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
    isTransformSupported() {
        // ie11 和 edge 不是MSIE
        if (window.navigator.userAgent.indexOf("MSIE") > -1) {
            return false
        } else {
            return true
        }
    },

    getOffsetStyle(offset, tabBarPosition) {
        const transformSupported = this.isTransformSupported()
        let navOffsetStyle = {}
        if (tabBarPosition === 'left' || tabBarPosition === 'right') {
            if (transformSupported) {
                navOffsetStyle = {
                    name: 'transform',
                    value: `translate3d(0,${offset}px,0)`,
                };
            } else {
                navOffsetStyle = {
                    name: 'top',
                    value: `${offset}px`,
                };
            }
        } else {
            if (transformSupported) {
                navOffsetStyle = {
                    name: 'transform',
                    value: `translate3d(${offset}px,0,0)`,
                };
            } else {
                navOffsetStyle = {
                    name: 'left',
                    value: `${offset}px`,
                };
            }
        }

        return navOffsetStyle
    },

    getElOffsetLT(el, tabBarPosition) {

        let position = 'left'
        if (tabBarPosition === 'right' || tabBarPosition === 'left') {
            position = 'top'
        }

        const webOffset = el.getBoundingClientRect()[position]

        return webOffset
    }
}