import React from 'react'
import Scss from './style/SildeThree.scss'

class SildeThree extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            currdeg: 0
        }

        this.endX = 0
        this.startX = 0
        this.maxX = 0
        this.minX = 0
        this.globalDeg = 0

        this.i = 1
    }


    onTouchStart(e) {
        this.startX = e.touches[0].clientX
        this.maxX = e.touches[0].clientX
        this.minX = e.touches[0].clientX
    }

    onTouchMove(e) {

        this.endX = e.touches[0].clientX

        if (e.touches[0].clientX < this.minX) {
            this.minX = e.touches[0].clientX
        }

        if (e.touches[0].clientX > this.maxX) {
            this.maxX = e.touches[0].clientX
        }
    }

    onTouchEnd(e) {

        // 触碰时不滚动
        if (this.endX === 0) {
            return
        }

        let deg = this.globalDeg
        // 先判断终点是在起始点的左还是右
        if (this.startX < this.endX && this.endX !== 0) {
            deg = deg + 60
        } else {
            deg = deg - 60
        }

        this.globalDeg = deg
        this.setState({
            currdeg: deg
        })

        this.startX = 0
        this.endX = 0
    }

    render() {
        return (
            <div className="swiper-slide" >
                <div className="side-three" >
                    <div className="container" onTouchStart={this.onTouchStart.bind(this)} onTouchMove={this.onTouchMove.bind(this)} onTouchEnd={this.onTouchEnd.bind(this)} >
                        <div style={{ transform: `rotateY(${this.state.currdeg}deg)` }} className="carousel">
                            <div className="item a">A</div>
                            <div className="item b">B</div>
                            <div className="item c">C</div>
                            <div className="item d">D</div>
                            <div className="item e">E</div>
                            <div className="item f">F</div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default SildeThree