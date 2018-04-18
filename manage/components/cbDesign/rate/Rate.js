import React from 'react'
import PropTypes from 'prop-types'
import lodash from 'lodash'
import ClassNames from 'classnames';

function noop() {
}

class Rate extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            currentIndex: this.props.defaultValue
        }

    }

    componentWillReceiveProps(nextProps) {
        if ('value' in nextProps) {
            let value = nextProps.value;
            if (value === undefined) {
                value = nextProps.defaultValue;
            }
            this.setState({
                currentIndex: value,
            });
        }
    }

    onClick(index, e) {
        e.preventDefault()
        let currentIndex = 0
        if (e.target.className.indexOf('first') >= 0) {
            if (this.props.allowHalf) {
                currentIndex = index - 0.5
            } else {
                currentIndex = index
            }
        } else if (e.target.className.indexOf('second') >= 0) {
            currentIndex = index
        }

        if (this.props.allowClear && currentIndex === this.state.currentIndex) {
            this.setState({
                currentIndex: 0
            })
        } else {
            this.setState({
                currentIndex
            })
        }

        this.props.onChange(currentIndex)
    }

    render() {
        const {
            count,
            style,
            disabled,
            character,
            tabIndex,
        } = this.props

        const items = []

        for (let i = 1; i <= count; i++) {

            const className = ClassNames({ 'cbd-rate-item': true }, { 'full': i <= this.state.currentIndex ? true : false }, { 'half': i === this.state.currentIndex + 0.5 ? true : false })
            items.push(
                <li key={i} onClick={disabled ? null : this.onClick.bind(this, i)} className={className} >
                    <div className="first" >{this.props.character}</div>
                    <div className="second" >{this.props.character}</div>
                </li>
            );
        }

        return (
            <ul style={style} className="cbd-rate" >
                {items}
            </ul>
        )
    }
}

Rate.propTypes = {
    disabled: PropTypes.bool,
    value: PropTypes.number,
    defaultValue: PropTypes.number,
    allowHalf: PropTypes.bool,
    allowClear: PropTypes.bool,
    count: PropTypes.number,
    style: PropTypes.object,
    onChange: PropTypes.func,
    character: PropTypes.node,
}

Rate.defaultProps = {
    defaultValue: 0,
    allowHalf: false,
    allowClear: true,
    count: 5,
    style: {},
    onChange: noop,
    character: '★',
}

export default Rate