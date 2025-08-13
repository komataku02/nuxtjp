import axios from 'axios'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()

  // 開発時に .env が反映されているか確認（ブラウザコンソールに出ます）
  if (process.client) {
    console.log('API BASE =', config.public.apiBase)
  }

  const instance = axios.create({
    baseURL: config.public.apiBase || 'http://127.0.0.1:8000/api',
    timeout: 10000,
  })

  //簡易レスポンス/エラー共通処理(お好みで)
  instance.interceptors.response.use(
    (res) => res,
    (err) => {
      console.error('AXIOS ERROR', {
        message: err?.message,
        status: err?.response?.status,
        data: err?.response?.data,
        url: err?.config?.url,
        method: err?.config?.method,
      })
      return Promise.reject(err)
    }
  )
  nuxtApp.provide('axios', instance)
})