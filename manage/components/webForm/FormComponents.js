import React from 'react'
import { Grid, Row, Col } from 'react-flexbox-grid';

import Input from '../cbDesign/dataEntry/input/Input'
import InputSearch from '../cbDesign/dataEntry/input/InputSearch'
import TextArea from '../cbDesign/dataEntry/input/TextArea'
import InputGroup from '../cbDesign/dataEntry/input/InputGroup'
import TableReport from '../cbDesign/tables/TableReport'
import Select from '../cbDesign/select/Select'
import Checkbox from '../cbDesign/checkbox/Checkbox'
import Steps from '../cbDesign/steps/Steps'
import Slider from '../cbDesign/slider/Slider'

// import Calendar from 'rc-calendar';
// import 'rc-calendar/assets/index.css';

const Option = Select.Option
const Step = Steps.Step

import TableReportData from '../../public/data/TableReportData.json'
import TableReportColumn from '../../public/data/TableReportColumn.json'
import InputGroupData from '../../public/data/InputGroupData.json'

//
class FormComponents extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            flag: true,
            currentStep: 0
        }
    }

    textChange(value) {
        console.log(value)
    }

    onClick() {
        let flag = this.state.flag

        let currentStep = this.state.currentStep
        if (currentStep > 2) {
            currentStep = 0
        } else {
            currentStep++
        }
        this.setState({
            flag: !flag,
            currentStep
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
                <Select showSearch placeholder="请输入代码" style={{ marginTop: this.state.flag ? '10px' : '20px' }} >
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
                </Select>

                <Select onChange={(e) => { console.log('回调数据', e) }} placeholder="请输入代码" style={{ marginTop: this.state.flag ? '10px' : '20px' }} >
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
                </Select>

                <TableReport className="tes" data={TableReportData} columns={TableReportColumn} style={{ marginTop: '10px' }} />

                <Checkbox defaultChecked onChange={(e) => { console.log(e) }} value="123456">代理</Checkbox>
                <Checkbox disabled defaultChecked onChange={(e) => { console.log(e) }} value="123456">苹果</Checkbox>

                <Steps current={this.state.currentStep} direction="vertical" size="small" style={{ marginTop: '30px' }} >
                    <Step title="接单" description="等待商家接单中" />
                    <Step title="等待发货" description="等待卖家发货" />
                    <Step title="运输中" description="卖家已发货，第三方物流已开始发货卖家已发货，第三方物流已开始发货卖家已发货，第三方物流已开始发货卖家已发货，第三方物流已开始发货卖家已发货，第三方物流已开始发货卖家已发货，第三方物流已开始发货卖家已发货，第三方物流已开始发货卖家已发货，第三方物流已开始发货卖家已发货，第三方物流已开始发货" />
                    <Step title="收货" description="等待买家收货" />
                </Steps>

                <Steps current={this.state.currentStep} style={{ marginTop: '30px' }} >
                    <Step title="接单" description="等待商家接单中" />
                    <Step title="等待发货" description="等待卖家发货" />
                    <Step title="运输中" description="卖家已发货，第三方物流已开始发货卖家已发货，第三方物流已开始发货卖家已发货，第三方物流已开始发货卖家已发货，第三方物流已开始发货卖家已发货，第三方物流已开始发货卖家已发货，第三方物流已开始发货卖家已发货，第三方物流已开始发货卖家已发货，第三方物流已开始发货卖家已发货，第三方物流已开始发货" />
                    <Step title="收货" description="等待买家收货" />
                </Steps>

                <Slider min={1} step={0.01} max={10} defaultValue={1} style={{ marginLeft: '20px' }} />

                {/* <Grid className="cbd-grid" style={{ height: '200px', width: '100%' }} >
                    <Row>
                        <Col xs={12} sm={3} md={2} lg={1} >1</Col>
                        <Col xs={6} sm={6} md={8} lg={10} >2</Col>
                        <Col xs={6} sm={3} md={2} lg={1} >3</Col>
                    </Row>
                    <Row>
                        <Col md={12} >1</Col>
                        <Col md={6} >2</Col>
                        <Col md={2} >3</Col>
                        <Col md={6} >4</Col>
                    </Row>

                    <Row>
                        <Col xs xsOffset={11} style={{ background: 'rgb(0, 127, 255)' }} >1</Col>
                        <Col xs style={{ background: 'yellow' }} >2</Col>
                    </Row>
                    <Row between="xs" bottom="xs">
                        <Col xs={7} style={{ background: 'rgb(0, 127, 255)' }} > <Input style={{ fontSize: '16px', height: '8em' }} onChange={this.textChange.bind(this)} placeholder="请输入姓名" /></Col>
                        <Col xs={2} style={{ background: 'rgb(0, 127, 255)', height: '1em' }} >2</Col>
                        <Col xs={2} style={{ background: 'rgb(0, 127, 255)', height: '3em' }} >
                            <Row>
                                <Col xs={12} style={{ background: 'rgb(0, 127, 255)', height: '1em' }} >文字</Col>
                                <Col xs={6} style={{ background: 'rgb(0, 127, 255)', height: '1em' }} >内容</Col>
                            </Row>
                        </Col>
                    </Row>
                </Grid> */}

            </div>
        )
    }
}

export default FormComponents