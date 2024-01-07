// api.ts

async function fetchData(username) {
    const apiUrl = "https://www.diving-fish.com/api/maimaidxprober/query/player";

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                b50: true
            }),
        });

        if (!response.ok) {
            console.error(`请求失败: ${response.status}`);
            return null;
        }

        // 处理响应数据
        return await response.json();
    } catch (error) {
        console.error('发生错误:', error);
        return null;
    }

}

export default fetchData;
