<template>
    <el-form ref="optionoptionFormRef" :model="optionFormData" label-width="80px" class="demo-dynamic">
        <el-form-item v-for="(option, index) in optionFormData.options" :key="option.key" :label="'候选项' + (index +1)"
            :prop="'options.' + index + '.name'" :rules="{
                required: true,
                message: '候选项不能为空',
                trigger: 'blur',
            }">
            <el-input v-model="option.name" placeholder="选项名" />
            <el-input v-model="option.description" placeholder="选项描述" />
            <el-button type="danger" @click.prevent="removeOptionItem(option)">删除</el-button>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="submitOptionForm(optionFormRef)">提交</el-button>
            <el-button @click="addDomain">新选项</el-button>
            <el-button @click="resetForm(optionFormRef)">Reset</el-button>
        </el-form-item>
    </el-form>
</template>
  
<script setup>
import { reactive, ref } from 'vue'

const optionFormRef = ref(null)
const optionFormData = reactive({
  options: [
    {
      key: 1,
      name: '',
      description: '',
    },
  ],
})

const removeOptionItem = (item) => {
  const index = optionFormData.options.indexOf(item)
  if (index !== 0) {
    optionFormData.options.splice(index, 1)
  }
}

const addDomain = () => {
  optionFormData.options.push({
    key: Date.now(),
    name: '',
    description: '',
  })
}

const submitOptionForm = (formEl) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      console.log('submit!')
    } else {
      console.log('error submit!!')
      return false
    }
  })
}

const resetForm = (formEl) => {
  if (!formEl) return
  formEl.resetFields()
}
</script>
  