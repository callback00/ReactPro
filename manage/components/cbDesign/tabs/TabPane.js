import React from 'react'
import PropTypes from 'prop-types'
import ClassNames from 'classnames'

class TabPane extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
        }

    }

    render() {
        const { prefixCls, active } = this.props
        const cls = ClassNames({
            [`${prefixCls}-pane`]: true,
            ['active']: active,
        })
        return (
            <div className={cls}  >
                {this.props.children}
            </div>
        )
    }
}

TabPane.propTypes = {
    onChange: PropTypes.func,

}

TabPane.defaultProps = {
    onChange() { },
}

export default TabPane