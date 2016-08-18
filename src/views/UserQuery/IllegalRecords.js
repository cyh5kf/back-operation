import React from 'react'
import {Table, Row, Col, Button} from 'antd'
import {AjaxUtil} from '../auth'
import './index.less'
import DateQuery from './DateQuery'
import ViewMoreButton from './ViewMoreButton'
import Video from './Video'

export default class IllegalRecords extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            updateState: '',
            childUpdateState: false,
            tableData: [],
            startDate: '',
            endDate: '',
            pageNumber: 1,
            pageSize: 10
        //{
        //    key: '1',
        //        date: '2016-05-23 09:45',
        //    device: 'iPhone 5',
        //    deviceId: '1E2D3F7N',
        //    illegalReason: 'Sexy performance',
        //    numberOfReporters: '3',
        //    punitiveMeasures: 'Permanent',
        //}
        }
    }

    initTable () {
        this.state.pageNumber = 1;
        this.state.pageSize = 10;
        this.state.startDate = '';
        this.state.endDate = '';
        this.state.tableData = [];
    }

    ajaxQueryUserIllegal (data) {
        AjaxUtil.queryUserIllegal(this.handleQueryUserIllegalSuccess.bind(this), this.handleQueryUserIllegalError.bind(this), data);
    }

    handleQueryUserIllegalSuccess (data) {
        var tableData = this.state.tableData;
        for (let i=0, len=data.length; i<len; i++) {
            tableData.push({
                key: (this.state.pageNumber-1)*10 + i,
                date: data[i].date,
                device: data[i].device,
                deviceId: data[i].device_id,
                illegalReason: data[i].reason,
                numberOfReporters: data[i].reporters,
                punitiveMeasures: data[i].punitive_measure,
                illegalEvidence: data[i].evidence,
                purchaseStatus: data[i].status == 0 ? 'Success' : 'Failed',
            })
        }
        this.setState({
            tableData: tableData,
            childUpdateState: false
        })
    }

    handleQueryUserIllegalError () {
        this.setState({
            childUpdateState: false
        })
    }

    handleDateQuery (startDate, endDate) {
        this.initTable();
        this.state.startDate = startDate;
        this.state.endDate = endDate;
        var data = {
            "pageNumber": 1,
            "pageSize": 10,
            "searchText": ''+this.props.userPixyId,
            "searchTimeFrom": startDate,
            "searchTimeTo": endDate
        };
        this.ajaxQueryUserIllegal(data);
    }

    viewMoreClick () {
        this.state.pageNumber ++;
        var data = {
            "pageNumber": this.state.pageNumber,
            "pageSize": this.state.pageSize,
            "searchText": ''+this.props.userPixyId,
            "searchTimeFrom": this.state.startDate,
            "searchTimeTo": this.state.endDate
        };
        this.ajaxQueryUserIllegal(data);
        this.setState({
            childUpdateState: true
        })
    }

    render () {

        if (this.props.updateState !== this.state.updateState) {
            this.state.updateState = this.props.updateState;
            this.initTable();
            var data = {
                "pageNumber": this.state.pageNumber,
                "pageSize": this.state.pageSize,
                "searchText": ''+this.props.userPixyId,
                "searchTimeFrom": "",
                "searchTimeTo": ""
            };
            this.ajaxQueryUserIllegal(data);
        }

        const illegalColumns = [{
            title: 'Date',
            dataIndex: 'date',
            key: 'date'
        },  {
            title: 'Device',
            dataIndex: 'device',
            key: 'device'
        },  {
            title: 'Device ID',
            dataIndex: 'deviceId',
            key: 'deviceId'
        },  {
            title: 'Illegal Reason',
            dataIndex: 'illegalReason',
            key: 'illegalReason'
        },  {
            title: 'Number of Reporters',
            dataIndex: 'numberOfReporters',
            key: 'numberOfReporters'
        },  {
            title: 'Punitive Measures',
            dataIndex: 'punitiveMeasures',
            key: 'punitiveMeasures'
        },  {
            title: 'Illegal Evidence',
            render: (text, record, index) => (
                <Video videoId={index} videoUrl={record.illegalEvidence}></Video>
            )
        },  {
            title: 'Operation',
            render: () => (
                <span></span>
            )
        }];

        const tableData = this.state.tableData

        return (
            <div className="illegal-records">
                <DateQuery handleSearch={this.handleDateQuery.bind(this)}></DateQuery>
                <Row className="info" type="flex" justify="start">
                    <Col span="24">
                        <Table columns={illegalColumns} dataSource={tableData} size="middle" className="tableStyle" pagination={false} />
                    </Col>
                </Row>
                <ViewMoreButton viewMoreClick={this.viewMoreClick.bind(this)} updateState={this.state.childUpdateState}></ViewMoreButton>
            </div>
        )
    }
}
