<template>
    <div style="display: flex;">
        <div style="flex: 1;"></div>
        <div style="flex: 1;">
            <header>
                <MainPage></MainPage>
            </header>
        </div>
        <div style="flex: 1;">
            <el-form ref="loginFormRef" :model="loginForm" :rules="loginrules" label-width="120px">
                <h1>登录</h1>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="loginForm.email" type="text" auto-complete="off" placeholder="请输入邮箱" />
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="loginForm.password" type="password" auto-complete="off" placeholder="请输入密码" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click.prevent="handleLogin">登录</el-button>
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
import { useUserStore } from '@/store/user.js'
import qs from 'qs'
import router from '@/router'
import { ElMessage } from 'element-plus'
import MainPage from '@/views/Login/compoents/MainPage.vue'
const loginFormRef = ref()
const loginForm = ref({
    email: '',
    password: '',
})
const loginrules = ref({
    email: [{
        required: true,
        message: '请输入邮箱',
        trigger: 'blur'
    }],
    password: [{
        required: true,
        message: '请输入密码',
        trigger: 'blur'
    }],
})

const resetForm = () => {
    loginFormRef.value.resetFields()
}
const handleLogin = () => {
    loginFormRef.value.validate(async (valid) => {
        if (valid) {
            const res = await requestUtil.post('/user/login', qs.stringify(loginForm.value))
            if (res.data.code == 200) {
                const store = useUserStore();
                // store.setToken(res.data.token);
                store.setToken("token-test");//测试
                store.setUserInfo(res.data.user);
                ElMessage({
                    message: res.data.user.email + '，欢迎回来！',
                    type: 'success',
                })
                router.replace("/home")
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
    