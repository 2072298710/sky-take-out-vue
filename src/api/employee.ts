import request from '@/utils/request'
/**
 *
 * 员工管理
 *
 **/
// 登录
export const login = (data: any) =>
    request({
        url: '/employee/login',
        method: 'post',
        data: data
    })

// 退出
export const userLogout = (params: any) =>
    request({
        url: `/employee/logout`,
        method: 'post',
        params
    })

// 获取员工列表
export const getEmployeeList = (params: any) =>
    request({
        url: '/employee/page',
        method: 'get',
        params
    })

// 启用禁用员工
export const enableOrDisableEmployee = (params: any) =>
    request({
        url: `/employee/status/${params.status}`,
        method: 'post',
        params: { id: params.id }
    })

// 新增员工
export const addEmployee = (params: any) =>
    request({
        url: '/employee',
        method: 'post',
        data: params
    })
// 根据id获取员工信息
export const getEmployeeById = (id:number) =>
    request({
        url: `/employee/${id}`,
        method: 'get'
    })

// 编辑员工
export const editEmployee = (params: any) =>
    request({
        url: '/employee',
        method: 'put',
        data: params
    })