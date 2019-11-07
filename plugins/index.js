import Vue from 'vue'
import naroujs from 'naroujs'

Vue.directive('focus', {
  inserted: (el) => {
    el.focus()
  }
})

Vue.filter('zeroPadding', (str, length = 4) => {
  if (str == null) {
    return ''
  }
  return (new Array(length + 1).join('0') + str).slice(-length)
})

export default ({ app }, inject) => {
  app.$narou = naroujs
}
