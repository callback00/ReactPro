import React from 'react'
import PropTypes from 'prop-types'

class TabBar extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            activeIndex: 0,
            activeElWidth: 0,
            translateX: 0
        }

        this.barArry = []
    }

    componentDidMount() {
        this.changeInkBar(0)
    }

    changeInkBar(activeIndex) {
        let activeElWidth = 0
        let translateX = 0

        for (let i = 0; i < this.barArry.length; i++) {
            if (i === activeIndex) {
                activeElWidth = this.barArry[i].clientWidth
                break
            } else {
                translateX = translateX + this.barArry[i].clientWidth + 32 //32为css样式中的margin
            }
        }

        this.setState({
            activeIndex,
            activeElWidth,
            translateX
        })
    }

    onTabClick(activeIndex) {
        this.changeInkBar(activeIndex)

        this.props.onTabClick(activeIndex)
    }

    render() {
        return (
            <div className="cbd-tabs-bar" >

                <div className="cbd-tabs-ink-bar active" style={{ width: `${this.state.activeElWidth}px`, transform: `translate3d(${this.state.translateX}px, 0px, 0px)` }} />
                {
                    this.props.data.map((item, i) => {
                        const name = i === this.state.activeIndex ? 'cbd-tabs-tab active' : 'cbd-tabs-tab'
                        return (
                            <div ref={(el) => { this.barArry.push(el) }} key={i} className={name} onClick={this.onTabClick.bind(this, i)} >
                                {item.title}
                            </div>
                        )
                    })
                }
            </div>
        )
    }
}

TabBar.propTypes = {
    data: PropTypes.array,
    onClick: PropTypes.func,

}

TabBar.defaultProps = {
    data: [],
    onClick() { },
}

export default TabBar