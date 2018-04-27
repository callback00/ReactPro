import React from 'react';

export default {
    getTabIndex(activeKey, tabPanes) {

        let index = 0
        React.Children.forEach(tabPanes, (child, i) => {
            if (child.key === activeKey) {
                index = i
            }
        });
        return index;
    },

    getClientWH(node, tabBarPosition) {
        var prop = 'clientWidth';
        if (tabBarPosition === 'left' || tabBarPosition === 'right') {
            prop = 'clientHeight';
        }
        return node[prop];
    },

    // 判断浏览器是否支持Transform,主要是判断是否为ie浏览器
    isTransformSupported(){
        // ie11 和 edge 不是MSIE
        if (window.navigator.userAgent.indexOf("MSIE") > -1) {
            return false
        }else{
            return true
        }
    }
}