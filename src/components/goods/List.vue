<template>
  <div id="list">
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card>
      <!-- 顶部输入框区域 -->
      <el-row>
        <el-input clearable @clear="clearFindInput" class="findGoodsInput" v-model="queryInfo.query">
          <el-button slot="append" icon="el-icon-search" @click="findGoodsBtn"></el-button>
        </el-input>
        <el-button type="primary" @click="goAddPage">添加商品</el-button>
      </el-row>

      <!-- table表格区域 -->
      <el-table border stripe :data="goodsList" style="width: 100%">
        <!-- 索引列 -->
        <el-table-column align="center" type="index" label="#" width="50"></el-table-column>
        <!-- 商品名称 -->
        <el-table-column align="center" prop="goods_name" label="商品名称"></el-table-column>
        <!-- 商品价格 -->
        <el-table-column align="center" prop="goods_price" label="商品价格(元)" width="100"></el-table-column>
        <!-- 商品重量 -->
        <el-table-column align="center" prop="goods_weight" label="商品重量" width="100"></el-table-column>
        <!-- 创建时间 -->
        <el-table-column align="center" label="创建时间" width="200">
          <template slot-scope="scope">{{scope.row.add_time|dateFormat}}</template>
        </el-table-column>
        <!-- 操作列 -->
        <el-table-column align="center" label="操作" width="200">
          <template slot-scope="scope">
            <!-- 商品信息编辑操作 -->
            <el-button type="primary" icon="el-icon-edit" circle></el-button>

            <!-- 商品信息删除操作 -->
            <el-button type="danger" @click="removeGoodsData(scope.row)" icon="el-icon-delete" circle></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页功能 -->
      <el-pagination background @size-change="pageSizeChange" @current-change="PageNumChange"
        :current-page="queryInfo.pagenum" :page-sizes="[10, 20, 30, 40]" :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
    </el-card>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        queryInfo: {
          //顶部商品搜索框内容双向绑定
          query: null,
          //当前页码
          pagenum: 1,
          //每页显示条数
          pagesize: 20
        },
        //商品列表数据
        goodsList: [],
        //商品数据数量
        total: 0,
      }
    },
    created() {
      this.getGoodsList()
    },
    methods: {
      //获取商品列表数据
      async getGoodsList() {
        const {
          data: res
        } = await this.$http.get('goods', {
          params: this.queryInfo
        })

        if (res.meta.status !== 200)
          return this.$message.error('服务器繁忙，数据请求失败')

        this.goodsList = res.data.goods
        this.total = res.data.total
      },
      //每页多少条数据
      pageSizeChange(sum) {
        this.queryInfo.pagesize = sum
        //刷新数据
        this.getGoodsList()
      },
      //当前是第几页
      PageNumChange(num) {
        this.queryInfo.pagenum = num
        //刷新数据
        this.getGoodsList()
      },
      //顶部搜索商品按钮
      findGoodsBtn() {
        //输入框未空或者输入字符串
        if (this.queryInfo.query.trim() === '')
          return this.$message.error('请输入合法数据进行查询')
        //刷新数据
        this.$message.success('数据查询成功')
        this.getGoodsList()
      },
      //清空顶部搜索框内容
      clearFindInput() {
        //刷新数据
        this.getGoodsList()
      },
      //删除商品数据
      async removeGoodsData(row) {
        console.log(row.goods_id);
        const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err);

        if (confirmResult === 'cancel')
          return this.$message.info('取消本次删除')

        const {
          data: res
        } = await this.$http.delete(`goods/${row.goods_id}`)
        if (res.meta.status != 200)
          return this.$message.error('删除失败')

        this.$message.success('删除成功')
        this.getGoodsList()
      },
      //跳转到Add页面
      goAddPage() {
        this.$router.push('/goods/add')
      }

    }
  }

</script>

<style>
  .findGoodsInput {
    width: 450px !important;
    margin-right: 25px;
  }

</style>
