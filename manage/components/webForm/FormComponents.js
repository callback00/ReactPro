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
            flag: true
        }
    }

    textChange(value) {
        console.log(value)
    }

    onClick() {
        let flag = this.state.flag
        this.setState({
            flag: !flag
        })
    }

    render() {
        return (
            <div className="test11">

                <button onClick={this.onClick.bind(this)} type="button">Click Me!</button>
                <Input style={{ fontSize: '16px' }} onChange={this.textChange.bind(this)} placeholder="请输入姓名" />

                <TextArea style={{ fontSize: '16px', marginTop: '10px' }} rows={6} onChange={this.textChange.bind(this)} placeholder="请输入姓名" />

                <InputSearch style={{ fontSize: '18px', marginTop: '10px' }} onChange={this.textChange.bind(this)} placeholder="请输入姓名" />
                <InputGroup data={InputGroupData} style={{ fontSize: '16px', marginTop: '10px' }} onChange={this.textChange.bind(this)} placeholder="请输入姓名" />
                <Select showSearch style={{ marginTop: this.state.flag ? '10px' : '20px' }} >
                    <Option disabled value='test' >代理1</Option>
                    <Option value='test' >代理2</Option>
                    <Option value='test' >代理1</Option>
                    <Option value='test' >代理1</Option>
                    <Option value='test' >代理1</Option>
                    <Option value='test' >代理4</Option>
                    <Option value='test' >代理1</Option>
                    <Option value='test' >代理1</Option>
                    <Option value='test' >代理1</Option>
                    <Option value='test' >代理1</Option>
                    <Option value='test' >代理2</Option>
                    {/* <Option disabled value='test' >代理3</Option>
                    <Option value='test' >代理4</Option>
                    <Option value='test' >代理5</Option>
                    <Option value='test' >代理6</Option>
                    <Option value='test' >代理7</Option>
                    <Option value='test' >代理8</Option>
                    <Option value='test' >代理9</Option>
                    <Option value='test' >代理0</Option>
                    <Option value='test' >代理1</Option>
                    <Option value='test' >代理2</Option>
                    <Option value='test' >代理3</Option> */}
                </Select>

                <TableReport data={this.state.flag ? TableReportData : []} columns={TableReportColumn} style={{ marginTop: '10px' }} />
            </div>
        )
    }
}

export default FormComponents