<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-input v-model="filters.name" placeholder="名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="getCase">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleAdd">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="Cases" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column type="index" width="60">
            </el-table-column>
            <el-table-column prop="name" label="名称"  sortable>
            </el-table-column>
            <el-table-column label="操作" width="150">
                <template scope="scope">
                    <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
            <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
            </el-pagination>
        </el-col>

        <!--编辑界面-->
        <el-dialog v-bind:title="dialogTitle" v-model="editFormVisible" :close-on-click-modal="false">
            <el-form :model="editForm" label-width="100px" :rules="editFormRules" ref="editForm">
                <el-form-item label="名称" prop="name">
                    <el-input v-model="editForm.name" auto-complete="off"></el-input>
                </el-form-item>


                <div v-bind:style="{ display : 'none' }">
                    <el-input v-model="editForm.type"></el-input>
                    <el-input v-model="editForm.id"></el-input>
                </div>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
            </div>
        </el-dialog>

    </section>
</template>

<script>
    import util from '../../common/js/util'
    //import NProgress from 'nprogress'


    import { getCaseListPage, getCaseList, deleteCase, addCase, editCase,deleteBatchCase } from '../../api/Case';

    export default {
        data() {
            return {
                filters: {
                    caseName: ''
                },
                Cases: [],
                dialogTitle:'',
                total: 0,
                page: 1,
                listLoading: false,
                sels: [],//列表选中列

                editFormVisible: false,//编辑界面是否显示
                editLoading: false,
                editFormRules: {
                    name: [
                        { required: true, message: '请输入名称', trigger: 'blur' }
                    ]
                },
                //编辑界面数据
                editForm: {
                    id: 0,
                    name: ''
                },

                addFormVisible: false,//新增界面是否显示
                addLoading: false

            }
        },
        methods: {
            handleCurrentChange(val) {
                this.page = val;
                this.getCase();
            },
            //获取案件列表
            getCase() {
                let para = {
                    page: this.page,
                    size: 20,
                    keyWords: this.filters.name
                };
                this.listLoading = true;
                //NProgress.start();
                getCaseListPage(para).then((res) => {

                    if(res.data.code==1){
                        this.Cases = res.data.object.content;
                        this.total = res.data.object.totalElements;
                    }

                    this.listLoading = false;
                    //NProgress.done();
                });
            },
            //删除
            handleDel: function (index, row) {
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    //NProgress.start();
                    let para = { id: row.id };

                    deleteCase(row.id,{}).then((res) => {
                        if(res.data.code==1){
                            this.listLoading = false;
                            //NProgress.done();
                            this.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            this.getCase();
                        }
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
                this.editFormVisible = true;
                this.editForm = {
                    id: 0,
                    name: ''
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

                            if(this.editForm.id>0){
                                //编辑
                                editCase(para).then((res) => {
                                    this.doHttp(res);
                                });
                            }else {
                                //编辑
                                addCase(para).then((res) => {
                                    this.doHttp(res);
                                });

                            }
                        });
                    }
                });
            },
            doHttp:function (res) {
                this.editLoading = false;

                if(res.data.code==1){
                    this.editFormVisible = false;
                    this.getCase();
                    this.editForm = {
                        id: 0,
                        name: ''
                    };
                    this.$message({
                        message: '提交成功',
                        type: 'success'
                    });
                }
            },
            selsChange: function (sels) {
                this.sels = sels;
            },
            //批量删除
            batchRemove: function () {

                var ids = this.sels.map(item => item.id).toString();

                let para = "{ ids : [" + ids + "]}";
                let paraJson = eval("(" + para + ")");;

                this.$confirm('确认删除选中记录吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    //NProgress.start();

                    deleteBatchCase(paraJson).then((res) => {
                        if(res.data.code==1){
                            this.listLoading = false;
                            //NProgress.done();
                            this.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            this.getCase();
                        }
                    });


                }).catch(() => {

                });
            }
        },
        mounted() {
            this.getCase();
        }
    }

</script>

<style scoped>

</style>