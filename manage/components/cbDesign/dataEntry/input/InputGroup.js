
import React from 'react'
import lodash from 'lodash'

class InputGroup extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            value: null,
            leftValue: { key: '', value: '' },

            leftOpenFlag: false,
            leftSelect: true,

            rightOpenFlag: false,

            mouseLeaveMenu: true,

            valueArry: [],
            menuArry: [],
            valueText: ''
        }

        let tempData = lodash.cloneDeep(props.data)
        this.data = tempData
    }

    onChange(e) {
        const el = e.target
        const value = el.value
        this.setState({
            value
        })
        this.props.onChange(value)
    }

    onLeftSelect(e) {
        let flag = this.state.leftOpenFlag
        const el = e.target
        if (el.localName === 'li') {
            if (!this.state.leftSelect) {
                return
            }
            const value = el.outerText
            const key = el.dataset ? el.dataset.key : el.getAttribute('data-key')

            const parentNode = el.parentNode

            lodash.forEach(parentNode.childNodes, (element) => {
                if (el === element) {
                    element.className = element.className + ' select'
                } else {
                    element.className = ''
                }
            });
            this.setState({
                leftValue: { value, key },
                leftOpenFlag: false,
                leftSelect: false
            })

            setTimeout(() => {
                this.setState({
                    leftSelect: true
                })
            }, 500)
        } else {

            flag = !flag

            this.setState({
                leftOpenFlag: flag
            })
        }
    }

    onLeftBlur(e) {

        this.setState({
            leftOpenFlag: false
        })
    }

    onRightSelect(e) {
        let flag = this.state.rightOpenFlag
        const el = e.target

        const valueArry = this.state.valueArry
        if (el.localName === 'li') {
            const value = el.outerText
            const key = el.dataset ? el.dataset.key : el.getAttribute('data-key')

            const menuDiv = el.parentNode.parentNode

            const parentUl = el.parentNode

            // 获取当前选择的menu
            let current_UL_Index = 0
            for (let i = 0; i < menuDiv.childNodes.length; i++) {
                if (menuDiv.childNodes[i] === parentUl) {
                    current_UL_Index = i
                }
            }


            lodash.forEach(parentUl.childNodes, (element) => {
                if (el === element) {
                    // 设置选择效果，else清除原来的选择
                    element.className = element.className + ' select'

                    // 这里要根据实际情况修改。当点击选择下拉内容时，需重新将焦点设置在input元素上
                    menuDiv.parentNode.childNodes[1].focus();
                    menuDiv.parentNode.childNodes[1].removeAttribute('placeholder')

                    //处理值显示
                    let valueArry = this.state.valueArry
                    if (valueArry.length > 0) {

                        valueArry.splice(current_UL_Index, valueArry.length - current_UL_Index, { key: el.dataset ? el.dataset.key : el.getAttribute('data-key'), value: el.outerText })

                    } else {
                        valueArry.push({
                            key: el.dataset ? el.dataset.key : el.getAttribute('data-key'),
                            value: el.outerText
                        })
                    }

                    const childMenu = []

                    const tempChildren = element.dataset ? el.dataset.children : el.getAttribute('data-children')
                    const children = tempChildren ? JSON.parse(tempChildren) : []

                    let menuArry = this.state.menuArry

                    const length = this.state.menuArry.length
                    let tempMenuArry = menuArry.splice(0, current_UL_Index + 1)

                    if (children.length > 0) {

                        children.forEach(child => {
                            childMenu.push(child)
                        });

                        tempMenuArry[current_UL_Index + 1] = childMenu

                        this.setState({
                            rightOpenFlag: true,
                            menuArry: tempMenuArry,
                            valueArry
                        })
                    } else {
                        this.setState({
                            rightOpenFlag: false,
                            menuArry: tempMenuArry,
                            valueArry
                        })
                    }
                } else {
                    const tempChildren = element.dataset ? el.dataset.children : el.getAttribute('data-children')
                    element.className = `cascader-menus-item-li${tempChildren && JSON.parse(tempChildren).length > 0 ? ' expend' : ''}`
                }
            });
        } else {

            flag = !flag

            if (this.state.menuArry.length < 1) {
                this.state.menuArry[0] = []
                this.data.forEach(item => {
                    this.state.menuArry[0].push(item)
                });
            }
            this.setState({
                rightOpenFlag: flag
            })
        }
    }

    onMouseLeave(e) {
        this.setState({
            mouseLeaveMenu: true
        })
    }

    onMouseEnter(e) {
        this.setState({
            mouseLeaveMenu: false
        })
    }

    onRightBlur(e) {
        if (this.state.mouseLeaveMenu) {
            this.setState({
                rightOpenFlag: false
            })
        }
    }

    renderRightMenu() {
        const rtndata = this.state.menuArry.map((item, i) => {
            return (
                <ul key={i} className="cascader-menus-item">
                    {
                        item.map((leafItem, n) => {
                            return (
                                <li className={"cascader-menus-item-li" + `${leafItem.children ? ' expend' : ''}`} key={`${i}-${n}`} data-key={leafItem.key} data-children={leafItem.children !== null && leafItem.children !== undefined && leafItem.children !== '' ? JSON.stringify(leafItem.children) : '[]'} >{leafItem.value}</li>
                            )
                        })
                    }
                </ul>
            )
        })

        return (rtndata)
    }

    renderRightValueText() {
        const arry = this.state.valueArry
        const spanList = arry.map((item, i) => {
            return (
                <span key={i} >{`${item.value}${i === arry.length - 1 ? '' : '/'}`}</span>
            )
        })

        return (spanList)
    }

    render() {

        // const style = Object.assign({ color: this.state.value ? 'black' : 'rgba(0,0,0,.65)' }, this.props.style)

        const style = this.props.style

        return (
            <span onBlur={this.onRightBlur.bind(this)} className="cbd-input-inputgroup" style={style} >

                <div onClick={this.onLeftSelect.bind(this)} onBlur={this.onLeftBlur.bind(this)} className="cbd-input-inputgroup-left" >

                    <div tabIndex={0}>{this.state.leftValue.value}</div>
                    <span className="icon left" style={{ transform: this.state.leftOpenFlag ? 'rotate(-135deg)' : 'rotate(45deg)' }} />

                    <ul style={{ opacity: this.state.leftOpenFlag ? 1 : 0, visibility: this.state.leftOpenFlag ? 'visible' : 'hidden' }} >
                        <li data-key={1} >城市</li>
                        <li data-key={2}>公司</li>
                    </ul>
                </div>

                <span id="cascader-menus" className="cascader-menus" onClick={this.onRightSelect.bind(this)} >
                    <span className="valuetext" >
                        {this.renderRightValueText()}
                    </span>
                    <input className='cbd-input cascader-text' readOnly style={{ fontSize: style.fontSize }} placeholder={this.props.placeholder} type="text" ></input>
                    <span className="icon right" style={{ transform: this.state.rightOpenFlag ? 'rotate(-135deg)' : 'rotate(45deg)' }} />

                    <div onMouseLeave={this.onMouseLeave.bind(this)} onMouseEnter={this.onMouseEnter.bind(this)} className={`cascader-menus${this.state.rightOpenFlag ? '' : ' hidden'}`} >
                        {this.renderRightMenu()}
                    </div>
                </span>

            </span>
        )
    }
}

export default InputGroup