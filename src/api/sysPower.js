import request from '@/utils/request'
import tablePage from '@/utils/table-page'

export default {
  findPage(pageParams, searchFormParams) {
    const params = tablePage.initPageParams(pageParams)
    return request({
      method: 'POST',
      url: `/sys/power/findPage?${params}`,
      data: tablePage.initSearchFormParams(searchFormParams)
    })
  },
  load(id) {
    return request({
      method: 'GET',
      url: `/sys/power/` + id,
      data: {}
    })
  }
}
