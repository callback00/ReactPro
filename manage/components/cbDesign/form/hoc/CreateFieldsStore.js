import React, { Component } from 'react'

import createFormField, { isFormField } from './createFormField';
import Utils from '../Utils';

class FieldsStore {
    constructor(fields) {
        this.fields = this.flattenFields(fields);
        this.fieldsMeta = {}; //暂时不知道作用
    }

    flattenFields(fields) {
        const dd = Utils.flattenFields(
            fields,
            (_, node) => isFormField(node),
            'You must wrap field data with `createFormField`.'
        )

        return dd
    }

    //该函数用于取字段名称
    getFieldValuePropValue(fieldMeta) {
        const { name, getValueProps, valuePropName } = fieldMeta
        const field = this.getField(name)
        const fieldValue = 'value' in field ? field.value : fieldMeta.initialValue

        // 回调函数 即option.getValueProps 主要用于处理文件上传时获取input控件本身，如果是普通的input，返回的就是字符串类型的value
        if (getValueProps) {
            return getValueProps(fieldValue)
        }

        return { [valuePropName]: fieldValue }

    }

    setFieldMeta(name, meta) {
        this.fieldsMeta[name] = meta;
    }

    getFieldMeta(name) {
        this.fieldsMeta[name] = this.fieldsMeta[name] || {};
        return this.fieldsMeta[name];
    }

    getValueFromFields(name, fields) {
        const field = fields[name];
        if (field && 'value' in field) {
            return field.value;
        }
        const fieldMeta = this.getFieldMeta(name);
        return fieldMeta && fieldMeta.initialValue;
    }

    getValidFieldsName() {
        const { fieldsMeta } = this;
        return fieldsMeta ?
            Object.keys(fieldsMeta).filter(name => !this.getFieldMeta(name).hidden) :
            [];
    }

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

    //取字段键值对，估计取值结果为{value:'test',name:'user'} ,name表示字段名称，value保存了该字段的值
    getField(name) {
        return {
            ...this.fields[name], //猜测是取字段的值
            name,
        }
    }

    getFieldValue(name) {
        const { fields } = this

        //处理嵌套字段 能处理的格式有数组和对象，如member[0].name 或item.x.w.z等

        const dd = this.getNestedField(name, (fullName) => this.getValueFromFields(fullName, fields))

        return this.getNestedField(name, (fullName) => this.getValueFromFields(fullName, fields))
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

        // 官方例子中并不会执行这里的代码，需理解fullNames的实际使用，现在暂时不理
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

    getValidFieldsFullName(maybePartialName) {
        const maybePartialNames = Array.isArray(maybePartialName) ?
            maybePartialName : [maybePartialName]
        return this.getValidFieldsName()
            .filter(fullName => maybePartialNames.some(partialName => (
                fullName === partialName || (
                    startsWith(fullName, partialName) &&
                    ['.', '['].indexOf(fullName[partialName.length]) >= 0
                )
            )))
    }


    flattenRegisteredFields(fields) {
        const validFieldsName = this.getAllFieldsName();
        return Utils.flattenFields(
            fields,
            path => validFieldsName.indexOf(path) >= 0,
            'You cannot set field before registering it.'
        );
    }

    getAllFieldsName() {
        const { fieldsMeta } = this
        return fieldsMeta ? Object.keys(fieldsMeta) : []
    }

    clearField(name) {
        delete this.fields[name]
        delete this.fieldsMeta[name]
    }
}

export default function createFieldsStore(fields) {
    return new FieldsStore(fields);
}
