import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.js'],
            refresh: ['resources/js/**/*.{js,vue}', 'resources/views/**/*.blade.php'],
        }),
        vue(),
    ],
    resolve: {
        alias: {
            '@': resolve(__dirname, 'resources/js'),
            '@/shared': resolve(__dirname, 'resources/js/shared'),
            '@/features': resolve(__dirname, 'resources/js/features'),
            '@/assets': resolve(__dirname, 'resources/js/assets'),
        },
    },
    build: {
        outDir: 'public/build',
        emptyOutDir: true,
        manifest: 'manifest.json',
        rollupOptions: {
            output: {
                manualChunks: undefined,
            },
        },
    },
    // Note: Server configuration removed for Docker setup
    // We use 'vite build --watch' instead of 'vite serve' for production parity
    // All requests are handled by nginx proxy in Docker containers
});
