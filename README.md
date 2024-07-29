# MaiMai 的网页查分器

简单实用的网页查分器，访问 [b50.mpas.top](https://b50.mpas.top) 来使用吧
面向PC，以及Pad等大屏用户使用的b50速生成
同时支持`水鱼`以及`落雪`
水鱼输出水鱼的用户名，落雪则输入在落雪绑定的QQ号哦
落雪支持显示姓名框等更多内容
整个网页纯静态部署哦

![](https://pic.imgdb.cn/item/66a7b1f5d9c307b7e94c3228.png)
![](https://pic.imgdb.cn/item/66a7b245d9c307b7e94c7e43.png)
![](https://pic.imgdb.cn/item/66a7b258d9c307b7e94c93af.png)

# 开发

克隆仓库

```
git clone https://github.com/MeowKJ/maimai-rating-web.git && cd maimai-rating-web
```

安装依赖

```
pnpm install
```

新建环境变量文件`.env`填入以下字段

```
VITE_API_KEY = 落雪咖啡屋查分器的开发者API
```

运行测试服务器

```
pnpm run dev
```
