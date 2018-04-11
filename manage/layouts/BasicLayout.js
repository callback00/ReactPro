// import React from 'react'
// import Style from './style/BasicLayout.scss'

// class BasicLayout extends React.Component {
//     constructor(props) {
//         super(props)
//         this.state = {
//             k: 0,
//             y: 0
//         }
//     }

//     componentDidMount() {
//         window.onerror = (msg, url, line, col, error) => {
//             console.log(msg)
//             console.log(url)
//             console.log(line)
//             console.log(col)
//             console.log(error)
//         }
//     }

//     btnClick() {
//         let k = this.state.k
//         k++

//         this.setState({
//             k,
//             y: 1
//         })

//         document.getElementsByClassName("test1")[0].style.background = "black"
//     }

//     render() {
//         return (
//             <div className="test1" style={{ background: this.state.k % 2 === 0 ? 'red' : 'green' }} onClick={this.btnClick.bind(this)} >
//                 I am the BasicLayout 1111111111
//                 <div style={{ background: this.state.y % 2 === 0 ? 'red' : 'green' }} className="test2">I am the BasicLayout</div>
//             </div>
//         )
//     }
// }

// export default BasicLayout

import React from 'react';
import ReactDOM from 'react-dom';
import Trigger from 'rc-trigger';
// import 'rc-trigger/assets/index.css';
import assign from 'object-assign';

function getPopupAlign(state) {
    return {
        offset: [state.offsetX, state.offsetY],
        overflow: {
            adjustX: 1,
            adjustY: 1,
        },
    };
}

const builtinPlacements = {
    left: {
        points: ['cr', 'cl'],
    },
    right: {
        points: ['cl', 'cr'],
    },
    top: {
        points: ['bc', 'tc'],
    },
    bottom: {
        points: ['tc', 'bc'],
    },
    topLeft: {
        points: ['bl', 'tl'],
    },
    topRight: {
        points: ['br', 'tr'],
    },
    bottomRight: {
        points: ['tr', 'br'],
    },
    bottomLeft: {
        points: ['tl', 'bl'],
    },
};

function preventDefault(e) {
    e.preventDefault();
}

function getPopupContainer(trigger) {
    return trigger.parentNode;
}

