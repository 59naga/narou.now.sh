<template>
  <div>
    <template v-for="page in pages">
      <div
        v-if="page"
        :id="'P'+page.page"
        :key="String(page.ncode)+String(page.page)"
        :class="{page:true, current:page.page == $route.query.page}"
      >
        <aside v-if="page.page == $route.query.page">
          <button class="page-status" @click.prevent="$modal.show('toc')">
            <span>{{ $route.query.line | zeroPadding }}</span>
            <span>{{ lineMax > 0 ? '/ ' : '' }}{{ lineMax | zeroPadding }}</span>
            <span>行（{{ page.page | zeroPadding }} / {{ toc.count | zeroPadding }}P）</span>
          </button>
          <div>
            <h3><Typed :text="page.subtitle" /></h3>
            <h1><span v-if="page.chapter">{{ page.chapter }} / </span><span>{{ page.title }}</span></h1>
          </div>
        </aside>
        <component :is="unescaped(page)" />
      </div>
    </template>
  </div>
</template>

<script>
import Typed from '~/components/Typed'

export default {
  components: { Typed },
  props: ['toc', 'pages'],
  computed: {
    unescaped: function (vm) {
      const currentPage = Number(this.$route.query.page)
      return (page) => {
        if (Number(page.page) === currentPage) {
          if (!vm._scroll) {
            vm.attachScrollReminder()
          }
        }
        return {
          name: 'DynamicComponent',
          template: `<div class="page-content">${page.content}</div>`
        }
      }
    },
    lineMax () {
      const { page } = this.$route.query

      if (!this.$el) {
        return null
      }
      const targetParent = this.$el.querySelector('#P' + page)
      if (!targetParent) {
        return null
      }
      const lines = [].slice.call(targetParent.querySelectorAll('p'))
      const lineNumber = lines[lines.length - 1].getAttribute('id').slice(1)
      if (lineNumber > 0) {
        return lineNumber
      }
      return null
    }
  },
  destroyed () {
    this.detachScrollReminder()
  },
  methods: {
    attachScrollReminder () {
      if (!process.browser) {
        return
      }

      setTimeout(() => { // DynamicComponentの描写を待ってからスクロールする
        const { page, line } = this.$route.query

        const targetParent = this.$el.querySelector('#P' + page)
        const targetNode = targetParent.querySelector('#L' + line)
        if (targetNode && line > 1) {
          const calculatedScrollX = innerWidth - (targetNode.offsetLeft + targetNode.offsetWidth)
          window.scrollTo(calculatedScrollX * -1, 0)
        } else {
          const calculatedScrollX = innerWidth - (targetParent.offsetLeft + targetParent.offsetWidth)
          window.scrollTo(calculatedScrollX * -1, 0)
        }

        this.$parent.busy = false

        this._scroll = this.scroll.bind(this)
        window.addEventListener('scroll', this._scroll)
      })
    },
    detachScrollReminder () {
      if (this._scroll) {
        window.removeEventListener('scroll', this._scroll)
        this._scroll = null
      }
    },
    async scroll () {
      const lines = [].slice.call(this.$el.querySelectorAll('p'))
      let i = 0
      for (; i < lines.length; i++) {
        if (VisSense(lines[i]).percentage() > 0) {
          break
        }
      }

      const targetNode = lines[i]
      if (!targetNode) {
        return
      }
      const page = targetNode.parentNode.parentNode.getAttribute('id').slice(1)
      const line = targetNode.getAttribute('id').slice(1)
      const r18 = this.$route.query.r18 ? true : undefined
      this.$router.replace({ query: { page, line, r18 } })

      const pageMax = this.toc.count
      const lineMax = this.lineMax
      const { ncode } = this.$route.params
      const text = targetNode.textContent.trim()
      const { subtitle, chapter, title } = this.pages.find(item => String(item.page) === String(page)) || {}
      this.$store.commit('update', { ncode, page, pageMax, line, r18, lineMax, text, subtitle, chapter, title })
    }
  }
}
</script>

<style lang="stylus" scoped>
footer-height = 8rem

.page
  transition opacity .5s
  opacity 1
  &:not(.current)
    opacity 0.75

  font-size 3vh
  font-family YuMincho,'游明朝','Yu Mincho','ヒラギノ明朝 Pro W3','Hiragino Mincho Pro',Meiryo,serif

  .page-content
      word-break break-all

  padding 1em
  padding-bottom footer-height
  aside
    margin 0 auto
    max-width 960px

    writing-mode: horizontal-tb;
    text-align right

    font-family initial

    fixed auto 0 0 0
    width 100%
    height footer-height
    padding .5em

    button
      display block
      margin 0 auto
      width 20em

    h1
    h2
    h3
      font-size medium

    .page-status
      color secondary_color
      opacity 0.75
      font-size small
      text-align center
      padding 1em

</style>
