<template>
  <div id="histories">
    <header>
      <h2>閲覧履歴</h2>
      <p>小説ごとの最後まで読んでいた行へジャンプできます</p>
    </header>

    <p v-if="!histories.length">
      ※開いた小説がありません
    </p>
    <ul v-else>
      <li v-for="(history, index) in histories.slice(0, 5)" :key="'histories'+index">
        <h3>
          <nuxt-link :to="`/${history.ncode}/${history.page}?line=${history.line}${history.r18 ? '&r18=1':''}`">
            {{ history.title }}
          </nuxt-link>
        </h3>
        <p>{{ history.line | zeroPadding }}行（{{ history.page | zeroPadding }} / {{ history.pageMax | zeroPadding }}P）</p>
        <p class="oneline">
          <small>{{ history.text }}</small>
        </p>
        <p><span v-if="history.chapter">{{ history.chapter }} / </span>{{ history.subtitle }}</p>

        <button @click="remove(history)">
          削除
        </button>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: mapState(['histories']),
  methods: {
    remove (history) {
      if (!confirm(`「${history.title}」を閲覧履歴から削除してよろしいですか？`)) {
        return
      }
      this.$store.commit('remove', history.ncode)
    }
  }
}
</script>

<style lang="stylus" scoped>
header
  margin-bottom 1em

li
  margin-bottom 1em
</style>
