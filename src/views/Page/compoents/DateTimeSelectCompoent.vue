<template>
    <el-date-picker v-model="defaultDate" type="datetimerange" range-separator="到" start-placeholder="开始时间"
        end-placeholder="结束时间" />
</template>
  
<script lang="ts" setup>
import { ref } from 'vue'
const defaultDate = ref<[Date, Date]>([
    new Date(2023, 4, 17, 10, 10),
    new Date(2023, 5, 23, 10, 10),
])
</script>
