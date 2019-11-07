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

    <template v-if="items.length">
      <Paginator :page="page" :step="step" :total="allcount" />

      <section>
        <ul>
          <li v-for="item in items" :key="item.ncode">
            <p class="oneline">
              <nuxt-link :to="'/'+item.ncode+'/'+(type == 3 ? '?r18=1' : '')">
                {{ item.title }}
              </nuxt-link>
              <span v-if="item.end">【完結済】</span>
            </p>
            <p>{{ item.all_point.toLocaleString() }}pt / {{ item.fav_novel_cnt.toLocaleString() }}fav / {{ item.review_cnt.toLocaleString() }}review</p>
            <p>{{ $dateFns.distanceInWordsToNow(item.novelupdated_at) }}前に更新 / 作者：{{ item.writer }}</p>
            <p class="summary">
              {{ item.story }}
            </p>
          </li>
        </ul>
      </section>

      <Paginator :page="page" :step="step" :total="allcount" />
      </tempalte>
    </template>
    <template v-else>
      <section>
        <p>何もないです</p>
      </section>
    </template>
  </div>
</template>

<script>
import Histories from '~/components/Histories'
import Paginator from '~/components/Paginator'

export default {
  components: { Histories, Paginator },
  data () {
    return { word: '' }
  },
  watchQuery: true,
  async asyncData ({ app, query }) {
    const { type = 1, word, page = 1 } = query
    const step = 10

    const st = step * (page - 1) + 1
    const params = { order: 'hyoka', word: word || ' ', lim: step, st }
    let data
    switch (Number(type)) {
      case 2:
        data = await app.$narou.pickup(params)
        break
      case 3:
        data = await app.$narou.noc(params)
        break

      default:
        data = await app.$narou(params)
    }
    return { type, page, step, ...data, word }
  },
  methods: {
    search () {
      const { type, word } = this
      this.$router.push({ query: { type, word } })
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
