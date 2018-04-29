import React from 'react'
import PropTypes from 'prop-types'
import ClassNames from 'classnames'

import TabBar from './TabBar'
import TabPane from './TabPane'
import TabContent from './TabContent'

function getDefaultActiveKey(props) {
    let activeKey;
    React.Children.forEach(props.children, (child) => {
        if (child && !activeKey && !child.props.disabled) {
            activeKey = child.key;
        }
    });
    return activeKey;
}

class Tabs extends React.Component {
    constructor(props) {
        super(props)

        let activeKey = ''
        if ('defaultActiveKey' in props) {
            activeKey = props.defaultActiveKey;
        } else {
            activeKey = getDefaultActiveKey(props);
        }

        this.state = {
            activeKey
        }

        this.onTabClick = this.onTabClick.bind(this)

    }

    componentWillReceiveProps(nextProps) {
        if ('activeKey' in nextProps) {
            this.setState({
                activeKey: nextProps.activeKey
            })
        }
    }

    onTabClick(activeKey) {
        this.props.onTabClick(activeKey)
        this.setState({
            activeKey
        })
    }

    render() {

        const {
            prefixCls,
            tabBarPosition,
            className,
            renderTabContent,
            renderTabBar,
        } = this.props

        //处理tab命名
        const wrapCls = ClassNames({
            [prefixCls]: 1,
            [`${prefixCls}-${tabBarPosition}`]: 1,
            [className]: !!className,
        })


        this.tabBar = renderTabBar()

        const contents = [
            // tab导航
            React.cloneElement(this.tabBar, {
                prefixCls,
                key: 'tabBar',
                tabBarPosition,
                onTabClick: this.onTabClick,
                panels: this.props.children,
                activeKey: this.state.activeKey,
                className: '',
                style: {}
            }),

            // 将TabPane包囊在tabContent中
            React.cloneElement(renderTabContent(), {
                prefixCls,
                tabBarPosition,
                activeKey: this.state.activeKey,
                children: this.props.children,
                key: 'tabContent',
            }),
        ];

        return (
            <div className={wrapCls} style={this.props.style} >
                {/* <TabBar onTabClick={this.onTabClick} data={this.tabbar} /> */}
                {/* {renderTabBar}

                <div style={{ marginLeft: this.state.marginLeft }} className="cbd-tabs-panes" >
                    {
                        this.props.children
                    }
                </div> */}

                {contents}
            </div>
        )
    }
}

Tabs.propTypes = {
    onChange: PropTypes.func,
    children: PropTypes.any,
    prefixCls: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,
    activeKey: PropTypes.string,
    defaultActiveKey: PropTypes.string,
};

Tabs.defaultProps = {
    prefixCls: 'cbd-tabs',
    tabBarPosition: 'top',
    style: {},
    onChange() { },
};

Tabs.TabPane = TabPane
Tabs.TabBar = TabBar
Tabs.TabContent = TabContent

export default Tabs