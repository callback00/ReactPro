import React from 'react'
import PropTypes from 'prop-types'
import lodash from 'lodash'
import ClassNames from 'classnames';

import createForm from '../cbDesign/form/CreateForm'

function noop() {
}

class FormTest extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        }

    }

    render() {
        const { getFieldProps } = this.props.form

        const userFieldProps = getFieldProps('user', {
            rules: [{
                required: true,
                message: 'Please input your username!'
            }, {
                type: 'email',
                message: '错误的 email 格式',
            }],

            validate: [{
                trigger: 'onBlur',
                rules: [{ required: true }],
            }],

        })

        console.log(userFieldProps)

        return (
            <div>
                <div>
                    UserName:
                    <input type="text" {...userFieldProps}
                    />
                </div>
            </div >
        )
    }
}
FormTest.defaultProps = {
}

FormTest = createForm()(FormTest)

export default FormTest