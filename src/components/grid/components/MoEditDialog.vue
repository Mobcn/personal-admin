<script setup lang="ts" generic="T extends Record<string, any>">
import type { FormInstance, FormItemRule } from 'element-plus';

/** 参数 */
const props = defineProps<MoEditDialogProps<T>>();

/** 回调 */
const emits = defineEmits<{
    /** 取消 */
    cancel: [];
    /** 确定 */
    confirm: [type: 'add' | 'update', data: EditData<T>];
}>();

/** 表单元素对象 */
const formRef = ref<FormInstance>();

/** 是否显示 */
const visible = defineModel<boolean>({ required: true });
/** 主键 */
const primaryKey = computed(() => props.config.primaryKey ?? '_id');
/** 表单数据对象 */
const formData = ref({}) as Ref<EditData<T>>;

watchEffect(() => {
    const data: any = { [primaryKey.value]: props.params.data?.[primaryKey.value] ?? '' };
    if (props.params.data) {
        props.config.components.forEach((component) => {
            const value: any = props.params.data![component.name];
            if (value == null) {
                data[component.name] = '';
            } else if (value instanceof Date) {
                data[component.name] = value.toISOString();
            } else {
                data[component.name] = value.toString();
            }
        });
    } else {
        props.config.components.forEach((component) => (data[component.name] = ''));
    }
    formData.value = data;
});

/** 确定点击事件 */
const confirmClickEvent = () => {
    const $form = formRef.value;
    if ($form) {
        // 校验
        $form.validate((valid) => {
            if (valid) {
                const type = formData.value[primaryKey.value] ? 'update' : 'add';
                const data = { ...formData.value };
                valid && emits('confirm', type, data);
            }
        });
    }
};
</script>
<script lang="ts">
/**
 * 编辑弹窗组件项
 */
type MoEditDialogComponent<T extends Record<string, any>> = {
    /** 组件名称 */
    name: keyof T & string;
    /** 组件标签 */
    label?: string;
    /** 组件大小 */
    size?: 'default' | 'small' | 'large';
    /** 占位内容 */
    placeholder?: string;
} & (
    | {
          /** 组件类型 */
          type: 'input';
      }
    | {
          /** 组件类型 */
          type: 'select';
          /** 选择项 */
          options: { value: string; label: string }[];
          /** 是否多选 */
          multiple?: boolean;
      }
    | {
          /** 组件类型 */
          type: 'time';
          /** 是否为时间范围 */
          isRange?: boolean;
          /** 范围选择时开始的占位内容 */
          startPlaceholder?: string;
          /** 范围选择时结束的占位内容 */
          endPlaceholder?: string;
      }
    | {
          /** 组件类型 */
          type: 'year' | 'month' | 'date' | 'datetime' | 'week';
          /** 显示在输入框中的格式 */
          format?: string;
      }
);

/** 编辑数据 */
export type EditData<T> = { [key in keyof T & string]: string };

/**
 * 编辑弹窗配置
 */
export type MoEditDialogConfig<T extends Record<string, any>> = {
    /** 主键名 */
    primaryKey?: keyof T & string;
    /** 编辑弹窗组件数组 */
    components: MoEditDialogComponent<T>[];
    /** 校验规则 */
    rules?: { [key in keyof T & string]?: FormItemRule[] };
    /** 弹窗宽度 */
    width?: number | string;
    /** 组件大小 */
    size?: 'default' | 'small' | 'large';
    /** 标签宽度 */
    labelWidth?: number | string;
};

/**
 * 编辑弹窗数据参数
 */
export type MoEditDialogParams<T extends Record<string, any>> = {
    /** 数据 */
    data?: T;
};

/**
 * 编辑弹窗参数
 */
export type MoEditDialogProps<T extends Record<string, any>> = {
    /** 配置 */
    config: MoEditDialogConfig<T>;
    /** 参数 */
    params: MoEditDialogParams<T>;
};
</script>

<template>
    <el-dialog
        v-model="visible"
        :title="formData[primaryKey] ? '编辑' : '添加'"
        :width="props.config.width"
        @open="() => formRef?.clearValidate()"
    >
        <el-form
            ref="formRef"
            :model="formData"
            :rules="props.config.rules"
            :size="props.config.size"
            :label-width="props.config.labelWidth"
        >
            <el-form-item
                v-for="(component, index) in props.config.components"
                :key="index"
                :prop="component.name"
                :label="component.label"
            >
                <template v-if="component.name !== primaryKey">
                    <el-input
                        v-if="component.type === 'input'"
                        v-model="(formData[component.name] as string)"
                        :size="component.size"
                        :placeholder="component.placeholder"
                    />
                    <el-select
                        v-if="component.type === 'select'"
                        v-model="formData[component.name]"
                        :multiple="component.multiple"
                        :size="component.size"
                        :placeholder="component.placeholder"
                        clearable
                    >
                        <el-option
                            v-for="(item, index) in component.options"
                            :key="index"
                            :value="item.value"
                            :label="item.label"
                        ></el-option>
                    </el-select>
                    <el-time-picker
                        v-if="component.type === 'time'"
                        v-model="(formData[component.name] as string | [string, string])"
                        :is-range="component.isRange"
                        :size="component.size"
                        :placeholder="component.placeholder"
                    />
                    <el-date-picker
                        v-if="
                            component.type === 'year' ||
                            component.type === 'month' ||
                            component.type === 'date' ||
                            component.type === 'datetime' ||
                            component.type === 'week'
                        "
                        v-model="(formData[component.name] as string)"
                        :type="component.type"
                        :format="component.format"
                        :size="component.size"
                        :placeholder="component.placeholder"
                    />
                </template>
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button @click="emits('cancel')">取消</el-button>
            <el-button type="primary" @click="confirmClickEvent">确定</el-button>
        </template>
    </el-dialog>
</template>

<style scoped>
.el-form {
    margin-top: 0.8rem;
}
.el-form--inline .el-form-item {
    margin-right: 0.8rem;
    margin-bottom: 0.8rem;
}
</style>
