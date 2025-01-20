/**
 * 將多支影片一次新增到指定的 YouTube 播放清單。
 * @param {string} cookie - 從 curl 中解析到的 cookie
 * @param {string} authorization - 從 curl 中解析到的 authorization
 * @param {string[]} videoIds - 影片 ID 陣列
 * @param {string} playlistId - 播放清單 ID
 * @returns {Promise<void>}
 */
async function addToPlaylist(cookie, authorization, videoIds, playlistId) {
    // 組出對應的 actions 陣列
    const actions = videoIds.map((videoId) => ({
        addedVideoId: videoId,
        action: "ACTION_ADD_VIDEO",
    }));

    // 以下內容是將繁雜的 curl 處理後的最簡化必要資料
    const bodyData = {
        context: {
            client: {
                userAgent:
                    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36,gzip(gfe)",
                clientName: "WEB",
                clientVersion: "2.20250116.10.00",
            },
        },
        actions,
        playlistId,
    };

    try {
        const response = await fetch(
            "https://www.youtube.com/youtubei/v1/browse/edit_playlist?prettyPrint=false",
            {
                method: "POST",
                headers: {
                    authorization,
                    "content-type": "application/json",
                    "x-origin": "https://www.youtube.com",
                    cookie,
                },
                body: JSON.stringify(bodyData),
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Failed to add videos to playlist. Status: ${response.status}`);
            console.error(`Response text: ${errorText}`);
            return;
        }

        const resultData = await response.json();
        console.log("Status:", resultData.status);
    } catch (error) {
        console.error("Error adding videos to playlist:", error);
    }
}


module.exports = {
    addToPlaylist
};
