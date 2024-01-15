// api.ts
declare const process: {
  env: {
    VUE_APP_API_KEY: string; // 根据需要调整类型
  };
};

export async function getDataFromDivingFish(username: string) {
  const apiUrl = "https://www.diving-fish.com/api/maimaidxprober/query/player";

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        b50: true,
      }),
    });

    if (!response.ok) {
      console.error(`请求失败: ${response.status}`);
      return null;
    }

    // 处理响应数据
    return await response.json();
  } catch (error) {
    console.error("发生错误:", error);
    return null;
  }
}

export async function getDataFromLuoXue(username: string) {
  const apiUrl = "https://maimai.lxns.net";
  const authHeaders = {
    Authorization: process.env.VUE_APP_API_KEY,
  };
  try {
    const response = await fetch(apiUrl + "/api/v0/maimai/player", {
      method: "GET",
      headers: authHeaders,
    });

    if (!response.ok) {
      return null;
    }
    const userData = await response.json();
  } catch (error) {
    return null;
  }
}
