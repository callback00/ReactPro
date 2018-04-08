import React from 'react'
import Scss from './style/SildeOne.scss'

import Swiper from 'swiper';

class SildeOne extends React.Component {
    constructor(props) {
        super(props)

        const height = window.screen.height
        //算高度，fontsize为30px 时，span的高度是40px
        const top = (height - 40 * 12) / 2

        this.state = {
            opacity: 0,
            translateX: 0,

            h2Top: top,

            headImage_Opacity: 0,
            headImage_Scale: 0.0001,

            clickCount: 0
        }
    }

    componentDidMount() {
        setTimeout(() => {
            const width = window.screen.width
            // 字体大小/2
            const cssFontSize = 30 / 2

            const x = width / 2 - cssFontSize

            this.setState({
                opacity_one: 1,
                translateX_one: x,
            })
        }, 100)
    }

    headClick() {
        let count = this.state.clickCount

        if (count % 2 === 0) {
            count++
            this.setState({
                headImage_Opacity: 1,
                headImage_Scale: 1,
                clickCount: count,
            })
        } else {
            count++
            this.setState({
                headImage_Opacity: 0,
                headImage_Scale: 0.0001,
                clickCount: count,
            })
        }
    }

    render() {
        return (
            <div className="swiper-slide" >
                <div className="side-one" >
                    <div className="myhead" >
                        <img src="/images/myhead.jpg" alt="" onClick={this.headClick.bind(this)} />
                        <img style={{ transform: `scale(${this.state.headImage_Scale})`, opacity: this.state.headImage_Opacity }} src="/images/email.png" alt="" />
                        <img style={{ transform: `scale(${this.state.headImage_Scale})`, opacity: this.state.headImage_Opacity }} src="/images/notes.png" alt="" />

                    </div>
                    <svg className="shapes" width="100%" height="100vh" viewBox="0,0,100,100" style={{ position: 'absolute' }}>
                        <g id="gStar" style={{ position: 'relative' }} >
                            <path transform="scale(0.1)" className="star" d="M50.214 10.067c6.4.204 10.753 25.648 10.753 25.648s26.256-1.803 27.13 2.857c.874 4.66-20.04 16.642-20.04 16.642s9.537 24.303 5.523 26.817c-4.015 2.515-23.545-14.023-23.545-14.023S29.333 84.493 25.633 81.785c-3.7-2.71 6.657-26.472 6.657-26.472S11.234 43.94 12.383 39.108c1.15-4.832 26.55-3.393 26.55-3.393s4.88-25.853 11.28-25.648z" fill="#feb53c" fillRule="evenodd"></path>
                            <animateMotion path="M0,0 q50,60 60,35 q70,-75 225,0" begin="0s" dur="3s" repeatCount="indefinite" />
                            <animateTransform attributeName="transform" begin="0s" dur="3s" type="rotate" from="0 5 5" to="360 5 5" repeatCount="indefinite" />
                        </g>

                    </svg>
                    <h2 className="word"  >
                        <span className="char" style={{ top: '1rem', opacity: this.state.opacity_one, transform: `translateX(${this.state.translateX_one}px)` }} >
                            欢
                        </span>
                        <span className="char" style={{ top: '2rem', right: '0', opacity: this.state.opacity_one, transform: `translateX(-${this.state.translateX_one}px)` }} >
                            迎
                        </span>
                        <span className="char" style={{ top: '3rem', opacity: this.state.opacity_one, transform: `translateX(${this.state.translateX_one}px)` }}>
                            回
                        </span>
                        <span className="char" style={{ top: '4rem', right: '0', opacity: this.state.opacity_one, transform: `translateX(-${this.state.translateX_one}px)` }}>
                            来
                        </span>
                        <span className="char" style={{ top: '5rem', opacity: this.state.opacity_one, transform: `translateX(${this.state.translateX_one}px)` }}>
                            请
                        </span>
                        <span className="char" style={{ top: '6rem', right: '0', opacity: this.state.opacity_one, transform: `translateX(-${this.state.translateX_one}px)` }}>
                            开
                        </span>
                        <span className="char" style={{ top: '7rem', opacity: this.state.opacity_one, transform: `translateX(${this.state.translateX_one}px)` }}>
                            始
                        </span>
                        <span className="char" style={{ top: '8rem', right: '0', opacity: this.state.opacity_one, transform: `translateX(-${this.state.translateX_one}px)` }}>
                            新
                        </span>
                        <span className="char" style={{ top: '9rem', opacity: this.state.opacity_one, transform: `translateX(${this.state.translateX_one}px)` }}>
                            的
                        </span>
                        <span className="char" style={{ top: '10rem', right: '0', opacity: this.state.opacity_one, transform: `translateX(-${this.state.translateX_one}px)` }}>
                            一
                        </span>
                        <span className="char" style={{ top: '11rem', opacity: this.state.opacity_one, transform: `translateX(${this.state.translateX_one}px)` }}>
                            天
                        </span>
                        <span className="char" style={{ top: '12rem', right: '0', opacity: this.state.opacity_one, transform: `translateX(-${this.state.translateX_one}px)` }}>
                            吧
                        </span>
                    </h2>
                </div>
            </div>
        )
    }
}

export default SildeOne