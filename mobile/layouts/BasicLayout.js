import React from 'react'
import Style from './style/BasicLayout.scss'

class BasicLayout extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    btnClick() {
        try {
            csonsole.log('测试2221111')
        } catch (error) {
            console.log(error)
        }
    }

    render() {
        return (
            <div>
                <div className="test1" onClick={this.btnClick.bind(this)} >
                    <p>
                        1
                    </p>
                </div>
                <div className="test2">
                    I am the BasicLayout
                </div>
            </div>
        )
    }
}

export default BasicLayout