<template>
  <modal name="toc" height="80%" @opened="openedToc">
    <div id="toc">
      <header>
        <h1><a :href="toc.uri" target="_blank">{{ toc.title }}</a></h1>
        <p class="author">
          作者：{{ toc.author }}
        </p>
        <p><component :is="unescaped(toc.content)" /></p>
      </header>
      
      <template v-if="toc.episodes">
        <section :key="'chapter0'">
          <ul>
            <li
              v-for="episode in toc.episodes"
              :id="`E${episode.page}`"
              :key="'episode'+episode.page"
            >
              <nuxt-link
                replace
                :to="`/${$route.params.ncode}/${episode.page}`"
                :class="{active:episode.page==$route.query.page}"
              >
                {{ episode.subtitle }}
              </nuxt-link>
            </li>
          </ul>
        </section>
      </template>

      <template v-for="(chapter, index) in toc.chapters">
        <section :key="'chapter'+(index+1)">
          <h2>{{ chapter.title }}</h2>
          <ul>
            <li
              v-for="episode in chapter.episodes"
              :id="`E${episode.page}`"
              :key="'episode'+episode.page"
            >
              <nuxt-link
                replace
                :to="`/${$route.params.ncode}/${episode.page}`"
                :class="{active:episode.page==$route.query.page}"
              >
                {{ episode.subtitle }}
              </nuxt-link>
            </li>
          </ul>
        </section>
      </template>
    </div>
  </modal>
</template>

<script>
export default {
  props: ['toc'],
  computed: {
    unescaped: function (vm) {
      return (html) => {
        return {
          name: 'DynamicComponent',
          template: `<span>${html}</span>`
        }
      }
    }
  },
  methods: {
    openedToc (event) {
      this.$nextTick(() => {
        const tocNode = this.$el.querySelector('#toc')
        const liNode = this.$el.querySelector('#E' + this.$route.query.page)
        if (liNode) {
          tocNode.scrollTo(0, liNode.offsetTop)
        }
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
#toc
  height 100%
  overflow scroll

  header
    padding 1em
    margin-bottom 2em

    .author
      text-align right
    p
      padding 0 1em
      font-size smaller

  section
    padding 1em

  .active
    font-weight bold

  h2:nth-of-type(n+2)
    margin-top 1em

  ul
    list-style-type none
</style>
