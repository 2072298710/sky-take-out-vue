import { formatDate } from '../../utils/formValidate'; import variables from '../../styles/_variables.scss'; import { addEmployee } from '../../api/employee';
<template>
    <div class="addBrand-container">
        <div class="container">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="180px">
                <el-form-item label="账号" prop="username">
                    <el-input v-model="ruleForm.username"></el-input>
                </el-form-item>
                <el-form-item label="员工姓名" prop="name">
                    <el-input v-model="ruleForm.name"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="phone">
                    <el-input v-model="ruleForm.phone"></el-input>
                </el-form-item>
                <el-form-item label="性别" prop="sex">
                    <el-radio v-model="ruleForm.sex" label="1">男</el-radio>
                    <el-radio v-model="ruleForm.sex" label="2">女</el-radio>
                </el-form-item>
                <el-form-item label="身份证号" prop="idNumber">
                    <el-input v-model="ruleForm.idNumber"></el-input>
                </el-form-item>
                <div class="subBox">
                    <el-button type="primary" @click="submitForm('ruleForm', false)">保存</el-button>
                    <el-button v-if="this.optType === 'add'" type="primary" @click="submitForm('ruleForm', true)">保存并继续添加员工</el-button>
                    <el-button @click="() => this.$router.push('/employee')">返回</el-button>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script lang="ts">
import { addEmployee, getEmployeeById, editEmployee } from '@/api/employee'
export default {
    data() {
        return {
            optType: '',
            ruleForm: {
                name: '',
                username: '',
                phone: '',
                sex: '1',
                idNumber: ''
            },
            rules: {
                name: [{ required: true, message: '请输入员工姓名', trigger: 'blur' }],
                username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
                phone: [
                    { required: true, message: '请输入手机号', trigger: 'blur' },
                    { pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
                ],
                idNumber: [
                    { required: true, message: '请输入身份证号', trigger: 'blur' },
                    { pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, message: '请输入正确的身份证号', trigger: 'blur' }
                ]
            }
        }
    },
    created() {
        // 获取路由参数,判断是新增还是编辑
        this.optType = this.$route.query.id ? 'edit' : 'add'
        // 如果是编辑，则获取员工信息,并回显
        if (this.optType === 'edit') {
            getEmployeeById(this.$route.query.id).then(res => {
                if (res.data.code === 1) {
                    this.ruleForm = res.data.data
                }
            })
        }
    },
    methods: {
        // 提交表单
        submitForm(formatDate, isContinue) {
            // 进行表单验证
            this.$refs[formatDate].validate(valid => {
                if (valid) {
                    // 判断是新增还是编辑
                    if (this.optType === 'add') {
                        // 表单验证通过，进行数据提交
                        addEmployee(this.ruleForm).then(res => {
                            this.$message.success('提交成功')
                            if (res.data.code == 1) {
                                if (isContinue) {
                                    this.ruleForm = {
                                        name: '',
                                        username: '',
                                        phone: '',
                                        sex: '1',
                                        idNumber: ''
                                    }
                                } else {
                                    this.$router.push('/employee')
                                }
                            }
                        })
                    } else {
                        // 编辑操作
                        editEmployee(this.ruleForm).then(res => {
                            if (res.data.code === 1) {
                                this.$message.success('修改成功')
                                this.$router.push('/employee')
                            }
                        })
                    }
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.addBrand {
    &-container {
        margin: 30px;
        margin-top: 30px;
        .HeadLable {
            background-color: transparent;
            margin-bottom: 0px;
            padding-left: 0px;
        }
        .container {
            position: relative;
            z-index: 1;
            background: #fff;
            padding: 30px;
            border-radius: 4px;
            // min-height: 500px;
            .subBox {
                padding-top: 30px;
                text-align: center;
                border-top: solid 1px $gray-5;
            }
        }
        .idNumber {
            margin-bottom: 39px;
        }

        .el-form-item {
            margin-bottom: 29px;
        }
        .el-input {
            width: 293px;
        }
    }
}
</style>
