<template>
  <!--<div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>
      <el-table-column label="Title">
        <template slot-scope="scope">
          {{ scope.row.title }}
        </template>
      </el-table-column>
      <el-table-column label="Author" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.author }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Pageviews" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.pageviews }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="Status" width="110" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="Display_time" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.display_time }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>-->
  <div>
    <br/>
   <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="活动名称">
            <el-input v-model="searchMap.name" placeholder="活动名称"></el-input>
        </el-form-item>
         <el-form-item label="活动日期" >
                <el-date-picker type="date" placeholder="选择开始日期" v-model="searchMap.starttime_1" ></el-date-picker>
                <el-date-picker type="date" placeholder="选择截止日期" v-model="searchMap.starttime_2" ></el-date-picker>
         </el-form-item>
         <el-button type="primary" @click="fetchData()">查询</el-button>
     </el-form>

  <el-table :data="list" border style="width: 100%">
      <el-table-column prop="id"  label="活动ID"   width="180"></el-table-column>
      <el-table-column  prop="name"  label="活动名称"  width="240"></el-table-column>
      <el-table-column  prop="sponsor"  label="主办方"  width="180"></el-table-column>
      <el-table-column  prop="address"  label="活动地址"   width="240"></el-table-column>
      <el-table-column  prop="starttime"  label="开始日期"  width="180"></el-table-column>
      <el-table-column  prop="endtime"   label="结束日期"   width="auto"></el-table-column>
  </el-table>
  <el-pagination
        @size-change="fetchData"
        @current-change="fetchData"
        :current-page="currentPage"
        :page-sizes="[5, 10, 20]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
  </el-pagination>
  </div>
</template>

<script>
import { getList } from '@/api/table'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {

      list:[],
      total:0,//总记录数
      currentPage:1,//当前页
      pageSize:10,//每页大小
      searchMap:{},//查询表单绑定变量

      listLoading: true
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getList(this.currentPage,this.pageSize,this.searchMap).then(response => {
        this.list=response.data.rows
        this.total=response.data.total
        this.listLoading = false;

      })
    }
  }
}
</script>
