import React from 'react'
import lodash from 'lodash'

class TableReport extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            value: null,
        }

        // JS_MergeCell 里用到，但是这个方法已被替代
        this.tbody = null

        // 分析表头列用到
        this.theadArry = []

        // columns 的子叶数据,这里的数据与data的数据一一对应
        this.leafColumns = []

        let tempColumn = lodash.cloneDeep(props.columns)
        this.columns = tempColumn

        let tempData = lodash.cloneDeep(props.data)
        this.data = tempData
    }

    componentWillMount() {
        this.InitThead()
        this.InitData()
    }

    componentWillReceiveProps(nextProps) {
        let tempColumn = lodash.cloneDeep(nextProps.columns)
        this.columns = tempColumn

        let tempData = lodash.cloneDeep(nextProps.data)
        this.data = tempData

        this.InitData()
    }

    //初始化表头
    InitThead() {
        const theadArry = this.theadArry
        this.columns.forEach(item => {

            if (!theadArry[0]) {
                theadArry[0] = []
            }

            theadArry[0].push(item)

            // 回调函数用于逆算父节点列函数
            this.treeAnalysis(1, item.children, item, (parent) => {
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

    // 重新处理传入的数据
    InitData() {

        // 处理需要合并单元格的数据
        this.data.forEach(item => {
            item.td = []
            for (const key in item) {
                if (key !== 'td' && lodash.find(this.leafColumns, (tempKey) => { return tempKey === key })) {
                    item.td.push({ key, value: item[key], rowSpan: 1, visible: true })
                }

            }
        });

        for (let i = 0; i < this.leafColumns.length; i++) {
            this.Data_MergeCell(0, 1, i)
        }
    }

    componentDidMount() {
        // 用js合并单元格，会引起界面reflow, 在Data_MergeCell() 方法稳定后可以删除
        // this.JS_MergeCell(0, 0, 0)
    }

    ///合并表格相同行的内容  
    ///startRow：起始行，没有标题就从0开始  
    ///endRow：终止行，此参数是递归时检查的范围，一开始时会自动赋值为最后一行  
    ///col：当前处理的列  
    JS_MergeCell(startRow, endRow, col) {
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


    // 计算合并单元格，数据遍历时以td的内容为主
    Data_MergeCell(startRow, endRow, col) {
        let dataTemp = this.data;

        if (endRow > dataTemp.length - 1) {
            return
        }

        //程序是自左向右合并,如果第一列不同不合并
        if (dataTemp[startRow].td[col].value === dataTemp[endRow].td[col].value && dataTemp[startRow].td[0].value === dataTemp[endRow].td[0].value) {

            dataTemp[startRow].td[col].rowSpan = dataTemp[startRow].td[col].rowSpan + 1

            dataTemp[endRow].td[col].visible = false

            this.Data_MergeCell(startRow, endRow + 1, col)


        } else {
            startRow = endRow
            endRow = endRow + 1

            this.Data_MergeCell(startRow, endRow, col)
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

            // 记录叶子节点，用于处理data
            this.leafColumns.push(parent.key)

            return callback(parent)
        }
    }

    renderThead() {
        const theadArry = this.theadArry
        const head = theadArry.map((tr, i) => {
            return (
                <tr key={`${i}`} >
                    {
                        tr.map((item, k) => {
                            return (
                                <th key={`${i}-${k}`} colSpan={item.colSpan} rowSpan={item.children && item.children.length > 0 ? 1 : theadArry.length - i} >{item.title}</th>
                            )
                        })
                    }
                </tr>
            )
        })

        return (head)
    }

    renderTbody() {
        const rtnData = this.data.map((item, i) => {
            return (
                <tr key={i}>
                    {
                        item.td.map((td, n) => {
                            return (
                                <td key={n} rowSpan={td.rowSpan} style={{ display: td.visible ? 'table-cell' : 'none' }} >{td.value}</td>
                            )
                        })
                    }
                </tr>
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
