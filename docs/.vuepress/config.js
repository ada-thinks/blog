import { defineUserConfig } from 'vuepress'
import { defaultTheme } from '@vuepress/theme-default'
import { viteBundler } from '@vuepress/bundler-vite'

export default defineUserConfig({
    lang: 'zh-CN',
    title: 'Ada的博客',
    description: '技术分享、生活记录、学习笔记',
    base: '/blog/',

    bundler: viteBundler(),

    theme: defaultTheme({
        logo: '/blog/logo.png',

        navbar: [{
                text: '首页',
                link: '/',
            },
            {
                text: '文章',
                link: '/posts/',
            },
            {
                text: '关于',
                link: '/about/',
            },
            {
                text: 'GitHub',
                link: 'https://github.com/ada712',
            },
        ],

        sidebar: {
            '/posts/': [{
                text: '文章列表',
                children: [
                    '/posts/hello-world.md',
                    '/posts/vuepress-getting-started.md',
                ],
            }, ],
        },
    }),
})