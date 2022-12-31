import request from '@/utils/request'

export function list(data) {
  return request({
    url: '/photo/list',
    method: 'post',
    data
  })
}

export function deletePhoto(params) {
  return request({
    url: '/photo/delete',
    method: 'get',
    params
  })
}

// export function edit(data) {
//   return request({
//     url: '/photoalbum/edit',
//     method: 'post',
//     data
//   })
// }

// export function changeStatus(data) {
//   return request({
//     url: '/photoalbum/changeStatus',
//     method: 'post',
//     data
//   })
// }
