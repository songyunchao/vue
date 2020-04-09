<template>
  <div>
    <div style="width:100%;">
      <!-- searchtool -->
      <div class="clearfix" style="margin:10px;">
        <el-row>
          <el-col v-for="(item,index) in tableData.searchParams" :key="index" :span="6">
            <el-col style="line-height: 36px;" :span="8">{{ item.name }}</el-col>
            <el-col style="padding:2px;" :span="15">
              <el-input
                v-model="item.value"
                :placeholder="item.placeholder"
                @keyup.enter.native="search()"
              />
            </el-col>
          </el-col>
          <el-col :span="6">
            <el-button @click="search()">查询</el-button>
          </el-col>
        </el-row>
      </div>

      <!-- toolbar -->
      <div class="clearfix" style="padding:4px;border-top:1px solid #EBEEF5;">
        <el-row>
          <el-button size="small" style="margin-left: 0px;" type="primary" icon="el-icon-circle-plus-outline" @click="create()">新增</el-button>
          <el-button size="small" style="margin-left: 0px;" type="success" icon="el-icon-delete" @click="deleteRows()">批量删除</el-button>
          <el-button size="small" style="margin-left: 0px;" type="warning" icon="el-icon-refresh" @click="refresh()">刷新</el-button>
        </el-row>
      </div>

      <Datagrid
        ref="myDatagrid"
        :tabledata="tableData"
        @search="search"
        @edit="edit"
        @deleteRow="deleteRow"
        @pageChange="pageChange"
        @handleSizeChange="handleSizeChange"
      />

    </div>

    <!--新建条目的弹框-->
    <el-dialog title="信息" :visible.sync="formData.dialogTableVisible">
      <el-form ref="form" :model="formData.form" class="inputWidth">
        <el-form-item
          label="编码"
          prop="code"
          :label-width="formData.formLabelWidth"
          :rules="[
            { required: true, message: '编码不能为空'},
            { type: 'number', message: '编码必须为字母、下划线、数字'}
          ]"
        ><el-input v-model.number="formData.form.code" type="code" autocomplete="off" />
        </el-form-item>

        <el-form-item
          label="名称"
          :label-width="formData.formLabelWidth"
          prop="name"
          :rules="[
            { required: true, message: '姓名不能为空',trigger: 'blur'}
          ]"
        >
          <el-input v-model="formData.form.name" autocomplete="off" />
        </el-form-item>
        <el-form-item
          label="地址"
          :label-width="formData.formLabelWidth"
          prop="url"
        >
          <el-input v-model="formData.form.url" autocomplete="off" />
        </el-form-item>
        <el-form-item
          label="所属模块"
          :label-width="formData.formLabelWidth"
          prop="menuId"
          :rules="[
            { required: true, message: '请选择模块',trigger: 'change'}
          ]"
        >
          <el-select v-model="formData.form.menuId" placeholder="请选择模块">
            <el-option label="男" value="男" />
            <el-option label="女" value="女" />
          </el-select>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="formData.dialogTableVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit('form')">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import sysPower from '@/api/sysPower'
import Datagrid from '@/components/common/datagrid'

export default {
  name: 'SysPowerIndex',
  components: {
    // 引用组件
    Datagrid
  },
  data: () => ({
    // 向table传值
    tableData: {
      // 是否显示组件
      isShow: true,
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
        pageSize: 15,
        sort: '',
        order: 'asc'
      }
    },
    formData: {
      // 是否显示新建弹框
      dialogTableVisible: false,
      // 控制label的宽度
      formLabelWidth: '80px',
      // 记录是修改还是新建
      type: '',
      form: {
        // 唯一标识
        id: '',
        name: '',
        code: '',
        url: '',
        menuId: ''
      }
    }
  }),
  mounted() {
    this.getTableData()
  },
  methods: {
    // 处理表格数据
    dealTableData(rows, total) {
      // 赋值列表
      this.tableData.lineItems.items = rows
      this.tableData.lineItems.totalCount = total
      // 创建表头名称
      this.tableData.table.header = [
        { 'label': '名称', 'prop': 'name', 'width': '180', 'align': 'center', 'sortable': 'true' },
        { 'label': '编码', 'prop': 'code', 'width': '200', 'align': 'center', 'sortable': 'true' },
        { 'label': '地址', 'prop': 'url', 'width': '240', 'align': 'center', 'sortable': 'true' },
        { 'label': '所属模块', 'prop': 'menuId', 'width': '280', 'align': 'center', 'sortable': 'true',
          'formatter': row => row.menuName
        }
      ]
      // 搜索条件的key
      this.tableData.searchParams = [
        { 'name': '关键字', 'id': 'q', 'value': '', 'field': 'q', 'placeholder': '名称、编码检索' }
      ]
    },
    getTableData() {
      const loading = this.$loading({
        lock: true,
        text: '拼命加载中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      sysPower.findPage(this.tableData.pageInfo, this.tableData.searchParams).then(response => {
        const { rows, total } = response
        this.dealTableData(rows, total)
        loading.close()
      })
    },
    // 分页器，记录页码，请求对应页码数据
    pageChange(num) {
      this.tableData.pageInfo.pageIndex = num
      this.getTableData()
    },
    handleSizeChange(size) {
      this.tableData.pageInfo.pageSize = size
      this.tableData.pageInfo.pageIndex = 1
      this.getTableData()
    },
    create() {
      this.formData.form = {}
      this.formData.dialogTableVisible = true
      // 标识为修改
      this.formData.type = 'create'
    },
    // 查询条目
    search(e) {
      this.getTableData()
    },
    // 刷新
    refresh() {
      this.tableData.searchParams.forEach(row => {
        row.value = ''
      })
      this.getTableData()
    },
    // 删除条目
    deleteRow(details) {
      console.log(details)
    },
    // 批量删除
    deleteRows() {
      const rows = this.$refs.myDatagrid.getSelectedRows()
      if (rows) {
        rows.forEach(row => {
          if (row) {
            console.log(row)
          }
        })
      }
    },
    // 修改条目
    edit(details) {
      // 赋值详情做展示用
      sysPower.load(details.id).then(response => {
        if (response != null && response.status) {
          this.formData.form = response.entry
          this.formData.dialogTableVisible = true
          // 标识为修改
          this.formData.type = 'edit'
        } else {
          this.$message({
            message: response.message,
            type: 'warning'
          })
        }
      })
    }
  }
}
</script>

<style>
  .el-input__inner {
    height:36px;
    line-height:36x;
  }
</style>
