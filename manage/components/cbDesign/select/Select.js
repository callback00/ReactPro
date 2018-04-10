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

            dropdownEl: props.children
        }

        //this.props.showSearch 为真时需要多处理一步
        this.mouseLeaveContent = true

        // 在下拉菜单点击会触发onBlur事件，所以用这个标记一下
        this.mouseLeaveDropdown = true

        //防止在触发隐藏时连续点击选择值
        this.selecting = false

        //this.props.showSearch 为真时， 输入数据时隐藏原文本显示框
        this.hiddenTextValueFlag = false

        //如果showSearch 存在需要清空input的值
        this.inputEl = null

        this.textValueEl = null
    }

    onClick(e) {
        let flag = this.state.openFlag
        flag = !flag

        if (this.props.showSearch) {
            // 清空input的内容
            this.inputEl.value = ''

            // 显示文本框
            this.hiddenTextValueFlag = false
            this.textValueEl.className = 'cbd-select-content-textvalue'
        }

        this.setState({
            openFlag: flag,
            dropdownEl: this.props.children
        }, () => {
            if (this.props.showSearch) {
                this.inputEl.focus();
            }
        })
    }

    onBlur(e) {
        if (this.mouseLeaveDropdown && this.mouseLeaveContent) {
            this.setState({
                openFlag: false
            })

            if (this.props.showSearch) {
                // 清空input的内容
                this.inputEl.value = ''

                // 显示文本框
                this.hiddenTextValueFlag = false
                this.textValueEl.className = 'cbd-select-content-textvalue'
            }
        }
    }

    onSelect(e) {
        let flag = this.state.openFlag
        const el = e.target

        if (el.className.indexOf("disabled") < 0) {
            if (el.localName === 'li') {

                if (this.selecting) {
                    return
                }

                if (this.props.showSearch) {
                    // 显示文本框
                    this.hiddenTextValueFlag = false
                    this.textValueEl.className = 'cbd-select-content-textvalue'
                }

                this.selecting = true
                const value = el.outerText
                const key = el.dataset.key

                const parentNode = el.parentNode
                parentNode.childNodes.forEach(element => {
                    if (el === element) {
                        element.className = element.className + ' select'
                    } else {
                        if (element.className.indexOf("disabled") < 0) {
                            element.className = 'cbd-select-dropdown-li'
                        }
                    }
                });
                this.setState({
                    value: { value, key },
                    openFlag: false,
                })

                setTimeout(() => {
                    this.selecting = false
                }, 500)
            } else {
                flag = !flag
                this.setState({
                    openFlag: flag
                })
            }
        } else {
            this.inputEl.focus();
        }
    }

    onMouseLeave(e) {
        this.mouseLeaveDropdown = true
    }

    onMouseEnter(e) {
        this.mouseLeaveDropdown = false
    }

    onMouseLeaveContent(e) {
        this.mouseLeaveContent = true
    }

    onMouseEnterContent(e) {
        this.mouseLeaveContent = false
    }

    inputOnChange(e) {
        if (e.target.value) {
            if (!this.hiddenTextValueFlag) {
                this.hiddenTextValueFlag = true
                this.textValueEl.className = 'cbd-select-content-textvalue hidden'
            }

            this.filterDropdownData()
        } else {
            this.hiddenTextValueFlag = false
            this.textValueEl.className = 'cbd-select-content-textvalue'
        }
    }

    filterDropdownData() {
        const com = this
        const data = React.Children.map(this.props.children, child => {
            let props = child.props

            if (child.type === Option) {

                if (com.inputEl.value) {
                    if (child.props.children.indexOf(com.inputEl.value) > 0) {
                        const temp = React.cloneElement(child, {
                        })

                        return temp
                    }
                } else {
                    return child
                }
            }
            else {
                return child
            }
        })

        this.setState({
            dropdownEl: data
        })

        // return data
    }

    // 如果需要绑定事件，需重定义props,如果不需要绑定事件可以直接渲染this.props.children
    renderOpt() {
        return (
            <div className="cbd-select-dropdown-content" onMouseLeave={this.onMouseLeave.bind(this)} onMouseEnter={this.onMouseEnter.bind(this)}>
                <ul className="cbd-select-dropdown-ul" onMouseUp={this.onSelect.bind(this)} >
                    {
                        this.state.dropdownEl.length > 0 ? this.state.dropdownEl : <li className='cbd-select-dropdown disabled' >暂无数据</li>
                    }
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
                {
                    this.props.showSearch ?
                        <div style={this.props.style} onMouseLeave={this.onMouseLeaveContent.bind(this)} onMouseEnter={this.onMouseEnterContent.bind(this)} onClick={this.onClick.bind(this)} onBlur={this.onBlur.bind(this)} className={`cbd-select`} >
                            <div className={`cbd-select-content${this.state.openFlag ? ' activity' : ''}`} tabIndex={0}>

                                <div ref={(el) => { this.textValueEl = el }} className={`cbd-select-content-textvalue`} style={{ opacity: this.state.openFlag ? 0.4 : 1 }} >{this.state.value.value}</div>
                                {
                                    this.props.showSearch ? <input ref={(el) => { this.inputEl = el }} className={`${this.state.openFlag ? ' show' : ' hidden'}`} onChange={this.inputOnChange.bind(this)} type="text" /> : ''
                                }
                            </div>
                            <span className="icon" style={{ zIndex: 2, transform: this.state.openFlag ? 'rotate(-135deg)' : 'rotate(45deg)' }} />
                        </div>

                        :
                        <div style={this.props.style} onClick={this.onClick.bind(this)} onBlur={this.onBlur.bind(this)} className={`cbd-select`} >
                            <div className={`cbd-select-content${this.state.openFlag ? ' activity' : ''}`} tabIndex={0}>

                                <div className="cbd-select-content-textvalue">{this.state.value.value}</div>
                            </div>
                            <span className="icon" style={{ zIndex: 2, transform: this.state.openFlag ? 'rotate(-135deg)' : 'rotate(45deg)' }} />
                        </div>
                }

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
            <li className={`cbd-select-dropdown-li${this.props.disabled ? ' disabled' : ''}`} data-key={this.props.value} >{this.props.children}</li>
        )
    }
}

Select.Option = Option
export default Select
