import React from 'react'
import Style from './style/BasicLayout.scss'

class BasicLayout extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            k: 0,
            y: 0
        }
    }

    componentDidMount() {
        window.onerror = (msg, url, line, col, error) => {
            console.log(msg)
            console.log(url)
            console.log(line)
            console.log(col)
            console.log(error)
        }
    }

    btnClick() {
        let k = this.state.k
        k++

        this.setState({
            k,
            y: 1
        })

        document.getElementsByClassName("test1")[0].style.background = "black"
    }

    render() {
        return (
            <div className="test1" style={{ background: this.state.k % 2 === 0 ? 'red' : 'green' }} onClick={this.btnClick.bind(this)} >
                I am the BasicLayout 1111111111
                <div style={{ background: this.state.y % 2 === 0 ? 'red' : 'green' }} className="test2">I am the BasicLayout</div>
            </div>
        )
    }
}

export default BasicLayout