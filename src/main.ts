import { createApp } from 'vue';
import App from '@/App.vue';
import ElementPlus from 'element-plus';
import ElementPlusLocaleZhCn from 'element-plus/dist/locale/zh-cn.min.mjs';
import 'virtual:uno.css';

const app = createApp(App);

app.use(ElementPlus, {
    locale: ElementPlusLocaleZhCn
});

app.mount('#app');
