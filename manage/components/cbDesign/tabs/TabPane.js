import React from 'react'
import PropTypes from 'prop-types'

class TabPane extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
        }

    }

    render() {
        return (
            <div className="cbd-tabs-pane"  >
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