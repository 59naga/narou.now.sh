<template>
  <div>
    <transition
      v-if="types.length"
      @appear="appear"
    >
      <div>
        <span
          v-for="(type,index) in types"
          :key="index"
          class="type"
        >{{ type }}</span>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  props: ['text'],
  data () {
    return { types: (this.text || '').match(/./g) || [] }
  },
  methods: {
    appear (el, complete) {
      const stagger = 100

      const types = [].slice.call(el.querySelectorAll('.type'))
      Velocity(types, 'transition.shrinkIn', { stagger, complete })
    }
  }
}
</script>

<style lang="stylus" scoped>
.type
  display inline-block
</style>
