
import React from 'react'

class InputSearch extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            value: null,
            mouseUp: true
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

    onClick(e) {
        if (this.props.onClick) {
            this.props.onClick(e)
        }
    }

    onMouseDown() {
        this.setState({
            mouseUp: false
        })
    }

    onMouseUp() {
        this.setState({
            mouseUp: true
        })
    }

    inputonFocus() {

    }

    render() {

        const style = Object.assign({ color: this.state.value ? 'black' : 'rgba(0,0,0,.65)' }, this.props.style)

        return (
            <span className="cbd-input-search-sapn" style={style} >
                <input className='cbd-input search-text' defaultValue={this.state.defaultValue} onFocus={this.inputonFocus.bind(this)} style={{ fontSize: style.fontSize }} placeholder={this.props.placeholder} onChange={this.onChange.bind(this)} type="text" ></input>
                <button className='cbd-input search-button' onMouseDown={this.onMouseDown.bind(this)} onMouseUp={this.onMouseUp.bind(this)} onClick={this.onClick.bind(this)} style={{ background: this.state.mouseUp ? '#1890ff' : '#096DD9', transition: 'background .2s' }} >
                    <span>Search</span>
                </button>

                <span className="tooltip" >
                    文本提示
                </span>
            </span>
        )
    }
}

export default InputSearch