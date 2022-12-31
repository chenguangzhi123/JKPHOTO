import request from '@/utils/request'

export function upload(data) {
  return request({
    url: '/upload/picture',
    method: 'post',
    data,
    headers: {
      "Content-Type": "multipart/form-data;charset=utf-8"
    }
  })
}
