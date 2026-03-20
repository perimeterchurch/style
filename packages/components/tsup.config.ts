import { defineConfig } from 'tsup';

export default defineConfig([
    {
        entry: ['src/index.ts'],
        format: ['esm', 'cjs'],
        dts: true,
        sourcemap: true,
        clean: true,
        outDir: 'dist',
        external: ['react', 'react-dom', '@headlessui/react'],
    },
    {
        entry: ['src/composite/index.ts'],
        format: ['esm', 'cjs'],
        dts: true,
        sourcemap: true,
        outDir: 'dist/composite',
        external: ['react', 'react-dom', '@headlessui/react'],
    },
]);
