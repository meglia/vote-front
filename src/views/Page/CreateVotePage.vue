<template>
    <div>
        <el-form :model="createVoteFormData" ref="createVoteFormRef" :rules="createVoteFormrules" label-position="left"
            label-width="80px" size="default" @submit.prevent>
            <el-form-item label="活动标题" prop="title" class="required">
                <el-input v-model="createVoteFormData.title" type="text" placeholder="活动标题" clearable>
                </el-input>
            </el-form-item>
            <el-form-item label="活动描述" prop="introduction" class="required label-center-align">
                <el-input type="textarea" v-model="createVoteFormData.introduction" placeholder="活动描述"
                    :autosize="{ minRows: 3, maxRows: 30 }"></el-input>
            </el-form-item>
            <div>
                <span>候选项</span>
            </div>
            <el-form-item v-for="(option, index) in createVoteFormData.options" :key="option.key"
                :label="'候选项' + (index + 1)" :prop="'options.' + index + '.name'">
                <el-input v-model="option.name" placeholder="选项名" />
                <div style="margin: 3px;"></div>
                <el-input v-model="option.description" :autosize="{ minRows: 2, maxRows: 4 }" type="textarea"
                    placeholder="选项描述" />
                <el-button type="danger" @click.prevent="removeOptionItem(option)">删除</el-button>
            </el-form-item>
            <el-form-item>
                <el-button @click="addDomain">新选项</el-button>
            </el-form-item>

            <el-form-item label="时间范围" prop="timeRange" class="required label-center-align">
                <el-date-picker v-model="createVoteFormData.timeRange" type="datetimerange" range-separator="到"
                    start-placeholder="开始时间" end-placeholder="结束时间" />
            </el-form-item>
            <el-form-item label="许可限制" prop="permitted" class="label-center-align">
                <el-radio-group v-model="createVoteFormData.permitted" class="ml-4">
                    <el-radio label="0" size="large">不限制</el-radio>
                    <el-radio label="1" size="large">限制</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="限制地址" prop="permittedList" class="label-center-align">
                <el-input type="textarea" v-model="createVoteFormData.permittedList"
                    :disabled="createVoteFormData.permitted != '1'" placeholder="输入限制的地址，请用逗号隔开"
                    :autosize="{ minRows: 3, maxRows: 30 }"></el-input>
            </el-form-item>
            <div class="static-content-item">
                <el-button type="primary" @click="dialogFormVisible = true">提交 </el-button>
            </div>
        </el-form>
    </div>
    <el-dialog v-model="dialogFormVisible" title="请确认您的信息" center>
        <el-form :model="createVoteFormData">
            <el-form-item label="用户名称">
                <el-input v-model="createVoteFormData.username" :disabled="true" autocomplete="off" />
            </el-form-item>
            <el-form-item label="用户邮箱">
                <el-input v-model="createVoteFormData.email" :disabled="true" autocomplete="off" />
            </el-form-item>
            <el-form-item label="用户公钥">
                <el-input v-model="createVoteFormData.pubKey" :disabled="true" autocomplete="off" />
            </el-form-item>
            <el-form-item label="用户私钥">
                <el-input v-model="createVoteFormData.privKey" type="textarea" :autosize="{ minRows: 2, maxRows: 4 }"
                    autocomplete="off" />
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取消</el-button>
                <el-button type="primary" @click="submitForm">
                    确认提交
                </el-button>
            </span>
        </template>
    </el-dialog>
</template>
  
<script setup>

import { ref, reactive } from 'vue'
import requestUtil from '@/util/request'
import qs from 'qs'
import router from '@/router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/store/user.js'
import { storeToRefs } from "pinia";
const store = useUserStore();
let { userInfo, token } = storeToRefs(store);
const dialogFormVisible = ref(false)
const createVoteFormRef = ref()
const createVoteFormData = reactive({
    title: '',
    introduction: '',
    options: [
        {
            key: 1,
            name: '',
            description: '',
        },
    ],
    timeRange: [],
    permitted: '0',
    permittedList: '',
    username: userInfo.value.username,
    email: userInfo.value.email,
    pubKey: userInfo.value.pubKey,
    privKey: '',
})
const createVoteFormrules = ref({
    title: [{
        required: true,
        message: '字段值不可为空',
    }],
    introduction: [{
        required: true,
        message: '字段值不可为空',
    }],
})
const submitForm = () => {
    createVoteFormRef.value.validate(async (valid) => {
        if (valid) {
            const res = await requestUtil.post('/vote/createVote', createVoteFormData)
            if (res.data.code == 200) {
                ElMessage.success('创建成功')
                dialogFormVisible.value = false
                router.push('/home')
            } else {
                ElMessage.error('创建失败:' + res.data.msg)
            }
        } else {
            ElMessage.error('请检查输入')
            return false
        }
    })
}
const removeOptionItem = (item) => {
    const index = createVoteFormData.options.indexOf(item)
    if (index !== 0) {
        createVoteFormData.options.splice(index, 1)
    } else {
        ElMessage.error('至少包含一个选项')
    }
}

const addDomain = () => {
    createVoteFormData.options.push({
        key: Date.now(),
        name: '',
        description: '',
    })
}
</script>