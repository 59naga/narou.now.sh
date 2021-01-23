<template>
  <div class="pager">
    <nuxt-link v-if="page - 1 >= 1" :to="{query:Object.assign({}, $route.query ,{page: page - 1})}">
      ＜
    </nuxt-link>
    <a v-else class="disabled">
      ＜
    </a>

    <nuxt-link v-if="page + 1 <= max" :to="{query:Object.assign({}, $route.query ,{page: page + 1})}">
      ＞
    </nuxt-link>
    <a v-else class="disabled">
      ＞
    </a>

    <nuxt-link
      v-for="(page, index) in slider.left"
      :to="{query:Object.assign({}, $route.query ,{page})}"
    >
      <span v-if="index === 1 && page > 2">…</span>
      <span v-else>{{ page }}</span>
    </nuxt-link>

    <a class="active">{{ page }}</a>

    <nuxt-link
      v-for="(page, index) in slider.right"
      :to="{query:Object.assign({}, $route.query ,{page})}"
    >
      <span v-if="index + 1 === slider.right.length - 1 && page + 1 < max">…</span>
      <span v-else>{{ page }}</span>
    </nuxt-link>
  </div>
</template>

<script>
export default {
  props: ['page', 'step', 'total'],
  computed: {
    max () {
      const { step, total } = this
      return Math.ceil((total > 2000 ? 2000 : total) / step)
    },
    slider () {
      const page = ~~this.page
      const max = ~~this.max
      const range = 7
      const rangeWithoutActive = range - 1

      let left = []
      let leftRange = Math.ceil(range / 2) - 1
      if (page > 1) {
        leftRange--
      }
      let leftI = 1
      for (; left.length < leftRange; leftI++) {
        if (page - leftI < 2) {
          break
        }
        left.unshift(page - leftI)
      }
      if (page > 1) {
        left.unshift(1)
      }

      const right = []
      let rightRange = rangeWithoutActive
      if (page < max) {
        rightRange--
      }
      for (let rightI = 1; (left.length + right.length) < rightRange; rightI++) {
        if (page + rightI >= max) {
          break
        }
        right.push(page + rightI)
      }
      if (page < max) {
        right.push(max)
      }

      if ((left.length + right.length) < rangeWithoutActive) {
        for (; (left.length + right.length) < (rangeWithoutActive); leftI++) {
          if (page - leftI < 2) {
            break
          }
          left.splice(1, 0, page - leftI)
        }
      }

      if (left[1] && left[1] > 2) {
        left[1] = Math.round(page / 2)
      }
      if (right[right.length - 2] && right[right.length - 2] < max - 1) {
        const median = page + Math.round((max - page) / 2)
        right[right.length - 2] = median >= max - 1 ? max - 1 : median
      }

      return { left, right }
    }
  }
}
</script>

<style lang="stylus" scoped>
button-width = 2.75em

.pager
  width button-width * 8
  margin 0 auto
  overflow ellipsis
  text-align center
  display flex

a
  display block
  max-width button-width
  width button-width
  height button-width
  padding .25em
  line-height 2

  &:visited
    color link_color

.active
  font-weight bold

.disabled
  opacity .5
</style>
