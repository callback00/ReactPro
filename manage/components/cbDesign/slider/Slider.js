import React from 'react'

import addEventListener from '../../../common/util/dom/addEventListener';

// import SliderRC, { Range } from 'rc-slider';
// import 'rc-slider/assets/index.css';

class Slider extends React.Component {
    constructor(props) {
        super(props)
        this.state = {

        }
        this.width = 0
        this.railEl = null
        this.trackEl = null
        this.pointEl = null
        this.dragFlag = false

        this.starX = 0;
        this.value = 0;

        this.min = this.props.min || this.props.min === 0 ? this.props.min : 0  //this.props.min 为 0 时判断条件会直接判断为false
        this.max = this.props.max || this.props.max === 0 ? this.props.max : 100
        this.defaultValue = this.props.defaultValue || this.props.defaultValue === 0 ? this.props.defaultValue : this.min
        this.step = this.props.step ? this.props.step : 1

        this.onMouseMove = this.onMouseMove.bind(this)
        this.onMouseUp = this.onMouseUp.bind(this)

        this.onTouchMove = this.onTouchMove.bind(this)
        this.onTouchEnd = this.onTouchEnd.bind(this)
    }

    componentDidMount() {
        this.InitComponentData()
    }


    componentWillReceiveProps(nextProps) {
        this.props = nextProps
    }

    InitComponentData() {
        const left = (this.defaultValue - this.min) / (this.max - this.min) * 100

        this.pointEl.style.left = left + "%"
        this.trackEl.style.width = left + "%"

        this.value = this.defaultValue
    }

    addDocumentMouseEvents() {
        document.addEventListener("mousemove", this.onMouseMove, false);
        document.addEventListener("mouseup", this.onMouseUp, false);
    }

    addDocumentTouchEvents() {
        document.addEventListener("touchmove", this.onTouchMove, false);
        document.addEventListener("touchend", this.onTouchEnd, false);
    }

    onTouchStart(e) {
        this.dragFlag = true
        this.starX = e.touches[0].pageX

        e.preventDefault() //取消事件的默认动作，否则有时候拖动时会出现黑色的禁止圈

        this.addDocumentTouchEvents()
    }

    onTouchMove(e) {
        e.stopPropagation()
        if (this.dragFlag) {
            const x = e.touches[0].pageX //鼠标横坐标var x
            this.calculateMove(x)
        }
    }

    onTouchEnd(e) {
        this.dragFlag = false
        document.removeEventListener("touchmove", this.onTouchMove, false);
        document.removeEventListener("touchend", this.onTouchEnd, false);
    }

    onMouseDown(e) {
        this.dragFlag = true
        this.starX = e.pageX || e.clientX

        e.preventDefault() //取消事件的默认动作，否则有时候拖动时会出现黑色的禁止圈

        this.addDocumentMouseEvents()
    }

    onMouseMove(e) {

        e.stopPropagation()
        if (this.dragFlag) {
            const x = e.pageX || e.clientX //鼠标横坐标var x
            this.calculateMove(x)
        }
    }

    onMouseUp(e) {
        this.dragFlag = false
        document.removeEventListener("mousemove", this.onMouseMove, false)
        document.removeEventListener("mouseup", this.onMouseUp, false)
    }

    // 计算移动位置
    calculateMove(x) {
        if (this.starX === x) {
            return
        }

        const viewOffsetleft = this.getPosition(this.railEl).left //计算横条距离浏览器的left

        let moveLeft = x - viewOffsetleft //小方块相对于父元素（长线条）的left值

        if (moveLeft >= this.railEl.offsetWidth) {
            moveLeft = this.railEl.offsetWidth
            if (this.value === this.max) {
                return
            }
        }

        if (moveLeft < 0) {
            moveLeft = 0
        }

        const pWidth = this.railEl.offsetWidth / ((this.max - this.min) / this.step)

        let left = Math.round((moveLeft / pWidth).toFixed(1)) / ((this.max - this.min) / this.step) * 100

        if (moveLeft === this.railEl.offsetWidth) {
            left = 100
        }

        const fixed = this.step.toString().split(".").length > 1 ? this.step.toString().split(".")[1].length : 0
        const tempValue = Number((Math.round((moveLeft / pWidth).toFixed(1)) * this.step + this.min).toFixed(fixed))

        // 相同值则直接返回
        if (this.value === tempValue) {
            return
        }

        if (left >= 100) {
            left = 100
            this.value = this.max

        } else {
            // 显示值需要单独处理下，根据步长保留小数点长度
            this.value = tempValue
        }

        //设置拖动后小方块的left值
        this.pointEl.style.left = left + "%"
        this.trackEl.style.width = left + "%"


        if (this.props.onChange) {
            this.props.onChange(this.value)
        }
    }

    //获取元素的绝对位置
    getPosition(el) {
        let left = el.offsetLeft; //获取元素相对于其父元素的left值var left
        let top = el.offsetTop;
        let parentEl = el.offsetParent; // 取得元素的offsetParent

        // 一直循环直到根元素
        while (parentEl != null) {
            left += parentEl.offsetLeft;
            top += parentEl.offsetTop;
            parentEl = parentEl.offsetParent;
        }
        return {
            "left": left,
            "top": top
        };
    }

    stepClick(e) {
        e.preventDefault()
        if (e.target.className === this.pointEl.className) {
            return
        }

        const x = e.pageX || e.clientX //鼠标横坐标var x
        const viewOffsetleft = this.getPosition(this.railEl).left //计算横条距离浏览器的left

        let moveLeft = x - viewOffsetleft //小方块相对于父元素（长线条）的left值

        // 用于处理自定义步长的预处理，当最后一个小段不足一步长的时候用到，比如min={1} step={0.4} max={10}这种情况
        if (this.max - this.value < this.step && this.max !== this.value && moveLeft / this.railEl.offsetWidth > Number(this.value) / this.max) {
            this.pointEl.style.left = 100 + "%"
            this.trackEl.style.width = 100 + "%"
            this.value = this.max

            if (this.props.onChange) {
                this.props.onChange(this.value)
            }
            console.log('显示数值', this.value)
            return
        }

        this.calculateMove(x)

    }

    render() {

        const {
            style
        } = this.props

        return (
            <div className="cbd-slider-wrapper" style={style} >
                <div className={`cbd-slider`} onClick={this.stepClick.bind(this)} >
                    <div ref={(el) => { this.railEl = el }} className={`cbd-slider-rail`} />

                    <div className={`cbd-slider-track`} ref={(el) => { this.trackEl = el }} />

                    <div className={`cbd-slider-point`} ref={(el) => { this.pointEl = el }} onTouchStart={this.onTouchStart.bind(this)} onMouseDown={this.onMouseDown.bind(this)} />
                </div>
            </div>
        )
    }
}

export default Slider


