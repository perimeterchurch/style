import { describe, it, expect } from 'vitest';
import { parseRoute } from './middleware.ts';

describe('parseRoute', () => {
    it('parses GET read-tokens', () => {
        const result = parseRoute('GET', '/api/style-addon/read-tokens');
        expect(result).toEqual({
            handler: 'read-tokens',
            method: 'GET',
            params: {},
        });
    });

    it('parses GET read-variants with component param', () => {
        const result = parseRoute('GET', '/api/style-addon/read-variants?component=Button');
        expect(result).toEqual({
            handler: 'read-variants',
            method: 'GET',
            params: { component: 'Button' },
        });
    });

    it('parses DELETE delete-variant with multiple params', () => {
        const result = parseRoute(
            'DELETE',
            '/api/style-addon/delete-variant?component=Button&variant=accent',
        );
        expect(result).toEqual({
            handler: 'delete-variant',
            method: 'DELETE',
            params: { component: 'Button', variant: 'accent' },
        });
    });

    it('returns null for non-matching paths', () => {
        const result = parseRoute('GET', '/other/path');
        expect(result).toBeNull();
    });

    it('returns null for partial prefix match', () => {
        const result = parseRoute('GET', '/api/style-addon-extra/read-tokens');
        expect(result).toBeNull();
    });

    it('parses POST write-tokens', () => {
        const result = parseRoute('POST', '/api/style-addon/write-tokens');
        expect(result).toEqual({
            handler: 'write-tokens',
            method: 'POST',
            params: {},
        });
    });

    it('parses POST write-theme', () => {
        const result = parseRoute('POST', '/api/style-addon/write-theme');
        expect(result).toEqual({
            handler: 'write-theme',
            method: 'POST',
            params: {},
        });
    });

    it('parses POST write-variant', () => {
        const result = parseRoute('POST', '/api/style-addon/write-variant');
        expect(result).toEqual({
            handler: 'write-variant',
            method: 'POST',
            params: {},
        });
    });
});
