import Vue from 'vue'
import VModal from 'vue-js-modal'

import * as viewportUnitsBuggyfill from 'viewport-units-buggyfill'

viewportUnitsBuggyfill.init()
window.addEventListener('resize', viewportUnitsBuggyfill.refresh, true)

Vue.use(VModal)
