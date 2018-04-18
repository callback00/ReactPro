import React from 'react'
import PropTypes from 'prop-types'

function noop() {
}

class Circle extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            value: this.props.value
        }

        this.onChange = this.onChange.bind(this)
    }

    componentWillReceiveProps(nextProps) {
        if ('value' in nextProps) {
            this.setState({
                value: nextProps.value,
            });
        }
    }

    onChange(value) {
        this.setState({
            value
        })

        this.props.onChange(value)
    }


    render() {
        return (
            <div id="timeCountX" className="time-count-x">
                <svg width="240" height="240">
                    <circle className="progress" r="90" cy="120" cx="120" strokeWidth="3" stroke="red" fill="none" />
                    <circle className="backdrop" r="90" cy="120" cx="120" strokeWidth="3" stroke="#C4C4C4" fill="none" />
                </svg>

            </div>
        )
    }
}

Circle.propTypes = {
    value: PropTypes.number,
    onChange: PropTypes.func,

}

Circle.defaultProps = {
    value: 0,
    onChange: noop,
}

export default Circle