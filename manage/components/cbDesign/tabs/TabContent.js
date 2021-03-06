import React from 'react'
import ClassNames from 'classnames'
import PropTypes from 'prop-types'

import Utils from './Utils'

// import { TabBarHOC } from './hoc/TabBarHOC';

class TabContent extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    render() {

        const { prefixCls, children, activeKey, tabBarPosition, className } = this.props;

        const cls = ClassNames({
            [`${prefixCls}-content`]: true,
            [className]: !!className
        })

        const activeIndex = Utils.getTabIndex(activeKey, children)

        const offset = 0 - activeIndex * 100
        let style = { marginLeft: `${offset}%` }
        if (tabBarPosition === 'left' || tabBarPosition === 'right') {
            // style = { marginTop: `${offset}%` }
            style = {}
        }

        const panes = React.Children.map(this.props.children, child => {
            return React.cloneElement(child, {
                active: activeKey === child.key ? true : false,
                prefixCls
            })
        })

        return (
            <div
                className={cls}
                style={style}
            >
                {panes}
            </div>
        )
    }
}

TabContent.propTypes = {
    onTabClick: PropTypes.func,

}

TabContent.defaultProps = {
    onTabClick() { },
}

export default TabContent
// export default TabBarHOC(TabBar)