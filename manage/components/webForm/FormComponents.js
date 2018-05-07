import React from 'react'
import { Grid, Row, Col } from 'react-flexbox-grid';

import './style/FormComponents.scss'

import Input from '../cbDesign/dataEntry/input/Input'
import InputSearch from '../cbDesign/dataEntry/input/InputSearch'
import TextArea from '../cbDesign/dataEntry/input/TextArea'
import InputGroup from '../cbDesign/dataEntry/input/InputGroup'
import TableReport from '../cbDesign/tables/TableReport'
import Select from '../cbDesign/select/Select'
import Checkbox from '../cbDesign/checkbox/Checkbox'
import Steps from '../cbDesign/steps/Steps'
import Slider from '../cbDesign/slider/Slider'
import Rate from '../cbDesign/rate/Rate'
import Switch from '../cbDesign/switch/Switch'
import Radio from '../cbDesign/radio/Radio'
import CircleProgress from '../cbDesign/progress/CircleProgress'
import Tabs from '../cbDesign/tabs/Tabs'
import FormTest from './FormTest'

// import Calendar from 'rc-calendar';
// import 'rc-calendar/assets/index.css';

const Option = Select.Option
const Step = Steps.Step

const RadioGroup = Radio.RadioGroup
const RadioButton = Radio.RadioButton

const TabPane = Tabs.TabPane
const TabBar = Tabs.TabBar
const TabContent = Tabs.TabContent

import TableReportData from '../../public/data/TableReportData.json'
import TableReportColumn from '../../public/data/TableReportColumn.json'
import InputGroupData from '../../public/data/InputGroupData.json'

