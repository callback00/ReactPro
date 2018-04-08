
import React from 'react'
import Scss from './style/TextArea.scss'

class textArea extends React.Component {
    constructor(props) {
        super(props)

        let style = this.props.style
        style.color = this.props.defaultValue ? 'black' : 'rgba(0,0,0,.65)'

        this.state = {
            value: null,
            style,
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

        const temp = this.state.style
        let style = {}
        style = Object.assign(style, temp)

        style.color = value ? 'black' : 'rgba(0,0,0,.65)'

        this.setState({
            value,
            style

        })

        this.props.onChange(value)
    }

    render() {

        return (

            <textarea className='cbd-textarea' style={this.state.style} rows={this.props.rows} defaultValue={this.state.defaultValue} placeholder={this.props.placeholder} onChange={this.onChange.bind(this)} />

        )
    }
}

export default textArea