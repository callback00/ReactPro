import React from 'react'
import ReactDOM from 'react-dom'
import vConsole from 'vconsole'  // 手机端调试，生产环境注释掉
import { BrowserRouter as Router } from 'react-router-dom'

import Routes from './routes/CustRoutes'


function isWeixinOrAlipay() {
  const ua = window.navigator.userAgent

  // 微信
  if (ua.indexOf('MicroMessenger') !== -1) {
    return 'WeiXin';
  }

  // 支付宝
  if (ua.indexOf('AlipayClient') !== -1) {
    return 'Alipay';
  }
  // 哪个都不是
  return 'other';
}

const client = isWeixinOrAlipay()

const render = (Component) => {
  ReactDOM.render(
    <Router basename="/">
      <Component client={client} />
    </Router>,
    document.getElementById('app-mount')
  )
}

render(Routes)

// 热加载更新
if (module.hot) {
  module.hot.accept();
}
