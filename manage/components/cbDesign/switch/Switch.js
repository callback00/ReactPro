import React from 'react'
import PropTypes from 'prop-types'
import lodash from 'lodash'
import ClassNames from 'classnames';

function noop() {
}

class Switch extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            checked: this.props.defaultChecked
        }
    }

    componentWillReceiveProps(nextProps) {
        if ('checked' in nextProps) {
            this.setState({
                checked: !!nextProps.checked,
            });
        }
    }

    onChange(e) {
        this.setState({
            checked: e.target.checked
        })
        this.props.onChange(e.target.checked)
    }

    render() {
        const { disabled, checkedText, unCheckedText, onChange } = this.props;

        return (
            <label className="cbd-switch">
                <input id="cbd-switch-check" onChange={this.onChange.bind(this)} checked={this.state.checked} type="checkbox" />
                <span className="cbd-switch-slider">
                    <span className="cbd-switch-text">
                        {this.state.checked ? checkedText : unCheckedText}
                    </span>
                </span>
            </label>
        )
    }
}

Switch.propTypes = {
    disabled: PropTypes.bool,
    checkedText: PropTypes.string,
    unCheckedText: PropTypes.string,
    onChange: PropTypes.func,
    checked: PropTypes.bool,
    defaultChecked: PropTypes.bool,
}

Switch.defaultProps = {
    checkedText: '',
    unCheckedText: '',
    defaultChecked: false,
    onChange: noop,
    onClick: noop,
}

export default Switch