/// <reference types="vitest" />

import { dirname, relative } from 'path'
import type { UserConfig } from 'vite'
import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

import Icons from 'unplugin-icons/vite'
import AutoImport from 'unplugin-auto-import/vite'
import UnoCSS from 'unocss/vite'
import { isDev, port, r } from './scripts/utils'

export const sharedConfig: UserConfig = {
  root: r('src'),
  resolve: {
    alias: {
      '~/': `${r('src')}/`,
      '@src/': `${r('src')}/`,
      '@components/': `${r('src/components')}/`,
      '@tests/': `${r('src/__tests__')}/`,
    },
  },
  define: {
    __DEV__: isDev,
  },
  plugins: [
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
          'webextension-polyfill': [['*', 'browser']],
        },
      ],

      // Filepath to generate corresponding .d.ts file.
      // Defaults to './auto-imports.d.ts' when `typescript` is installed locally.
      dts: r('src/auto-imports.d.ts'),
    }),

    // https://github.com/antfu/unplugin-icons
    Icons({ compiler: 'svelte' }),

    // https://github.com/unocss/unocss
    UnoCSS(),

    svelte(),

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
  plugins: sharedConfig.plugins,
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
        background: r('src/pages/background/index.html'),
        options: r('src/pages/options/index.html'),
        popup: r('src/pages/popup/index.html'),
      },
    },
  },
  test: {
    // Had  to add the '..' because the root path for vite is 'src/'
    include: ['**/__tests__/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    globals: true,
    environment: 'jsdom',
    resolveSnapshotPath: (testPath, snapExtension) => testPath + snapExtension,
    coverage: {
      provider: 'c8',
      reporter: ['text'],
      reportsDirectory: r('src/__tests__/__coverage__'),
    },
  },
}))
