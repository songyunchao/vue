<template>
  <div>
    <checkboxTable
      :tabledata="tableData"
      @Search="Search"
      @editline="editline"
      @deleteline="deleteline"
      @pageChange="pageChange"
      @createInfor="createInfor"
    />
  </div>
</template>

<script>
import checkboxTable from '@/components/common/checkboxTable'
import sysPower from '@/api/sysPower'
export default {
  name: 'SysPowerIndex',
  components: {
    // 引用组件
    checkboxTable
  },
  data: () => ({
    // 向table传值
    tableData: {
      // 是否显示组件
      isShow: true,
      // 是否显示新建弹框
      dialogTableVisible: false,
      // 表格行项目列表和总条目数
      lineItems: {
        items: [],
        totalCount: 0
      },
      // 表格头部信息
      table: { header: {}},
      // 存放搜索的key数组
      searchParams: [],
      // 分页对象
      pageInfo: {
        pageIndex: 1,
        pageSize: 10,
        sort: '',
        order: 'asc'
      }
    }
  }),
  mounted() {
    this.getTableData()
  },
  methods: {
    // 处理表格数据
    dealTableData(rows) {
      // 赋值列表
      this.tableData.lineItems = rows
      // 创建表头名称
      this.tableData.table.header = {
        'id': 'ID',
        'name': '名称',
        'code': '编码',
        'url': '地址'
      }
      // 搜索条件的key
      this.tableData.searchParams = [
        { 'name': '关键字', 'id': 'q', 'value': '' }
      ]
    },
    getTableData() {
      debugger
      const resultData = sysPower.findPage(this.tableData.pageInfo, this.tableData.searchParams)
      this.dealTableData(resultData)
    },
    // 分页器，记录页码，请求对应页码数据
    pageChange(num) {
      console.log(num)
      this.tableData.pageInfo.pageIndex = num
      this.getTableData()
    },
    createInfor(details) {

    },
    // 查询条目
    Search(e) {

    },
    // 删除条目
    deleteline(details) {
      console.log(details, details._id)
    },
    // 修改条目
    editline(details) {
      console.log(details, details._id)
    }
  }
}
</script>

<style scoped>

</style>
