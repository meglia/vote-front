<template>
    <div style="display: flex;">
        <div style="flex: 1;"></div>
        <div style="flex: 1;">
            <header>
                <MainPage></MainPage>
            </header>
        </div>
        <div style="flex: 1;">
            <el-form ref="registerFormRef" :model="registerForm" :rules="registerrules" label-width="120px">
                <h1>注册</h1>
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="registerForm.username" type="text" auto-complete="off" placeholder="请输入用户名" />
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="registerForm.email" type="text" auto-complete="off" placeholder="请输入邮箱" />
                </el-form-item>

                <el-form-item label="密码" prop="password">
                    <el-input v-model="registerForm.password" type="password" auto-complete="off" placeholder="请输入密码" />
                </el-form-item>
                <el-form-item label="验证码" prop="code">
                    <el-row :gutter="20">
                        <el-col :span="17"><el-input v-model.number="registerForm.code" /></el-col>
                        <el-col :span="6"><el-button @click.prevent="sendCode">发送验证码</el-button></el-col>
                    </el-row>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click.prevent="handleRegister">注册</el-button>
                    <el-button @click="resetForm">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div style="flex: 1;"></div>
    </div>
</template>
    
<script setup>
import { ref } from 'vue'
import requestUtil from '@/util/request'
import qs from 'qs'
import router from '@/router'
import { ElMessage } from 'element-plus'
import MainPage from '@/views/Login/compoents/MainPage.vue'

const registerFormRef = ref()
const registerForm = ref({
    email: '',
    username: '',
    password: '',
    code: '',
})
const registerrules = ref({
    email: [{
        required: true,
        message: '请输入邮箱',
        trigger: 'blur'
    }],
    username: [{
        required: true,
        message: '请输入用户名',
        trigger: 'blur'
    }],
    password: [{
        required: true,
        message: '请输入密码',
        trigger: 'blur'
    }],
    code: [{
        required: true,
        message: '请输入验证码',
        trigger: 'blur'
    }],
})

const handleRegister = () => {
    registerFormRef.value.validate(async (valid) => {
        if (valid) {
            const res = await requestUtil.post('/user/register', qs.stringify(registerForm.value))
            if (res.data.code == 200) {
                resetForm();
                ElMessage({
                    message: "注册成功",
                    type: 'success',
                })
                router.replace("/")
            } else {
                ElMessage.error(res.data.msg)
            }
        } else {
            return false
        }
    })
}
const resetForm = () => {
    registerFormRef.value.resetFields()
}
const sendCode = () => {
    registerFormRef.value.validateField('email', async (valid) => {
        if (valid) {
            const res = await requestUtil.post('/user/sendCode', qs.stringify({ email: registerForm.value.email }))
            if (res.data.code == 200) {
                ElMessage({
                    message: '验证码已发送，请注意查收',
                    type: 'success',
                })
            } else {
                ElMessage.error(res.data.msg)
            }
        } else {
            return false
        }
    })
}
</script>
<style scoped>
h1 {
    display: flex;
    justify-content: center;
}
div {
    display: flex;
    justify-content: center;  
    align-items: center; 
}
</style>
    