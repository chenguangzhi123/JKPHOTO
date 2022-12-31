import { upload } from '@/api/upload'

const state = {
}

const mutations = {
}

const actions = {
  picture({ commit }, params) {
    return new Promise((resolve, reject) => {
      upload(params).then(response => {
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
