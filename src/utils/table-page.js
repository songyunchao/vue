export default {
    initPageParams(pageParams){
      return `page=${pageParams.pageIndex}&rows=${pageParams.pageSize}` +
        `&sort=${pageParams.sort}&order=${pageParams.order}`;
    }
}
