<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form >
        <!--<el-form-item>-->
        <!--<el-input v-model="filters.nickName" placeholder="姓名"></el-input>-->
        <!--</el-form-item>-->
        <!--<el-form-item>-->
        <!--<el-input v-model="filters.phone" placeholder="账号(手机号)"></el-input>-->
        <!--</el-form-item>-->
        <!--<el-form-item>-->
        <!--<el-select v-model="filters.isBlock" placeholder="请选择是否停用">-->
        <!--<el-option value="" >全部</el-option>-->
        <!--<el-option-->
        <!--v-for="item in isBlocks"-->
        <!--:key="item.value"-->
        <!--:label="item.label"-->
        <!--:value="item.value">-->
        <!--</el-option>-->
        <!--</el-select>-->
        <!--</el-form-item>-->
        <!--<el-form-item>-->
        <!--<el-select v-model="filters.mGroup" placeholder="请选择用户类型">-->
        <!--<el-option value="" >全部</el-option>-->
        <!--<el-option-->
        <!--v-for="item in mGroups"-->
        <!--:key="item.value"-->
        <!--:label="item.label"-->
        <!--:value="item.value">-->
        <!--</el-option>-->
        <!--</el-select>-->
        <!--</el-form-item>-->
        <!--<el-form-item>-->
        <!--<el-button type="primary" v-on:click="getList">查询</el-button>-->
        <!--</el-form-item>-->
        <el-form-item>
          <el-button type="primary" @click="handleAdd">新增类型</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <el-table :data="products" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column prop="id"  label="ID" width="100">
      </el-table-column>
      <el-table-column prop="typeIcon" label="" width="100" >
        <template slot-scope="scope">
          <img :src="scope.row.typeIcon" width="60px" height="60px" style="margin-top:5px;"/>
        </template>
      </el-table-column>
      <el-table-column prop="typeName" label="类型名称" width="180" >
      </el-table-column>
      <el-table-column prop="createTime" label="创建日期" min-width="180" >
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template scope="scope">
          <!--<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>-->
          <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--工具条-->
    <!--<el-col :span="24" class="toolbar">-->
    <!--&lt;!&ndash;<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>&ndash;&gt;-->
    <!--<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="10" :total="total" style="float:right;">-->
    <!--</el-pagination>-->
    <!--</el-col>-->

    <!--编辑界面-->
    <el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
      <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="editForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="editForm.sex">
            <el-radio class="radio" :label="1">男</el-radio>
            <el-radio class="radio" :label="0">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="年龄">
          <el-input-number v-model="editForm.age" :min="0" :max="200"></el-input-number>
        </el-form-item>
        <el-form-item label="生日">
          <el-date-picker type="date" placeholder="选择日期" v-model="editForm.birth"></el-date-picker>
        </el-form-item>
        <el-form-item label="地址">
          <el-input type="textarea" v-model="editForm.addr"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
      </div>
    </el-dialog>

    <!--新增界面-->
    <el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
      <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
        <el-form-item label="类型名称" prop="typeName">
          <el-input v-model="addForm.typeName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="图片" prop="imgs">
          <el-upload :action="_uploadFilePath" list-type="picture-card" :limit="1"
                     :file-list="productImg.imgs" :on-remove="handleRemoveImg"
                     :on-success="handleAvatarScucess" :before-upload="beforeAvatarUpload">
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
      </div>
    </el-dialog>
  </section>
