import React from 'react'

class Checkbox extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            checked: false
        }
    }

    onChange(e) {
        const checked = e.target.checked
        this.setState({
            checked
        })

        this.props.onChange ? this.props.onChange(checked) : null
    }

    render() {

        const {
            defaultChecked,
            disabled,
            style
        } = this.props

        return (
            <label className="cbd-checkbox-wrapper" style={style}>
                <span className={`cbd-checkbox${this.state.checked ? ' checked' : ''}${disabled ? ' disabled' : ''}`}>
                    <input type="checkbox" onChange={this.onChange.bind(this)} disabled={disabled} defaultChecked={defaultChecked} className={`cbd-checkbox-input`} />
                    <span className="cbd-checkbox-inner" />
                </span>
                <span className="cb-checkbox-text" data-key={this.props.value} >{this.props.children}</span>
            </label>
        );
    }
}

export default Checkbox
