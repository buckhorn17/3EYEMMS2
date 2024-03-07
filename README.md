## 資料夾結構
  - assets # 靜態資源放置處
    - images # 圖片放置處
    - scss # SCSS 的樣式放置處

  - layout # ejs、js、json 模板放置處
  - pages # 頁面放置處

- main.js 檔案為讀取所有 JavaScript 程式碼，若有新增需補充路徑

### 注意事項
- 已將 pages 資料夾內的 index.html 預設為首頁，建議不要任意修改 index.html 的檔案名稱
- .gitignore 檔案是用來忽略掉不該上傳到 GitHub 的檔案（例如 node_modules），請不要移除 .gitignore
- index.js 中因應本機測試需使用 36、72、87 行code，若要上傳至git 則需使用 37、73、88 行code，若不使用的一方需進行語法註解
- 目前版本 layout/json/tarot-files.json 檔案需手動更新為編譯dist檔名，抽牌功能才可正常執行

## 開發模式的監聽
vite 專案執行開發模式 `npm run dev` 後即會自動監聽，不需要使用 `Live Sass Compiler` 的 `Watch SCSS` 功能