import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

/*获取用户信息*/
export function getUserList(page, size, searchMap) {
  return request({
    url: `/user/list/${page}/${size}`,
    method: 'post',
    data: searchMap
  })
}

/*新增用户信息*/
export function addUser(data) {
  return request({
    url: `/user/add`,
    method: 'post',
    data: data
  })
}


