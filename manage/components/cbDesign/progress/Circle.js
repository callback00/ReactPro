import React from 'react'
import PropTypes from 'prop-types'

function noop() {
}

class Circle extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            value: this.props.value
        }

        this.onChange = this.onChange.bind(this)
    }

    componentWillReceiveProps(nextProps) {
        if ('value' in nextProps) {
            this.setState({
                value: nextProps.value,
            });
        }
    }

    onChange(value) {
        this.setState({
            value
        })

        this.props.onChange(value)
    }

    renderByDiv() {
        return (

            <div className="cbd-progress-circle">
                <div className="back-circle" />
                <div className="left-half-circle" />
                <div className="right-half-circle" />
            </div>

        )
    }

    renderBySvg() {
        let { percent, borderWidth, style } = this.props

        // 圆心位置
        const circlePoint = parseFloat(style.width) / 2

        // 传过来的半径需要减掉边框
        const radius = parseFloat(style.width) / 2 - parseFloat(borderWidth) / 2

        // 虚线
        const dasharray = Math.PI * (2 * radius);

        //虚线间隔
        const dashoffset = Math.PI * (2 * radius) * (1 - percent / 100)

        //matrix 中用到
        const v_move = parseFloat(style.width)

        return (

            <div style={style} className="cbd-progress-circle">
                <svg width="100%" height="100%" >
                    <circle className="svg-back-circle" cx={`${circlePoint}`} cy={`${circlePoint}`} r={`${radius}`} strokeWidth={`${borderWidth}`} stroke="#D1D3D7" fill="none"></circle>
                    <circle className="svg-show-circle" cx={`${circlePoint}`} cy={`${circlePoint}`} r={`${radius}`} strokeWidth={`${borderWidth}`} stroke="#00A5E0" fill="none" transform={`matrix(0,-1,1,0,0,${v_move})`} strokeDasharray={`${dasharray}`} strokeDashoffset={`${dashoffset}`} ></circle>
                </svg>

            </div>

        )
    }


    render() {
        return (
            <div>
                {
                    this.renderByDiv()
                }
                {
                    this.renderBySvg()
                }
            </div>
        )
    }
}

Circle.propTypes = {
    percent: PropTypes.number,
    radius: PropTypes.number,
    borderWidth: PropTypes.number,
    onChange: PropTypes.func,
    style: PropTypes.object

}

Circle.defaultProps = {
    percent: 10, // 半分比 ,值为0~100
    borderWidth: 6, // 圈边框显示宽度
    style: { height: 240, width: 240 },
    onChange: noop,
}

export default Circle