<template>
  <div>
    <div style="width:100%;">
      <div class="clearfix" style="margin:10px;">
        <el-row>
          <el-col v-for="(item,index) in tabledata.searchParams" :key="index" :span="6">
            <el-col style="line-height: 40px;" :span="6">{{ item.name }}</el-col>
            <el-col :span="15">
              <el-input
                v-model="item.value"
                placeholder=""
                @keyup.enter.native="Search()"
              />
            </el-col>
          </el-col>
          <el-col :span="8">
            <el-button @click="Search()">查询</el-button>
            <el-button type="primary" @click="createInfor()"> 新建</el-button>
            <el-button type="danger" round @click="batchDelete()"> 批量删除</el-button>
          </el-col>
        </el-row>
      </div>

      <!--引用表格-->
      <el-table
        ref="singleTable"
        border
        :row-key="getRowKeys"
        stripe
        :height="(this.$store.state.bodyHeight-150)"
        :reserve-selection="true"
        :data="tabledata.lineItems.items"
        style="width: 100%"
        @selection-change="handleCurrentChange"
      >
        <!--多选  prop要填唯一标识-->
        <el-table-column label="选择" :reserve-selection="true" prop="uuid" width="32" type="selection" />
        <el-table-column
          width="50"
          label=""
          type="index"
          :index="indexMethod">
        </el-table-column>
        <!--循环输出表头-->
        <el-table-column
          v-for="(value, key) in tableHeader"
          :key="value"
          :label="value"
          :render-header="labelHeadFit"
        >
          <!--循环输出对应value-->
          <template slot-scope="scope">
            <span>{{ scope.row[key] }}</span>
          </template>
        </el-table-column>
        <!--定义操作功能-->
        <el-table-column width="302" label="操作">
          <template slot-scope="scope">
            <span>
              <el-button type="primary " size="mini" plain @click="editline(scope.row)">修改</el-button>
              <el-button type="danger " size="mini" plain @click="deleteline(scope.row)">删除</el-button>
            </span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--分页器-->
    <el-pagination
      v-if="tabledata.isShow"
      layout="total, prev, pager, next, jumper"
      :total="tabledata.lineItems.totalCount"
      :current-page="tabledata.pageInfo.pageIndex"
      :page-size="tabledata.pageInfo.pageSize"
      @current-change="pageChange"
    />
    <!--新建条目的弹框-->
    <el-dialog title="信息" :visible.sync="tabledata.dialogTableVisible">
      <el-form ref="form" :model="form" class="inputWidth">
        <el-form-item
          label="姓名"
          :label-width="formLabelWidth"
          prop="name"
          :rules="[
            { required: true, message: '姓名不能为空',trigger: 'blur'}
          ]"
        >
          <el-input v-model="form.name" autocomplete="off" />
        </el-form-item>
        <el-form-item
          label="性别"
          :label-width="formLabelWidth"
          prop="sex"
          :rules="[
            { required: true, message: '请选择性别',trigger: 'change'}
          ]"
        >
          <el-select v-model="form.sex" placeholder="请选择性别">
            <el-option label="男" value="男" />
            <el-option label="女" value="女" />
          </el-select>
        </el-form-item>
        <el-form-item
          label="年龄"
          prop="age"
          :label-width="formLabelWidth"
          :rules="[
            { required: true, message: '年龄不能为空'},
            { type: 'number', message: '年龄必须为数字值'}
          ]"
        >
          <el-input v-model.number="form.age" type="age" autocomplete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="tabledata.dialogTableVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit('form')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

//  生成uuid唯一标识，可以不引用
import UUID from 'node-uuid'

export default {
  // 接收父组件传来的数据
  props: {
    tabledata: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      // 控制label的宽度
      formLabelWidth: '80px',
      // 记录是修改还是新建
      type: '',
      form: {
        // 唯一标识
        uuid: '',
        name: '',
        code: '',
        url: ''
      },
      // 获取row的key值
      getRowKeys(row) {
        return row.uuid
      },
      // 存放分页选中条目,回显用
      selectedData: [],
      // 存放选中条目，做传参用
      templateRadio: []
    }
  },

  computed: {
    tableHeader() {
      if (!this.tabledata || !this.tabledata.table) {
        return { table: { header: {}}}
      }
      return this.tabledata.table.header || {}
    },
    filterHeader(key) {
      if(key != 'id') {//eslint-disable-line
        return true
      }
      return false
    }
  },
  methods: {
    indexMethod(index) {
      return (this.tabledata.pageInfo.pageIndex - 1) * this.tabledata.pageInfo.pageSize + index + 1;
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
            this.selectedData.push(row.uuid)
          }
        })
      }
    },
    // 表头自适应
    labelHeadFit(h, { column, index }) {
      const l = column.label.length
      const f = 16 // 每个字大小，其实是每个字的比例值，大概会比字体大小差不多大一点，
      column.minWidth = f * l // 字大小乘个数即长度 ,注意不要加px像素，这里minWidth只是一个比例值，不是真正的长度
      // 然后将列标题放在一个div块中，注意块的宽度一定要100%，否则表格显示不完全
      return h('div', { class: 'table-head', style: { width: '100%' }}, [column.label])
    },
    // 行项目分页
    pageChange(val) {
      // 将页码传回父组件
      this.$emit('pageChange', val)
    },
    // 新建行项目
    createInfor() {
      // 生成uuid
      this.form.uuid = UUID.v1()
      // 打开新建弹窗
      this.tabledata.dialogTableVisible = true
      // 标识为新建
      this.type = 'createInfor'
    },
    // 修改行项目
    editline(details) {
      // 赋值详情做展示用
      this.form = details
      this.tabledata.dialogTableVisible = true
      // 标识为修改
      this.type = 'editline'
    },
    // 删除有行项目
    deleteline(details) {
      this.$emit('deleteline', details)
    },
    // 批量删除
    batchDelete() {
      this.$emit('batchDelete', this.templateRadio)
    },
    // 查询
    Search() {
      // 将查询的value传回
      this.$emit('Search', this.tabledata.searchParams)
    },
    // 提交时统一分发
    submit(formName) {
      console.log(formName, this.form)
      this.$refs[formName].validate((valid) => {
        if (valid) {
          switch (this.type) {
            // 修改行项目
            case 'editline':
              this.$emit('editline', this.form)
              break
            // 创建行项目
            case 'createInfor':
              this.$emit('createInfor', this.form)
              break
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

