<template>
    <div class="dashboard-container">
        <div class="container">
            <div class="tableBar">
                <label style="margin-right: 8px">员工姓名:</label>
                <el-input v-model="name" placeholder="请输入员工姓名" style="width: 15%"></el-input>
                <el-button type="primary" style="margin-left: 20px" @click="pageQuery">查询</el-button>
                <el-button type="primary" style="float: right" @click="handleAddEmp">+添加员工</el-button>
            </div>
            <el-table :data="records" stripe style="width: 100%">
                <el-table-column prop="name" label="员工姓名" width="180"></el-table-column>
                <el-table-column prop="username" label="账号" width="180"></el-table-column>
                <el-table-column prop="phone" label="手机号"></el-table-column>
                <el-table-column prop="status" label="账号状态">
                    <template slot-scope="scope">{{ scope.row.status == 0 ? '禁用' : '启用' }}</template>
                </el-table-column>
                <el-table-column prop="updateTime" label="更新时间"></el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" @click="handleEditEmp(scope.row)">修改</el-button>
                                                <el-divider direction="vertical" content-position="right"></el-divider>
                        <el-button type="text" @click="handleStartOrStop(scope.row)">{{ scope.row.status == 0 ? '启用' : '禁用' }}</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                class="pageList"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="page"
                :page-sizes="[10, 20, 30, 40]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
            ></el-pagination>
        </div>
    </div>
</template>
<script lang="ts">
import { getEmployeeList, enableOrDisableEmployee } from '@/api/employee'

export default {
    data() {
        return {
            name: '',
            page: 1,
            pageSize: 10,
            total: 0,
            records: []
        }
    },
    created() {
        this.pageQuery()
    },
    methods: {
        // 分页查询
        pageQuery() {
            const params = {
                name: this.name,
                page: this.page,
                pageSize: this.pageSize
            }
            // 发送Ajax请求，获取员工列表数据
            // 显示员工列表数据
            getEmployeeList(params)
                .then(res => {
                    if (res.data.code === 1) {
                        this.total = res.data.data.total
                        this.records = res.data.data.records
                    }
                })
                .catch(err => {
                    this.$message.error('请求信息出错了' + err.message)
                })
        },
        // 切换每页显示数量
        handleSizeChange(pageSize) {
            this.pageSize = pageSize
            this.pageQuery()
        },
        // 切换页码
        handleCurrentChange(page) {
            this.page = page
            this.pageQuery()
        },
        // 启用/禁用员工账号
        handleStartOrStop(row) {
            // 超级管理员不能被禁用
            if (row.username === 'admin') {
                this.$message.error('管理员不可禁用')
                return
            }
            // 弹出确认框
            this.$confirm('确认要修改当前员工的账号状态吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                const p = {
                    id: row.id,
                    status: !row.status ? 1 : 0
                }
                enableOrDisableEmployee(p).then(res => {
                    if (res.data.code === 1) {
                        this.$message.success('员工账号状态修改成功')
                        this.pageQuery()
                    }
                })
            })
        },
        // 跳转到添加员工页面
        handleAddEmp() {
            // 路由跳转，跳转到员工添加页面
            this.$router.push('/employee/add')
        },
        // 跳转到修改员工页面
        handleEditEmp(row) {
            // 超级管理员不能被修改
            if (row.username === 'admin') {
                this.$message.error('管理员不可修改')
                return
            }
            // 路由跳转，跳转到员工修改页面
            this.$router.push({ path: '/employee/add', query: { id: row.id } })
        }
    }
}
</script>

<style lang="scss" scoped>
.disabled-text {
    color: #bac0cd !important;
}
</style>
