import React from 'react'
import PropTypes from 'prop-types'
import lodash from 'lodash'
import ClassNames from 'classnames'

import RadioGroup from './RadioGroup'
import RadioButton from './RadioButton';

function noop() {
}

class Radio extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            value: this.props.value,
            checked: this.props.checked
        }
    }

    componentWillReceiveProps(nextProps) {
        if ('value' in nextProps) {
            this.setState({
                value: nextProps.value,
                checked: nextProps.checked,
            });
        }
    }

    onChange(e) {
        const value = this.state.value

        this.setState({
            checked: e.target.checked
        })
        
        if (e.target.checked) {
            this.props.onChange(value)
        }
    }

    render() {
        const { disabled, checkedText, unCheckedText, onChange } = this.props;

        return (
            <label className="cbd-radio">
                <input onChange={this.onChange.bind(this)} checked={this.state.checked} type="radio" />

                <span className="cbd-radio-slider">
                    <span />
                </span>

                <span className="cbd-radio-inner-text" >{this.props.children}</span>
            </label>
        )
    }
}

Radio.propTypes = {
    checked: PropTypes.bool,
    value: PropTypes.any,

}

Radio.defaultProps = {
    checked: false,
    value: '',
    onChange: noop,
}

Radio.RadioGroup = RadioGroup
Radio.RadioButton = RadioButton
export default Radio