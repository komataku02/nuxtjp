<template>
  <div id="app">
    <h1>連絡先アプリ</h1>

    <!-- エラーバナー -->
    <div v-if="errorMessage" class="error">{{ errorMessage }}</div>

    <!-- 新規作成フォーム -->
    <div class="new">
      <h2>新規作成</h2>
      <div class="name">
        <label for="name">お名前：</label>
        <input type="text" v-model="newName" />
      </div>
      <div class="email">
        <label for="email">メールアドレス：</label>
        <input type="email" v-model="newEmail" />
      </div>
      <button :disabled="loading" @click="insertContact">
      {{ loading ? '処理中…' : '新規作成' }}
      </button>
    </div>

    <!-- 一覧表示（ロード中は操作無効） -->
    <div class="table">
      <h2>連絡先リスト</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>名前</th>
            <th>メールアドレス</th>
            <th>更新</th>
            <th>削除</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in contactLists" :key="item.id">
            <td>{{ item.id }}</td>
            <td><input v-model="item.name" /></td>
            <td><input v-model="item.email" /></td>
            <td><button :disabled="loading" @click="updateContact(item)">更新</button></td>
            <td><button :disabled="loading" @click="deleteContact(item.id)">削除</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
const { $axios } = useNuxtApp()

const newName = ref('')
const newEmail = ref('')
const contactLists = ref<any[]>([])
const loading = ref(false)
const errorMessage = ref<string | null>(null)

const showError = (msg: string) => {
  errorMessage.value = msg
  // setTimeout(() => (errorMessage.value = null), 4000) // 自動で消したいなら
}

const getContacts = async () => {
  try {
    loading.value = true
    const res = await $axios.get('/contact')
    contactLists.value = res.data.data
  } catch (e: any) {
    showError('一覧の取得に失敗しました')
  } finally {
    loading.value = false
  }
}

const insertContact = async () => {
  if (!newName.value || !newEmail.value) {
    showError('名前とメールは必須です')
    return
  }
  try {
    loading.value = true
    await $axios.post('/contact', {
      name: newName.value,
      email: newEmail.value,
    })
    newName.value = ''
    newEmail.value = ''
    await getContacts()
  } catch (e: any) {
    if (e?.response?.status === 422) {
      // バリデーションエラー表示（複数ある場合は先頭だけ拾う例）
      const errs = e.response.data.errors
      const first = errs?.name?.[0] || errs?.email?.[0] || '入力内容を確認してください'
      showError(first)
    } else {
      showError('新規作成に失敗しました')
    }
  } finally {
    loading.value = false
  }
}

const updateContact = async (item: any) => {
  try {
    loading.value = true
    await $axios.put(`/contact/${item.id}`, {
      name: item.name,
      email: item.email,
    })
    await getContacts()
  } catch (e: any) {
    if (e?.response?.status === 422) {
      const errs = e.response.data.errors
      const first = errs?.name?.[0] || errs?.email?.[0] || '入力内容を確認してください'
      showError(first)
    } else {
      showError('更新に失敗しました')
    }
  } finally {
    loading.value = false
  }
}

const deleteContact = async (id: number) => {
  try {
    loading.value = true
    await $axios.delete(`/contact/${id}`)
    await getContacts()
  } catch {
    showError('削除に失敗しました')
  } finally {
    loading.value = false
  }
}

onMounted(getContacts)
</script>

<style scoped>
table,
td,
th {
  border: 1px solid #000;
  border-collapse: collapse;
  text-align: center;
}
td,
th {
  padding: 5px;
}
th {
  background: #f0e6cc;
}

.error {
  margin: 12px 0;
  padding: 10px;
  border: 1px solid #f00;
}
</style>
