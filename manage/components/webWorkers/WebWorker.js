import React from 'react'

class WebWorker extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            num: 0
        }

        let w
    }

    startWorker() {
        if (typeof (Worker) !== "undefined") {
            if (typeof (this.w) == "undefined") {
                this.w = new Worker('./js/Worker.js')
            }

            const that = this
            this.w.onmessage = function (event) {
                const num = event.data;

                that.setState({
                    num
                })
            };
        } else {
            document.getElementById("result").innerHTML = "抱歉，你的浏览器不支持 Web Workers...";
        }
    }
    stopWorker() {
        this.w.terminate();
        this.w = undefined;
    }

    render() {
        return (
            <div >
                <p>
                    计数： <output>{this.state.num}</output>
                </p>
                <button onClick={this.startWorker.bind(this)}>开始工作</button>
                <button onClick={this.stopWorker.bind(this)}>停止工作</button>
            </div>
        )
    }
}

export default WebWorker