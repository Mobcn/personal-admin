<script setup lang="ts">
import MoIcon from '@/components/icons/MoIcon.vue';
import { MdEditor } from 'md-editor-v3';
import ShowImage from '@/components/function/ShowImage';
import store from '@/store/store';
import type { UploadUserFile } from 'element-plus';
import type { ArticleVO } from '@/api/article-service';
import 'md-editor-v3/lib/style.css';

/**
 * 文章编辑数据
 */
type ArticleEditData = Omit<ArticleVO, '_id' | 'author' | 'views' | 'create_time' | 'update_time'> & {
    _id?: string;
};

/** 表单数据 */
const form = ref<ArticleEditData>({
    title: '',
    category: '',
    tags: [],
    description: '',
    content: ''
});
/** 封面 */
const covers = ref<UploadUserFile[]>([]);

/** 分类列表 */
const categoryList = ref<{ _id: string; name: string }[]>([]);
/** 标签列表 */
const tagList = ref<{ _id: string; name: string }[]>([]);

/** 表单校验 */
const rules = {
    title: [
        { required: true, message: '标题不能为空', trigger: 'blur' },
        { min: 5, max: 100, message: '标题长度应为5~100', trigger: 'blur' }
    ],
    description: [
        { required: true, message: '摘要不能为空', trigger: 'blur' },
        { min: 5, max: 300, message: '摘要长度应为5~300', trigger: 'blur' }
    ]
};

/** 待上传图片列表 */
const uploadImgList: { file: File; tempURL: string }[] = [];

/** 图片上传事件 */
const uploadImgEvent = (files: File[], callback: (urls: string[]) => void) => {
    callback(
        files.map((file) => {
            const tempURL = URL.createObjectURL(file);
            uploadImgList.push({ file, tempURL });
            return tempURL;
        })
    );
};

/**
 * 获取临时URL
 *
 * @param content Markdown内容
 */
// function getTempURL(content: string) {
//     const temps = content.match(/\!\[.*\]\(blob:.+\)/g);
//     if (temps) {
//         return temps.map((item) => /\((blob:.+)\)/.exec(item)![1]);
//     }
//     return [];
// }

// 初始化操作
(() => {
    categoryService.all().then((list) => (categoryList.value = list.map((c) => ({ _id: c._id, name: c.name }))));
    tagService.all().then((list) => (tagList.value = list.map((t) => ({ _id: t._id, name: t.name }))));
})();
</script>

<template>
    <el-container class="h-full overflow-hidden">
        <el-header class="h-auto p0">
            <el-form :model="form" :rules="rules" label-width="60">
                <el-row :gutter="10">
                    <el-col :span="12">
                        <el-row>
                            <el-col :span="24">
                                <el-form-item label="标题" prop="title">
                                    <el-input
                                        v-model="form.title"
                                        placeholder="请输入标题（长度5~100）"
                                        minlength="5"
                                        maxlength="100"
                                        :show-word-limit="true"
                                        clearable
                                    />
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="18">
                                <el-row>
                                    <el-col :span="24">
                                        <el-form-item label="分类">
                                            <el-select class="w-4/5" v-model="form.category" placeholder="未分类">
                                                <el-option
                                                    v-for="item in categoryList"
                                                    :key="item._id"
                                                    :label="item.name"
                                                    :value="item._id"
                                                />
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span="24">
                                        <el-form-item label="标签">
                                            <el-select
                                                class="w-4/5"
                                                v-model="form.tags"
                                                :multiple-limit="3"
                                                placeholder="无标签"
                                                multiple
                                                collapse-tags
                                                collapse-tags-tooltip
                                                clearable
                                            >
                                                <el-option
                                                    v-for="item in tagList"
                                                    :key="item._id"
                                                    :label="item.name"
                                                    :value="item._id"
                                                />
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="封面">
                                    <el-upload
                                        class="article-edit__cover"
                                        list-type="picture-card"
                                        v-model:file-list="covers"
                                        :auto-upload="false"
                                        :on-preview="() => covers[0].url && ShowImage(covers[0].url)"
                                    >
                                        <el-icon><mo-icon icon-name="plus-lg" /></el-icon>
                                    </el-upload>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="摘要" prop="description">
                            <el-input
                                v-model="form.description"
                                placeholder="请输入摘要（长度5~300）"
                                type="textarea"
                                rows="6"
                                minlength="5"
                                maxlength="300"
                                :show-word-limit="true"
                            />
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-header>
        <el-main class="p0">
            <MdEditor
                v-model="form.content"
                :theme="store.theme"
                placeholder="请输入文章内容"
                style="height: 100%"
                @on-upload-img="uploadImgEvent"
            />
        </el-main>
    </el-container>
</template>

<style scoped>
.article-edit__cover :deep(.el-upload--picture-card) {
    --el-upload-picture-card-size: 5.5rem;
}

.article-edit__cover :deep(.el-upload-list--picture-card) {
    --el-upload-list-picture-card-size: 5.5rem;
}

.article-edit__cover :deep(.el-upload-list:has(li) .el-upload) {
    display: none;
}
</style>
