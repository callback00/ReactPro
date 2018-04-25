
import React from 'react'
import PropTypes from 'prop-types'

class textArea extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            value: null
        }
    }

    componentDidMount() {
        const el = window.document.getElementsByClassName('cbd-textarea')[0]

        this.setState({
            preScrollHeight: el.scrollHeight
        })
    }

    onChange(e) {
        const el = e.target

        const value = el.value

        const style = this.props.style

        this.setState({
            value,
            style

        })

        this.props.onChange(value)
    }

    render() {

        return (

            <textarea className='cbd-textarea' style={this.props.style} rows={this.props.rows} defaultValue={this.state.defaultValue} placeholder={this.props.placeholder} onChange={this.onChange.bind(this)} />

        )
    }
}

textArea.propTypes = {
    style: PropTypes.object,
    onChange: PropTypes.func,

}

textArea.defaultProps = {
    style: {},
    onChange() { },
}

export default textArea