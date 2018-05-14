import React, { Component } from 'react'
import get from 'lodash/get'
import set from 'lodash/set'

import createFormField, { isFormField } from './createFormField'
import Utils from '../Utils'

class FieldsStore {
    constructor(fields) {
        this.fields = this.flattenFields(fields)
        this.fieldsMeta = {} //保存的是原始传入的参数 即getFieldProps 的第二个参数的内容经过一定的初始化后传过来，
    }

    flattenFields(fields) {
        const name = Utils.flattenFields(
            fields,
            (_, node) => isFormField(node),
            'You must wrap field data with `createFormField`.'
        )

        return name
    }

    //该函数用于取字段名称
    getFieldValuePropValue(fieldMeta) {
        const { name, getValueProps, valuePropName } = fieldMeta
        const field = this.getField(name)
        const fieldValue = 'value' in field ? field.value : fieldMeta.initialValue

        // 回调函数 即option.getValueProps 这个函数用于自定义处理valuePropName 的对应值
        if (getValueProps) {
            return getValueProps(fieldValue)
        }

        // 如果值不是自定义则按规则取
        return { [valuePropName]: fieldValue }

    }

    // 保存原始传入的数据参数，
    // meta:{
    //     name,
    //     trigger: 'onChange',
    //     valuePropName: 'value',
    //     validate: [],
    // } meta的值至少包含这些，值内容根据getFieldProps的第二个参数变化
    setFieldMeta(name, meta) {
        this.fieldsMeta[name] = meta
    }

    getFieldMeta(name) {
        this.fieldsMeta[name] = this.fieldsMeta[name] || {}
        return this.fieldsMeta[name]
    }

    // 优先取最新值，如果无值，取元数据的initialValue，如果未设置initialValue 返回undefined
    getValueFromFields(name, fields) {
        const field = fields[name]
        if (field && 'value' in field) {
            return field.value
        }
        const fieldMeta = this.getFieldMeta(name)
        return fieldMeta && fieldMeta.initialValue
    }

    getValidFieldsName() {
        const { fieldsMeta } = this
        return fieldsMeta ?
            Object.keys(fieldsMeta).filter(name => !this.getFieldMeta(name).hidden) :
            []
    }

    // 保存字段相关的信息，如value,error等
    setFields(fields) {
        const fieldsMeta = this.fieldsMeta

        const nowFields = {
            ...this.fields,
            ...fields,
        }

        const nowValues = {}

        // Object.keys返回对象属性数组
        Object.keys(fieldsMeta).forEach((f) => {
            nowValues[f] = this.getValueFromFields(f, nowFields)
        })

        Object.keys(nowValues).forEach((f) => {
            const value = nowValues[f]
            const fieldMeta = this.getFieldMeta(f)
            if (fieldMeta && fieldMeta.normalize) {
                const nowValue = fieldMeta.normalize(value, this.getValueFromFields(f, this.fields), nowValues)
                if (nowValue !== value) {
                    nowFields[f] = {
                        ...nowFields[f],
                        value: nowValue,
                    }
                }
            }
        })

        this.fields = nowFields
    }

    resetFields(ns) {
        const { fields } = this
        const names = ns ?
            this.getValidFieldsFullName(ns) :
            this.getAllFieldsName()
        return names.reduce((acc, name) => {
            const field = fields[name]
            if (field && 'value' in field) {
                acc[name] = {}
            }
            return acc
        }, {})
    }

    getField(name) {
        return {
            ...this.fields[name], //猜测是取字段的值
            name,
        }
    }

    getFieldsValue(names) {
        return this.getNestedFields(names, this.getFieldValue.bind(this))
    }

    getFieldValue(name) {
        const { fields } = this

        //处理嵌套字段 能处理的格式有数组和对象，如member[0].name 或item.x.w.z等

        const dd = this.getNestedField(name, (fullName) => this.getValueFromFields(fullName, fields))

        return this.getNestedField(name, (fullName) => this.getValueFromFields(fullName, fields))
    }

    // 嵌套字段的值获取
    getNestedFields(names, getter) {
        const fields = names || this.getValidFieldsName()
        return fields.reduce(
            (acc, f) => set(acc, f, getter(f)),
            {})
    }

    // 获取嵌套字段
    getNestedField(name, getter) {
        const fullNames = this.getValidFieldsFullName(name)
        if (
            fullNames.length === 0 || // Not registered
            (fullNames.length === 1 && fullNames[0] === name) // Name already is full name.
        ) {
            return getter(name)
        }

        const isArrayValue = fullNames[0][name.length] === '['
        const suffixNameStartIndex = isArrayValue ? name.length : name.length + 1
        return fullNames
            .reduce(
                (acc, fullName) => set(
                    acc,
                    fullName.slice(suffixNameStartIndex),
                    getter(fullName)
                ),
                isArrayValue ? [] : {}
            )
    }

    getNotCollectedFields() {
        return this.getValidFieldsName()
            .filter(name => !this.fields[name])
            .map(name => ({
                name,
                dirty: false,
                value: this.getFieldMeta(name).initialValue,
            }))
            .reduce((acc, field) => set(acc, field.name, createFormField(field)), {})
    }

    getNestedAllFields() {
        return Object.keys(this.fields)
            .reduce(
                (acc, name) => set(acc, name, createFormField(this.fields[name])),
                this.getNotCollectedFields()
            )
    }

    getValidFieldsFullName(maybePartialName) {
        const maybePartialNames = Array.isArray(maybePartialName) ?
            maybePartialName : [maybePartialName]
        return this.getValidFieldsName()
            .filter(fullName => maybePartialNames.some(partialName => (
                fullName === partialName || (
                    Utils.startsWith(fullName, partialName) &&
                    ['.', '['].indexOf(fullName[partialName.length]) >= 0
                )
            )))
    }


    flattenRegisteredFields(fields) {
        const validFieldsName = this.getAllFieldsName()
        return Utils.flattenFields(
            fields,
            path => validFieldsName.indexOf(path) >= 0,
            'You cannot set field before registering it.'
        )
    }

    getAllFieldsName() {
        const { fieldsMeta } = this
        return fieldsMeta ? Object.keys(fieldsMeta) : []
    }

    clearField(name) {
        delete this.fields[name]
        delete this.fieldsMeta[name]
    }

    getFieldsError(names) {
        const errors = this.getNestedFields(names, this.getFieldError.bind(this))

        return errors
    }

    getFieldError(name) {
        return this.getNestedField(
            name,
            (fullName) => Utils.getErrorStrs(this.getFieldMember(fullName, 'errors'))
        )
    }

    getFieldMember(name, member) {
        return this.getField(name)[member]
    }
}

export default function createFieldsStore(fields) {
    return new FieldsStore(fields)
}
