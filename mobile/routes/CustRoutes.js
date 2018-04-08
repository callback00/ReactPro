import React, { Component } from 'react'
import { Route, Switch, withRouter } from 'react-router-dom'

import MainScss from '../layouts/style/Main.scss'

import BasicLayout from '../layouts/BasicLayout'
import Resume from '../components/personal/Resume'


class Routes extends Component {
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
                    <Route path="/Resume" component={Resume} routeComponent={this} />
                    {/* 这个路由必须放在最后面 */}
                    <Route path="/" component={BasicLayout} routeComponent={this} />
                </Switch>
            </div>
        )
    }
}

Routes = withRouter(Routes)

export default Routes
