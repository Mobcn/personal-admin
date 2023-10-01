<script setup lang="ts">
import storage from '@/utils/storage.ts';

// 404图片路径
const _404ImagePath = storage.get('_404ImageURL') || '/img/404.png';
</script>

<template>
    <div class="mo-404">
        <img :src="_404ImagePath" referrerpolicy="no-referrer" />
        <h2>小笨蛋，页面跑偏啦～</h2>
        <p>你可以选择刷新页面或者返回主页</p>
        <a href="/" class="mo-btn mo-btn-primary mo-btn-blue">返回主页</a>
    </div>
</template>

<style>
@media screen and (max-width: 960px) {
    .mo-404 img {
        width: 80vw;
        height: 50vw;
    }

    .mo-404 h2 {
        font-size: 24px;
    }

    .mo-404 p {
        font-size: 10px;
    }

    .mo-btn-blue {
        height: 40px;
        line-height: 40px;
        font-size: 14px;
    }

    .mo-404 a {
        width: 50vw;
        height: 40px;
    }
}

@media screen and (min-width: 961px) {
    .mo-404 h2 {
        font-size: 32px;
    }

    .mo-404 p {
        font-size: 14px;
    }

    .mo-btn-blue {
        height: 56px;
        line-height: 56px;
        font-size: 18px;
    }

    .mo-404 a {
        width: 220px;
        height: 56px;
    }
}

h2,
p {
    padding: 0;
    margin: 0;
    list-style: none;
}

.mo-404 {
    width: 100vw;
    margin: 10vh auto;
    vertical-align: middle;
}

.mo-404 img {
    display: block;
    margin: auto;
}

.mo-404 h2 {
    color: #333333;
    text-align: center;
    letter-spacing: 5px;
    padding-top: 33px;
    padding-bottom: 25px;
}

.mo-404 p {
    color: #666666;
    letter-spacing: 1px;
    text-align: center;
    padding-bottom: 35px;
}

.mo-btn {
    display: inline-block;
    padding: 6px 12px;
    margin-bottom: 0;
    font-weight: 400;
    text-align: center;
    white-space: nowrap;
    vertical-align: middle;
    -ms-touch-action: manipulation;
    touch-action: manipulation;
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    background-image: none;
    border: 1px solid transparent;
    border-radius: 4px;
}

.mo-btn-primary {
    color: #fff;
    background-color: #337ab7;
    border-color: #2e6da4;
}

.mo-btn-blue {
    display: inline-block;
    text-align: center;
    border-radius: 3px;
    background: #7caced;
    color: #fff;
    letter-spacing: 5px;
    border: 0;
    padding: 0;
    text-decoration: none;
    -webkit-transition-duration: 0.3s;
    transition-duration: 0.3s;
    -webkit-transition-timing-function: ease-out;
    transition-timing-function: ease-out;
}

.mo-404 a {
    display: block;
    margin: auto;
}
</style>
