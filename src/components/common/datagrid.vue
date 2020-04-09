<template>
  <div>
    <!--引用表格-->
    <el-table
      ref="multipleTable"
      :row-key="getRowKeys"
      border
      stripe
      :reserve-selection="true"
      :data="tabledata.lineItems.items"
      style="width: 100%;height:100%;"
      :fit="true"
      :height="tableHeight"
      :row-style="{height:'36px'}"
      :cell-style="{padding:'1px 0px'}"
      @selection-change="handleCurrentChange"
    >
      <!--多选  prop要填唯一标识-->
      <el-table-column label="选择" :reserve-selection="true" prop="id" width="42" type="selection" />
      <el-table-column label="" type="index" :index="indexMethod" fixed="left" />

      <!--定义操作功能-->
      <el-table-column width="150" label="操作" prop="operate" fixed="left">
        <template slot-scope="scope">
          <span>
            <el-button type="primary " size="mini" plain @click="edit(scope.row)">修改</el-button>
            <el-button type="danger " size="mini" plain @click="deleteRow(scope.row)">删除</el-button>
          </span>
        </template>
      </el-table-column>

      <template v-for="(column,index) in tableHeader">
        <el-table-column
          :key="index"
          :label="column.label"
          :prop="column.prop"
          :width="column.width"
          :align="column.align"
          :sortable="column.sortable"
          :formatter="column.formatter"
        />
      </template>
    </el-table>

    <!--分页器-->
    <el-pagination
      v-if="tabledata.isShow"
      style="margin-top: 10px;"
      layout="total, sizes, prev, pager, next, jumper"
      :total="tabledata.lineItems.totalCount"
      :current-page="tabledata.pageInfo.pageIndex"
      :page-sizes="[15, 30, 50, 100]"
      :page-size="tabledata.pageInfo.pageSize"
      @current-change="pageChange"
      @size-change="handleSizeChange"
    />
  </div>
</template>

<style>
  .el-table__header tr, .el-table__header th {
    padding: 0;
    height: 36px;
  }
  .el-table__body tr, .el-table__body td {
    padding: 0;
    height: 34px;
  }
</style>

<script>

export default {
  // 接收父组件传来的数据
  props: {
    tabledata: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    tableHeight: '100%',
    // 获取row的key值
    getRowKeys(row) {
      return row.id
    },
    // 存放分页选中条目,回显用
    selectedData: [],
    // 存放选中条目，做传参用
    templateRadio: []
  }),
  computed: {
    tableHeader() {
      if (!this.tabledata || !this.tabledata.table) {
        return []
      }
      return this.tabledata.table.header || []
    },
    filterHeader(key) {
      if(key != 'id') {//eslint-disable-line
        return true
      }
      return false
    }
  },
  mounted: function() {
    this.$nextTick(function() {
      this.tableHeight = window.innerHeight - this.$refs.multipleTable.$el.offsetTop - 100
      // 监听窗口大小变化
      const self = this
      window.onresize = function() {
        self.tableHeight = window.innerHeight - self.$refs.multipleTable.$el.offsetTop - 100
      }
    })
    // this.$refs.multipleTable.$el.offsetTop：表格距离浏览器的高度
    // 50表示你想要调整的表格距离底部的高度(你可以自己随意调整),因为我们一般都有放分页组件的,所以需要给它留一个高度
  },
  methods: {
    indexMethod(index) {
      return (this.tabledata.pageInfo.pageIndex - 1) * this.tabledata.pageInfo.pageSize + index + 1
    },
    // 确定选中
    handleCurrentChange(rows) {
      console.log(rows)
      // 将选中赋值到回显和传参数组
      this.templateRadio = rows
      this.selectedData = []
      if (rows) {
        rows.forEach(row => {
          if (row) {
            this.selectedData.push(row.id)
          }
        })
      }
    },
    // 行项目分页
    pageChange(val) {
      // 将页码传回父组件
      this.$emit('pageChange', val)
    },
    handleSizeChange(val) {
      // 将页码大小传回父组件
      this.$emit('handleSizeChange', val)
    },
    getSelectedRows() {
      return this.templateRadio
    },
    // 修改条目
    edit(details) {
      this.$emit('edit', details)
    },
    // 删除
    deleteRow(details) {
      this.$emit('deleteRow', details)
    }
  }
}
</script>
