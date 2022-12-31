import { list, deletePhoto } from '@/api/photo'

const state = {
}

const mutations = {
}

const actions = {
  list({ commit }, params) {
    return new Promise((resolve, reject) => {
      list(params).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  delete({ commit }, params) {
    return new Promise((resolve, reject) => {
      deletePhoto(params).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
