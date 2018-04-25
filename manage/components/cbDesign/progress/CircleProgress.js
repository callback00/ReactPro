import React from 'react'
import PropTypes from 'prop-types'

function noop() {
}

class CircleProgress extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            value: props.value
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

        const width = style.width ? style.width : '240px'
        const height = style.height ? style.height : '240px'

        // 圆心位置
        const circlePoint = parseFloat(width) / 2

        // 传过来的半径需要减掉边框
        const radius = parseFloat(width) / 2 - parseFloat(borderWidth) / 2

        // 虚线
        const dasharray = Math.PI * (2 * radius);

        //虚线间隔
        const dashoffset = Math.PI * (2 * radius) * (1 - percent / 100)

        //matrix 中用到
        const v_move = parseFloat(width)

        return (

            <div style={{ height, width }} className="cbd-progress-circle">
                <svg width="100%" height="100%" >
                    <circle className="svg-back-circle" cx={`${circlePoint}`} cy={`${circlePoint}`} r={`${radius}`} strokeWidth={`${borderWidth}`} stroke="#D1D3D7" fill="none"></circle>
                    <circle className="svg-show-circle" cx={`${circlePoint}`} cy={`${circlePoint}`} r={`${radius}`} strokeWidth={`${borderWidth}`} stroke="#00A5E0" fill="none" transform={`matrix(0,-1,1,0,0,${v_move})`} strokeDasharray={`${dasharray}`} strokeDashoffset={`${dashoffset}`} ></circle>
                </svg>

                <div className="cbd-progress-circle-text">
                    <span className="percent" style={{ fontSize: style.fontSize }} > {this.props.percent}% </span>
                </div>
            </div>

        )
    }


    render() {
        return (
            <div>
                {
                    // this.renderByDiv()
                }
                {
                    this.renderBySvg()
                }
            </div>
        )
    }
}

CircleProgress.propTypes = {
    percent: PropTypes.number,
    radius: PropTypes.number,
    borderWidth: PropTypes.number,
    onChange: PropTypes.func,
}

CircleProgress.defaultProps = {
    percent: 10, // 半分比 ,值为0~100
    borderWidth: 6, // 圈边框显示宽度
    style: {},
    onChange: noop,
}

export default CircleProgress