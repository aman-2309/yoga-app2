import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    plugins: [react()],

    // Enable JSX in .js files
    esbuild: {
        loader: 'jsx',
        include: /src\/.*\.jsx?$/,
        exclude: [],
    },

    optimizeDeps: {
        esbuildOptions: {
            loader: {
                '.js': 'jsx',
            },
        },
    },

    // Resolve aliases (optional, for cleaner imports)
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },

    // Server configuration
    server: {
        port: 3000,
        open: true, // Auto-open browser
        cors: true,
    },

    // Build configuration
    build: {
        outDir: 'dist',
        sourcemap: true,
        // Optimize chunks
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['react', 'react-dom'],
                },
            },
        },
    },

    // CSS configuration (Tailwind)
    css: {
        postcss: './postcss.config.js',
    },
});