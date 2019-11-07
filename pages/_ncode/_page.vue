<template>
  <div id="spinner-container">
    <clip-loader color="#934" size="340px" />
  </div>
</template>

<script>
import { stringify } from 'querystring'
import ClipLoader from 'vue-spinner/src/ClipLoader'

export default {
  components: { ClipLoader },
  mounted () {
    let { ncode, page } = this.$route.params
    let { line, r18 } = this.$route.query
    page = page || 1
    line = line || 1
    r18 = r18 || undefined

    this.$router.replace(`/${ncode}?${stringify({ page, line, r18 })}`)
  }
}
</script>

<style lang="stylus" scoped>
#spinner-container
  height 100vw
  height 100vh
  
  display flex
  justify-content center
  align-items center
    
</style>
