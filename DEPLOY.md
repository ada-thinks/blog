# 部署指南

## 首次部署步骤

### 1. 安装 Node.js

确保已安装 Node.js（推荐 v18 或更高版本）：

```bash
node --version
npm --version
```

如果没有安装，可以从 [Node.js 官网](https://nodejs.org/) 下载安装。

### 2. 安装项目依赖

```bash
pnpm install
```

### 3. 本地预览（可选）

```bash
pnpm dev
```

访问 `http://localhost:5173` 查看效果。

### 4. 初始化 Git 仓库（如果还没有）

```bash
git init
git add .
git commit -m "Initial commit"
```

### 5. 创建 GitHub 仓库

1. 在 GitHub 上创建名为 `blog` 的仓库
2. 将本地仓库连接到远程：





```bash
git remote add origin https://github.com/ada-thinks/blog.git
git branch -M main
git push -u origin main
```

### 6. 配置 GitHub Pages

1. 进入仓库设置：`Settings` > `Pages`
2. 在 `Source` 部分，选择 `GitHub Actions`
3. 保存设置

### 7. 触发首次部署

推送代码后，GitHub Actions 会自动：
- 安装依赖
- 构建 VitePress 站点
- 部署到 GitHub Pages

等待几分钟后，访问 `https://ada-thinks.github.io/blog/` 即可看到你的博客！

## 日常使用

### 写新文章

在 `docs/posts/` 目录下创建新的 Markdown 文件：

```bash
# 创建新文章
touch docs/posts/我的新文章.md
```

编辑文章后，提交并推送：

```bash
git add .
git commit -m "Add new post"
git push
```

### 本地预览

```bash
pnpm dev
```

访问 `http://localhost:5173` 查看效果。

### 更新导航栏

编辑 `docs/.vitepress/config.js` 中的 `nav` 配置。

### 更新侧边栏

编辑 `docs/.vitepress/config.js` 中的 `sidebar` 配置。

## 常见问题

### 本地预览时页面空白？

确保 `base` 配置正确。当前配置为 `/blog/`，与仓库名一致。

### GitHub Actions 部署失败？

1. 检查仓库设置中是否启用了 GitHub Pages
2. 检查 Actions 权限是否开启
3. 查看 Actions 日志排查错误
4. 确保 `package.json` 中的脚本配置正确

### 如何更换主题？

VitePress 默认使用内置主题，你也可以安装其他主题或自定义主题。更多信息请参考 [VitePress 主题文档](https://vitepress.dev/guide/theme-introduction)。

## 自定义配置

编辑 `docs/.vitepress/config.js` 可以自定义：
- 网站标题和描述
- 导航栏和侧边栏
- 主题配置
- 插件配置

更多配置选项请参考 [VitePress 文档](https://vitepress.dev/)。
