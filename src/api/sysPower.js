import request from '@/utils/request'
import tablePage from '@/utils/table-page'

export default {
  /*获取权限分页列表*/
  findPage(pageParams, searchParamsMap) {
    debugger
    const params = tablePage.initPageParams(pageParams);
    return request({
      method: 'POST',
      url: `/sys/power/findPage?${params}`,
      data: searchParamsMap
    })
  }
}
