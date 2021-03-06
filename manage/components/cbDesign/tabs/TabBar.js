// 关于第一个和最后一个tab的偏移量修正问题描述
// 1、当最后一次偏移时，如果最后一个tab显示不全会自动修正最小偏移量，让最后一个tab显示完整，这样会导致一个bug，有可能修正的偏移量刚好在某个tab的宽度的范围内，这个tab有可能就显示不出来
// 2、当出现上述问题时，只需点击prev则能显示刚才跳过的tab
// 3、所以在修正最小偏移量和最大偏移量时，只能修正一个，修正了最小偏移量能自动补全最后一项，修正最大偏移量能自动补全第一项显示
// 4、同时修正最小偏移量和最大偏移量很有可能导致其中某个tab一直无法显示，所以本组件只修正最后一项的偏移量，antd也是如此
// 5、2018-04-28 修正当最后一个tab宽度大于容器宽度时，prep失效。 修正内容rc-tabs setNextprev(), 该bug可在 https://4x4vnvxv87.codesandbox.io/ 重现，将里面的style处理宽度的样式去掉然后调整浏览器宽度即可

import React from 'react'
import ClassNames from 'classnames'
import PropTypes from 'prop-types'
import debounce from 'lodash/debounce';

import Utils from './Utils'

// 总结: 1、该组件的关键点在于控制tabBar的创建以及移动，inkBar依赖于tabNode的宽度和offset，需要在tabNoderender后才能获取到tabNode的宽度和offset，所以处理逻辑有些会放在componentDidUpdate内
class TabBar extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            scrollBarEnable: false,
            next: false,
            prev: false,

            navStyle: {}
        }

        this.activeTab = null // 当前tab
        // 用于计算tab显示位置
        this.navContainerEl = null
        this.navWrapEl = null
        this.navEl = null

        // navEL当前偏移量(注意不是activeTab的偏移量，代码多容易搞混)
        this.navOffset = 0

    }

    componentDidMount() {
        //初始化时主动调用componentDidUpdate 并伪造一个prevProps
        this.componentDidUpdate({ firstInit: true })
        // 监听浏览器大小改变
        this.debouncedResize = debounce(() => {
            this.setNextprev()
        }, 200);

        addEventListener('resize', this.debouncedResize)
    }

    componentDidUpdate(prevProps) {

        //这个方法里setstate比需要判断，不需要更新时不要调用setstate，否则这里就死循环了
        if (prevProps.firstInit) {
            this.setNextprev()
            this.setState({
            }, () => {
                this.moveToActiveTab()
            })
        } else {
            // 由调用者改变activeKey时调用
            if (this.props.activeKey !== prevProps.activeKey) {
                //onTabClick中不需要添加moveToActiveTab的原因在这里,调用setstate是更新inkbar的位置，在scrollBarEnable为false时如果没setstate则inkbar位置不一定改变
                this.setState({
                }, () => {
                    this.moveToActiveTab()
                })
            }
            if (this.props.tabBarPosition !== prevProps.tabBarPosition) {
                this.setNextprev() //头文件描述的第五点的bug修正又引起了另一个bug, 这个bug是在水平方向与垂直方向来回切换引起的bug。其实可修正也可以不处理(不处理把这句代码去掉即可，影响可读性)，比较真实业务中不太可能切换方向。
                this.setState({
                    navStyle: {}
                }, () => {
                    this.navOffset = 0
                    this.moveToActiveTab()
                })
            }
        }

    }

    componentWillUnmount() {
        removeEventListener("resize", this.debouncedResize);
    }


    moveToActiveTab() {

        const navEl = this.navEl
        const navWH = Utils.getClientWH(navEl, this.props.tabBarPosition)

        const navWrapEl = this.navWrapEl;
        const navWrapWH = Utils.getClientWH(navWrapEl, this.props.tabBarPosition);

        const activeTabWH = Utils.getClientWH(this.activeTab, this.props.tabBarPosition)

        let offset = 0

        //精髓啊，用距离浏览器的偏移量来判断activeTab是否显示完整,显示不完整补全偏移量
        const activeWebOffset = Utils.getElOffsetLT(this.activeTab, this.props.tabBarPosition)
        const navWrapWebOffset = Utils.getElOffsetLT(navWrapEl, this.props.tabBarPosition)

        //这两个判断都是处理非可视区域时偏移量设置，如果tab在可视区域内则不调用setOffset
        if (navWrapWebOffset > activeWebOffset) {
            offset = this.navOffset + (navWrapWebOffset - activeWebOffset);
            this.setOffset(offset);
        } else if ((navWrapWebOffset + navWrapWH) < (activeWebOffset + activeTabWH)) {
            //算法关键点
            offset = this.navOffset - (activeWebOffset + activeTabWH) + (navWrapWebOffset + navWrapWH);
            this.setOffset(offset);
        }
    }

    setOffset(offset, checkNextPrev = true) {
        //offset的最大偏移量为0，最小偏移量为navWrapWH - navWH
        const targetOffset = Math.min(0, offset)

        if (this.navOffset !== targetOffset) {

            this.navOffset = targetOffset
            let navOffsetStyle = Utils.getOffsetStyle(targetOffset, this.props.tabBarPosition)

            let navStyle = {}
            navStyle[navOffsetStyle.name] = navOffsetStyle.value

            //  防止重复渲染,递归出口判断
            if (!this.state.navStyle || navStyle[navOffsetStyle.name] !== this.state.navStyle[navOffsetStyle.name]) {
                this.setState({
                    navStyle
                })
            }

            // 是否继续设置next和prev的使用状态,该方法有两个作用，该方法作用一是禁用按钮，作用二是重计算偏移量
            if (checkNextPrev) {
                this.setNextprev()
            }
        }
    }

    //设置next和prev是否可用，处理最小偏移量
    setNextprev() {
        const navEl = this.navEl
        const navWrapEl = this.navWrapEl
        const navContainerEl = this.navContainerEl

        const navWH = Utils.getClientWH(navEl, this.props.tabBarPosition)
        const navWrapWH = Utils.getClientWH(navWrapEl, this.props.tabBarPosition)
        const nanavContainerWH = Utils.getClientWH(navContainerEl, this.props.tabBarPosition)

        // 判断是否修正最小偏移量的值，如果这个值设为minOffset = navWrapWH - navWH 则表示不修正偏移量，也就不会出现组件最上方描述出现的问题
        const minOffset = nanavContainerWH - navWH

        let { next, prev, scrollBarEnable } = this.state
        if (minOffset >= 0) {
            next = false
            prev = false
            this.setOffset(0, false)
        } else if (minOffset < this.navOffset) {
            next = true
            prev = this.navOffset < 0 ? true : false
        } else {
            // 显示到最后一页时，偏移量用最小值
            // 必须有这个if语句，否则当navWrapWH 小于 最后一个tab的宽度或者高度时，点击上prep就会失效，因为它仍重计算了
            // 2018-04-28 修正的bug
            if (this.state.next) {
                next = false
                prev = true
                const realOffset = navWrapWH - navWH;
                this.setOffset(realOffset, false);
            }
        }

        scrollBarEnable = minOffset >= 0 ? false : true

        // componentDidUpdate内调用setstate 相当于递归函数，这里是出口
        if (prev !== this.state.prev || next !== this.state.next || scrollBarEnable !== this.state.scrollBarEnable) {
            this.setState({
                prev,
                next,
                scrollBarEnable
            })
        }
    }

    prevClick() {
        if (this.state.prev) {
            const navWrapEl = this.navWrapEl;
            const navWrapWH = Utils.getClientWH(navWrapEl, this.props.tabBarPosition);
            const { navOffset } = this;

            this.setOffset(navOffset + navWrapWH, true);
        }
    }

    nextClick() {
        if (this.state.next) {
            const navWrapEl = this.navWrapEl;
            const navWrapWH = Utils.getClientWH(navWrapEl, this.props.tabBarPosition);
            const { navOffset } = this;
            this.setOffset(navOffset - navWrapWH);
        }
    }

    onTabClick(activeKey, e) {

        this.activeTab = e.target
        this.props.onTabClick(activeKey)
    }

    // 创建索引标签,this.activeTab依赖于tabNode渲染完成后赋值，
    createInkBar() {
        let style = {}

        //第一次进时不显示动画
        if (this.activeTab) {
            style.display = 'block'

            const offset = this.props.tabBarPosition === 'top' || this.props.tabBarPosition === 'bottom' ? this.activeTab.offsetLeft : this.activeTab.offsetTop

            const tempStyle = Utils.getOffsetStyle(offset, this.props.tabBarPosition)
            style[tempStyle.name] = tempStyle.value
            if (this.props.tabBarPosition === 'top' || this.props.tabBarPosition === 'bottom') {
                style.width = `${this.activeTab.clientWidth}px`
            } else {
                style.height = `${this.activeTab.clientHeight}px`
            }

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
                <span className='cbd-tabs-tab-prev' style={{ opacity: this.state.prev ? '1' : '0' }} onClick={this.prevClick.bind(this)} />
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
        const tempTabs = this.createTabNode()
        const inkBar = this.createInkBar()
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