/**
 * Created by zhengyingya on 16/7/1.
 */

import React from 'react';
import { Row, Col, Table } from 'antd';
import { AjaxUtil } from '../auth';
import TagSelect from '../../components/Common/TagSelect';
import './index.less';

export default class TotalUserNumber extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            totalUser: '',
            tableData: [],
            selValue: 'country',
            allData: {},
        }
    }

    ajaxOnlineGetTotalUser () {
        AjaxUtil.getTotalUser(this.handleAjaxOnlineGetTotalUser.bind(this));
    }

    handleAjaxOnlineGetTotalUser (data) {
        var allData = {};

        const regionUserList = data.regionUserList;
        var tableData = [];
        for (let i=0, len=regionUserList.length; i<len; i++) {
            tableData.push({
                serial: i+1,
                country: regionUserList[i].name,
                total: regionUserList[i].value
            })
        }
        allData.country = tableData;

        const devTypeUserList = data.devTypeUserList;
        var tableData = [];
        for (let i=0, len=devTypeUserList.length; i<len; i++) {
            tableData.push({
                serial: i+1,
                deviceType: devTypeUserList[i].name == 0 ? 'iOS' : 'Android',
                total: devTypeUserList[i].value
            })
        }
        allData.deviceType = tableData;

        this.setState({
            totalUser: data.totalUserCount,
            tableData: allData.country,
            allData
        })
    }

    componentWillMount () {
        this.ajaxOnlineGetTotalUser();
    }

    onSelect (value) {

        this.setState({
            selValue: value,
            tableData: this.state.allData[value]
        })
    }

    render () {
        if (this.state.selValue == 'country') {
            var columns = [{
                title: 'Serial number',
                dataIndex: 'serial',
                key: 'serial',
                width: '30%'
            },  {
                title: 'Country',
                dataIndex: 'country',
                key: 'country',
                width: '40%'
            },  {
                title: 'Total',
                dataIndex: 'total',
                key: 'total',
                width: '30%',
                sorter: (a, b) => a.total - b.total
            }];
        }
        else {
            var columns = [{
                title: 'Serial number',
                dataIndex: 'serial',
                key: 'serial',
                width: '30%'
            },  {
                title: 'Device Type',
                dataIndex: 'deviceType',
                key: 'deviceType',
                width: '40%'
            },  {
                title: 'Total',
                dataIndex: 'total',
                key: 'total',
                width: '30%',
                sorter: (a, b) => a.total - b.total
            }];
        }


        const optionsContent = [
            <Option key="1" value="country">Country</Option>,
            <Option key="2" value="deviceType">Device Type</Option>
        ]
        return (
            <div>
                <Row className="m-total-user" type="flex" justify="start">
                    <Col className="tag1">
                        <Row type="flex" justify="start">
                            <Col className="f-vcenter f-hcenter c1">
                                <span className="text">Total User</span>
                            </Col>
                            <Col className="f-vcenter f-hcenter c2">
                                <span>{this.state.totalUser}</span>
                            </Col>
                        </Row>
                    </Col>
                    <Col style={{width: 20}}></Col>
                    <Col>
                        <TagSelect tag="Type" value={this.state.selValue} options={optionsContent} onSelect={this.onSelect.bind(this)} style={{selectWidth: '120px'}}></TagSelect>
                    </Col>
                </Row>
                <Row className="info" type="flex" justify="start">
                    <Col span="24">
                        <Table columns={columns} dataSource={this.state.tableData} size="middle" className="tableStyle" pagination={false} />
                    </Col>
                </Row>
            </div>
        )
    }
}
