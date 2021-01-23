export const state = () => ({
  histories: []
})

export const mutations = {
  update (state, history = {}) {
    if (!history || !history.ncode) {
      return
    }

    const index = state.histories.findIndex(item => item.ncode === history.ncode)
    if (index > -1) {
      state.histories.splice(index, 1, history)
    } else {
      state.histories.unshift(history)
    }
  },
  remove (state, ncode) {
    if (!ncode) {
      return
    }

    const index = state.histories.findIndex(item => item.ncode === ncode)
    if (index > -1) {
      state.histories.splice(index, 1)
    }
  }
}