class BasicLayout extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            mask: false,
            maskClosable: false,
            placement: 'right',
            trigger: {
                hover: 1,
            },
            offsetX: undefined,
            offsetY: undefined,
        };
    }

    onPlacementChange(e) {
        this.setState({
            placement: e.target.value,
        });
    }

    onTransitionChange(e) {
        this.setState({
            transitionName: e.target.checked ? e.target.value : '',
        });
    }

    onTriggerChange(e) {
        const trigger = assign({}, this.state.trigger);
        if (e.target.checked) {
            trigger[e.target.value] = 1;
        } else {
            delete trigger[e.target.value];
        }
        this.setState({
            trigger,
        });
    }

    onOffsetXChange(e) {
        const targetValue = e.target.value;
        this.setState({
            offsetX: targetValue || undefined,
        });
    }

    onOffsetYChange(e) {
        const targetValue = e.target.value;
        this.setState({
            offsetY: targetValue || undefined,
        });
    }

    onVisibleChange(visible) {
        console.log('tooltip', visible);
    }

    onMask(e) {
        this.setState({
            mask: e.target.checked,
        });
    }

    onMaskClosable(e) {
        this.setState({
            maskClosable: e.target.checked,
        });
    }

    destroy() {
        this.setState({
            destroyed: true,
        });
    }

    destroyPopupOnHide(e) {
        this.setState({
            destroyPopupOnHide: e.target.checked,
        });
    }

    render() {
        const state = this.state;
        const trigger = state.trigger;
        if (state.destroyed) {
            return null;
        }
        return (<div >
            <div style={{ margin: '10px 20px' }}>
                <label>
                    placement:
          <select value={state.placement} onChange={this.onPlacementChange.bind(this)}>
                        <option>right</option>
                        <option>left</option>
                        <option>top</option>
                        <option>bottom</option>
                        <option>topLeft</option>
                        <option>topRight</option>
                        <option>bottomRight</option>
                        <option>bottomLeft</option>
                    </select>
                </label>
                &nbsp;&nbsp;&nbsp;&nbsp;
        <label>
                    <input
                        value="rc-trigger-popup-zoom"
                        type="checkbox"
                        onChange={this.onTransitionChange.bind(this)}
                        checked={state.transitionName === 'rc-trigger-popup-zoom'}
                    />
                    transitionName
        </label>

                &nbsp;&nbsp;&nbsp;&nbsp;

                trigger:

        <label>
                    <input
                        value="hover"
                        checked={!!trigger.hover}
                        type="checkbox"
                        onChange={this.onTriggerChange.bind(this)}
                    />
                    hover
        </label>
                <label>
                    <input
                        value="focus"
                        checked={!!trigger.focus}
                        type="checkbox"
                        onChange={this.onTriggerChange.bind(this)}
                    />
                    focus
        </label>
                <label>
                    <input
                        value="click"
                        checked={!!trigger.click}
                        type="checkbox"
                        onChange={this.onTriggerChange.bind(this)}
                    />
                    click
        </label>
                <label>
                    <input
                        value="contextMenu"
                        checked={!!trigger.contextMenu}
                        type="checkbox"
                        onChange={this.onTriggerChange.bind(this)}
                    />
                    contextMenu
        </label>
                &nbsp;&nbsp;&nbsp;&nbsp;
        <label>
                    <input
                        checked={!!this.state.destroyPopupOnHide}
                        type="checkbox"
                        onChange={this.destroyPopupOnHide.bind(this)}
                    />
                    destroyPopupOnHide
        </label>

                &nbsp;&nbsp;&nbsp;&nbsp;
        <label>
                    <input
                        checked={!!this.state.mask}
                        type="checkbox"
                        onChange={this.onMask.bind(this)}
                    />
                    mask
        </label>

                &nbsp;&nbsp;&nbsp;&nbsp;
        <label>
                    <input
                        checked={!!this.state.maskClosable}
                        type="checkbox"
                        onChange={this.onMaskClosable.bind(this)}
                    />
                    maskClosable
        </label>

                <br />
                <label>
                    offsetX:
          <input
                        type="text"
                        onChange={this.onOffsetXChange.bind(this)}
                        style={{ width: 50 }}
                    />
                </label>
                &nbsp;&nbsp;&nbsp;&nbsp;
        <label>
                    offsetY:
          <input
                        type="text"
                        onChange={this.onOffsetYChange.bind(this)}
                        style={{ width: 50 }}
                    />
                </label>
                &nbsp;&nbsp;&nbsp;&nbsp;
        <button onClick={this.destroy.bind(this)}>destroy</button>
            </div>
            <div style={{ margin: 100, position: 'relative' }}>
                <Trigger
                    getPopupContainer={undefined && getPopupContainer}
                    // popupAlign={getPopupAlign(state)}
                    popupPlacement={state.placement}
                    // destroyPopupOnHide={this.state.destroyPopupOnHide}
                    // mask={this.state.mask}
                    // maskClosable={this.state.maskClosable}
                    action={Object.keys(state.trigger)}
                    builtinPlacements={builtinPlacements}
                    popup={
                        // <div style={{ border: '1px solid red', padding: 10, background: 'white' }}>
                        //     i am a popup
                        // </div>

                        <ul>
                            <li data-value={1} >测试</li>
                        </ul>
                    }
                    popupTransitionName={state.transitionName}
                >
                    <a href="#" style={{ margin: 20 }} onClick={preventDefault}>trigger</a>
                </Trigger>
            </div>
        </div>);
    }
}

export default BasicLayout