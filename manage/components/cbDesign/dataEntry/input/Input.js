import React from 'react'

class Input extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    onChange(e) {
        const el = e.target
        const value = el.value
        this.props.onChange(value)
    }

    render() {

        const style = this.props.style
        return (
            <input className='cbd-input-base' placeholder={this.props.placeholder} onChange={this.onChange.bind(this)} type="text" style={style} defaultValue={this.props.defaultValue} ></input>
        )
    }
}

export default Input
