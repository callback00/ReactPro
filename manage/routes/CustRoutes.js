import React, { Component } from 'react'
import { Route, Switch, withRouter } from 'react-router-dom'


import BasicLayout from '../layouts/BasicLayout'
import FormComponents from '../components/webForm/FormComponents'
import WebWorker from '../components/webWorkers/WebWorker'
import Simple from '../components/echartsTest/testOne/Simple'

class CustRoutes extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    componentWillMount() {
    }

    render() {
        return (
            <div>
                <Switch>
                    <Route path="/Simple" component={Simple} routeComponent={this} />
                    <Route path="/Webform" component={FormComponents} routeComponent={this} />
                    <Route path="/WebWorker" component={WebWorker} routeComponent={this} />

                    {/* 这个路由必须放在最后面 */}
                    <Route path="/" component={BasicLayout} routeComponent={this} />
                </Switch>
            </div>
        )
    }
}

CustRoutes = withRouter(CustRoutes)

export default CustRoutes
