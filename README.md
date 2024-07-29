# MaiMai 的网页查分器

简单实用的网页查分器，访问 b50.mpas.top 来使用吧

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

构建

```
pnpm run build
```

# 免费部署到 Vercel

- fork 本仓库
- 在 Vercel 选择此仓库部署(vite)
- 添加环境变量 VITE_API_KEY 值为落雪咖啡屋查分器的开发者 API
- 完成部署，可按需添加自己的域名
