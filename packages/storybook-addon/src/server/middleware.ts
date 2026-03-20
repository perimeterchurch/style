/**
 * Vite middleware router for the style addon.
 * Intercepts /api/style-addon/* requests and dispatches to the appropriate handler.
 *
 * File writes use atomicWrite (write to .tmp, rename) with .bak backup.
 * CSS/TS output is formatted with Prettier before writing.
 */

import { join } from 'node:path';
import { readFile, writeFile, rename, copyFile } from 'node:fs/promises';
import type { Plugin, ViteDevServer } from 'vite';
import type { IncomingMessage, ServerResponse } from 'node:http';

import { parseTokensFromCss, categorizeTokens } from './readTokens.ts';
import { updateTokensInCss } from './writeTokens.ts';
import { generateThemeCss, generateBaseImport } from './writeTheme.ts';
import { parseVariantsFile, resolveVariantsPath } from './readVariants.ts';
import { updateVariantInFile, addVariantToFile, removeVariantFromFile } from './writeVariant.ts';

// ---------------------------------------------------------------------------
// Route parsing
// ---------------------------------------------------------------------------

const PREFIX = '/api/style-addon/';

export interface ParsedRoute {
    handler: string;
    method: string;
    params: Record<string, string>;
}

/** Parse an incoming request into a route descriptor, or null if it doesn't match. */
export function parseRoute(method: string, url: string): ParsedRoute | null {
    // Split URL from query string
    const qIdx = url.indexOf('?');
    const pathname = qIdx === -1 ? url : url.slice(0, qIdx);
    const queryString = qIdx === -1 ? '' : url.slice(qIdx + 1);

    if (!pathname.startsWith(PREFIX)) return null;

    const handler = pathname.slice(PREFIX.length);
    if (!handler || handler.includes('/')) return null;

    const params: Record<string, string> = {};
    if (queryString) {
        const searchParams = new URLSearchParams(queryString);
        for (const [key, value] of searchParams) {
            params[key] = value;
        }
    }

    return { handler, method, params };
}

// ---------------------------------------------------------------------------
// File I/O helpers
// ---------------------------------------------------------------------------

/** Write to a .tmp file then atomically rename, creating a .bak backup first. */
async function atomicWrite(filePath: string, content: string): Promise<void> {
    const tmpPath = filePath + '.tmp';

    // Create backup of existing file (ignore if it doesn't exist)
    try {
        await copyFile(filePath, filePath + '.bak');
    } catch {
        // File may not exist yet — that's fine
    }

    await writeFile(tmpPath, content, 'utf-8');
    await rename(tmpPath, filePath);
}

/** Format content with Prettier, resolving config from the file path. */
async function formatWithPrettier(content: string, filePath: string): Promise<string> {
    try {
        const prettier = await import('prettier');
        const config = await prettier.resolveConfig(filePath);
        return await prettier.format(content, {
            ...config,
            filepath: filePath,
        });
    } catch {
        // If Prettier fails, return unformatted content
        return content;
    }
}

/** Read the full body of a POST/PUT request as a string. */
function readBody(req: IncomingMessage): Promise<string> {
    return new Promise((resolve, reject) => {
        const chunks: Buffer[] = [];
        req.on('data', (chunk: Buffer) => chunks.push(chunk));
        req.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
        req.on('error', reject);
    });
}

