# Ada的博客

使用 VitePress 搭建的个人博客，部署在 GitHub Pages。

## 技术栈

- **VitePress**: 静态站点生成器（Vue 官方维护）
- **GitHub Pages**: 托管平台
- **GitHub Actions**: 自动部署

## 本地开发

### 安装依赖

```bash
pnpm install
```

### 本地预览

```bash
pnpm dev
```

访问 `http://localhost:5173` 查看效果。

### 创建新文章

在 `docs/posts/` 目录下创建新的 Markdown 文件即可。

### 构建

```bash
pnpm build
```

生成的文件在 `docs/.vitepress/dist/` 目录中。

## 部署

### 自动部署（推荐）

1. 创建 GitHub 仓库 `blog`
2. 将代码推送到 GitHub 仓库
3. 在仓库设置中启用 GitHub Pages，选择 GitHub Actions 作为源
4. 每次推送到 `main` 分支会自动构建和部署

访问地址：`https://ada-thinks.github.io/blog/`

## 项目结构

```
.
├── docs/
│   ├── .vitepress/
│   │   └── config.js      # VitePress 配置文件
│   ├── posts/            # 博客文章
│   ├── about/            # 关于页面
│   └── README.md         # 首页
├── package.json
└── .github/
    └── workflows/        # GitHub Actions 配置
```

## 参考资源

- [VitePress 官方文档](https://vitepress.dev/)
- [GitHub Pages 文档](https://docs.github.com/pages)
