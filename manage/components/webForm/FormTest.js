import React from 'react'
import PropTypes from 'prop-types'
import lodash from 'lodash'
import ClassNames from 'classnames';

import createForm from '../cbDesign/form/CreateForm'

import Radio from '../cbDesign/radio/Radio'
const RadioGroup = Radio.RadioGroup
const RadioButton = Radio.RadioButton

function noop() {
}

class FormTest extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    getFileValueProps(value) {
        if (value && value.target) {
            return {
                value: value.target.value,
            };
        }
        return {
            value,
        };
    }

    onGetErrors() {
        const { getFieldsError, validateFields } = this.props.form

        const err = getFieldsError()

        validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values)
            }
        })

        console.log(err)
    }

    onGetValue() {
        const { getFieldValue, getFieldsValue } = this.props.form

        const value = getFieldValue('user')
        const isDY_Value = getFieldValue('isDY')
        const values = getFieldsValue()

        console.log(value)
    }

    onSetValue() {
        const { setFields } = this.props.form

        setFields({ user: { value: '设置了新的错误信息', errors: [new Error('forbid ha')] } })
    }

    onOnlySetValue() {
        const { setFieldsValue } = this.props.form

        setFieldsValue({ user: '我仅设置了值', isDY: false })
    }

    onReset() {
        const { resetFields, validateFields } = this.props.form

        resetFields()

        validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values)
            }
        })

    }

    onChange(e) {
        console.log(1)
    }

    render() {
        const { getFieldProps, getFieldError, getFieldDecorator } = this.props.form

        const userFieldProps = getFieldProps('user', {
            initialValue: 'my',
            rules: [
                {
                    type: 'email',
                    message: '错误的 email 格式',
                }, {
                    required: true,
                    message: 'Please input your username!'
                }],

            ref: (item) => this.inputEl = item
            // validate: [{
            //     trigger: 'onBlur',
            //     rules: [{ required: true }],
            // }]
        })

        const isDYFieldProps = getFieldProps('isDY', {
            initialValue: true,
            valuePropName: 'checked',

            rules: [{
                required: true,
                message: 'Please input your username!'
            }],

        })

        return (
            <div>

                <button style={{ marginRight: '10px' }} onClick={this.onGetErrors.bind(this)} >获取全部错误信息</button>
                <button style={{ marginRight: '10px' }} onClick={this.onReset.bind(this)} >重置</button>
                <button style={{ marginRight: '10px' }} onClick={this.onGetValue.bind(this)} >获取值</button>
                <button style={{ marginRight: '10px' }} onClick={this.onSetValue.bind(this)} >设置新值及错误信息</button>
                <button style={{ marginRight: '10px' }} onClick={this.onOnlySetValue.bind(this)} >仅设置值</button>

                <div>
                    UserName:
                    <input type="text" {...userFieldProps}
                    />
                </div>

                <div style={{ color: 'red' }}>
                    {(getFieldError('user') || []).join(', ')}
                </div>
                <div>
                    党员:
                    <input type="checkbox" {...isDYFieldProps}
                    />
                </div>

                {getFieldDecorator('memberName', {
                    initialValue: 'daily',
                    rules: [{
                        required: true,
                        message: 'What\'s the member name?',
                    }],
                })(
                    <input
                        onChange={this.onChange}
                    />
                )}

                {getFieldDecorator('memberName', {
                    initialValue: 'daily',
                    rules: [{
                        required: true,
                        message: 'What\'s the member name?',
                    }],
                })(
                    <input
                        // onChange={this.onChange}
                    />
                )}

                {getFieldDecorator('radio', {
                    initialValue: '3',
                    rules: [{
                        required: true,
                        message: 'What\'s the member name?',
                    }],
                    // trigger: 'onBlur' 因为onBlur再该组件中未定义，所以无法获取到更新的值
                    trigger: 'onChange'
                })(
                    <RadioGroup style={{ marginTop: '10px' }} onChange={(value) => { console.log('RadioGroup返回值', value) }} >
                        <RadioButton value={'1'} >南宁市</RadioButton>
                        <RadioButton value={'2'} >柳州市</RadioButton>
                        <RadioButton value={'3'} >梧州市</RadioButton>
                        <RadioButton value={'4'} >防城港</RadioButton>
                    </RadioGroup>
                )}

                <div style={{ color: 'red' }}>
                    {(getFieldError('memberName') || []).join(', ')}
                </div>
            </div >
        )
    }
}
FormTest.defaultProps = {
}

FormTest = createForm()(FormTest)

export default FormTest