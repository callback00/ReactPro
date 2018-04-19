import React from 'react'
import Scss from './style/SildeFour.scss'

class SilderFour extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
        }

        this.addAnimation = this.addAnimation.bind(this)
    }

    componentDidMount() {

        const div = document.getElementsByClassName("bubble-content")[0]
        for (let i = 0; i < 15; i++) {

            const newBubble = document.createElement("div")
            newBubble.className = "bubble"

            let x = Math.floor(Math.random() * innerWidth);
            let y = Math.floor(Math.random() * innerHeight);
            let scale = Math.random();
            let pos = Math.round(Math.random());

            newBubble.style.top = `${y}px`;
            newBubble.style.left = `${x}px`;
            newBubble.style.transform = `translateZ(${pos ? '' : '-'}${scale.toFixed(2) * 250}px)`;

            // const that = this
            setTimeout(() => {
                div.appendChild(newBubble)

                this.addAnimation(newBubble, x, y, true, true)
            }, i * 200)
        }

    }


    addAnimation(newBubble, x, y, isPositive, updateX) {
        let curTop = parseInt(newBubble.style.top)
        let curLeft = parseInt(newBubble.style.left)

        if (curTop > -50) {
            newBubble.style.top = `${--curTop}px`
        } else {
            newBubble.style.top = `${innerHeight}px`
        }

        if (isPositive) {
            if (curLeft > x + 20) {
                isPositive = false
            } else {
                newBubble.style.left = `${++curLeft}px`
            }
        } else {
            if (curLeft < x - 20) {
                isPositive = true
            } else {
                newBubble.style.left = `${--curLeft}px`
            }
        }

        updateX = updateX ? false : true;
        requestAnimationFrame(this.addAnimation.bind(this, newBubble, x, y, isPositive, updateX))
    }

    add(e) {
        const x = e
        console.log(1)
    }

    render() {
        return (
            <div className="swiper-slide" >
                <div onClick={this.add} className="side-four" >
                    <div className='bubble-content' />
                </div>
            </div>
        )
    }
}

export default SilderFour
