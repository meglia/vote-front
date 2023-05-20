<template>
    <div>
        <el-container style="height: 100vh; position: relative;">
            <el-header style="font-size: large; height: 60px; background-color:cornflowerblue;   align-items: center;">
                <div style="float: left; text-align: left; margin-left: 20px; margin-top: 15px;">
                    <img src="@/assets/vote.png" width="30" height="30" style="margin-right: 10px; vertical-align: middle;"/>
                    <span>区块链在线投票系统</span>
                </div>
                <div style="float: right; text-align: right;  margin-right: 40px; margin-top: 15px;">
                    <el-dropdown>
                        <el-icon style="margin-right: 20px; margin-top: 5px; font-size: large;">
                            <User />
                        </el-icon>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item @click="handleLogout">退出</el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                    <span style="font-size: large;">{{ username }}</span>
                </div>
            </el-header>
            <el-container style="margin-right: 2px; position: relative;">
                <el-aside style="background-color: #545c64; width: 10%;">
                    <el-row class="tac">
                        <el-col>
                            <el-menu active-text-color="#ffd04b" background-color="#545c64" class="el-menu-vertical-demo"
                                :default-active="route.path" :router="true" text-color="#fff">
                                <el-menu-item index="1" route="home">
                                    <el-icon style="vertical-align: middle">
                                        <HomeFilled />
                                    </el-icon>
                                    <span>主页</span>
                                </el-menu-item>
                                <el-menu-item index="2" route="create">
                                    <el-icon style="vertical-align: middle">
                                        <Document />
                                    </el-icon>
                                    <span>发起投票</span>
                                </el-menu-item>
                                <el-menu-item index="3" route="join">
                                    <el-icon style="vertical-align: middle">
                                        <Promotion />
                                    </el-icon>
                                    <span>参与投票</span>
                                </el-menu-item>
                                <el-menu-item index="4" route="check">
                                    <el-icon style="vertical-align: middle">
                                        <Search />
                                    </el-icon>
                                    <span>查看投票</span>
                                </el-menu-item>
                                <el-menu-item index="5" route="myinfo">
                                    <el-icon style="vertical-align: middle">
                                        <UserFilled />
                                    </el-icon>
                                    <span>我的投票</span>
                                </el-menu-item>
                            </el-menu>
                        </el-col>
                    </el-row>
                </el-aside>
                <el-main >
                    <div style="flex: 1; width: 400px; background-color: white; padding: 10px">
                        <router-view :key="$route.fullPath"/>
                    </div>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script setup>

import { useRoute } from 'vue-router'
import { ref } from 'vue'
import requestUtil from '@/util/request'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/store/user.js'
import router from '@/router'

const route = useRoute()
const store = useUserStore();
let { userInfo, token } = storeToRefs(store);
const handleLogout = async () => {
    // store.logout();
    store.logout();
    router.replace("/login")
}

const username = ref(userInfo.value.username)
</script>
