import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import Unocss from 'unocss/vite';
import { Plugin as importToCDN } from 'vite-plugin-cdn-import';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue({
            script: {
                defineModel: true
            }
        }),
        Unocss(),
        importToCDN({
            modules: [
                {
                    name: 'vue',
                    var: 'Vue',
                    path: `https://cdn.staticfile.org/vue/3.3.4/vue.global.prod.min.js`
                }
            ]
        })
    ],
    resolve: {
        alias: {
            '@': path.resolve('./src')
        }
    },
    base: './'
});
