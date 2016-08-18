import React from 'react'
import {Table, Row, Col, Button, Radio, Input} from 'antd'
import BasicInformation from '../BasicInformation/BasicInformation';
import './index.less'

const RadioGroup = Radio.Group;

export default class ApplicationInfo extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
        };
        this.initTableColumns();
    }


    initTableColumns(){
        this.tableColumns = [{
            title: 'Date',
            dataIndex: 'applyTime',
            key: 'date'
        },  {
            title: 'Device',
            dataIndex: 'device',
            key: 'device'
        },  {
            title: 'Device ID',
            dataIndex: 'deviceID',
            key: 'deviceId'
        },  {
            title: 'Stars before Withdrawal',
            dataIndex: 'starsBeforeWithdrawal',
            key: 'StarsBeforeWithdrawal'
        },  {
            title: 'Earnings before Withdrawal',
            dataIndex: 'earningsBeforeWithdrawal',
            key: 'earningsBeforeWithdrawal'
        },  {
            title: 'Level before Withdrawal',
            dataIndex: 'levelBeforeWithdrawal',
            key: 'levelBeforeWithdrawal'
        },  {
            title: 'Withdrawal Limit',
            dataIndex: 'withdrawalLimit',
            key: 'withdrawalLimit'
        },  {
            title: 'Withdrawal Amount',
            dataIndex: 'withdrawalAmount',
            key: 'withdrawalAmount'
        },  {
            title: 'Stars Deduction',
            dataIndex: 'starsDeduction',
            key: 'starsDeduction'
        },  {
            title: 'Paypal Account',
            dataIndex: 'paypalAccount',
            key: 'paypalAccount'
        }];
    }



    onClickRecordOperation(operationType,record){
        this.props.onClickRecordOperation(operationType,record);
    }


    renderRecordDetails(record){

        ////-1:已取消,0:待审核,1:审核成功,2:审核失败,3:已到账,4:提现失败'

        var columns = this.tableColumns;
        var tableData = [record];
        var userInfo = record.userInfo || {};

        return (
            <div className="t-info-content">
                <Row className="r2" type="flex" justify="start">
                    <Col span="20">
                        <BasicInformation userInfo={userInfo}></BasicInformation>
                    </Col>
                    <Col span="4">

                    </Col>
                </Row>
                <Row className="r3" type="flex" justify="start">
                    <Col span="24">
                        <Table columns={columns} dataSource={tableData} size="middle" pagination={false}></Table>
                    </Col>
                </Row>
                <Row className="r6" type="flex" justify="start">
                    <div className="height10"></div>
                    {
                        record.handleStatus===0?(
                            <div>
                                <Button type="primary" onClick={this.onClickRecordOperation.bind(this,'reject',record)}>Reject</Button> &nbsp;
                                <Button type="primary" onClick={this.onClickRecordOperation.bind(this,'approve',record)}>Approve</Button>
                                <div className="height10"></div>
                            </div>
                        ):(null)
                    }
                </Row>
            </div>
        );
    }


    render () {

        var record = this.props.record || {};

        var renderRecordDetails = this.renderRecordDetails.bind(this);

        return (
            <div className="application-info">
                {renderRecordDetails(record)}
            </div>
        )
    }
}
