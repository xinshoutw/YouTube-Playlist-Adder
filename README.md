# YouTube Playlist Adder

此專案的目的是為了繞過 Google API 每日用量限制，將歌曲透過查詢加入 YouTube 播放清單。

1. 快速新增多支影片到 YouTube 播放清單。
2. 自動從文字檔歌曲名稱搜尋
   YouTube（利用第三方庫 [youtube-search-api](https://www.npmjs.com/package/youtube-search-api)）。
3. 透過自動解析 `fetch(...)` 呼叫內容，取得所需的 `cookie`、`authorization`、`playlistId`，以完成批次加歌流程。

## 特色

- 批次新增：只需在 `songs.txt` 放上各行歌曲名稱，就能一次搜尋並加到播放清單。
- 節省手動複製時間：利用程式自動處理、呼叫 YouTube 的內部 API。
- 自動解析 Header：將瀏覽器複製出的 `fetch(...)` 內容貼上，即可擷取必要憑證。

## 環境需求

- Node.js 18 以上：
- YouTube 帳戶已登入：
    - 由於程式需要用到瀏覽器 Cookie 與 Authorization，務必要從已登入 YouTube 的瀏覽器複製出 fetch(...)。

## 檔案結構

專案基本結構如下：

```
.
├─ srcapp.js
│  ├─ add-to-playlist.js
│  ├─ get-all-song.js
│  ├─ main.js
│  └─ songs.txt
├─ package.json
└─ package-lock.json
```

- app.js
    - 讀取 `songs.txt` 的歌曲。
    - 解析使用者貼上的 `fetch(...)` 字串以取得 `cookie`、`authorization`、`playlistId`。
    - 搜尋影片取得 ID。
    - 最後批次把所有影片加到對應的播放清單。
- get-all-song.js
    - `extractCurl(str)`：解析傳入的 `fetch(...)` 文字內容，抽取 `cookie`、`authorization`、`playlistId`。
    - `searchSongs(songs)`：依序搜尋歌曲（或並行搜尋），回傳影片 ID 陣列。
- songs.txt
    - 每行放置一個欲搜尋的歌曲名稱，例如：
  ```
  Sacred Play Secret Place
  Monotonous Purgatory
  Cut All Trees 
  Instant Immortal
  ```

## 使用方式

- 擷取瀏覽器發送的 `fetch(...)`
    - 打開瀏覽器（已登入 YouTube），進入要操作的播放清單頁面，例如 `https://www.youtube.com/playlist?list=xxxxxx`。
    - 在該頁面按 F12 開啟開發者工具 → Network / 網路面板 → 搜尋關鍵字 "edit"
    - 與此同時，按下「新增歌曲」按鈕，並隨意選擇一首歌曲加入播放清單。
    - 右鍵請求，選擇複製 → 複製為 fetch 格式 (Node.js)。
    - 然後將這整段以字串形式貼到 `app.js` 裡的 `extractCurl( ... )` 參數字串中。
- 放歌曲到 `songs.txt`
    - 在專案根目錄的 `songs.txt` 中，每行寫一首歌曲的名稱或關鍵字。
- 執行程式
   - 安裝依賴包並初始化 `$ npm install`
   - 執行進入點 `node main.js`

## 注意事項

- Cookie、Authorization 有效性
    - 若憑證失效（例如重啟瀏覽器、過了一段時間、或登出後），必須重新擷取新的 `fetch(...)` 呼叫內容貼進程式碼。
- 本專案僅作為學習用途使用，請勿從事違法行為。
- 請確保此操作符合 YouTube 服務條款。量大時有機會被觸發驗證或限制。
- 歌曲搜尋準確度
- 由於是利用關鍵字搜尋，若歌曲關鍵字過於模糊或重複，可能搜尋到非預期影片。建議提供更精確關鍵字如作者或執行後檢查。

## 常見問題 FAQ

1. 為什麼找不到影片？  
   可能是搜尋關鍵字太模糊、頻寬或網路問題導致無法搜尋。建議先在 YouTube 上手動搜尋確認關鍵字是否可用。

2. 能不能一次跑很多歌曲？   
   可以，只要 `songs.txt` 裡的內容是有效的歌曲關鍵字。若量過大，可能導致 YouTube API 發生錯誤或限制，可適度分批執行。

3. 為什麼無法新增到播放清單？  
   檢查 `playlistId` 是否正確、瀏覽器裡是否有該播放清單的存取權限，以及 Cookie/Authorization 是否即時有效。

4. 出現 403 或 401 Unauthorized？  
   可能是 `cookie` 或 `authorization` 參數失效，需要重新擷取瀏覽器的 fetch(...)。

5. License  
   此範例程式可自由修改、使用、散佈。請遵守 YouTube 使用條款 與 Google API 使用規範 之相關規定。

## 授權與貢獻

- 本專案採用 Apache 授權
- 歡迎提交 Issues、Pull Requests 改進此自動爬蟲流程！
