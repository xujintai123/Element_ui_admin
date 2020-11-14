<template>
  <div id="order">
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card>
      <!-- 顶部输入框 -->
      <el-row>
        <el-col :span="8">
          <el-input class="topInput">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- table表格区域 -->
      <el-table :data="orderList" stripe border style="width: 100%">
        <el-table-column type="index" label="#" width="50" align="center"></el-table-column>
        <el-table-column prop="order_number" label="订单编号" align="center"></el-table-column>
        <el-table-column prop="order_price" label="订单价格" width="100" align="center"></el-table-column>
        <!-- 是否付款 -->
        <el-table-column label="是否付款" width="100" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.pay_status==0" type="danger">未付款</el-tag>
            <el-tag v-else>已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货" width="100" align="center"></el-table-column>
        <!-- 下单时间 -->
        <el-table-column label="下单时间" width="180" align="center">
          <template slot-scope="scope">{{scope.row.create_time|dateFormat}}</template>
        </el-table-column>
        <!-- 编辑删除操作 -->
        <el-table-column prop="address" label="操作" width="280" align="center">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" @click="editAddress" circle></el-button>
            <el-button type="success" icon="el-icon-location" @click="getAddress" circle></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 页码区域 -->
      <el-pagination
        @size-change="pageSizeChange"
        @current-change="pageCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[10, 15, 30]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      ></el-pagination>

      <!-- 编辑地址对话框 -->
      <el-dialog
        title="修改地址"
        :visible.sync="editAdressVisible"
        width="50%"
        @close="addressFormClose"
      >
        <!-- 表单区域 -->
        <el-form
          :model="addressForm"
          :rules="addressFormRules"
          ref="editorAddressForm"
          label-width="100px"
        >
          <el-form-item label="省市区/县" prop="address1">
            <!-- 省市区/县级联选择器 -->
            <el-cascader
              v-model="addressForm.address1"
              :options="regionData"
              :props="{ expandTrigger: 'hover' }"
              @change="address1Change"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="详细地址" prop="address2">
            <el-input v-model="addressForm.address2"></el-input>
          </el-form-item>
        </el-form>
        <!-- 底部按钮 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="editAdressVisible = false">取 消</el-button>
          <el-button type="primary" @click="editorAddress">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 查询物流对话框 -->
      <el-dialog title="物流进度" :visible.sync="getAdressVisible" width="50%">
        <!-- 物流信息区域 -->
        <el-timeline :reverse="false">
          <el-timeline-item
            v-for="(item, index) in addressInfo"
            :key="index"
            :timestamp="item.time"
          >{{item.context}}</el-timeline-item>
        </el-timeline>
      </el-dialog>
      <!-- 卡片底部区域 -->
    </el-card>
  </div>
</template>

<script>
// 引入省市区文件
import { regionData } from 'element-china-area-data'

export default {
 data(){
   return {
   //订单数据请求参数
    queryInfo:{
      query:'',
      //页码序号
      pagenum:1,
      //每页数据数量
      pagesize:10,
      user_id:'',
      pay_status:'',
      is_send:'',
      order_fapiao_title:[],
      order_fapiao_company:'',
      order_fapiao_content:'',
      consignee_addr:''
    },
    //订单数据列表
    orderList:[],
    //订单数据数量
    total:0,
    //编辑地址对话框（显示）
    editAdressVisible:false,
    //表单地址信息
    addressForm:{
      address1:[],
      address2:''
    },
    //验证表单地址信息
    addressFormRules:{ 
      address1: [
          { required: true, message: '请选择省市区县', trigger: 'blur' }]
       ,
      address2: [
          { required: true, message: '请输入详细地址名称', trigger: 'blur' },
          { min: 5, message: '长度在5 个字符以上', trigger: 'blur' } ]      
    },
    //地址文件
    regionData,
    //物流信息对话框（显示）
    getAdressVisible:false,
    //物流信息
    addressInfo:[]
   }
 },
 created(){
  this.getOrderList()
 },
 methods:{
  //获取数据的方法
  //获取订单数据
  async getOrderList(){
    const {data:res} = await this.$http.get('orders',{
      params:this.queryInfo
    })
 
   if(res.meta.status!==200)
   return this.$message.error('服务器繁忙,数据请求失败')
  
   this.orderList=res.data.goods
   this.total=res.data.total
  },
  //监听每页数据数量改变
  pageSizeChange(pageSum){
  this.queryInfo.pagesize=pageSum
  this.getOrderList()
  },
  //监听当前是第几页
  pageCurrentChange(pageNum){
  this.queryInfo.pagenum=pageNum
  this.getOrderList()
  },
  //点击编辑地址
  editAddress(){
   this.editAdressVisible=true
  },
  //监听省市区/县级级联选择器变化
  address1Change(){
  console.log(this.addressForm.address1);
  },
  //监听地址对话框关闭
  addressFormClose(){
  this.$refs.editorAddressForm.resetFields()
  },
  //点击查看物流信息(发起请求获取物流信息)
 async getAddress(){
   const { data: res } = await this.$http.get(`/kuaidi/1106975712662`)
   
    if (res.meta.status !== 200) 
    return this.$message.error('服务器繁忙！获取快递物流信息失败！')
    //将物流信息保存在addressInfo
    this.addressInfo = res.data
    this.getAdressVisible=true
 },
 //提交编辑地址对话框（表单预验证）
 editorAddress(){
   this.$refs.editorAddressForm.validate(valid=>{
     if(!valid)
     return this.$message.error('请规范填写信息！')
     
     this.$message.success('信息编辑成功！')
     this.editAdressVisible = false
   })
 }
 }
}
</script>

<style lang="less" scoped>
.el-input {
  width: 70%!important;
}
</style>