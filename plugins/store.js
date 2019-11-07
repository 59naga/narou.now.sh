import createPersistedState from 'vuex-persistedstate'

export default ({ app, store, isHMR }) => {
  if (isHMR) return

  createPersistedState({
    paths: ['histories'],
    storage: {
      getItem: key => app.$cookies.get(key),
      setItem: (key, value) => app.$cookies.set(key, value, { maxAge: 365 * 60 * 60 * 24 }),
      removeItem: key => app.$cookies.remove(key)
    }
  })(store)
}
