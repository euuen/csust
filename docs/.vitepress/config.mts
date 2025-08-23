import { defineConfig } from 'vitepress'
import tailwindcss from "@tailwindcss/vite"

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "长沙理工人工智能学院智能网络",
  // description: "主打一个便民服务",
  base: "/csust",
  head: [
    ['link', { rel: 'icon', href: '/csust.png' }],
  ],
  themeConfig: {
    logo: "/csust.png",
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      // { text: 'Home', link: '/' },
      // { text: 'Examples', link: '/markdown-examples' }
    ],

    sidebar: [
      {
        text: '长沙理工',
        items: [
          // { text: 'Markdown Examples', link: '/markdown-examples' },
          // { text: 'Runtime API Examples', link: '/api-examples' }
          { text: "多人听歌", link:'/sharedmusic' },
          { text: "关于本站", link:'/about'}
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/euuen/csust' }
    ]
  },
  vite:{
    plugins:[
      tailwindcss()
    ]
  }
})
