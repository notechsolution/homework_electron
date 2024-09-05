const { join, resolve } = require('path')
const { external } = require('../package.json')
const { default: vue } = require('@vitejs/plugin-vue')
const { readdirSync } = require('fs')

const entries = readdirSync(join(__dirname, '../src/renderer')).filter(f => f.endsWith('.html'))
  .map(f => join(__dirname, '../src/renderer', f))

/**
 * Vite shared config, assign alias and root dir
 * @type {import('vite').UserConfig}
 */
const config = {
  root: join(__dirname, '../src/renderer'),
  base: '', // has to set to empty string so the html assets path will be relative
  build: {
    rollupOptions: {
      input: entries
    },
    outDir: resolve(__dirname, '../dist/renderer'),
    assetsInlineLimit: 0
  },
  resolve: {
    alias: {
      '/@shared': join(__dirname, '../src/shared'),
      '/@': join(__dirname, '../src/renderer'),
      'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js'
    }
  },
  optimizeDeps: {
    exclude: [
      'electron-updater',
      'fs-extra',
      '@azure/applicationinsights-query',
      '@azure/container-registry',
      '@azure/identity',
      'dotenv'
  ],
    include: ['element-plus/lib/locale/lang/zh-cn', 'element-plus/lib/locale/lang/en', 'element-plus/lib/locale/lang/zh-tw']
  },
  // @ts-ignore
  plugins: [vue()],
  css: {
    postcss: {
      plugins: [
        {
          postcssPlugin: 'internal:charset-removal',
          AtRule: {
            charset: (atRule) => {
              if (atRule.name === 'charset') {
                atRule.remove();
              }
            }
          }
        }
      ]
    }
  },
  define: {
    __VUE_I18N_LEGACY_API__: JSON.stringify(false),
    __VUE_I18N_FULL_INSTALL__: JSON.stringify(false),
    __INTLIFY_PROD_DEVTOOLS__: JSON.stringify(false)
  }
}

module.exports = config
