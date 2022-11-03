/// <reference types="vitest" />

import { dirname, relative } from 'path'
import type { UserConfig } from 'vite'
import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

import IconsResolver from 'unplugin-icons/resolver'
import Icons from 'unplugin-icons/vite'
import AutoImport from 'unplugin-auto-import/vite'
import UnoCSS from 'unocss/vite'
import { isDev, port, r } from './scripts/utils'

export const sharedConfig: UserConfig = {
  root: r('src'),
  resolve: {
    alias: {
      '~/': `${r('src')}/`,
    },
  },
  define: {
    __DEV__: isDev,
  },
  plugins: [
    svelte(),

    // https://github.com/antfu/unplugin-auto-import
    AutoImport({
      include: [
        /\.[tj]sx?$/,
        /\.svelte$/,
      ],
      // global imports to register
      imports: [
        'svelte',
        'svelte/store',
        'svelte/transition',
        {
          '@iconify/svelte': [
            // default imports
            ['default', 'Icon'], // import { default as Icon } from '@iconify/svelte',
          ],
          'webextension-polyfill': [['*', 'browser']],
        },
      ],
      resolvers: [
        // auto import icons
        IconsResolver({
          componentPrefix: 'Icon',
        }),
      ],

      // Filepath to generate corresponding .d.ts file.
      // Defaults to './auto-imports.d.ts' when `typescript` is installed locally.
      dts: r('src/auto-imports.d.ts'),
    }),

    // // https://github.com/antfu/unplugin-vue-components
    // Components({
    //   dirs: [r('src/components')],
    //   // generate `components.d.ts` for ts support with Volar
    //   dts: r('src/components.d.ts'),
    //   resolvers: [
    //     // auto import icons
    //     IconsResolver({
    //       componentPrefix: '',
    //     }),
    //   ],
    // }),

    // https://github.com/antfu/unplugin-icons
    Icons({ compiler: 'svelte' }),

    // https://github.com/unocss/unocss
    UnoCSS(),

    // rewrite assets to use relative path
    {
      name: 'assets-rewrite',
      enforce: 'post',
      apply: 'build',
      transformIndexHtml(html, { path }) {
        return html.replace(/"\/assets\//g, `"${relative(dirname(path), '/assets')}/`)
      },
    },
  ],
  optimizeDeps: {
    include: ['webextension-polyfill'],
  },
}

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  ...sharedConfig,
  base: command === 'serve' ? `http://localhost:${port}/` : '/dist/',
  server: {
    port,
    hmr: {
      host: 'localhost',
    },
  },
  build: {
    outDir: r('extension/dist'),
    emptyOutDir: false,
    sourcemap: isDev ? 'inline' : false,
    // https://developer.chrome.com/docs/webstore/program_policies/#:~:text=Code%20Readability%20Requirements
    terserOptions: {
      mangle: false,
    },
    rollupOptions: {
      input: {
        background: r('src/background/index.html'),
        options: r('src/options/index.html'),
        popup: r('src/popup/index.html'),
      },
    },
  },
  plugins: sharedConfig.plugins,
  test: {
    globals: true,
    environment: 'jsdom',
  },
}))
