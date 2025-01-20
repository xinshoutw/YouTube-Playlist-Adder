/**
 * 負責：
 * 1. 解析輸入字串以取得 cookie、authorization、playlistId 等資訊。
 * 2. 提供根據歌曲名稱查詢 YouTube 並回傳其影片 ID 的函式。
 */

const youtubeSearchApi = require("youtube-search-api");

/**
 * 從輸入字串中提取 cookie、authorization、playlistId。
 * @param {string} str - 包含 fetch(...) 呼叫資訊的完整字串
 * @returns {{ cookie: string, authorization: string, playlistId: string }}
 *          返回包含 cookie、authorization、playlistId 的物件
 */
function extractCurl(str) {
    // 使用正則表達式分別匹配 "cookie": "...", "authorization": "...", "playlistId": "..."
    const cookieRegex = /"cookie"\s*:\s*"([^"]*)"/;
    const authRegex = /"authorization"\s*:\s*"([^"]*)"/;
    const playlistIdRegex = /"playlistId\\"\s*:\\\s*"([^"]*)\\"/;

    const cookieMatch = cookieRegex.exec(str);
    const authMatch = authRegex.exec(str);
    const playlistIdMatch = playlistIdRegex.exec(str);

    const cookie = cookieMatch ? cookieMatch[1] : "";
    const authorization = authMatch ? authMatch[1] : "";
    const playlistId = playlistIdMatch ? playlistIdMatch[1] : "";

    return {
        cookie,
        authorization,
        playlistId,
    };
}

/**
 * 根據歌曲名稱列表，並行搜尋 YouTube，回傳可用影片 ID 陣列。
 * @param {string[]} songs - 歌曲名稱陣列
 * @returns {Promise<string[]>} - 成功搜尋到的影片 ID 陣列
 */
async function searchSongs(songs) {
    // 讓每首歌曲同時啟動搜尋，提高整體效率
    const tasks = songs.map(async (song) => {
        try {
            const results = await youtubeSearchApi.GetListByKeyword(song, false, 1);
            if (results.items && results.items.length > 0) {
                return results.items[0].id;
            } else {
                console.log(`No video found for: ${song}`);
                return null;
            }
        } catch (error) {
            console.error(`Error processing song: ${song}`, error);
            return null;
        }
    });

    // 等待所有搜尋完成，過濾掉 null（搜尋失敗或無結果）
    const results = await Promise.all(tasks);
    return results.filter((id) => id !== null);
}

module.exports = {
    extractCurl,
    searchSongs,
};