class FormComponents extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            flag: true,
            currentStep: 1,
            percent: 0,
            tabActiveKey: '3',
            tabBarPosition: 'top'
        }
    }

    textChange(value) {
        console.log(value)
    }

    progressAdd() {
        let percent = this.state.percent === 100 ? 100 : this.state.percent + 10
        this.setState({
            percent
        })
    }

    progressSub() {
        let percent = this.state.percent === 0 ? 0 : this.state.percent - 10
        this.setState({
            percent
        })
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
                <div className="example">
                    <Input style={{ fontSize: '16px' }} defaultValue="我是谁" onChange={this.textChange.bind(this)} placeholder="请输入姓名" />

                    <TextArea style={{ fontSize: '16px', marginTop: '10px' }} rows={6} onChange={this.textChange.bind(this)} placeholder="请输入姓名" />

                    <InputSearch style={{ fontSize: '18px', marginTop: '10px' }} onChange={this.textChange.bind(this)} placeholder="请输入姓名" />
                    <InputGroup data={InputGroupData} style={{ fontSize: '16px', marginTop: '10px' }} onChange={this.textChange.bind(this)} placeholder="请输入姓名" />
                </div>

                <div className="example">
                    <Select showSearch placeholder="请输入代码">
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

                    <Select onChange={(e) => { console.log('回调数据', e) }} placeholder="请输入代码" >
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

                </div>

                <div className="example">
                    <TableReport className="tes" data={TableReportData} columns={TableReportColumn} style={{ marginTop: '10px' }} />
                </div>

                <div className="example">
                    <Checkbox defaultChecked onChange={(e) => { console.log(e) }} value="123456">代理</Checkbox>
                    <Checkbox disabled defaultChecked onChange={(e) => { console.log(e) }} value="123456">苹果</Checkbox>
                </div>

                <div className="example">
                    <button style={{ marginBottom: '20px' }} onClick={this.onClick.bind(this)} type="button">改变两个步骤</button>
                    <Steps current={this.state.currentStep} direction="vertical" size="small" style={{ marginBottom: '30px' }} >
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
                </div>

                <div className="example">
                    <Slider min={1} step={1} max={100} defaultValue={10} onChange={(value) => { console.log('第一个值', value) }} style={{ marginLeft: '20px', marginTop: '30px' }} />
                    <Slider min={1} step={1} max={10} defaultValue={5} onChange={(value) => { console.log('第二个值', value) }} style={{ marginLeft: '20px', marginTop: '30px' }} />
                </div>
                <div className="example">
                    <Rate character='☻' disabled allowHalf={true} defaultValue={1} />
                    <Rate character='☻' allowHalf={true} style={{ fontSize: '20px' }} />
                    <Rate character='☻' allowHalf={true} />
                    <Rate character='★' count={6} />
                </div>

                <div className="example">
                    <div style={{ marginTop: '15px', marginBottom: '15px' }} >
                        <Switch onChange={(value) => { console.log('Switch:', value) }} checkedText={'开'} unCheckedText={'关'} />
                    </div>

                    <div style={{ marginTop: '15px', marginBottom: '15px' }}>
                        <Switch onChange={(value) => { console.log('Switch:', value) }} checkedText={'超长文字开'} unCheckedText={'超长文字关'} />
                    </div>
                </div>

                <div className="example">
                    <div style={{ marginTop: '15px', marginBottom: '15px' }}>
                        <Radio>测试</Radio>
                    </div>

                    <div style={{ marginTop: '15px', marginBottom: '15px' }}>
                        <RadioGroup onChange={(value) => { console.log('RadioGroup返回值', value) }} >
                            <Radio value={'1'} >A</Radio>
                            <Radio value={'2'} >B</Radio>
                            <Radio value={'3'} >C</Radio>
                        </RadioGroup>
                    </div>

                    <div style={{ marginTop: '15px', marginBottom: '15px' }}>
                        <RadioGroup defaultValue='4' onChange={(value) => { console.log('RadioGroup返回值', value) }} >
                            <RadioButton value={'1'} >南宁市</RadioButton>
                            <RadioButton value={'2'} >柳州市</RadioButton>
                            <RadioButton value={'3'} >梧州市</RadioButton>
                            <RadioButton value={'4'} >防城港</RadioButton>
                        </RadioGroup>
                    </div>
                </div>

                <div className="example">
                    <button onClick={(this.progressAdd.bind(this))} style={{ height: '25px', width: '40px', marginRight: '10px' }} >+</button>
                    <button onClick={this.progressSub.bind(this)} style={{ height: '25px', width: '40px' }}>-</button>
                    <CircleProgress percent={this.state.percent} />

                    <CircleProgress borderWidth={50} style={{ fontSize: '30px' }} percent={this.state.percent} />
                </div>

                <div className="example">
                    <div style={{ marginBottom: '20px' }} >
                        <button onClick={() => { this.setState({ tabActiveKey: '9' }) }} style={{ height: '25px', width: 'auto', verticalAlign: 'middle' }}>跳转到最后一个页签</button>

                        <button onClick={() => { this.setState({ tabBarPosition: 'top' }) }} style={{ height: '25px', width: 'auto', marginLeft: '20px' }}>top</button>
                        <button onClick={() => { this.setState({ tabBarPosition: 'left' }) }} style={{ height: '25px', width: 'auto', marginLeft: '20px' }}>left</button>
                    </div>

                    <Tabs
                        defaultActiveKey='3'
                        activeKey={this.state.tabActiveKey}
                        tabBarPosition={this.state.tabBarPosition}
                        style={{ height: '224px' }}
                        renderTabBar={() => <TabBar />}
                        renderTabContent={() => <TabContent />}
                        onTabClick={(activeKey) => { this.setState({ tabActiveKey: activeKey }) }}
                    >
                        <TabPane tab='选项卡一' key='1' >
                            <RadioGroup defaultValue='4' onChange={(value) => { console.log('RadioGroup返回值', value) }} >
                                <RadioButton value={'1'} >南宁市</RadioButton>
                                <RadioButton value={'2'} >柳州市</RadioButton>
                                <RadioButton value={'3'} >梧州市</RadioButton>
                                <RadioButton value={'4'} >防城港</RadioButton>
                            </RadioGroup>
                        </TabPane>

                        <TabPane tab='选项卡二' key='2' >
                            <TableReport className="tes" data={TableReportData} columns={TableReportColumn} style={{ marginTop: '10px' }} />
                        </TabPane>

                        <TabPane tab='选三' key='3' >
                            <Steps current={this.state.currentStep} direction="vertical" size="small" style={{ marginBottom: '30px' }} >
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
                        </TabPane>

                        <TabPane tab='选项卡四' key='4' disabled >content4</TabPane>
                        <TabPane tab='选项卡五' key='5' disabled >content5</TabPane>
                        <TabPane tab='选项卡六' key='6' disabled >content6</TabPane>
                        <TabPane tab='选项卡七' key='7' disabled >content7</TabPane>
                        <TabPane tab='选项卡八' key='8' disabled >content8</TabPane>
                        <TabPane tab='选项卡久' key='9' disabled >content9</TabPane>
                    </Tabs>
                </div>

                <div className="example" >
                    <FormTest />
                </div>

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