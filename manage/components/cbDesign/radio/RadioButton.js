import React from 'react'
import PropTypes from 'prop-types'
import lodash from 'lodash'
import ClassNames from 'classnames';

function noop() {
}

class RadioButton extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            checked: this.props.checked
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
            <label className="cbd-radio-button">
                <input onChange={this.onChange.bind(this)} checked={this.state.checked} type="radio" />
                <span className="cbd-radio-inner-text" >{this.props.children}</span>
            </label>
        )
    }
}

RadioButton.propTypes = {
    checked: PropTypes.bool,

}

RadioButton.defaultProps = {
    checked: false,
    onChange: noop,
}

export default RadioButton