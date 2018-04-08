import React from 'react'
import Input from '../cbDesign/dataEntry/input/Input'
import InputSearch from '../cbDesign/dataEntry/input/InputSearch'
import TextArea from '../cbDesign/dataEntry/input/TextArea'
import InputGroup from '../cbDesign/dataEntry/input/InputGroupNew'
import TableReport from '../cbDesign/tables/TableReport'

import TableReportData from '../../public/data/TableReportData.json'
import TableReportColumn from '../../public/data/TableReportColumn.json'

//
class FormComponents extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    textChange(value) {
        console.log(value)
    }

    render() {
        return (
            <div className="test11">
                <Input style={{ fontSize: '16px' }} onChange={this.textChange.bind(this)} placeholder="请输入姓名" />

                <TextArea style={{ fontSize: '16px', marginTop: '10px' }} rows={6} onChange={this.textChange.bind(this)} placeholder="请输入姓名" />

                <InputSearch style={{ fontSize: '18px', marginTop: '10px' }} onChange={this.textChange.bind(this)} placeholder="请输入姓名" />
                <InputGroup style={{ fontSize: '16px', marginTop: '10px' }} onChange={this.textChange.bind(this)} placeholder="请输入姓名" />
                <TableReport data={TableReportData} columns={TableReportColumn} style={{ marginTop: '10px' }} />
            </div>
        )
    }
}

export default FormComponents