<script setup lang="ts">
/** 参数 */
const props = defineProps<{
    /** 开关状态 */
    switch: boolean;
}>();

/** 回调 */
const emits = defineEmits<{
    /** 开关点击 */
    switchClick: [state: boolean];
}>();
</script>

<template>
    <div class="w-full h-full flex items-center justify-between">
        <mo-icon
            class="p-15px hover:bg-mask-1 hover:cursor-pointer"
            :icon-name="props.switch ? 'text-indent-left' : 'text-indent-right'"
            width="20px"
            height="20px"
            @click="emits('switchClick', !props.switch)"
        ></mo-icon>
    </div>
</template>

<style scoped></style>