/** Send a JSON response. */
function sendJson(res: ServerResponse, status: number, data: unknown): void {
    res.writeHead(status, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
}

// ---------------------------------------------------------------------------
// Middleware factory — returns a Vite plugin
// ---------------------------------------------------------------------------

/**
 * Creates a Vite plugin that serves the style addon API.
 * rootDir should be the monorepo root (where packages/ lives).
 */
export function createStyleAddonMiddleware(rootDir: string): Plugin {
    const tokensPath = join(rootDir, 'packages/tokens/src/tokens.css');
    const basePath = join(rootDir, 'packages/tokens/src/base.css');
    const themesDir = join(rootDir, 'packages/tokens/src/themes/');

    return {
        name: 'style-addon-middleware',
        configureServer(server: ViteDevServer) {
            server.middlewares.use(
                async (req: IncomingMessage, res: ServerResponse, next: () => void) => {
                    const route = parseRoute(req.method ?? 'GET', req.url ?? '');
                    if (!route) return next();

                    try {
                        switch (route.handler) {
                            // ----- read-tokens -----
                            case 'read-tokens': {
                                const css = await readFile(tokensPath, 'utf-8');
                                const flat = parseTokensFromCss(css);
                                const categorized = categorizeTokens(flat);
                                sendJson(res, 200, { tokens: flat, categorized });
                                break;
                            }

                            // ----- write-tokens -----
                            case 'write-tokens': {
                                const body = JSON.parse(await readBody(req)) as {
                                    updates: Record<string, string>;
                                };
                                const css = await readFile(tokensPath, 'utf-8');
                                const updated = updateTokensInCss(css, body.updates);
                                const formatted = await formatWithPrettier(updated, tokensPath);
                                await atomicWrite(tokensPath, formatted);
                                sendJson(res, 200, { ok: true });
                                break;
                            }

                            // ----- write-theme -----
                            case 'write-theme': {
                                const body = JSON.parse(await readBody(req)) as {
                                    name: string;
                                    tokens: Record<string, string>;
                                };
                                const themeCss = generateThemeCss(body.name, body.tokens);
                                const themeFilePath = join(themesDir, `theme-${body.name}.css`);
                                const formatted = await formatWithPrettier(themeCss, themeFilePath);
                                await atomicWrite(themeFilePath, formatted);

                                // Update base.css with import
                                const baseCss = await readFile(basePath, 'utf-8');
                                const updatedBase = generateBaseImport(baseCss, body.name);
                                if (updatedBase !== baseCss) {
                                    const formattedBase = await formatWithPrettier(
                                        updatedBase,
                                        basePath,
                                    );
                                    await atomicWrite(basePath, formattedBase);
                                }

                                sendJson(res, 200, { ok: true, path: themeFilePath });
                                break;
                            }

                            // ----- read-variants -----
                            case 'read-variants': {
                                const component = route.params.component;
                                if (!component) {
                                    sendJson(res, 400, { error: 'Missing component param' });
                                    break;
                                }
                                const relPath = resolveVariantsPath(component);
                                const fullPath = join(rootDir, relPath);
                                const content = await readFile(fullPath, 'utf-8');
                                const parsed = parseVariantsFile(content);
                                sendJson(res, 200, parsed);
                                break;
                            }

                            // ----- write-variant -----
                            case 'write-variant': {
                                const body = JSON.parse(await readBody(req)) as {
                                    component: string;
                                    suffix: string;
                                    name: string;
                                    definition: Record<string, unknown>;
                                    mode: 'add' | 'update';
                                };
                                const relPath = resolveVariantsPath(body.component);
                                const fullPath = join(rootDir, relPath);
                                const content = await readFile(fullPath, 'utf-8');

                                const updated =
                                    body.mode === 'add'
                                        ? addVariantToFile(
                                              content,
                                              body.suffix,
                                              body.name,
                                              body.definition as never,
                                          )
                                        : updateVariantInFile(
                                              content,
                                              body.suffix,
                                              body.name,
                                              body.definition as never,
                                          );

                                const formatted = await formatWithPrettier(updated, fullPath);
                                await atomicWrite(fullPath, formatted);
                                sendJson(res, 200, { ok: true });
                                break;
                            }

                            // ----- delete-variant -----
                            case 'delete-variant': {
                                const component = route.params.component;
                                const variant = route.params.variant;
                                if (!component || !variant) {
                                    sendJson(res, 400, {
                                        error: 'Missing component or variant param',
                                    });
                                    break;
                                }
                                const relPath = resolveVariantsPath(component);
                                const fullPath = join(rootDir, relPath);
                                const content = await readFile(fullPath, 'utf-8');
                                const updated = removeVariantFromFile(content, 'Variants', variant);
                                const formatted = await formatWithPrettier(updated, fullPath);
                                await atomicWrite(fullPath, formatted);
                                sendJson(res, 200, { ok: true });
                                break;
                            }

                            default:
                                sendJson(res, 404, { error: `Unknown handler: ${route.handler}` });
                        }
                    } catch (err) {
                        const message = err instanceof Error ? err.message : String(err);
                        sendJson(res, 500, { error: message });
                    }
                },
            );
        },
    };
}
