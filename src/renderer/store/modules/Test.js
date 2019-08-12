const state = {
  main: 0,
  defaultConfig: {}
}

const mutations = {
  SET_DEFAULT_CONFIG(state, info) {
    state.defaultConfig = info
  }
}

const actions = {
  someAsyncTask ({ commit }, value) {
    // do something async
    commit('SET_DEFAULT_CONFIG', value)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
