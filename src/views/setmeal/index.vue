import { getCategoryByType } from '../../api/category';
<template>
    <div class="dashboard-container">
        <div class="container">
            <div class="tableBar">
                <label style="margin-right: 10px">套餐名称：</label>
                <el-input v-model="name" placeholder="请填写套餐名称" style="width: 14%"></el-input>
                <label style="margin-right: 10px;margin-left: 20px">套餐类型：</label>
                <el-select v-model="categoryId" style="width: 14%" placeholder="请选择">
                    <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
                <label style="margin-right: 10px;margin-left: 20px">售卖状态：</label>
                <el-select v-model="status" placeholder="请选择" style="width: 14%">
                    <el-option v-for="item in statusArr" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
                <el-button class="normal-btn" type="primary" style="margin-left: 20px" @click="pageQuery">查询</el-button>
                <div style="float:right">
                    <el-button type="danger" @click="handleDelete('B')" style="background-color:white ;color:#e74c3c;border:none">批量删除</el-button>
                    <el-button type="primary" @click="handleAddSetmeal">新建套餐</el-button>
                </div>
            </div>
            <el-table :data="records" stripe class="tableBox" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="25" />
                <el-table-column prop="name" label="套餐名称" />
                <el-table-column label="图片">
                    <template slot-scope="scope">
                        <el-image style="width: 80px;height:40px;border:none" :src="scope.row.image"></el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="categoryName" label="套餐类型" />
                <el-table-column prop="price" label="价格" />
                <el-table-column label="售卖状态">
                    <template slot-scope="scope">
                        <div class="tableColumn-status" :class="{ 'stop-use': scope.row.status === 0 }">
                            {{ scope.row.status == 0 ? '停售' : '启售' }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="updateTime" label="更新时间" />
                <el-table-column label="操作" align="center" width="250px">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" style="color:#409EFF" @click="handleEditSetmeal(scope.row)">修改</el-button>
                        <el-divider direction="vertical" content-position="right"></el-divider>

                        <el-button type="text" size="small" @click="handleStartOrStop(scope.row)">
                            <span style="color:#BDBDBD" v-if="scope.row.status == 1">停售</span>
                            <span style="color:#1dc779" v-else>启售</span>
                        </el-button>
                        <el-divider direction="vertical" content-position="right"></el-divider>
                        <el-button type="text" size="small" @click="handleDelete('S', scope.row.id)" style="color:#e74c3c">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                class="pageList"
                :page-sizes="[10, 20, 30, 40]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
            ></el-pagination>
        </div>
    </div>
</template>

<script lang="ts">
import { getCategoryByType } from '@/api/category'
import { getSetmealPage, enableOrDisableSetmeal, deleteSetmeal } from '@/api/setMeal'
import router from '@/router'
export default {
    data() {
        return {
            name: '',
            page: 1,
            pageSize: 10,
            total: 0,
            records: [],
            options: [],
            categoryId: '',
            statusArr: [
                {
                    value: '0',
                    label: '停售'
                },
                {
                    value: '1',
                    label: '起售'
                }
            ],
            status: '',
            multipleSelection: ''
        }
    },
    created() {
        getCategoryByType({ type: 2 }).then(res => {
            if (res.data.code === 1) {
                this.options = res.data.data
            }
        })
        this.pageQuery()
    },
    methods: {
        pageQuery() {
            // 实现分页查询套餐列表
            const params = {
                page: this.page,
                pageSize: this.pageSize,
                name: this.name,
                categoryId: this.categoryId,
                status: this.status
            }
            getSetmealPage(params).then(res => {
                if (res.data.code === 1) {
                    this.records = res.data.data.records
                    this.total = res.data.data.total
                }
            })
        },
        handleStartOrStop(row) {
            // 启用或停用套餐
            const params = {
                id: row.id,
                status: row.status ? 0 : 1
            }
            this.$confirm('确认修改套餐状态吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                enableOrDisableSetmeal(params).then(res => {
                    if (res.data.code === 1) {
                        this.$message.success('套餐状态修改成功')
                        this.pageQuery()
                    }
                })
            })
        },
        handleDelete(type: string, id: any) {
            if (type == 'B' && this.multipleSelection.length == 0) {
                this.$message.error('请选择套餐!')
                return
            }
            // 删除套餐
            this.$confirm('确认删除套餐吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let param = ''
                if (type == 'B') {
                    const arr = new Array()
                    this.multipleSelection.forEach(item => {
                        arr.push(item.id)
                    })
                    const ids = arr.join(',')
                    param = ids
                } else {
                    param = id
                }
                deleteSetmeal(param).then(res => {
                    if (res.data.code === 1) {
                        this.$message.success('套餐删除成功')
                        this.pageQuery()
                    } else {
                        this.$message.error(res.data.msg)
                    }
                })
            })
        },
        handleSelectionChange(val) {
            this.multipleSelection = val
        },
        handleEditSetmeal(row) {
            // 跳转到修改套餐页面
            this.$router.push({ path: '/setmeal/add', query: { id: row.id } })
        },
        handleAddSetmeal() {
            // 跳转到新建套餐页面
            this.$router.push('/setmeal/add')
        }
    }
}
</script>
<style lang="scss">
.el-table-column--selection .cell {
    padding-left: 10px;
}
</style>
<style lang="scss" scoped>
.dashboard {
    &-container {
        margin: 30px;

        .container {
            background: #fff;
            position: relative;
            z-index: 1;
            padding: 30px 28px;
            border-radius: 4px;

            .tableBar {
                margin-bottom: 20px;
                .tableLab {
                    float: right;
                    span {
                        cursor: pointer;
                        display: inline-block;
                        font-size: 14px;
                        padding: 0 20px;
                        color: $gray-2;
                    }
                }
            }

            .tableBox {
                width: 100%;
                border: 1px solid $gray-5;
                border-bottom: 0;
            }

            .pageList {
                text-align: center;
                margin-top: 30px;
            }
            //查询黑色按钮样式
            .normal-btn {
                background: #333333;
                color: white;
                margin-left: 20px;
            }
        }
    }
}
</style>