</template>
<script>
  import util from '../../common/js/util'
  import { getProductTypes, addProductType,removeProductType } from '../../api/api';

  export default {
    data() {
      return {
        products: [],
        total: 0,
        page: 1,
        productImg: {
          imgs: []
        },
        listLoading: false,
        sels: [],//列表选中列

        editFormVisible: false,//编辑界面是否显示
        editLoading: false,
        editFormRules: {
          name: [
            { required: true, message: '请输入姓名', trigger: 'blur' }
          ]
        },
        //编辑界面数据
        editForm: {
          id: 0,
          name: '',
          sex: -1,
          age: 0,
          birth: '',
          addr: ''
        },

        addFormVisible: false,//新增界面是否显示
        addLoading: false,
        addFormRules: {
          typeName: [
            { required: true, message: '请输入姓名', trigger: 'blur' }
          ]
        },
        //新增界面数据
        addForm: {
          typeName: '',
          typeIcon: ''
        },
        isBlocks: [
          {
            value: '0',
            label: '正常'
          },{
            value: '1',
            label: '禁用'
          }
        ],
        mGroups: [
          {
            value: '1',
            label: '普通人'
          },{
            value: '2',
            label: '管理员'
          },{
            value: '3',
            label: '会员'
          }
        ]
      }
    },
    methods: {
      handleRemoveImg: function (file, fileList) {
        this._imgUploadChange(file, fileList)
      },
      _imgUploadChange: function (file, fileList) {
        this.productImg.imgs = []
        for (let img of fileList) {
          let data = Object.assign({}, JSON.parse(JSON.stringify({url: img.response.data ? img.response.data : img.url})))
          this.productImg.imgs.push(data)
        }
      },
      handleAvatarScucess: function (response, file, fileList) {
        if (response) {
          this._imgUploadChange(file, fileList)
        } else {
          this.$message.error('该图片不支持上传，请更换一张！')
        }
      },
      beforeAvatarUpload: function (file) {
        const isRightType = file.type.indexOf('image/') === 0
        if (!isRightType) {
          this.$message.error('上传图标必须为图片格式!')
        }
        const isRightSize = file.size / 1024 / 1024 < 5
        if (!isRightSize) {
          this.$message.error('上传图标大小不能超过 5MB!')
        }
        return isRightSize && isRightType
      },
      handleCurrentChange(val) {
        this.page = val;
        this.getList();
      },
      //获取用户列表
      getList() {
        this.listLoading = true;
        getProductTypes().then((res) => {
          console.log(res)
          this.products = res.data;
          this.listLoading = false;
        });
      },
      //删除
      handleDel: function (index, row) {
        this.$confirm('确认删除该记录吗?', '提示', {
          type: 'warning'
        }).then(() => {
          this.listLoading = true;
          //NProgress.start();
          let para = { typeId: row.id };
          removeProductType(para).then((res) => {
            this.listLoading = false;
            this.$message({
              message: res.message,
              type: 'success'
            });
            this.getList();
          });
        }).catch(() => {

        });
      },
      //显示编辑界面
      handleEdit: function (index, row) {
        this.editFormVisible = true;
        this.editForm = Object.assign({}, row);
      },
      //显示新增界面
      handleAdd: function () {
        this.addFormVisible = true;
        this.addForm = {
          typeName: '',
          typeIcon: ''
        };
      },
      //编辑
      editSubmit: function () {
        this.$refs.editForm.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              this.editLoading = true;
              //NProgress.start();
              let para = Object.assign({}, this.editForm);
              para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
              editUser(para).then((res) => {
                this.editLoading = false;
                //NProgress.done();
                this.$message({
                  message: '提交成功',
                  type: 'success'
                });
                this.$refs['editForm'].resetFields();
                this.editFormVisible = false;
                this.getList();
              });
            });
          }
        });
      },
      //新增
      addSubmit: function () {
        this.$refs.addForm.validate((valid) => {
          console.log('addSubmit');
          console.log(this.productImg.imgs)
          if (typeof (this.productImg.imgs) == 'undefined' || this.productImg.imgs == null) {
            this.$message({
              message: "请选择一张图片！",
              type: 'success'
            });
          }
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              for (let img of this.productImg.imgs) {
                this.addForm.typeIcon = img.url
              }
              this.addLoading = true;
              let para = Object.assign({}, this.addForm);
              console.log(para)
              addProductType(para).then((res) => {
                this.addLoading = false;
                this.$message({
                  message: res.message,
                  type: 'success'
                });
                this.$refs['addForm'].resetFields();
                this.addFormVisible = false;
                this.getList();
              });
            });
          }
        });
      },
      selsChange: function (sels) {
        this.sels = sels;
      },
      //批量删除
      batchRemove: function () {
        var ids = this.sels.map(item => item.id).toString();
        this.$confirm('确认删除选中记录吗？', '提示', {
          type: 'warning'
        }).then(() => {
          this.listLoading = true;
          //NProgress.start();
          let para = { ids: ids };
          batchRemoveUser(para).then((res) => {
            this.listLoading = false;
            //NProgress.done();
            this.$message({
              message: '删除成功',
              type: 'success'
            });
            this.getList();
          });
        }).catch(() => {

        });
      }
    },
    mounted() {
      this.getList();
    }
  }

</script>