import React from 'react'
import Scss from './style/SildeTwo.scss'

import Swiper from 'swiper';

class SildeTwo extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            // book of css
            bookcssOpne: false,
            left: 30,

            // book of js 
            bookjsOpne: false,
            bookjsLeft: 30,
        }
    }

    bookClikc(book) {
        if (book === 'css') {
            let flag = this.state.bookcssOpne;
            let left = this.state.left;
            if (flag) {
                flag = false
                left = 30
            } else {
                flag = true
                left = 50
            }

            this.setState({
                bookcssOpne: flag,
                left
            })
        } else if (book === 'js') {
            let flag = this.state.bookjsOpne;
            let left = this.state.bookjsLeft;
            if (flag) {
                flag = false
                left = 30
            } else {
                flag = true
                left = 50
            }

            this.setState({
                bookjsOpne: flag,
                bookjsLeft: left
            })
        }

    }

    render() {


        return (
            <div className="swiper-slide" >
                <div className="side-two" >
                    <ul className="bookshelf" >
                        <li onClick={this.bookClikc.bind(this, 'css')} className="book css" style={{ left: `${this.state.left}%`, transition: this.state.bookcssOpne ? "left 0.6s ease" : "left 0.6s ease 0.8s" }} >
                            {/* 封面页效果处理 */}
                            <ul className="cover" style={{ transform: this.state.bookcssOpne ? "rotateY(-150deg)" : "rotateY(-34deg) translateZ(8px)", transition: this.state.bookcssOpne ? "transform 0.8s ease 0.6s, z-index 0.8s" : "transform 0.8s ease, z-index 0.8s" }} >
                                <li className="testli" style={{ zIndex: this.state.bookcssOpne ? 8 : 10, transition: this.state.bookcssOpne ? "z-index 0.25s ease 0.8s " : "z-index 0.3s ease 0.15s" }} >
                                    <div>
                                        <p>css</p>
                                    </div>
                                </li>
                                {/* 封面页翻转后的背页 */}
                                <li />
                            </ul>

                            <ul className="page" >
                                <li style={{ zIndex: this.state.bookcssOpne ? 12 : 5, transform: this.state.bookcssOpne ? "rotateY(-140deg)" : "rotateY(-34deg)", transition: this.state.bookcssOpne ? "transform 0.8s ease 0.7s, z-index 2.4s " : "transform 0.6s ease, z-index 0.8s" }} />
                                <li style={{ zIndex: this.state.bookcssOpne ? 12 : 5, transform: this.state.bookcssOpne ? "rotateY(-135deg)" : "rotateY(-32deg)", transition: this.state.bookcssOpne ? "transform 0.8s ease 0.8s, z-index 2.4s" : "transform 0.6s ease, z-index 0.8s" }} />
                                <li style={{ transform: this.state.bookcssOpne ? "rotateY(-26deg)" : "rotateY(-30deg)", transition: this.state.bookcssOpne ? "transform 0.8s ease 0.6s" : "transform 0.6s ease" }} />
                                <li style={{ transform: this.state.bookcssOpne ? "rotateY(-20deg)" : "rotateY(-28deg)", transition: this.state.bookcssOpne ? "transform 0.8s ease 0.6s" : "transform 0.6s ease" }} />
                                <li style={{ transform: this.state.bookcssOpne ? "rotateY(-14deg)" : "rotateY(-26deg)", transition: this.state.bookcssOpne ? "transform 0.8s ease 0.6s" : "transform 0.6s ease" }} />
                            </ul>

                            <ul className="back" >
                                <li style={{ transform: this.state.bookcssOpne ? "rotateY(-10deg)" : "rotateY(-28deg)", transition: this.state.bookcssOpne ? "transform 0.8s ease 0.6s" : "transform 0.6s ease" }} />
                            </ul>

                            <ul className="spine" style={{ left: this.state.bookcssOpne ? '-9px' : '-11px', transition: this.state.bookcssOpne ? "left 0.6s ease 0.8s" : "left 0.6s ease" }} >
                                {/* 白条 */}
                                <li />
                            </ul>
                        </li>

                        <li onClick={this.bookClikc.bind(this, 'js')} className="book js" style={{ top: '2rem', left: `${this.state.bookjsLeft}%`, transition: this.state.bookjsOpne ? "left 0.6s ease" : "left 0.6s ease 0.8s" }} >
                            {/* 封面页效果处理 */}
                            <ul className="cover" style={{ transform: this.state.bookjsOpne ? "rotateY(-150deg)" : "rotateY(-34deg) translateZ(8px)", transition: this.state.bookjsOpne ? "transform 0.8s ease 0.6s, z-index 0.8s" : "transform 0.8s ease, z-index 0.8s" }} >
                                <li className="testli" style={{ zIndex: this.state.bookjsOpne ? 8 : 10, transition: this.state.bookjsOpne ? "z-index 0.25s ease 0.8s " : "z-index 0.3s ease 0.15s" }} >
                                    <div style={{ background: '-webkit-linear-gradient(top, #3498db 58%, #2a90d4 0%)', }} >
                                        <p>js</p>
                                    </div>
                                </li>
                                {/* 封面页翻转后的背页 */}
                                <li />
                            </ul>

                            <ul className="page" >
                                <li style={{ zIndex: this.state.bookjsOpne ? 12 : 5, transform: this.state.bookjsOpne ? "rotateY(-140deg)" : "rotateY(-34deg)", transition: this.state.bookjsOpne ? "transform 0.8s ease 0.7s, z-index 2.4s " : "transform 0.6s ease, z-index 0.8s" }} />
                                <li style={{ zIndex: this.state.bookjsOpne ? 12 : 5, transform: this.state.bookjsOpne ? "rotateY(-135deg)" : "rotateY(-32deg)", transition: this.state.bookjsOpne ? "transform 0.8s ease 0.8s, z-index 2.4s" : "transform 0.6s ease, z-index 0.8s" }} />
                                <li style={{ transform: this.state.bookjsOpne ? "rotateY(-26deg)" : "rotateY(-30deg)", transition: this.state.bookjsOpne ? "transform 0.8s ease 0.6s" : "transform 0.6s ease" }} />
                                <li style={{ transform: this.state.bookjsOpne ? "rotateY(-20deg)" : "rotateY(-28deg)", transition: this.state.bookjsOpne ? "transform 0.8s ease 0.6s" : "transform 0.6s ease" }} />
                                <li style={{ transform: this.state.bookjsOpne ? "rotateY(-14deg)" : "rotateY(-26deg)", transition: this.state.bookjsOpne ? "transform 0.8s ease 0.6s" : "transform 0.6s ease" }} />
                            </ul>

                            <ul className="back" >
                                <li style={{ transform: this.state.bookjsOpne ? "rotateY(-10deg)" : "rotateY(-28deg)", transition: this.state.bookjsOpne ? "transform 0.8s ease 0.6s" : "transform 0.6s ease" }} />
                            </ul>

                            <ul className="spine" style={{ left: this.state.bookjsOpne ? '-9px' : '-11px', transition: this.state.bookjsOpne ? "left 0.6s ease 0.8s" : "left 0.6s ease" }} >
                                {/* 白条 */}
                                <li />
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        )
    }
}

export default SildeTwo