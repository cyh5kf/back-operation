import React from 'react';
import {Row, Col, Table, Input, Button, Checkbox, Radio, Select, QueueAnim} from 'antd';
import classNames from 'classnames';

import BasicInformation from '../../BasicInformation/BasicInformation';
import ScreenShot from './ScreenShot';
import PublishModal from './PublishModal';
import Video from './Video';
import OperateTd from './OperateTd';
import {AjaxUtil,CheckToken} from '../../auth'
import './index.less';

const RadioGroup = Radio.Group;
export default class reviewReport extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            tableShow: true,
            value: '',
            focus: false,
            tableData: [{
                key: 1,
                index: '1',
                pixyId: '3215987',
                reportTime: '2016-05-22 9:05',
                video: 'asdasd',
                operateType: 'operate',
            }],
            totalReports: 0,
            handleReports: 0
        };
        this.originalData = null;
        this.remark = ['Sexy Performance', 'Illegal Profile Photo', 'Broadcast drugs or smoking', 'Broadcast gamble', 'Broadcast terrorism or violance', 'Broadcast other illegal content'];
    }
    componentWillMount () {
        this.ajaxQueryReport(1);
    }

    ajaxQueryReport (size) {
        AjaxUtil.queryreport(this.handleQueryReport.bind(this), size);
    }

    ajaxCommitReport (data) {
        AjaxUtil.commitreport(this.handleCommitReport.bind(this), this.handleCommitReportError.bind(this), data);
    }

    handleQueryReport (data) {
        console.log(data);
        this.originalData = data;
        var tableData = [];
        var totalReports = 0;
        var handleReports = 0;
        for (let i=0, len=data.length; i<len; i++) {
            totalReports = data[i].total_reports;
            handleReports = data[i].handle_reports;
            var date = new Date(parseInt(data[i].created));
            const Y = date.getFullYear() + '-';
            const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
            const d = (date.getDate() < 10 ? '0' + date.getDate() : + date.getDate()) + ' ';
            const h = date.getHours() < 10 ? '0' + date.getHours() + ':' : date.getHours() + ':';
            const m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
            const time = Y + M + d + h + m;
            tableData.push({
                key: i + 1,
                index: i + 1,
                pixyId: data[i].user_id,
                reportTime: time,
                videoId: 'video_' + i,
                videoUrl: data[i].url,
                remarkRadioValue: 0,
            })
        }
        this.setState({
            tableData: tableData,
            tableShow: true,
            totalReports: totalReports,
            handleReports: handleReports
        })
    }

    handleCommitReport () {
        console.log('handleCommitReport');
        const self = this;
        setTimeout(function () {
            self.ajaxQueryReport(1);
        }, 1000)
    }

    handleCommitReportError(e) {
        if (e.status===401) {
            CheckToken.check();
        }
    }

    remarkRadioChange (index, e) {
        this.state.tableData[index].remarkRadioValue = e.target.value;
        this.setState({
            tableData: this.state.tableData,
        });
    }

    handlePunish (rowIndex) {
        const reason = this.remark[this.state.tableData[rowIndex].remarkRadioValue];
        const report_id = this.originalData[rowIndex].report_id;
        const user_id = this.originalData[rowIndex].user_id;
        const channel_id = this.originalData[rowIndex].channel_id;
        const operator_id = this.originalData[rowIndex].operator_id;
        const audit_result = 255;
        const ajaxData = {
            report_id: report_id,
            user_id: user_id,
            channel_id: channel_id,
            reason: reason,
            operator_id: operator_id,
            audit_result: audit_result,
            ban_method : 0
        };
        this.ajaxCommitReport(ajaxData);
        //this.ajaxQueryReport(1);
        this.setState({
            tableShow: false
        });
    }

    handleIgnore (rowIndex) {
        const reason = this.remark[this.state.tableData[rowIndex].remarkRadioValue];
        const report_id = this.originalData[rowIndex].report_id;
        const user_id = this.originalData[rowIndex].user_id;
        const channel_id = this.originalData[rowIndex].channel_id;
        const operator_id = this.originalData[rowIndex].operator_id;
        const audit_result = 0;
        const ajaxData = {
            report_id: report_id,
            user_id: user_id,
            channel_id: channel_id,
            reason: reason,
            operator_id: operator_id,
            audit_result: audit_result
        };
        this.ajaxCommitReport(ajaxData);
        this.setState({
            tableShow: false
        });
    }

    render () {

        var columns = [{
            title: '#',
            dataIndex: 'index',
            key: 'index'
        },{
            title: 'PIXY ID',
            dataIndex: 'pixyId',
            key: 'pixyId'
        },{
            title: 'Report Time',
            dataIndex: 'reportTime',
            key: 'reportTime'
        },{
            title: 'Video',
            dataIndex: 'video',
            key: 'video',
            render: (text, record) => (
                <div className="f-hcenter">
                    <Video dataSetup={record}></Video>
                </div>
            )
        }, {
            title: 'Remark',
            dataIndex: 'remark',
            key: 'remark',
            render: (text, record, index) => {
                const radioStyle = {
                    display: 'block',
                    height: '30px',
                    lineHeight: '30px',
                };
                const radioContent = this.remark.map((data, index) => (
                    <Radio style={radioStyle} key={index} value={index}>{data}</Radio>
                ));

                return (
                    <div className="f-hcenter">
                        <RadioGroup onChange={this.remarkRadioChange.bind(this, index)} value={this.state.tableData[index].remarkRadioValue} style={{textAlign: 'left', fontSize: 14}}>
                            {radioContent}
                        </RadioGroup>
                    </div>
                )
            }
        },{
            title: 'Operation',
            dataIndex: 'operation',
            key: 'operation',
            render: (text, record, index) => (
                <OperateTd handlePunish={this.handlePunish.bind(this, index)} handleIgnore={this.handleIgnore.bind(this, index)}></OperateTd>
            )
        }];
        //<Col className="per-page f-vcenter">
        //    <span className="text">Report per page: </span>
        //    <Select className="sel" defaultValue="50" onChange={this.handleChange}>
        //        <Option value="50">50</Option>
        //        <Option value="100">100</Option>
        //        <Option value="200">200</Option>
        //    </Select>
        //</Col>
        const tableContent = this.state.tableShow ?
            <Table key="t1" className="m-report-table" columns={columns} dataSource={this.state.tableData} pagination={false}></Table> : null;
        return(
            <div className="m-review-report">
                <Row className="m-report-handle" type="flex" justify="start">
                    <Col className="f-vcenter f-hcenter c1">
                        <span className="text">Handled: </span>
                    </Col>
                    <Col className="f-vcenter f-hcenter c2">
                        <span>{this.state.handleReports + ' / ' + this.state.totalReports}</span>
                    </Col>
                </Row>
                <QueueAnim className="demo-content"
                           type={['right', 'left']}
                           ease={['easeOutQuart', 'easeInOutQuart']}
                           duration={2000}>
                    {tableContent}
                </QueueAnim>
            </div>
        )
    }
}