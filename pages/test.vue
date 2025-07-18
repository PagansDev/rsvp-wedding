<template>
    <div v-if="isLoading" class="flex flex-row items-center justify-center min-h-dvh">
        <Icon name="mdi:loading" class="animate-spin" />
        <p>Loading...</p>
    </div>
    <div v-else class="flex flex-col items-center justify-center min-h-dvh gap-4">

        <button @click="refreshData"
            class="bg-brand-700 text-white font-bold text-center text-sm rounded-lg w-10 h-10 p-2">
            <Icon name="mdi:refresh" class="text-white text-2xl" />
        </button>
        <div v-for="item in data" :key="item.id" class="bg-brand-300 rounded-lg p-4 border-1 border-brand-500 w-[80%]">
            <div class="flex flex-row items-center justify-center gap-4">
                <p class="text-brand-700 font-bold text-sm">{{ item.id }}.</p>
                <p class="text-brand-700 font-bold text-sm">{{ item.name }}</p>
            </div>

        </div>
        <div class="flex flex-row items-center justify-center gap-4 p-4 bg-brand-200 rounded-lg w-[80%]">
            <div class="flex flex-col gap-4">
                <label for="name" class="text-brand-700 font-bold text-sm">Nome</label>
                <div class="flex flex-row items-center justify-center gap-4">
                    <input type="text" v-model="formData.name" placeholder="Nome" id="name"
                        class="bg-brand-300 rounded-lg p-2 border-1 border-brand-500 w-full" />
                    <button @click="addData"
                        class="bg-brand-700 text-white font-bold text-center text-sm rounded-lg w-10 h-10 p-2">
                        <Icon name="mdi:plus" class="text-white text-2xl" />
                    </button>
                </div>
                <p v-if="formError" class="text-red-500 font-bold text-sm">{{ formError }}</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">

import type { ITestRequest } from '@/dtos/test/testRequest'
import type { ITestResponse } from '@/dtos/test/testResponse'


//supabase
import { getSupabase } from '@/utils/supabase'
const supabase = getSupabase()

const isLoading = ref(true)
const data = ref < ITestResponse[] > ([])
const formData = ref < ITestRequest > ({
    name: ''
})

const formError = ref('')

async function getData() {
    const { data: result } = await supabase.from('test').select('*').order('id', { ascending: true })

    data.value = result as ITestResponse[]
    isLoading.value = false
}

async function addData() {
    if (!formData.value.name.trim()) {
        formError.value = 'O nome não pode ser vazio!'
        setTimeout(() => {
            formError.value = ''
        }, 3000)
        return
    }
    await supabase.from('test').insert({ name: formData.value.name })
    formData.value.name = ''
    getData()
}

async function refreshData() {
    getData()
}

onMounted(() => {
    getData()
})


definePageMeta({
  layout: 'default',
  middleware: ['auth']
})

</script>
