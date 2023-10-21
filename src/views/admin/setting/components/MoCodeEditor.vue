<script setup lang="ts">
/** 参数 */
const props = withDefaults(
    defineProps<{
        /** 宽度 */
        width?: number | string;
        /** 高度 */
        height?: number | string;
        /** 提示文本 */
        placeholder?: string;
        /** 是否禁用 */
        disabled?: boolean;
    }>(),
    {
        width: '100%',
        height: '300px'
    }
);

/** 代码文本 */
const code = defineModel<string>({ required: true });

/** 代码编辑器配置 */
const options = computed<EditorOptions>(() => ({
    value: code.value,
    language: 'javascript',
    minimap: {
        enabled: false
    },
    theme: store.theme === 'dark' ? 'vs-dark' : 'vs',
    automaticLayout: true,
    scrollBeyondLastLine: false,
    readOnly: props.disabled
}));

/** 编辑器容器 */
const moCodeEditorRef = ref();

onMounted(() => {
    // 编辑器VS引入路径
    const editorVS = 'https://cdn.staticfile.org/monaco-editor/0.36.1/min/vs';
    // 编辑器Loader引入路径
    const editorLoader = editorVS + '/loader.js';
    // 导入monaco
    fetch(editorLoader)
        .then((res) => res.text())
        .then((textJS) => {
            textJS = textJS.replace('var h=do', '//var h=do');
            textJS = textJS.replace('d(h)', 'd(h)\nfetch(r).then(d=>d.text()).then(t=>eval(t))');
            textJS = 'new Promise((rev) => ({\nexecFun: function () {\n' + textJS + ';\n';
            textJS += `this.require.config({paths:{vs:'${editorVS}'}});`;
            textJS += "this.require(['vs/editor/editor.main'],()=>rev(monaco));}}).execFun())";
            return eval(textJS);
        })
        .then((monaco) => {
            // 创建编辑器
            const editorInstance = monaco.editor.create(moCodeEditorRef.value, options.value, null);
            // 编辑器内容修改监听
            editorInstance.onDidChangeModelContent(() => (code.value = editorInstance.getValue()));
            // 内容变化监听
            watchEffect(() => code.value !== editorInstance.getValue() && editorInstance.setValue(code.value));
            // 监听是否禁用
            watchEffect(() => editorInstance.updateOptions(options.value));
        });
});

/**
 * 获取样式尺寸
 *
 * @param value 值
 */
function getStyleSize(value: number | string) {
    return typeof value === 'number' ? value + 'px' : value;
}
</script>
<script lang="ts">
/**
 * 代码编辑器配置
 */
export type EditorOptions = {
    /** 编辑器初始显示文字 */
    value?: string;
    /** 语言支持自行查阅demo */
    language?: string;
    /** 自动布局 */
    automaticLayout?: boolean;
    /** 代码可分小段折叠 */
    foldingStrategy?: string;
    /** 是否自动添加结束括号(包括中括号) */
    autoClosingBrackets?: 'always' | 'languageDefined' | 'beforeWhitespace' | 'never';
    /** 是否自动删除结束括号(包括中括号) */
    autoClosingDelete?: 'always' | 'never' | 'auto';
    /** 是否自动添加结束的单引号 双引号 */
    autoClosingQuotes?: 'always' | 'languageDefined' | 'beforeWhitespace' | 'never';
    /** 控制编辑器在用户键入、粘贴、移动或缩进行时是否应自动调整缩进 */
    autoIndent?: string;
    /** 注释配置 */
    comments?: {
        /** 插入行注释时忽略空行。默认为真 */
        ignoreEmptyLines?: boolean;
        /** 插入行注释时忽略空行。默认为真 */
        insertSpace?: boolean;
    };
    /** 光标动画样式 */
    cursorBlinking?: string;
    /** 是否启用光标平滑插入动画  当你在快速输入文字的时候 光标是直接平滑的移动还是直接"闪现"到当前文字所处位置 */
    cursorSmoothCaretAnimation?: boolean;
    /** 光标环绕行数 当文字输入超过屏幕时 可以看见右侧滚动条中光标所处位置是在滚动条中间还是顶部还是底部 即光标环绕行数 环绕行数越大 光标在滚动条中位置越居中 */
    cursorSurroundingLines?: number;
    /** 光标环绕样式 */
    cursorSurroundingLinesStyle?: 'default' | 'all';
    /** 光标宽度 <=25 */
    cursorWidth?: number;
    /** 代码缩略图 */
    minimap?: {
        /** 是否开启 */
        enabled?: boolean;
    };
    /** 是否应围绕概览标尺绘制边框 */
    overviewRulerBorder?: boolean;
    /** 是否启用代码折叠 */
    folding?: boolean;
    /** 置编辑器是否可以滚动到最后一行之后 */
    scrollBeyondLastLine?: boolean;
    /** 当前行突出显示方式 */
    renderLineHighlight?: 'all' | 'line' | 'none' | 'gutter';
    /** 官方自带三种主题 */
    theme?: 'vs' | 'hc-black' | 'vs-dark';
    /** 是否只读 */
    readOnly?: boolean;
};
</script>

<template>
    <div ref="moCodeEditorRef" :style="`width: ${getStyleSize(props.width)}; height: ${getStyleSize(props.height)}`" />
</template>

<style scoped></style>
