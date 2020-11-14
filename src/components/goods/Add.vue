<template>
  <div id="add">
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <!-- 顶部消息提示区域 -->
      <el-alert center title="消息提示的文案" type="info" show-icon :closable="false"></el-alert>
      <!-- 顶部步骤条区域 -->
      <!-- el-steps的active需要绑定数值类型 -->
      <el-steps :space="200" :active="activeSteps - 0" align-center finish-status="success">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- 侧边标签页区域 -->
      <!-- 侧边栏表单 -->
      <el-form
        label-position="top"
        :model="goodsAddForm"
        :rules="goodsAddRules"
        ref="goodsAddForm"
        label-width="100px"
        class="goodsAddForm"
      >
        <!-- 侧边栏 -->
        <el-tabs v-model="activeSteps" :tab-position="'left'" :before-leave="beforeTabLeave">
          <el-tab-pane name="0" label="基本信息">
            <!-- 商品名称输入框 -->
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="goodsAddForm.goods_name"></el-input>
            </el-form-item>
            <!-- 商品价格输入框 -->
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="goodsAddForm.goods_price" type="number"></el-input>
            </el-form-item>
            <!-- 商品重量输入框 -->
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="goodsAddForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <!-- 商品数量输入框 -->
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="goodsAddForm.goods_number" type="number"></el-input>
            </el-form-item>

            <!-- 商品分类复选框 -->
            <el-form-item label="商品分类" prop="goods_cat">
              <!-- 复选框开始 -->
              <el-cascader
                @change="selectedCateChange"
                v-model="goodsAddForm.goods_cat"
                :options="cateList"
                :props="{ expandTrigger:'hover',children:'children',value:'cat_id',label:'cat_name'}"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>

          <!-- 商品参数 -->
          <el-tab-pane name="1" label="商品参数">
            <el-form-item v-for="item1 in cateParams" :key="item1.attr_id" :label="item1.attr_name">
              <!-- 复选按钮 -->
              <el-checkbox-group v-model="item1.attr_vals">
                <el-checkbox
                  v-for="(item2,index) in item1.attr_vals"
                  :label="item2"
                  :key="index"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <!-- 商品属性 -->
          <el-tab-pane name="2" label="商品属性">
            <el-form-item v-for="item1 in cateParams" :key="item1.attr_id" :label="item1.attr_name">
              <el-input v-model="item1.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <!-- 商品图片 -->
          <el-tab-pane name="3" label="商品图片">
            <!-- action 表示图片要上传到的后台API地址(写完整地址) -->
            <!-- on-preview处理图片预览效果 -->
            <!-- on-remove处理移除图片操作 -->
            <!-- headers为请求头对象 -->
            <el-upload
              :headers="headerObj"
              :action="uploadURL"
              :on-preview="imgPreview"
              :on-remove="imgRemove"
              :on-success="imgSuccess"
              list-type="picture"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-tab-pane>
          <!-- 商品内容 -->
          <el-tab-pane name="4" label="商品内容">
            <!-- 富文本编辑器 -->
            <quill-editor v-model="goodsAddForm.goods_introduce"></quill-editor>
            <!-- 添加按钮 -->
            <el-button class="quill-editor-addBtn" type="primary" @click="addCateContent">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>

      <!-- 图片预览对话框 -->
      <el-dialog title="图片预览" :visible.sync="imgIsVisiable" width="40%">
        <img class="dialogImg" :src="imgPath" alt="图片预览" />
      </el-dialog>

      <!-- 卡片区域底部 -->
    </el-card>
  </div>
</template>

<script>
//引入深拷贝
import _ from 'lodash'

