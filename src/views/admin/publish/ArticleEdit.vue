<script setup lang="ts">
import { MdEditor } from 'md-editor-v3';
import store from '@/store/store';
import 'md-editor-v3/lib/style.css';

const text = ref('');
</script>

<template>
    <MdEditor v-model="text" :theme="store.theme" placeholder="请输入文章内容" />
</template>

<style scoped></style>
