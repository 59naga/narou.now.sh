<template>
  <div id="index">
    <section>
      <h1>
        <nuxt-link to="/">
          narou endless reader
        </nuxt-link>
      </h1>

      <Histories />
    </section>

    <section>
      <header class="radios">
        <label>
          <input
            v-model="type"
            type="radio"
            value="1"
            @change="search"
          >
          <h2>検索</h2>
        </label>
        <label>
          <input
            v-model="type"
            type="radio"
            value="2"
            @change="search"
          >
          <h2>ピックアップ検索</h2>
        </label>
        <label>
          <input
            v-model="type"
            type="radio"
            value="3"
            @change="search"
          >
          <h2>ノクターン（R18）検索</h2>
        </label>
      </header>

      <form @submit.prevent="search()">
        <input v-model="word" v-focus required>

        <!-- <p>{{ uri }}</p> -->
        <p v-if="items.length" class="result">
          {{ allcount.toLocaleString() }}件中 {{ (page - 1) * step + 1 }}〜{{ (page - 1) * step + items.length }}件を表示
        </p>
      </form>
    </section>

    <Paginator :page="page" :step="step" :total="allcount" />

    <div v-if="items.length">
      <section>
        <div v-if="progress" class="progress-overlay">
          <section>
            <ul><li>読み込み中・・・</li></ul>
          </section>
        </div>
        <ul>
          <li v-for="item in items" :key="item.ncode">
            <p class="oneline">
              <nuxt-link :to="'/'+item.ncode+'/'+(type == 3 ? '?r18=1' : '')">
                {{ item.title }}
              </nuxt-link>
              <span v-if="item.end">【完結済】</span>
            </p>
            <p>{{ item.all_point.toLocaleString() }}pt / {{ item.fav_novel_cnt.toLocaleString() }}fav / {{ item.review_cnt.toLocaleString() }}review</p>
            <p>{{ item.novelupdated_at }}前に更新 / 作者：{{ item.writer }}</p>
            <p class="summary">
              {{ item.story }}
            </p>
          </li>
        </ul>
      </section>

      <Paginator :page="page" :step="step" :total="allcount" />
    </div>
    <div v-else-if="!progress">
      <section>
        <p>何もないです</p>
      </section>
    </div>
  </div>
</template>

<script>
import Histories from '~/components/Histories'
import Paginator from '~/components/Paginator'

export default {
  components: { Histories, Paginator },
  data () {
    const step = 10
    return { step, items: [], progress: false, allcount: 0 }
  },
  computed: {
    type: {
      get () {
        return Number(this.$route.query.type || 1)
      },
      set (value) {
        const query = this.$route.query
        this.$router.replace({ query: { ...query, type: value } })
      }
    },
    page: {
      get () {
        return Number(this.$route.query.page || 1)
      },
      set (value) {
        const query = this.$route.query
        this.$router.replace({ query: { ...query, page: value } })
      }
    },
    word: {
      get () {
        return this.$route.query.word || ''
      },
      set (value) {
        const query = this.$route.query
        this.$router.replace({ query: { ...query, word: value } })
      }
    }
  },
  watch: {
    '$route.query': {
      deep: true,
      handler () {
        this.$nextTick(() => {
          this.search()
        })
      }
    }
  },
  mounted () {
    this.search()
  },
  methods: {
    async search () {
      const { type, word, page } = this
      const step = 10

      const st = step * (page - 1) + 1
      const params = { order: 'hyoka', word: word || ' ', lim: step, st }
      let data
      this.progress = true
      switch (Number(type)) {
        case 2:
          data = await this.$narou.pickup(params)
          break
        case 3:
          data = await this.$narou.noc(params)
          break

        default:
          data = await this.$narou(params)
      }

      Object.keys(data).forEach(key => {
        this[key] = data[key]
      })
      this.progress = false
    }
  }
}
</script>

<style lang="stylus" scoped>
#index
  margin 0 auto
  max-width 960px

  form
    margin-top 2em

    .result
      text-align right

.radios
  display flex
  label
    display block
    margin-right 1em
    h2
      cursor pointer
      opacity .5
      font-weight normal
  input[type=radio]
    display none

    &:checked + h2
      opacity 1
      font-weight bold

section
  padding 1em
  position relative

  .progress-overlay
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    text-align: center;
    color: white;
    background: rgba(0, 0, 0, 0.2);
    z-index: 10;

h1
  margin-bottom 1em

input
  display block
  width 100%
  border primary_color solid 1px

ul
  li
    margin 1em 0

.summary
  overflow ellipsis
  font-size small
</style>
