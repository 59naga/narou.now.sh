export default {
  ssr: false,
  target: 'static',
  head: {
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' }
    ],
    link: [
      { rel: 'stylesheet', href: '//rawgit.com/filipelinhares/ress/master/dist/ress.min.css' }
    ],
    script: [
      { src: '//cdnjs.cloudflare.com/ajax/libs/vissense/0.10.0/vissense.min.js' },
      { src: '//cdnjs.cloudflare.com/ajax/libs/velocity/1.5.2/velocity.min.js' },
      { src: '//cdnjs.cloudflare.com/ajax/libs/velocity/1.5.2/velocity.ui.min.js' }
    ]
  },
  plugins: [
    { src: '~/plugins/index.js' },
    { src: '~/plugins/store.js' },
    { src: '~/plugins/browser.js', ssr: false }
  ],
  build: {
    cssSourceMap: false, // https://github.com/vuetifyjs/vuetify/issues/3403
    extend (config, { isDev, isClient }) {
      if (!isDev) {
        config.devtool = false
      }
      // config.node = {
      //   fs: 'empty'
      // }
      // https://github.com/nuxt-community/modules/issues/185
      config.resolve.alias['vue'] = 'vue/dist/vue.js'
    }
  },
  modules: [
    '@nuxtjs/style-resources',
    '@nuxtjs/axios',
    ['cookie-universal-nuxt', { parseJSON: false }]
  ],
  styleResources: {
    stylus: [
      'kouto-swiss/index.styl',
      './assets/index.styl'
    ]
  },
  axios: {
    baseURL: '//narou-nyiztebz6a-an.a.run.app',
    browserBaseURL: '//narou-nyiztebz6a-an.a.run.app'
  }
}
