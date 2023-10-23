<script setup lang="ts">
import type { ModelItem } from '@/api/auto-api-service';
import type { EditorOptions, MonacoEditorInstance } from '@/components/editor/MonacoEditor.vue';

/** 参数 */
const props = defineProps<{
    /** 宽度 */
    width?: number | string;
    /** 高度 */
    height?: number | string;
    /** 提示文本 */
    placeholder?: string;
    /** 是否禁用 */
    disabled?: boolean;
    /** 参数项 */
    params?: {
        /** 模型 */
        modelItem?: ModelItem;
    };
}>();

/** MonacoEditor组件实例 */
const monacoEditorRef = ref<MonacoEditorInstance>();
/** ModelValue */
const model = defineModel<string>();
/** 代码文本 */
const codeText = computed({
    get: () => model.value || '',
    set: (val) => (model.value = val)
});

/** 代码编辑器配置 */
const options = computed<EditorOptions>(() => ({
    language: 'javascript',
    minimap: {
        enabled: false
    },
    theme: store.theme === 'dark' ? 'vs-dark' : 'vs',
    automaticLayout: true,
    scrollBeyondLastLine: false,
    readOnly: props.disabled
}));

onMounted(() => {
    monacoEditorRef.value!.useLanguages(async (languages) => {
        // 语言设置对象
        // @ts-ignore
        const languageServiceDefaults = languages.typescript.javascriptDefaults;

        const extraLibsChange = languageServiceDefaults._onDidExtraLibsChange;
        const initChangePropsLength = Object.keys(extraLibsChange).length;

        /** 扩展类型定义更新 */
        const updateExtraLib = (() => {
            let update: () => void | undefined;
            return () => {
                if (!update) {
                    const changeKeys = Object.keys(extraLibsChange);
                    if (changeKeys.length > initChangePropsLength) {
                        const listenerKey = changeKeys[changeKeys.length - 1];
                        const listeners = extraLibsChange[listenerKey];
                        const updateKey = Object.keys(listeners)[0];
                        updateKey && (update = listeners[updateKey].element?.callback);
                    }
                }
                update && update();
            };
        })();

        /** 添加扩展类型定义 */
        const addExtraLib = (content: string, filePath: string) => {
            let declareItem = languageServiceDefaults._extraLibs[filePath];
            if (!declareItem) {
                languageServiceDefaults._extraLibs[filePath] = declareItem = {};
            }
            declareItem.content = content;
            declareItem.version = declareItem.version ? declareItem.version + 1 : 1;
            updateExtraLib();
        };

        // 设置扩展类型定义
        loadFileText('/declare/mongoose.d.ts').then((content) => addExtraLib(content, 'mongoose.d.ts'));
        loadFileText('/declare/result.d.ts').then((content) => addExtraLib(content, 'result.d.ts'));

        // 根据模型更改更新类型扩展定义
        let currentModelItem: ModelItem | null | undefined = null;
        watchEffect(() => {
            const params = props.params;
            if (currentModelItem !== params?.modelItem) {
                currentModelItem = params?.modelItem;
                const content = getDeclareModelText(currentModelItem);
                addExtraLib(content, 'model.d.ts');
            }
        });
    });
});

/**
 * 获取Model定义文本
 */
function getDeclareModelText(modelItem?: ModelItem) {
    let modelTypeText = '';
    if (modelItem) {
        modelTypeText = JSON.stringify(modelItem.schema);
        modelTypeText = modelTypeText.replace(/"/g, '');
        modelTypeText = modelTypeText.replace(/String/g, 'string');
        modelTypeText = modelTypeText.replace(/Number/g, 'number');
        modelTypeText = modelTypeText.replace(/Boolean/g, 'boolean');
        modelTypeText += '&';
    }
    return `declare const Model: mongoose.Model<${modelTypeText}{ [x: string]: any }>;`;
}
</script>

<template>
    <MonacoEditor
        ref="monacoEditorRef"
        v-model="codeText"
        :options="options"
        :width="props.width"
        :height="props.height"
    />
</template>

<style scoped></style>
