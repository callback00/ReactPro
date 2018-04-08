import React from 'react'

class Input extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            value: null,
        }
    }

    onChange(e) {
        const el = e.target
        const value = el.value
        this.setState({
            value
        })
        this.props.onChange(value)
    }

    render() {

        const style = Object.assign({ color: this.state.value ? 'black' : 'rgba(0,0,0,.65)' }, this.props.style)

        return (
            <input className='cbd-input-base' placeholder={this.props.placeholder} onChange={this.onChange.bind(this)} type="number" style={style} defaultValue={this.state.defaultValue} ></input>
        )
    }
}

export default Input
