// 关于第一个和最后一个tab的偏移量修正问题描述
// 1、当最后一次偏移时，如果最后一个tab显示不全会自动修正最小偏移量，让最后一个tab显示完整，这样会导致一个bug，有可能修正的偏移量刚好在某个tab的宽度的范围内，这个tab有可能就显示不出来
// 2、当出现上述问题时，只需点击prep则能显示刚才跳过的tab
// 3、所以在修正最小偏移量和最大偏移量时，只能修正一个，修正了最小偏移量能自动补全最后一项，修正最大偏移量能自动补全第一项显示
// 4、同时修正最小偏移量和最大偏移量很有可能导致其中某个tab一直无法显示，所以本组件只修正最后一项的偏移量，antd也是如此

import React from 'react'
import ClassNames from 'classnames'
import PropTypes from 'prop-types'
import debounce from 'lodash/debounce';

import Utils from './Utils'

class TabBar extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            inkTranslateX: 0,
            scrollBarEnable: false,
            next: false,
            prep: false,

            navStyle: { left: '0%' }
        }

        this.activeTab = null // 当前tab

        // 用于计算tab显示位置
        this.navContainerEl = null
        this.navWrapEl = null
        this.navEl = null

        // navEL当前偏移量
        this.navOffset = 0

    }

    componentDidMount() {
        //判断是否启用滚动条
        this.judgeEnableScroll()
        this.setNextPrep()

        // 监听浏览器大小改变
        this.debouncedResize = debounce(() => {
            this.judgeEnableScroll()
            this.setNextPrep()
        }, 200);

        addEventListener('resize', this.debouncedResize)
    }

    componentWillUnmount() {
        removeEventListener("resize", this.debouncedResize);
    }


    onTabClick(activeKey, e) {

        this.activeTab = e.target

        this.setState({
            activeKey
        })

        this.props.onTabClick(activeKey)
    }


    setOffset(offset, checkNextPrev = true) {
        //offset的最大偏移量为0，最小偏移量为navWrapWH - navWH
        const targetOffset = Math.min(0, offset)

        if (this.navOffset !== targetOffset) {

            this.navOffset = targetOffset
            let navOffsetStyle = {}
            const transformSupported = Utils.isTransformSupported()

            if (this.props.tabBarPosition === 'left' || this.props.tabBarPosition === 'right') {
                if (transformSupported) {
                    navOffsetStyle = {
                        name: 'transform',
                        value: `translate3d(0,${targetOffset}px,0)`,
                    };
                } else {
                    navOffsetStyle = {
                        name: 'top',
                        value: `${targetOffset}px`,
                    };
                }
            } else {
                if (transformSupported) {
                    navOffsetStyle = {
                        name: 'transform',
                        value: `translate3d(${targetOffset}px,0,0)`,
                    };
                } else {
                    navOffsetStyle = {
                        name: 'left',
                        value: `${targetOffset}px`,
                    };
                }
            }

            let navStyle = {}
            navStyle[navOffsetStyle.name] = navOffsetStyle.value

            this.setState({
                navStyle
            })

            // 是否继续设置next和prep的使用状态,该方法有两个作用，该方法作用一是禁用按钮，作用二是重计算偏移量
            if (checkNextPrev) {
                this.setNextPrep()
            }
        }
    }

    prevClick() {
        if (this.state.prep) {
            const navWrapEl = this.navWrapEl;
            const navWrapWH = Utils.getClientWH(navWrapEl);
            const { navOffset } = this;
            this.setOffset(navOffset + navWrapWH);
        }
    }

    nextClick() {
        if (this.state.next) {
            const navWrapEl = this.navWrapEl;
            const navWrapWH = Utils.getClientWH(navWrapEl);
            const { navOffset } = this;
            this.setOffset(navOffset - navWrapWH);
        }
    }

    // 判断是否启用滚动条
    judgeEnableScroll() {

        const navEl = this.navEl
        const navWrapEl = this.navWrapEl
        const navContainerEl = this.navContainerEl

        const navWH = Utils.getClientWH(navEl, this.props.tabBarPosition)
        const navWrapWH = Utils.getClientWH(navWrapEl, this.props.tabBarPosition)
        const nanavContainerWH = Utils.getClientWH(navContainerEl, this.props.tabBarPosition)

        const minOffset = nanavContainerWH - navWH


        if (navWH > nanavContainerWH) {
            this.setState({
                scrollBarEnable: true
            })
        } else {
            this.setState({
                scrollBarEnable: false
            })
        }
    }

    //设置next和prep是否可用，处理最小偏移量
    setNextPrep() {
        const navEl = this.navEl
        const navWrapEl = this.navWrapEl
        const navContainerEl = this.navContainerEl

        const navWH = Utils.getClientWH(navEl, this.props.tabBarPosition)
        const navWrapWH = Utils.getClientWH(navWrapEl, this.props.tabBarPosition)
        const nanavContainerWH = Utils.getClientWH(navContainerEl, this.props.tabBarPosition)

        // 判断是否修正最小偏移量的值，如果这个值设为minOffset = navWrapWH - navWH 则表示不修正偏移量，也就不会出现组件最上方描述出现的问题
        const minOffset = nanavContainerWH - navWH

        let { next, prep } = this.state
        if (minOffset >= 0) {
            next = false;
        } else if (minOffset < this.navOffset) {
            next = true;
        } else {
            // 显示到最后一页时，偏移量用最小值
            next = false;
            const realOffset = navWrapWH - navWH;
            this.setOffset(realOffset, false);
        }

        prep = this.navOffset < 0 ? true : false

        this.setState({
            prep,
            next
        })
    }

    // 创建索引标签
    createInkBar() {
        let style = {}

        //第一次进时不显示动画
        if (this.activeTab) {
            style.display = 'block'
            style.width = `${this.activeTab.clientWidth}px`
            style.transform = `translate3d(${this.activeTab ? this.activeTab.offsetLeft : 0}px, 0px, 0px)`
        } else {
            style.display = 'none'
        }

        return (
            <div className="cbd-tabs-ink-bar" style={style} />
        )
    }

    //创建tab节点
    createTabNode() {

        const { activeKey, panels, prefixCls, className } = this.props;
        const rtn = [];

        this.barArry = []

        React.Children.forEach(panels, (child, index) => {

            const cls = ClassNames({
                [`${prefixCls}-tab`]: true,
                ['active']: activeKey === child.key,
                ['disabled']: !!child.props.disabled,
                [className]: !!className,
            })

            const ref = {};
            if (activeKey === child.key) {
                ref.ref = (el) => { this.activeTab = el }
            }

            const tab = (
                <div
                    className={cls}
                    key={child.key}
                    {...ref}
                    onClick={this.onTabClick.bind(this, child.key)}
                >
                    {child.props.tab}
                </div>
            )
            rtn.push(tab)
        })

        return rtn
    }

    //创建scroll容器，并将inkBar, tab放入scroll容器中
    createScrollBarNode(inkBar, tabs) {

        const { prefixCls, className } = this.props

        const cls = ClassNames({
            [`${prefixCls}-nav-container`]: true,
            ['scrolling']: this.state.scrollBarEnable,
            [className]: !!className
        })

        return (
            <div className={cls} ref={(el) => { this.navContainerEl = el }} >
                <span className='cbd-tabs-tab-prev' style={{ opacity: this.state.prep ? '1' : '0' }} onClick={this.prevClick.bind(this)} />
                <span className='cbd-tabs-tab-next' style={{ opacity: this.state.next ? '1' : '0' }} onClick={this.nextClick.bind(this)} />
                <div className="cbd-tabs-scroll-wrap" ref={(el) => { this.navWrapEl = el }} >
                    <div className="cbd-tabs-scroll-nav" >
                        <div ref={(el) => { this.navEl = el }} style={this.state.navStyle} className="cbd-tabs-nav">
                            {inkBar}
                            {tabs}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    //将上面生成的元素在包一层
    putInTabContainer(contents) {
        const { prefixCls, className, style, tabBarPosition } = this.props

        const cls = ClassNames(`${prefixCls}-bar`, {
            [className]: !!className,
        })

        const topOrBottom = (tabBarPosition === 'top' || tabBarPosition === 'bottom');

        let children = contents;

        return (
            <div
                role="tablist"
                className={cls}
                tabIndex="0"
                style={style}
            >
                {children}
            </div>
        );
    }

    render() {
        const inkBar = this.createInkBar()
        const tempTabs = this.createTabNode()
        const scrollBar = this.createScrollBarNode(inkBar, tempTabs)
        const tabs = this.putInTabContainer(scrollBar)
        return (
            tabs
        )
    }
}

TabBar.propTypes = {
    onTabClick: PropTypes.func,

}

TabBar.defaultProps = {
    onTabClick() { },
}

export default TabBar
// export default TabBarHOC(TabBar)