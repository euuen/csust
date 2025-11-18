// https://vitepress.dev/guide/custom-theme
import { h, toRefs } from 'vue'
import type { Theme } from 'vitepress'
import { useData, useRoute } from 'vitepress';
import DefaultTheme from 'vitepress/theme'
import './style.css'
import giscusTalk from 'vitepress-plugin-comment-with-giscus'
import Lenis from 'lenis';
import Layout from './Layout.vue';

import test from "./test.vue"
import hs from './hs.vue';

export default {
  extends: DefaultTheme,
  Layout: Layout,
  // Layout: () => {
  //   return h(DefaultTheme.Layout, null, {
  //     // https://vitepress.dev/guide/extending-default-theme#layout-slots
  //   })
  // },
  enhanceApp({ app, router, siteData }) {
    app.component('test', test)
    app.component('hs', hs)
  },
  setup() {
    const { frontmatter } = toRefs(useData());
    const route = useRoute();
    giscusTalk({
            repo: 'euuen/csust',
            repoId: 'R_kgDOPiwftw',
            category: 'General', // 或其他分类
            categoryId: 'DIC_kwDOPiwft84Cuf_M',
            mapping: 'pathname',
            inputPosition: 'top',
            lang: 'zh-CN',
            loading: 'lazy',
            theme: "preferred_color_scheme"
        }, {
            frontmatter,
            route
        }, true);
    const lenis = new Lenis({
        duration: 1,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        autoRaf: true,
    });
  }
} satisfies Theme
