import { add, list, edit, deletePhotoalbum, changeStatus } from '@/api/photoalbum'

const state = {
}

const mutations = {
}

const actions = {
  add({ commit }, params) {
    return new Promise((resolve, reject) => {
      add(params).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  list({ commit }, params) {
    return new Promise((resolve, reject) => {
      list(params).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  edit({ commit }, params) {
    return new Promise((resolve, reject) => {
      edit(params).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  delete({ commit }, params) {
    return new Promise((resolve, reject) => {
      deletePhotoalbum(params).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  changeStatus({ commit }, params) {
    return new Promise((resolve, reject) => {
      changeStatus(params).then(response => {
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
