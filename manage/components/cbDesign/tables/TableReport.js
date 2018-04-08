import React from 'react'
import Scss from './style/TableReport.scss'

const columns = [{
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    width: 100,
}, {
    title: 'Other',
    children: [{
        title: 'Age',
        dataIndex: 'age',
        key: 'age',
        width: 200,
    }, {
        title: 'Address',
        children: [{
            title: 'Street',
            dataIndex: 'street',
            key: 'street',
            width: 200,
        }, {
            title: 'Block',
            children: [{
                title: 'Building',
                dataIndex: 'building',
                key: 'building',
                width: 100,
            }, {
                title: 'Door No.',
                dataIndex: 'number',
                key: 'number',
                width: 100,
            }],
        }],
    }],
}, {
    title: 'Company',
    children: [{
        title: 'Company Address',
        dataIndex: 'companyAddress',
        key: 'companyAddress',
    }, {
        title: 'Company Name',
        dataIndex: 'companyName',
        key: 'companyName',
    }],
}, {
    title: 'Gender',
    dataIndex: 'gender',
    key: 'gender',
    width: 60,
}];

const data = [{
    name: 'daily',
    age: '28',
    street: '五一路',
    building: '维也纳酒店',
    doorno: '101',
    address: '五一路淡村市场',
    company: '了一家科技公司',
    gender: '男'
}, {
    name: 'daily',
    age: '28',
    street: '五二路',
    building: '维也纳酒店',
    doorno: '101',
    address: '五一路淡村市场',
    company: '了一家科技公司',
    gender: '男'
}, {
    name: 'daily',
    age: '28',
    street: '五三路',
    building: '维也纳酒店',
    doorno: '102',
    address: '五一路淡村市场',
    company: '了一家科技公司',
    gender: '男'
}, {
    name: 'lufi',
    age: '28',
    street: '五三路五三路五三路五三路五三路五三路五三路五三路五三路五三路五三路五三路五三路五三路五三路五三路五三路五三路五三路',
    building: '维也纳酒店',
    doorno: '102',
    address: '五一路淡村市场',
    company: '了一家科技公司',
    gender: '男'
}]

class TableReport extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            value: null,
        }

        this.theadArry = []
        this.tbody = null
    }

    componentWillMount() {
        const that = this
        columns.forEach(item => {

            if (!that.theadArry[0]) {
                that.theadArry[0] = []
            }

            that.theadArry[0].push(item)

            // 回调函数用于逆算父节点列函数
            that.treeAnalysis(1, item.children, item, (parent) => {
                if (parent.children && parent.children.length > 0) {
                    parent.children.forEach(temp => {
                        parent.colSpan = parent.colSpan ? parent.colSpan : 0
                        parent.colSpan = parent.colSpan + temp.colSpan
                    });
                } else {
                    parent.colSpan = 1
                }
            });
        });
    }

    componentDidMount() {
        // 处理合并单元格
        this.MergeCell(0, 0, 0)
    }

    ///合并表格相同行的内容  
    ///startRow：起始行，没有标题就从0开始  
    ///endRow：终止行，此参数是递归时检查的范围，一开始时会自动赋值为最后一行  
    ///col：当前处理的列  
    MergeCell(startRow, endRow, col) {
        let tb = this.tbody;
        if (col >= tb.rows[0].cells.length) {
            return;
        }
        //当检查第0列时检查所有行  
        if (col == 0 || endRow == 0) {
            endRow = tb.rows.length - 1;
        }
        for (let i = startRow; i < endRow; i++) {
            //程序是自左向右合并,如果第一列不同不合并
            if (tb.rows[startRow].cells[col].innerHTML == tb.rows[i + 1].cells[col].innerHTML && tb.rows[startRow].cells[0].innerHTML == tb.rows[i + 1].cells[0].innerHTML) {
                //如果相同则删除下一行的第0列单元格  
                tb.rows[i + 1].cells[col].style.display = 'none';
                //更新rowSpan属性  
                tb.rows[startRow].cells[col].rowSpan = (tb.rows[startRow].cells[col].rowSpan | 0) + 1;
                //当循环到终止行前一行并且起始行和终止行不相同时递归(因为上面的代码已经检查了i+1行，所以此处只到endRow-1)  
                if (i == endRow - 1 && startRow != endRow) {
                    this.MergeCell(startRow, endRow, col + 1);
                }
            } else {
                //起始行，终止行不变，检查下一列  
                this.MergeCell(startRow, i, col + 1);
                //增加起始行  
                startRow = i + 1;
            }
        }
    }

    treeAnalysis(nodeLayerIndex, children, parent, callback) {

        if (children) {
            children.forEach(item => {
                this.treeAnalysis(nodeLayerIndex + 1, item.children, item, (tempParent) => {

                    if (tempParent.children && tempParent.children.length > 0) {
                        tempParent.children.forEach(temp => {
                            tempParent.colSpan = tempParent.colSpan ? tempParent.colSpan : 0
                            tempParent.colSpan = tempParent.colSpan + temp.colSpan
                        });
                    } else {
                        tempParent.colSpan = 1
                    }

                    callback(parent)
                })

                if (!this.theadArry[nodeLayerIndex]) {
                    this.theadArry[nodeLayerIndex] = []
                }

                this.theadArry[nodeLayerIndex].push(item)
            });

        } else {
            parent.colSpan = 1
            return callback(parent)
        }
    }

    tbodyDataAnalysis() {

    }

    renderThead() {
        const theadArry = this.theadArry
        const head = theadArry.map((tr, i) => {
            return (
                <tr key={`${i}`} >
                    {
                        tr.map((item, k) => {
                            return (
                                <td key={`${i}-${k}`} colSpan={item.colSpan} rowSpan={item.children && item.children.length > 0 ? 1 : theadArry.length - i} >{item.title}</td>
                            )
                        })
                    }
                </tr>
            )
        })

        return (head)
    }

    renderTbody() {
        const rtnData = data.map((item, i) => {
            return (
                <tr key={i}>
                    {
                        this.renderTbodyTd(item)
                    }
                </tr>
            )
        })
        return (rtnData)
    }

    renderTbodyTd(item) {
        const tempArry = []
        for (const key in item) {
            tempArry.push({ key, value: item[key] })
        }

        const rtnData = tempArry.map((item, i) => {
            return (
                <td key={i}>{item.value}</td>
            )

        })
        return (rtnData)
    }

    render() {
        return (
            <div style={this.props.style} className="cbd-table-component" >
                <div className="cbd-table-title" >
                </div>
                <div className="cbd-table-content" >
                    <table>
                        <thead>
                            {this.renderThead()}

                        </thead>

                        <tbody ref={(el) => { this.tbody = el }} >
                            {this.renderTbody()}
                        </tbody>
                    </table>
                </div>
                <div className="cbd-table-footer" >
                </div>
            </div>
        )
    }
}

export default TableReport
