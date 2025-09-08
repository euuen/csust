import { defineConfig } from 'vitepress'
import tailwindcss from "@tailwindcss/vite"

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "长理人工智能学院",
  // description: "主打一个便民服务",
  base: "/csust",
  head: [
    ['link', { rel: 'icon', href: '/csust/csust.png' }],
  ],
  markdown:{
    lineNumbers: true,

  },
  themeConfig: {
    logo: "/csust.png",
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      // { text: 'Home', link: '/' },
      // { text: 'Examples', link: '/markdown-examples' }
    ],

    sidebar: [
      {
        text: '初来乍到',
        items: [
          { text: "新生必读", link:'/mustread' }
        ]
      },
      {
        text: '长沙理工',
        items: [
          // { text: 'Markdown Examples', link: '/markdown-examples' },
          // { text: 'Runtime API Examples', link: '/api-examples' }
          { text:"学习的本质", link:"/study/essential" },
          { text:"学习如何学习", link:'/study/lrtostudy' },
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
