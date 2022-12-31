import request from '@/utils/request'

export function add(data) {
  return request({
    url: '/photoalbum/add',
    method: 'post',
    data
  })
}

export function list(data) {
  return request({
    url: '/photoalbum/list',
    method: 'post',
    data
  })
}

export function deletePhotoalbum(params) {
  return request({
    url: '/photoalbum/delete',
    method: 'get',
    params
  })
}

export function edit(data) {
  return request({
    url: '/photoalbum/edit',
    method: 'post',
    data
  })
}

export function changeStatus(data) {
  return request({
    url: '/photoalbum/changeStatus',
    method: 'post',
    data
  })
}
