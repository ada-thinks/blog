import { defineConfig } from 'vitepress'
import { readdirSync, readFileSync, statSync } from 'fs'
import { join } from 'path'

/**
 * 自动生成侧边栏的函数
 * 支持两种组织方式：
 * 1. 按文件夹结构：docs/posts/数据结构/经典排序.md（文件夹名作为分类）
 * 2. 按 frontmatter：在文件 frontmatter 中设置 category 字段
 * 
 * 优先级：文件夹结构 > frontmatter 中的 category
 */
function generateSidebar() {
    // 文章目录路径
    const postsDir = join(process.cwd(), 'docs/posts')

    /**
     * 递归读取目录下的所有 Markdown 文件
     * @param {string} dir - 目录路径
     * @param {string} baseCategory - 基础分类名（用于嵌套文件夹）
     * @returns {Array} 文件列表
     */
    function readFilesRecursive(dir, baseCategory = '') {
        const files = []
        const items = readdirSync(dir)

        for (const item of items) {
            const itemPath = join(dir, item)
            const stat = statSync(itemPath)

            if (stat.isDirectory()) {
                // 如果是文件夹，递归读取
                const category = baseCategory ? `${baseCategory}/${item}` : item
                const subFiles = readFilesRecursive(itemPath, category)
                files.push(...subFiles)
            } else if (item.endsWith('.md') && item !== 'index.md') {
                // 如果是 Markdown 文件，读取并解析
                const content = readFileSync(itemPath, 'utf-8')
                const relativePath = itemPath.replace(postsDir + '/', '').replace(/\\/g, '/')
                const filePath = relativePath.replace('.md', '')

                // 解析 frontmatter
                const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/)

                // 默认值：文件名（去掉 .md 后缀）作为标题
                let title = item.replace('.md', '')
                let category = baseCategory || '文章列表' // 优先使用文件夹名作为分类
                let date = ''
                let order = 999

                // 如果存在 frontmatter，解析其中的字段（title 是可选的，如果没有就用文件名）
                if (frontmatterMatch) {
                    const frontmatter = frontmatterMatch[1]

                    // 提取标题（如果 frontmatter 中有 title 则使用，否则使用文件名）
                    const titleMatch = frontmatter.match(/title:\s*(.+)/)
                    if (titleMatch) {
                        title = titleMatch[1].trim().replace(/['"]/g, '')
                    }
                    // 如果没有 title，title 保持为文件名

                    // 提取分类（如果 frontmatter 中有 category，且没有文件夹结构，则使用它）
                    const categoryMatch = frontmatter.match(/category:\s*(.+)/)
                    if (categoryMatch && !baseCategory) {
                        category = categoryMatch[1].trim().replace(/['"]/g, '')
                    }

                    // 提取日期
                    const dateMatch = frontmatter.match(/date:\s*(.+)/)
                    if (dateMatch) {
                        date = dateMatch[1].trim().replace(/['"]/g, '')
                    }

                    // 提取排序值
                    const orderMatch = frontmatter.match(/order:\s*(.+)/)
                    if (orderMatch) {
                        order = parseInt(orderMatch[1].trim()) || 999
                    }
                }

                // 处理文件路径中的特殊字符，进行 URL 编码
                // 将路径分段编码，保留斜杠
                const encodedPath = filePath.split('/').map(segment =>
                    encodeURIComponent(segment)
                ).join('/')

                files.push({
                    title, // 文章标题
                    link: `/posts/${encodedPath}`, // 文章链接（包含文件夹路径，特殊字符已编码）
                    category, // 所属分类（文件夹名或 frontmatter 中的 category）
                    date, // 发布日期
                    order, // 排序值
                    filename: item, // 文件名
                    filePath // 完整文件路径（用于排序）
                })
            }
        }

        return files
    }

    // 读取所有文件
    const files = readFilesRecursive(postsDir)
        .sort((a, b) => {
            // 排序规则（优先级从高到低）：

            // 1. 优先按 order 排序（如果设置了 order 字段）
            if (a.order !== b.order) {
                return a.order - b.order
            }

            // 2. 其次按日期排序，最新的在前
            if (a.date && b.date) {
                return new Date(b.date) - new Date(a.date)
            }

            // 3. 如果只有一个有日期，有日期的排在前面
            if (a.date && !b.date) return -1
            if (!a.date && b.date) return 1

            // 4. 都没有日期，按文件路径排序（字母顺序）
            return a.filePath.localeCompare(b.filePath)
        })

    // 按分类分组
    const categoryMap = new Map()

    files.forEach(file => {
        // 如果这个分类还不存在，创建一个空数组
        if (!categoryMap.has(file.category)) {
            categoryMap.set(file.category, [])
        }
        // 将文章添加到对应的分类中
        categoryMap.get(file.category).push({
            text: file.title,
            link: file.link
        })
    })

    // 转换为 VitePress 侧边栏格式
    const sidebar = []

    // 按分类名称排序，确保顺序一致
    const sortedCategories = Array.from(categoryMap.keys()).sort()

    sortedCategories.forEach(category => {
        const items = categoryMap.get(category)
        sidebar.push({
            text: category, // 分类名称（文件夹名）
            collapsed: false, // 默认展开，设置为 true 则默认收起
            collapsible: true, // 启用折叠功能（可以点击展开/收起）
            items: items // 该分类下的文章列表
        })
    })

    return sidebar
}

/**
 * 生成关于页面的侧边栏
 */
function generateAboutSidebar() {
    const aboutDir = join(process.cwd(), 'docs/about')
    const sidebar = []

    try {
        const items = readdirSync(aboutDir)

        // 添加"关于"主页
        sidebar.push({
            text: '关于',
            items: [
                { text: '关于我', link: '/about/' }
            ]
        })

        // 遍历子目录
        items.forEach(item => {
            const itemPath = join(aboutDir, item)
            const stat = statSync(itemPath)

            if (stat.isDirectory()) {
                // 检查子目录下是否有index.md
                const indexPath = join(itemPath, 'index.md')
                try {
                    if (statSync(indexPath).isFile()) {
                        const encodedItem = encodeURIComponent(item)
                        sidebar.push({
                            text: item,
                            items: [
                                { text: item, link: `/about/${encodedItem}/` }
                            ]
                        })
                    }
                } catch (e) {
                    // 如果index.md不存在，跳过
                }
            }
        })
    } catch (e) {
        // 如果about目录不存在，返回默认侧边栏
        sidebar.push({
            text: '关于',
            items: [
                { text: '关于我', link: '/about/' }
            ]
        })
    }

    return sidebar
}

// 生成所有文章路径的侧边栏配置
function generateSidebarConfig() {
    const sidebarConfig = {}
    const postsDir = join(process.cwd(), 'docs/posts')

    // 递归获取所有文章路径
    function getAllPostPaths(dir, basePath = '') {
        const paths = []
        const items = readdirSync(dir)

        for (const item of items) {
            const itemPath = join(dir, item)
            const stat = statSync(itemPath)

            if (stat.isDirectory()) {
                const newBasePath = basePath ? `${basePath}/${item}` : item
                paths.push(...getAllPostPaths(itemPath, newBasePath))
            } else if (item.endsWith('.md') && item !== 'index.md') {
                const relativePath = basePath ? `${basePath}/${item.replace('.md', '')}` : item.replace('.md', '')
                const encodedPath = relativePath.split('/').map(segment =>
                    encodeURIComponent(segment)
                ).join('/')
                paths.push(`/posts/${encodedPath}`)
            }
        }

        return paths
    }

    const allPaths = getAllPostPaths(postsDir)
    const sidebar = generateSidebar()
    const aboutSidebar = generateAboutSidebar()

    // 为所有路径配置侧边栏
    sidebarConfig['/posts/'] = sidebar
    sidebarConfig['/posts'] = sidebar
    allPaths.forEach(path => {
        sidebarConfig[path] = sidebar
    })

    // 为"关于"页面配置自己的侧边栏
    sidebarConfig['/about/'] = aboutSidebar
    sidebarConfig['/about'] = aboutSidebar

    // 为about下的子目录也配置侧边栏
    try {
        const aboutDir = join(process.cwd(), 'docs/about')
        const items = readdirSync(aboutDir)
        items.forEach(item => {
            const itemPath = join(aboutDir, item)
            const stat = statSync(itemPath)
            if (stat.isDirectory()) {
                const encodedItem = encodeURIComponent(item)
                sidebarConfig[`/about/${encodedItem}/`] = aboutSidebar
                sidebarConfig[`/about/${encodedItem}`] = aboutSidebar
            }
        })
    } catch (e) {
        // 忽略错误
    }

    return sidebarConfig
}

export default defineConfig({
    lang: 'zh-CN',
    title: 'Ada的奇思妙想',
    description: '技术分享、生活记录、学习笔记',
    base: '/blog/',

    head: [
        ['link', { rel: 'icon', href: '/blog/favicon.ico' }]
    ],

    themeConfig: {
        logo: 'logo.png',

        // 配置右侧导航（On this page）显示的标题层级
        // 设置为 'deep' 表示显示所有层级的标题（h2 到 h6）
        outline: {
            level: 'deep',
            label: '页面导航'
        },

        // 启用本地搜索功能
        search: {
            provider: 'local',
            options: {
                locales: {
                    zh: {
                        translations: {
                            button: {
                                buttonText: '搜索',
                                buttonAriaLabel: '搜索文档'
                            },
                            modal: {
                                noResultsText: '无法找到相关结果',
                                resetButtonTitle: '清除查询条件',
                                footer: {
                                    selectText: '选择',
                                    navigateText: '切换',
                                    closeText: '关闭'
                                }
                            }
                        }
                    }
                }
            }
        },

        // 顶部导航栏
        nav: [
            { text: '首页', link: '/' },
            { text: '文章', link: '/posts/' },
            { text: '关于', link: '/about/' },
            // { text: 'GitHub', link: 'https://github.com/ada-thinks' },
        ],

        // 侧边栏配置（自动生成）
        // 为所有 /posts/ 下的路径都使用文章列表侧边栏
        sidebar: generateSidebarConfig(),

        // 社交链接
        socialLinks: [
            // { icon: 'github', link: 'https://github.com/ada-thinks' }
        ],

        // 页脚
        footer: {
            message: '基于 VitePress 构建',
            copyright: 'Copyright © 2024 Ada'
        },
    },
})