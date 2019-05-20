<template>
  <div>
    <br/>
    <el-form :inline="true" class="demo-form-inline">
       <el-form-item label="活动名称">
            <el-input v-model="searchMap.name" placeholder="活动名称"></el-input>
              </el-form-item>
                 <el-form-item label="活动日期" >
                          <el-date-picker type="date" placeholder="选择开始日期" v-model="searchMap.starttime_1" ></el-date-picker>
                          <el-date-picker type="date" placeholder="选择截止日期" v-model="searchMap.starttime_2" ></el-date-picker>
      </el-form-item>
         <el-button type="primary" @click="fetchData()">查询</el-button>
         <el-button type="primary" @click="dialogVisible = true">新增</el-button>
       </el-form>

    <el-table :data="list" border style="width: 100%">
       <el-table-column prop="id"  label="活动ID"  width="180"></el-table-column>
       <el-table-column  prop="name"  label="活动名称"  width="240"></el-table-column>
       <el-table-column  prop="sponsor"  label="主办方"  width="180"></el-table-column>
       <el-table-column  prop="address"  label="活动地址"  width="240"></el-table-column>
       <el-table-column  prop="starttime"  label="开始日期"  width="180"></el-table-column>
       <el-table-column  prop="endtime"  label="结束日期"  width="auto"></el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="150">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
          <el-button type="text" size="small">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
             @size-change="fetchData"
             @current-change="fetchData"
             :current-page="currentPage"
             :page-sizes="[5,10,20]"
             :page-size="pageSize"
             layout="total,sizes,prev,pager,next,jumper"
             :total="total">
    </el-pagination>

    <el-dialog
      title="用户新增"
      :visible.sync="dialogVisible"
      width="50%"
      :before-close="handleClose">
      <el-form ref="form" :model="user" label-width="80px" >
        <el-form-item label="用户帐号">
          <el-input v-model="user.username" ></el-input>
        </el-form-item>

        <el-form-item label="用户密码">
          <el-input placeholder="请输入密码" v-model="user.password" show-password></el-input>
        </el-form-item>
        <el-form-item label="用户中文名称">
          <el-input v-model="user.realname"></el-input>
        </el-form-item>
        <el-form-item label="电子邮件">
        <el-input v-model="user.email" ></el-input>
      </el-form-item>
        <el-form-item label="手机号码">
          <el-input v-model="user.telphone"></el-input>
        </el-form-item>
        <el-form-item label="备注" t>
          <el-input v-model="user.description"  type="textarea" :rows="2"></el-input>
        </el-form-item>
        <el-form-item align="center">
          <el-button type="primary" @click="add(user)">保存</el-button>
          <el-button  @click="dialogVisible = false">关闭</el-button>
       </el-form-item>
      </el-form>

    </el-dialog>
  </div>
</template>

<script>
 import { getUserList } from '@/api/user'
 import { addUser } from '../../api/user'

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

        listLoading: true,
        dialogVisible:false,
        user:{}
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      fetchData() {

        this.listLoading = true;
        getUserList(this.currentPage,this.pageSize,this.searchMap).then(response => {

          this.list=response.data.rows
          this.total=response.data.total
          this.listLoading = false;

        })
      },
      add(){
        addUser(this.user).then(response => {
            this.$message({
              message: response.message ,
              type: response.code == 20000 ? 'success':'error'
            });

        })
        this.dialogVisible=false;
        this.fetchData();
      }
    }
  }
</script>

<style scoped>

</style>
