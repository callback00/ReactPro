
import React from 'react'

const jsonData = [
    {
        key: '1',
        value: '南宁市',
        children: [{
            key: '1-1',
            value: '青秀区',
            children: [{
                key: '1-1-1',
                value: '竹溪大道',
            }, {
                key: '1-1-2',
                value: '双拥路',
            }]
        }, {
            key: '1-2',
            value: '江南区',
            children: [{
                key: '1-2-1',
                value: '五一路',
            }, {
                key: '1-2-2',
                value: '白沙大道',
            }]
        }, {
            key: '1-2',
            value: '良庆区',
        }]
    }, {
        key: '2',
        value: '柳州市',
        children: [{
            key: '1-1',
            value: '柳城区',
        }]
    }, {
        key: '3',
        value: '梧州市',
    }
]


class InputGroup extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            value: null,
            leftValue: { key: '', value: '' },

            leftOpenFlag: false,
            rightOpenFlag: false,

            mouseLeaveMenu: true,

            valueArry: [],
            valueText: ''
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

    onLeftSelect(e) {

        let flag = this.state.leftOpenFlag
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
            this.setState({
                leftValue: { value, key },
                leftOpenFlag: false
            })
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
            const key = el.dataset.key

            const menuDiv = el.parentNode.parentNode

            const parentUl = el.parentNode

            parentUl.childNodes.forEach(element => {
                if (el === element) {
                    // 设置选择效果，else清除原来的选择
                    element.className = element.className + ' select'

                    // 这里要根据实际情况修改。当点击选择下拉内容时，需重新将焦点设置在input元素上
                    menuDiv.parentNode.childNodes[1].focus();
                    menuDiv.parentNode.childNodes[1].removeAttribute('placeholder')

                    this.setState({
                        rightOpenFlag: true
                    })

                    //当前所在页
                    let current_UL_Index = 0

                    // 判断点击的选项是否还有子节点，有子节点则添加ul或重新设置ul的innerHTML
                    const children = element.dataset.children ? JSON.parse(element.dataset.children) : []
                    if (children.length > 0) {

                        for (let i = 0; i < menuDiv.childNodes.length; i++) {
                            if (menuDiv.childNodes[i] === parentUl) {
                                current_UL_Index = i
                                let innerHTML = ''
                                children.forEach(item => {
                                    innerHTML = innerHTML + `<li class="${"cascader-menus-item-li" + `${item.children ? ' expend' : ''}`}" data-key=${item.key} data-children =${item.children ? JSON.stringify(item.children) : '[]'}>
                                                                ${item.value}
                                                             </li>`
                                });

                                if (menuDiv.childNodes[i + 1]) {
                                    menuDiv.childNodes[i + 1].style.opacity = 1
                                    menuDiv.childNodes[i + 1].innerHTML = innerHTML
                                } else {
                                    let ul = document.createElement('ul')
                                    ul.className = "cascader-menus-item"
                                    ul.innerHTML = innerHTML
                                    menuDiv.appendChild(ul)
                                }

                                break;
                            }
                        }

                        // 删除非相关ul
                        for (let i = current_UL_Index + 2; i < menuDiv.childNodes.length; i++) {

                            menuDiv.removeChild(menuDiv.childNodes[i])
                            i--
                        }
                    }
                    else {

                        // 删除非相关ul
                        for (let i = 0; i < menuDiv.childNodes.length; i++) {
                            if (menuDiv.childNodes[i] === parentUl) {
                                current_UL_Index = i
                                break;
                            }
                        }

                        // 删除点击后的
                        for (let i = current_UL_Index + 1; i < menuDiv.childNodes.length; i++) {
                            menuDiv.removeChild(menuDiv.childNodes[i])
                            i--
                        }

                        this.setState({
                            rightOpenFlag: false
                        })
                    }

                    //处理值显示
                    if (valueArry.length > 0) {

                        valueArry.splice(current_UL_Index, valueArry.length - current_UL_Index, { key: el.dataset.key, value: el.outerText })

                    } else {
                        valueArry.push({
                            key: el.dataset.key,
                            value: el.outerText
                        })
                    }

                    this.setState({
                        valueArry
                    })

                } else {
                    element.className = `cascader-menus-item-li${element.dataset.children && JSON.parse(element.dataset.children).length > 0 ? ' expend' : ''}`
                }
            });
        } else {

            flag = !flag

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
        const liList = jsonData.map((item, i) => {
            return (
                <li className={"cascader-menus-item-li" + `${item.children ? ' expend' : ''}`} key={i} data-key={item.key} data-children={item.children !== null && item.children !== undefined && item.children !== '' ? JSON.stringify(item.children) : '[]'} >{item.value}</li>
            )
        });

        return (liList)
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

        const style = Object.assign({ color: this.state.value ? 'black' : 'rgba(0,0,0,.65)' }, this.props.style)

        return (
            <span onBlur={this.onRightBlur.bind(this)} className="cbd-input-inputgroup" style={style} >

                <div onClick={this.onLeftSelect.bind(this)} onBlur={this.onLeftBlur.bind(this)} className="cbd-input-inputgroup-left" >

                    <div tabIndex={0}>{this.state.leftValue.value}</div>
                    <span className="icon left" style={{ transform: this.state.leftOpenFlag ? 'rotate(-135deg)' : 'rotate(45deg)' }} />

                    <ul style={{ opacity: this.state.leftOpenFlag ? 1 : 0 }} >
                        <li data-key={1} >城市</li>
                        <li data-key={2}>公司</li>
                    </ul>
                </div>

                <span id="cascader-menus" className="cascader-menus" onClick={this.onRightSelect.bind(this)} >
                    <span className="valuetext" >
                        {this.renderRightValueText()}
                    </span>
                    <input className='cbd-input search-text' readOnly style={{ fontSize: style.fontSize }} placeholder={this.props.placeholder} type="text" ></input>
                    <span className="icon right" />

                    <div onMouseLeave={this.onMouseLeave.bind(this)} onMouseEnter={this.onMouseEnter.bind(this)} className={`cascader-menus${this.state.rightOpenFlag ? '' : ' hidden'}`} >
                        <ul className="cascader-menus-item">
                            {this.renderRightMenu()}
                        </ul>

                    </div>
                </span>

            </span>
        )
    }
}

export default InputGroup