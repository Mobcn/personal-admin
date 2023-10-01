import { reactive } from 'vue';

// 状态存储
const store = reactive<{ [x: string]: any }>({
    // 屏幕宽度
    screenWidth: window.screen.width
});

// 监听屏幕宽度变化
window.onresize = () => {
    store.screenWidth = window.screen.width;
};

export default store;
