export default {
  initPageParams(pageParams) {
    return (
      `page=${pageParams.pageIndex}&rows=${pageParams.pageSize}` +
      `&sort=${pageParams.sort}&order=${pageParams.order}`
    )
  },
  initSearchFormParams(searchFormParams) {
    var parmas = {}
    searchFormParams.forEach(item => {
      if (item.field !== '') {
        parmas[item.field] = item.value
      }
    })
    return parmas
  }
}
