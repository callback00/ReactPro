import React from 'react'
import ReactDOM from 'react-dom';
import Trigger from 'rc-trigger';
import 'rc-trigger/assets/index.css';

class Select extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            value: { key: '', value: '' },

            openFlag: false,
        }
    }

    onClick(e) {
        let flag = this.state.openFlag
        flag = !flag
        this.setState({
            openFlag: flag
        })
    }

    onBlur(e) {
        this.setState({
            openFlag: false
        })
    }

    onSelect(e) {
        let flag = this.state.openFlag
        const el = e.target
        if (el.localName === 'li') {
            const value = el.outerText
            const key = el.dataset.key

            const parentNode = el.parentNode
            parentNode.childNodes.forEach(element => {
                if (el === element) {
                    element.className = element.className + ' select'
                } else {
                    element.className = ''
                }
            });

            setTimeout(() => {
                this.setState({
                    value: { value, key },
                    openFlag: false,
                })
            }, 20)

        } else {
            flag = !flag
            this.setState({
                openFlag: flag
            })
        }
    }

    // 如果需要绑定事件，需重定义props,如果不需要绑定事件可以直接渲染this.props.children
    renderOpt() {

        return (
            <div className="cbd-select-dropdown">
                <ul className="cbd-select-dropdown-ul" onClick={this.onSelect.bind(this)} >
                    {this.props.children}
                </ul>
            </div>
        )
    }

    render() {

        const style = Object.assign({ color: this.state.value ? 'black' : 'rgba(0,0,0,.65)' }, this.props.style)

        return (

            <Trigger
                popupClassName="cbd-select-dropdown"
                popupPlacement="bottomLeft"
                popupVisible={this.state.openFlag}
                popupTransitionName="cbd-trigger-popup-slide"
                builtinPlacements={
                    {
                        bottomLeft: {
                            points: ['tl', 'bl'],
                        }
                    }
                }
                popup={this.renderOpt.bind(this)}
            >
                <div style={this.props.style} onClick={this.onClick.bind(this)} onBlur={this.onBlur.bind(this)} className={`cbd-select${this.state.openFlag ? ' open' : ' close'}`} >
                    <div tabIndex={0}>{this.state.value.value}</div>
                    <span className="icon" style={{ transform: this.state.openFlag ? 'rotate(-135deg)' : 'rotate(45deg)' }} />
                </div>
            </Trigger>
        )
    }
}

class Option extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }
    render() {
        return (
            <li className="cbd-select-dropdown-li" data-key={this.props.value} >{this.props.children}</li>
        )
    }
}

Select.Option = Option
export default Select
