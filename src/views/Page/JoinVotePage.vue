<template>
    <div>
        <el-form ref="inputAddressRef" :model.trim="inputAddressData" :rules="inputAddressRules">
            <el-form-item label="用户名称" prop="inputAddress">
                <el-input v-model="inputAddressData.inputAddress" placeholder="请输入地址" maxlength="37" clearable>
                    <template #prepend>投票地址：</template>
                </el-input>
            </el-form-item>

            <div style="margin: 13px;"></div>
            <el-button type="primary" @click="searchAddress()">搜索</el-button>

            <el-button type="danger" @click="prepareVote()">投票</el-button>
        </el-form>
    </div>
    <div style="margin: 13px;">
        <el-form :model="searchVoteFormData" label-position="left" label-width="100px" size="default" @submit.prevent
            disabled="true">
            <el-form-item label="发起人" prop="initiatorName">
                <el-input v-model="searchVoteFormData.initiatorName" type="text" placeholder="发起人" />
            </el-form-item>
            <el-form-item label="发起人邮箱" prop="initiatorEmail">
                <el-input v-model="searchVoteFormData.initiatorEmail" type="text" placeholder="发起人邮箱" />
            </el-form-item>
            <el-form-item label="发起人地址" prop="initiatorAddress">
                <el-input v-model="searchVoteFormData.initiatorAddress" type="text" placeholder="发起人地址" />
            </el-form-item>

            <el-form-item label="活动标题" prop="title">
                <el-input v-model="searchVoteFormData.title" type="text" placeholder="活动标题">
                </el-input>
            </el-form-item>
            <el-form-item label="活动描述" prop="introduction" class="label-center-align">
                <el-input type="textarea" v-model="searchVoteFormData.introduction" placeholder="活动描述"
                    :autosize="{ minRows: 3, maxRows: 30 }"></el-input>
            </el-form-item>
            <el-form-item label="投票地址" prop="voteAddress">
                <el-input v-model="searchVoteFormData.voteAddress" type="text" placeholder="投票地址" />
            </el-form-item>
            <el-form-item label="事件账户地址" prop="eventAddress">
                <el-input v-model="searchVoteFormData.eventAddress" type="text" placeholder="事件账户地址" />
            </el-form-item>
            <el-form-item label="开始时间" prop="startTime">
                <el-input v-model="searchVoteFormData.startTime" type="text" placeholder="开始时间" />
            </el-form-item>
            <el-form-item label="结束时间" prop="endTime">
                <el-input v-model="searchVoteFormData.endTime" type="text" placeholder="结束时间" />
            </el-form-item>
            <el-form-item label="许可限制" prop="permitted" class="label-center-align">
                <el-radio-group v-model="searchVoteFormData.permitted" class="ml-4">
                    <el-radio label="0" size="large">不限制</el-radio>
                    <el-radio label="1" size="large">限制</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="限制地址" prop="permittedAddressList" class="label-center-align">
                <el-input type="textarea" v-model="searchVoteFormData.permittedAddressList"
                    :autosize="{ minRows: 3, maxRows: 30 }"></el-input>
            </el-form-item>

            <div>
                <span>候选项</span>
            </div>
            <el-form-item v-for="(option, index) in searchVoteFormData.options" :key="option.optionAddress"
                :label="'候选项' + (index + 1)" :prop="'options.' + index + '.name'">
                <el-input v-model="option.optionName" placeholder="选项名">
                    <template #prepend>名称</template>
                </el-input>
                <div style="margin: 3px;"></div>
                <el-input v-model="option.description" :autosize="{ minRows: 2, maxRows: 4 }" type="textarea"
                    placeholder="选项描述">
                </el-input>
                <div style="margin: 3px;"></div>
                <el-input v-model="option.voteCount" placeholder="得票数">
                    <template #prepend>得票数</template>
                </el-input>
            </el-form-item>
        </el-form>
    </div>
    <el-dialog v-model="dialogFormVisible" title="确认投票" center>
        <el-form :model="searchVoteFormData" ref="confirmVoteFormRef" :rules="confirmVoteFormRules">
            <el-form-item label="用户名称">
                <el-input v-model="searchVoteFormData.username" :disabled="true" autocomplete="off" />
            </el-form-item>
            <el-form-item label="用户邮箱">
                <el-input v-model="searchVoteFormData.email" :disabled="true" autocomplete="off" />
            </el-form-item>
            <el-form-item label="用户公钥">
                <el-input v-model="searchVoteFormData.pubKey" :disabled="true" autocomplete="off" />
            </el-form-item>

            <el-form-item label="投票选项" prop="selectOption">
                <el-select v-model="selectVoteOptionValue" class="m-2" placeholder="请投票" size="large" label:="dfa">
                    <el-option v-for="item in searchVoteFormData.options" :key="item.optionAddress"
                        :label='item.optionName + "(当前" + item.voteCount + "票)"' :value="item.optionAddress" />
                </el-select>
            </el-form-item>
            <el-form-item label="用户私钥" prop="privKey">
                <el-input v-model="searchVoteFormData.privKey" type="textarea" :autosize="{ minRows: 2, maxRows: 4 }"
                    autocomplete="off" />
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取消</el-button>
                <el-button type="primary" @click="confirmVote">
                    确认投票
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
const selectVoteOptionValue = ref('请选择')
const confirmVoteFormRef = ref()
const inputAddressRef = ref()
const inputAddressRules = ref({
    inputAddress: [{
        required: true,
        message: '地址不可为空',
        trigger: 'blur'
    },
    {
        pattern: /^[a-zA-Z0-9]{37}$/,
        message: '地址长度为37位且不能含有空格',
        trigger: 'blur'
    }
    ],
})
const inputAddressData = ref({
    inputAddress: '',
})
const confirmVoteFormRules = ref({
    privKey: [{
        required: true,
        message: '私钥不可为空',
        trigger: 'blur'
    }],
    // selectOption: [{
    //     required: true,
    //     message: '选项不可为空',
    //     trigger: 'blur'
    // }],
})
const searchVoteFormData = ref({
    initiatorAddress: '',
    initiatorEmail: '',
    initiatorName: '',
    title: '',
    introduction: '',
    voteAddress: '',
    eventAddress: '',
    startTime: '',
    endTime: '',

    options: [{
        description: '',
        image: '',
        optionAddress: '',
        optionName: '',
        pollAddress: '',
        voteCount: 0,
    },],
    permitted: '',
    permittedAddressList: '',
    username: userInfo.value.username,
    email: userInfo.value.email,
    pubKey: userInfo.value.pubKey,
    privKey: '',

})
const confirmVoteFormData = ref({
    pubKey: '',
    privKey: '',
    voteAddress: '',
    selectOptionAddress: '',
})
const prepareVote = () => {
    if (searchVoteFormData.value.voteAddress == '') {
        ElMessage.error('请先搜索投票地址')
        return
    } else {
        dialogFormVisible.value = true
    }
}
const confirmVote = () => {
    confirmVoteFormRef.value.validate(async (valid) => {
        if (valid) {
            confirmVoteFormData.value.pubKey = searchVoteFormData.value.pubKey
            confirmVoteFormData.value.privKey = searchVoteFormData.value.privKey
            confirmVoteFormData.value.voteAddress = searchVoteFormData.value.voteAddress
            confirmVoteFormData.value.selectOptionAddress = selectVoteOptionValue.value
            const res = await requestUtil.post('/vote/joinVote', confirmVoteFormData.value)
            if (res.data.code == 200) {
                ElMessage({
                    message: '投票成功！' + res.data.data.voteUsername + '当前票数为' + res.data.data.voteCount,//某某人票数+1
                    type: 'success',
                })
                dialogFormVisible.value = true
            } else {
                ElMessage.error(res.data.msg)
            }
        } else {
            return false
        }
    })
}
const searchAddress = () => {
    inputAddressRef.value.validate(async (valid) => {
        if (valid) {
            const res = await requestUtil.post('/search/voteAddress', qs.stringify({ voteAddress: inputAddressData.value.inputAddress }))
            if (res.data.code == 200) {
                searchVoteFormData.value = res.data.data
                searchVoteFormData.value.username = userInfo.value.username
                searchVoteFormData.value.email = userInfo.value.email
                searchVoteFormData.value.pubKey = userInfo.value.pubKey
                ElMessage.success(res.data.data.title + '，搜索成功！')
            } else {
                ElMessage.error(res.data.msg)
            }
        } else {
            ElMessage.error("请正确输入地址!")
        }
    })
}
</script>