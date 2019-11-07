<template>
  <div>
    <no-ssr>
      <Toc ref="toc-modal" :toc="toc" />
    </no-ssr>
    <div id="reader" :class="{loading: busy}">
      <Reader :toc="toc" :pages="pages" />
    </div>
  </div>
</template>

<script>
import { stringify } from 'querystring'
import Toc from '~/components/Toc'
import Reader from '~/components/Reader'

export default {
  components: { Toc, Reader },
  data: () => ({ busy: true }),
  watch: {
    '$route' (to, from) {
      if (to.query.page === from.query.page) {
        return
      }

      const prev = Number(to.query.page) - 1
      const prevPageNotExists = !this.pages.find(page => page.page === prev) && prev > 0
      if (prevPageNotExists) {
        // TODO: 描写時にスクロールが大きくズレる
        this.unshiftPage(prev)
      }

      const next = Number(to.query.page) + 1
      const nextPageNotExists = !this.pages.find(page => page.page === next)
      if (nextPageNotExists) {
        this.pushPage(next)
      }
    }
  },
  async asyncData ({ params, query, redirect, app, store }) {
    const ncode = (params.ncode || '').toLowerCase()
    let { page, line, r18 } = query
    if (!page || !line) {
      const history = store.state.histories.find(history => history.ncode === ncode) || {}
      page = page || history.page || 1
      line = line || history.line || 1
      r18 = r18 || history.r18 || undefined
      return redirect(`/${ncode}?${stringify({ page, line, r18 })}`)
    }

    const prefix = r18 ? '/r18' : ''
    const deferredToc = app.$axios.$get(prefix + '/toc/' + ncode)
    const deferredPages = []
    if (Number(page) - 1) {
      deferredPages.push(app.$axios.$get(prefix + '/novel/' + ncode + '/' + (Number(page) - 1)).catch(error => null))
    }
    deferredPages.push(app.$axios.$get(prefix + '/novel/' + ncode + '/' + (Number(page))))
    deferredPages.push(app.$axios.$get(prefix + '/novel/' + ncode + '/' + (Number(page) + 1)).catch(error => null))
    const [toc, pages] = await Promise.all([deferredToc, Promise.all(deferredPages)])

    return { toc, pages }
  },
  methods: {
    async unshiftPage (page) {
      const { ncode } = this.$route.params
      const prefix = this.$route.query.r18 ? '/r18' : ''

      // TODO: this.pages.pop()を行うとscrollが意図せぬズレ方をする
      this.pages.unshift(await this.$axios.$get(prefix + '/novel/' + ncode + '/' + (Number(page))))
    },
    async pushPage (page) {
      const { ncode } = this.$route.params
      const prefix = this.$route.query.r18 ? '/r18' : ''

      const minPage = ~~((this.pages[0] || {}).page)
      if (this.$route.query.page > minPage + 1) {
        this.pages.shift()
      }
      this.pages.push(await this.$axios.$get(prefix + '/novel/' + ncode + '/' + (Number(page))))
      this.$nextTick(() => {
        const targetParent = this.$el.querySelector('#P' + page)
        window.scrollBy(targetParent.offsetWidth, 0)
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
#reader
  position relative
  height 100vh
  color #333
  writing-mode vertical-rl

  transition opacity .5s
  opacity 1
  &.loading
    opacity 0
</style>