export default {
data(){
  return{
    //顶部步骤条index
     activeSteps:'0',
    //商品信息提交表单
     goodsAddForm:{
      goods_name:'',
      goods_price:null,
      goods_weight:null,
      goods_number:null,
      goods_cat:[],
      // 图片数组
      pics:[],
      //商品的详情介绍（富文本编辑器）
      goods_introduce:''
     },
    //表单商品信息校验规则
     goodsAddRules:{
      goods_name:[
      { required: true, message: '商品名称不能为空',trigger: 'blur' },
      { min:1,max:10, message: '商品名称在1到10字符之间',trigger: 'blur'}],
      goods_price:[
      { required: true, message: '商品价格不能为空',trigger: 'blur'},

      {min:1,max:7, message: '商品价格必须在一位数到七位数之间',trigger: 'blur'},],
      goods_weight:[
      { required: true, message: '商品重量不能为空',trigger: 'blur'},
      {min:1,max:7, message: '商品重量必须在一位数到七位数之间',trigger: 'blur'},],
      goods_number:[
      { required: true, message: '商品数量不能为空',trigger: 'blur'}, 
      {min:1,max:7, message: '商品数量必须在一位数到七位数之间',trigger: 'blur'},
     ],
      goods_cat:[
      { required: true, message: '请选择商品种类',trigger: 'blur'}, 
     ]
     },
    //商品分类总数据
     cateList:[],
     //每条商品参数数据
     cateParams:[],
     //请求商品分类数据query
     query:{
       type:'',
       pagenum:'',
       pagesize:''
     },
     //动态参数数据
     manyData:[],
     //静态属性数据
     onlyData:[]
     ,
    //上传文件图片地址
      uploadURL: 'http://119.23.53.78:8888/api/private/v1/upload',
     //图片上传组件的headers请求头对象
      headerObj:{
        Authorization:window.sessionStorage.getItem('token')
      },
      //预览图片路径
      imgPath:'',
      //预览图片是否显示
      imgIsVisiable:false
  }
},
created(){
 this.getCateList()
},
methods:{
    //请求数据的方法
    //获取商品分类数据
   async  getCateList(){
   const {data:res} = await this.$http.get('categories',this.query)
        if(res.meta.status!==200)
        return this.$message.error('服务器繁忙，数据获取失败')

        this.cateList=res.data  
    },
    //根据商品id获取每条商品参数数据
    async  getCateParams(sel){
    const {data:res} = await this.$http.get(`categories/${this.goodsAddForm.goods_cat[2]}/attributes`,{
      params:{
        sel:sel
      }
    })
        if(res.meta.status!==200)
        return this.$message.error('服务器繁忙，数据获取失败')
        //将参数数据赋值给cateParams
        //将attrsel转化为数组形式
         res.data.forEach(item => {
        
         item.attr_vals = item.attr_vals.length===0?[]:item.attr_vals.split(' ')
            console.log(item.attr_vals);
        })
       
        this.cateParams=res.data  

        sel==="many"?this.manyData=res.data:this.onlyData=res.data
        console.log(this.manyData);
        console.log(this.onlyData);
   },
    //监听级联选择器中选项变化
    selectedCateChange(){
    //只允许选择三级分类
    if(this.goodsAddForm.goods_cat.length!==3){
      return  this.goodsAddForm.goods_cat = []
    }
    },
    //侧边栏tab按钮切换之前触发
    beforeTabLeave(nextTab,oldTab){
      if(oldTab==='0'&&this.goodsAddForm.goods_cat.length!==3){
        this.$message.error('请选择商品分类后再进行下一步操作!')
        return false
      }

      if(nextTab==='1'){
       return this.getCateParams('many')
      }
       else if(nextTab==='2'){
       return  this.getCateParams('only')
      }
    },
    //处理图片预览效果
    imgPreview(file){
      //处理图片url路径
      this.imgPath = file.response.data.url.replace('127.0.0.1', '119.23.53.78')
      this.imgIsVisiable = true
    },
   //处理移除图片操作
    imgRemove(file){
      //移除的图片临时路径
      // console.log(file.response.data.tmp_path);
      //遍历goodsAddForm.pics图片列表数组,寻找图片对应项索引值然后在goodsAddForm.pics中删除
     this.goodsAddForm.pics.forEach((item,index)=>{
        if(item.pic.indexOf(file.response.data.tmp_path)){
          this.goodsAddForm.pics.splice(index,1)
        }  
     })

    },
    // 图片上传成功
    imgSuccess(response){
    //拼接获得添加成功的图片对象
    const imgObj={pic:response.data.tmp_path}
    //将添加成功的图片对象push进pics数组
    this.goodsAddForm.pics.push(imgObj)
     console.log(this.goodsAddForm.pics);
    },
    //提交表单商品信息
    addCateContent(){
    this.$refs.goodsAddForm.validate(async valid=>{
      if(!valid)
      return this.$message.error('请规范并且完整地填写表单项!')
   
    //执行添加的业务逻辑
    // lodash cloneDeep(obj)
     const form = _.cloneDeep(this.goodsAddForm)
     form.goods_cat = form.goods_cat.join(',')
         form.attrs=[]
         //处理动态参数
         this.manyData.forEach(item => {
           const objParams = {
             attr_id:item.attr_id,
             attr_value:item.attr_vals.join(' ')
           }
          form.attrs.push(objParams)
       })
         //处理静态属性
         this.onlyData.forEach(item => {
           const objParams = {
             attr_id:item.attr_id,
             attr_value:item.attr_vals.join(' ')
           }
          form.attrs.push(objParams)
       })
      
       console.log(form.attrs);

       //发起请求添加商品
       //商品的名称必须是唯一的
       const {data:res} = await this.$http.post('goods',form)
       
       if(res.meta.status!==201) 
       return this.$message.error('添加商品失败')

       this.$message.success('商品添加成功')
       this.$router.push('/goods')
    })
    }
},
}
</script>

<style lang="less" scoped>
.el-steps {
  margin: 28px 0!important;
}

.el-tabs {
  .el-form-item {
    margin:0 0 20px 0;
    width: 30%;
  }

  .el-tag {
    margin: 15px;
  }
}

.el-checkbox {
  margin: 0 10px 0 0!important;
}

//图片预览图
 .dialogImg {
   width: 100%;
 }

 .quill-editor-addBtn {
   margin: 20px 0;
 }


</style>