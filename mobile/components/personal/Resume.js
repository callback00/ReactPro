import React from 'react'
import ResumeScss from './style/Resume.scss'
import SildeOne from './SildeOne'
import SildeTwo from './SildeTwo'
import SildeThree from './SildeThree'
import SilderFour from './SilderFour'

import Swiper from 'swiper';

class Resume extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            key: 0,
        }
    }

    componentDidMount() {

        const that = this
        var mySwiper = new Swiper('.swiper-personal-resume', {
            direction: 'vertical',

            on: {
                slideChangeTransitionStart: function () {

                    if (this.activeIndex === 0 || this.activeIndex === 3) {
                        let key = that.state.key
                        key++

                        that.setState({
                            key
                        })
                    }
                },
            },
        })
    }

    render() {


        return (
            <div className="swiper-personal-resume">
                <div className="swiper-wrapper">
                    {<SilderFour />}
                    {<SildeOne key={this.state.key} />}
                    {<SildeTwo />}
                    {<SildeThree />}
                </div>

            </div>
        )
    }
}

export default Resume