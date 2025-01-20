/**
 * 負責：
 * 1. 從檔案讀取歌曲清單
 * 2. 透過 extractCurl 解析出必要資訊
 * 3. 搜尋歌曲並一次將結果新增到特定 YouTube 播放清單
 */

const fs = require("fs");
const readline = require("readline");
const assert = require("node:assert");
const {extractCurl, searchSongs} = require("./get-all-song");
const {addToPlaylist} = require("./add-to-playlist");


/**
 * 從指定檔案讀取每行歌曲並回傳字串陣列。
 * @param {string} filePath - 檔案路徑
 * @returns {Promise<string[]>} - 歌曲名稱的字串陣列
 */
async function readSongsFromFile(filePath) {
    const songs = [];
    const fileStream = fs.createReadStream(filePath);

    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity,
    });

    for await (const line of rl) {
        if (line.trim()) {
            songs.push(line.trim());
        }
    }

    return songs;
}

// ---- Main 執行區 ----
(async () => {
    try {
        const {cookie, authorization, playlistId} = extractCurl(`
            REPLACE_WITH_YOUR_FETCH_CALL_HERE(node.js format)
    `);

        // 確認必要資訊是否存在
        assert(cookie, "Cookie not found");
        assert(authorization, "Authorization not found");
        assert(playlistId, "PlaylistId not found");

        // 讀取歌曲清單檔案
        const filePath = "./songs.txt";
        const songs = await readSongsFromFile(filePath);

        // 搜尋 YouTube，取得歌曲對應的影片 ID
        const songIds = await searchSongs(songs);
        if (!songIds.length) {
            console.warn("No valid video IDs found, process stopped.");
            return;
        }

        // 將所有影片一次新增到該播放清單
        await addToPlaylist(cookie, authorization, songIds, playlistId);
    } catch (error) {
        console.error("Error in processing songs:", error);
    }
})();
