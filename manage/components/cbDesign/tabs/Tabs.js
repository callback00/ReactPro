import React from 'react'
import PropTypes from 'prop-types'

import TabBar from './TabBar'
import TabPane from './TabPane'

class Tabs extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            marginLeft: '0%'
        }

        this.onTabClick = this.onTabClick.bind(this)

        this.tabbar = [{ title: '已受理案件' }, { title: '案件' }, { title: '未领取案件' }, { title: '未领取案件' }, { title: '未领取案件' }, { title: '未领取案件' }, { title: '未领取案件' }]
    }

    onTabClick(index) {
        this.setState({
            marginLeft: `${(0 - index) * 100}%`
        })
    }

    render() {
        return (
            <div className="cbd-tabs" >
                <TabBar onTabClick={this.onTabClick} data={this.tabbar} />

                <div style={{ marginLeft: this.state.marginLeft }} className="cbd-tabs-panes" >
                    {
                        this.props.children
                    }
                </div>
            </div>
        )
    }
}

Tabs.propTypes = {
    value: PropTypes.any,
    onChange: PropTypes.func,

}

Tabs.defaultProps = {
    checked: false,
    value: null,
    onChange() { },
}

Tabs.TabPane = TabPane

export default Tabs