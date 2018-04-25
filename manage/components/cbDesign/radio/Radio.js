import React from 'react'
import PropTypes from 'prop-types'
import lodash from 'lodash'
import ClassNames from 'classnames'

import RadioGroup from './RadioGroup'
import RadioButton from './RadioButton';

class Radio extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            checked: props.checked
        }
    }

    componentWillReceiveProps(nextProps) {
        if ('checked' in nextProps) {
            this.setState({
                checked: nextProps.checked,
            });
        }
    }

    onChange(e) {
        const value = this.props.value

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

}

Radio.defaultProps = {
    checked: false,
    onChange() { },
}

Radio.RadioGroup = RadioGroup
Radio.RadioButton = RadioButton
export default Radio