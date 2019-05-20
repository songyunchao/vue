import request from '@/utils/request'

export function getList(page, size, searchMap) {
  return request({
    url: '/table/list/${page}/${size}',
    method: 'post',
    data: searchMap
  })
}
