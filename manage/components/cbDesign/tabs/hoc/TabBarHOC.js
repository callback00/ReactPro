import React, { Component } from 'react'
import ClassNames from 'classnames'

export function TabBarHOC(WrappedComponent) {
    // ……返回另一个新组件……
    return class extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
            };

            this.tabBar = []
        }

        componentWillMount() {
            // ……注意订阅数据……
            console.log('HOC', 'hei you')

            const tabs = this.createTabs()

            this.tabBar = this.getRootNode(tabs)
        }

        createTabs() {

            const { panels, activeKey, prefixCls, className } = this.props;
            const rtn = [];

            React.Children.forEach(panels, (child, index) => {

                const cls = ClassNames({
                    [`${prefixCls}-tab`]: true,
                    ['active']: activeKey === child.key,
                    ['disabled']: !!child.props.disabled,
                    [className]: !!className,
                })

                const tab = (
                    <div className={cls} key={child.key} >
                        {/* TabPane内的tab参数 */}
                        {child.props.tab}
                    </div>
                )
                rtn.push(tab)
            })

            return rtn
        }

        getRootNode(contents) {
            const { prefixCls, className, style, tabBarPosition } = this.props

            const cls = ClassNames(`${prefixCls}-bar`, {
                [className]: !!className,
            })

            const topOrBottom = (tabBarPosition === 'top' || tabBarPosition === 'bottom');

            // const tabBarExtraContentStyle = topOrBottom ? { float: 'right' } : {};
            // const extraContentStyle = (extraContent && extraContent.props) ? extraContent.props.style : {};
            let children = contents;

            // if (extraContent) {
            //     children = [
            //         cloneElement(extraContent, {
            //             key: 'extra',
            //             style: {
            //                 ...tabBarExtraContentStyle,
            //                 ...extraContentStyle,
            //             },
            //         }),
            //         cloneElement(contents, { key: 'content' }),
            //     ];
            //     children = topOrBottom ? children : children.reverse();
            // }

            return (
                <div
                    role="tablist"
                    className={cls}
                    tabIndex="0"
                    style={style}
                >
                    {children}
                </div>
            );
        }

        render() {
            // ……使用最新的数据渲染组件
            // 注意此处将已有的props属性传递给原组件
            return <WrappedComponent tabs={this.tabBar} {...this.props} />;
        }
    };
}
