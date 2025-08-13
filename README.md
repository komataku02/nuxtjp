# Contact App - Frontend (Nuxt 3)

このリポジトリは「Contact App」のフロントエンド部分です。  
バックエンド（Laravel API）と連携して動作します。

## 🚀 使用技術
- Nuxt 3 (TypeScript)
- Axios
- HTML / CSS

## 📂 関連リポジトリ
- [バックエンド (Laravel API)](https://github.com/komataku02/laravel-api)

## 🖥 機能概要
- 連絡先一覧の取得
- 新規作成
- 更新
- 削除
- バリデーションエラー表示

## ⚙️ 開発環境での起動方法
```bash
# 依存パッケージのインストール
yarn install

# 開発サーバー起動
yarn dev

#API ベースURL
.env ファイルに API の URL を設定します。
NUXT_PUBLIC_API_BASE=http://127.0.0.1:8000/api

```bash
cd ~/coachtech/Nuxt/nuxtjp
git add README.md
git commit -m "Add README with backend repo link"
git push

