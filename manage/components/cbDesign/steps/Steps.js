import React from 'react'

class Steps extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    renderStep() {
        const com = this

        const current = com.props.current ? com.props.current : 0
        const data = React.Children.map(this.props.children, (child, index) => {
            if (child.type === Step) {

                let name = "wait"
                if (index <= current) {
                    if (index === current) {
                        name = "process"
                    } else {
                        name = "finish"
                    }
                }
                const temp = React.cloneElement(child, {
                    stepNum: index,
                    name
                })
                return temp
            }
            else {
                return child
            }
        })

        return (data)
    }

    render() {

        const {
            style,
            size,
            direction
        } = this.props

        return (
            <div className="cbd-steps-wrapper" style={style} >
                <div className={`cbd-steps ${size ? size : ''} ${direction ? direction : ''}`} >
                    {this.renderStep()}
                </div>
            </div>
        );
    }
}

class Step extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }
    render() {

        const {
            icon,
            stepNum,
            title,
            description,
            name,
        } = this.props

        return (
            <div className={`cbd-steps-item ${name}`} >
                <div className="cbd-steps-item-tail" />

                <div className="cbd-steps-item-icon" >
                    <span className={`cbd-steps-icon ${icon ? icon.type : ''}`} >
                        {icon || name === 'finish' ? '' : stepNum + 1}
                    </span>
                </div>

                <div className="cbd-steps-item-content" >
                    <div className="cbd-steps-item-content-title" >
                        {title}
                    </div>
                    <div className="cbd-steps-item-content-description" >
                        {description}
                    </div>
                </div>
            </div>
        );
    }
}

Steps.Step = Step
export default Steps


