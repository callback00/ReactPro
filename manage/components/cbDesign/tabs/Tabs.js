import React from 'react'
import PropTypes from 'prop-types'

function noop() {
}

class Tabs extends React.Component {
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

    renderRadio() {

        const com = this
        const data = React.Children.map(this.props.children, (child, index) => {

            if (child.props.value === com.state.value) {
                const temp = React.cloneElement(child, {
                    checked: true,
                    onChange: com.onChange
                })

                return temp
            } else {
                // 如果未设置默认选择自动选择第一个
                const temp = React.cloneElement(child, {
                    checked: index === 0 && !com.state.value ? true : false,
                    onChange: com.onChange
                })

                return temp
            }

        })

        return data
    }

    render() {
        return (
            <div className="cbd-tabs" >
                <div className="cbd-tabs-bar" >
                </div>
            </div>
        )
    }
}

Tabs.propTypes = {
    value: PropTypes.any,
    onChange: PropTypes.func,

}

Tabs.defaultProps = {
    checked: false,
    value: null,
    onChange: noop,
}

export default Tabs