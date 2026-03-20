import { cpSync, existsSync, mkdirSync, rmSync } from 'fs';

const sources = [
    { from: 'packages/tokens/dist/', to: 'dist/tokens/' },
    { from: 'packages/components/dist/', to: 'dist/components/' },
    { from: 'packages/motion/dist/', to: 'dist/motion/' },
    { from: 'packages/icons/dist/', to: 'dist/icons/' },
];

// Verify all source dirs exist
for (const { from } of sources) {
    if (!existsSync(from)) {
        console.error(`ERROR: ${from} does not exist. Did the build fail?`);
        process.exit(1);
    }
}

// Clean and collect
rmSync('dist', { recursive: true, force: true });

for (const { from, to } of sources) {
    mkdirSync(to, { recursive: true });
    cpSync(from, to, { recursive: true });
}

console.log('dist/ collected successfully');
