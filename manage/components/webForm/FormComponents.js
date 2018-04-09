import React from 'react'
import Input from '../cbDesign/dataEntry/input/Input'
import InputSearch from '../cbDesign/dataEntry/input/InputSearch'
import TextArea from '../cbDesign/dataEntry/input/TextArea'
import InputGroup from '../cbDesign/dataEntry/input/InputGroup'
import TableReport from '../cbDesign/tables/TableReport'
import Select from '../cbDesign/select/Select'

const Option = Select.Option

import TableReportData from '../../public/data/TableReportData.json'
import TableReportColumn from '../../public/data/TableReportColumn.json'
import InputGroupData from '../../public/data/InputGroupData.json'

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
                <InputGroup data={InputGroupData} style={{ fontSize: '16px', marginTop: '10px' }} onChange={this.textChange.bind(this)} placeholder="请输入姓名" />
                <Select style={{ marginTop: '10px' }} >
                    <Option value='test' >代理</Option>
                    <Option value='test2' >测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试</Option>
                </Select>
                <TableReport data={TableReportData} columns={TableReportColumn} style={{ marginTop: '10px' }} />
            </div>
        )
    }
}

export default FormComponents