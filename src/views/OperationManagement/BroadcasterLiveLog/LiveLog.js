import React from 'react';
import { Row, Col, Input, Button, Dropdown, Menu, Icon, Select, Alert, Spin, message, Modal, DatePicker} from 'antd';
import enUS from 'antd/lib/date-picker/locale/en_US';
import {getDateFormat} from '../../../utils/CommonUtils';
import BasicInformation from '../../BasicInformation/BasicInformation';
import LiveLogTable from './LiveLogTable';
import SearchInput from '../../../components/Common/SearchInput';
import {AjaxUtil,CheckToken} from '../../auth';
import './index.less';
const RangePicker = DatePicker.RangePicker;

var MESSAGE_DEFAULT = 'You can search by pixy ID';
var MESSAGE_NO_USER = 'User does not exist, please check the ID';
var MESSAGE_NO_ID = 'Please enter the pixy ID';
export default class LiveLog extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            loading: false,
            queryLiveLogData: [],
            pagination: '',
            tableTotalCount: 0,
            pageNumber: 1,
            pageSize: 10,
            userInfo: '',
            message: MESSAGE_DEFAULT,
            alertType: 'info',
            totalTime: '',
            totalStar: '',
            startDate: '',
            endDate: ''

        };
    }

     errorModal (text) {
        Modal.error({
            title: 'Warning',
            content: text,
            okText:'OK'
        });
    }

    ajaxQueryLiveLog (data) {
        AjaxUtil.queryLiveLog(this.handleQueryLiveLogSuccess.bind(this), this.handleQueryLiveLogError.bind(this), data);
    }

    handleQueryLiveLogSuccess (data) {
        if(data.status === 207) {
            this.setState({
                    userInfo: null,
                    message: MESSAGE_DEFAULT,
                    loading: false,
                });
        } else {
            var userInfo = data.rows[0].userBasicInfo;
            var uid = userInfo.uid;
            if (!uid) {
                userInfo = null;
                this.setState({
                    message: MESSAGE_NO_USER
                });
            } else {
                this.setState({
                    userInfo: userInfo,
                    message: MESSAGE_DEFAULT
                });
            }
            
            var queryLiveLogData = [];
            var liveInfo = data.rows[0].liveInfo;
            for (let i=0, len=liveInfo.length; i<len; i++) {
                queryLiveLogData.push({
                    key: (this.state.pageNumber-1)*10 + i,
                    startTime: liveInfo[i].startTime,
                    endTime: liveInfo[i].endTime,
                    totalTime: liveInfo[i].totalTime,
                    totalStar: liveInfo[i].totalStar
                })
            }
            var tableTotalCount = data.totalCount;
            var totalTime = data.rows[0].totalTime;
            var totalStar = data.rows[0].totalStar;
            this.setState({
                queryLiveLogData: queryLiveLogData,
                tableTotalCount: tableTotalCount,
                loading: false,
                totalTime: totalTime,
                totalStar: totalStar
            })
        }
        
    }

    handleQueryLiveLogError (e) {
        if (e.status===401) {
            CheckToken.check();
        }
        this.setState({
            loading: false,
            userInfo: null,
            message: MESSAGE_NO_USER
        })
    }

        /**
     * 搜索人员
     * @param value
     */
    handleSearch(value) {
        var that = this;
        var searchInputValue = value ? value.trim() : "";
        if (!searchInputValue) {
            that.setState({
                userInfo: null,
                message: MESSAGE_NO_ID
            });
            return false;
        }
        var reg =  new RegExp("^[0-9]{8}$");
        if(!reg.test(searchInputValue)) {
            this.errorModal("Please enter the eight-digit！");
            return false;
        }
        that.setState({
            loading: true,
            searchText: searchInputValue
        });
        var data = {
            "pageNumber": 1,
            "pageSize": 10,
            "searchText": searchInputValue,
            "searchTimeFrom": that.state.startDate,
            "searchTimeTo": that.state.endDate
        };
        this.ajaxQueryLiveLog(data);
    }

    
        /**
     * 时间选择发生变换
     * @param timeRange
     */
    onChangeDatePicker(timeRange) {
        var startDate = timeRange[0];
        var endDate = timeRange[1];
        startDate = startDate ? "" + getDateFormat(startDate): null;

        if(endDate){
            endDate.setDate(endDate.getDate()+1);
        }
        endDate = endDate ? "" + getDateFormat(endDate): null;
        this.setState({
            startDate: startDate,
            endDate: endDate,
            loading: true,
            pageNumber: 1
        });

        var data = {
            "pageNumber": 1,
            "pageSize": this.state.pageSize,
            "searchText": this.state.searchText,
            "searchTimeFrom": startDate,
            "searchTimeTo": endDate
        };
        this.ajaxQueryLiveLog(data);
    }
        

    render () {
        var pagination = {
            total: this.state.tableTotalCount || 0,
            showSizeChanger: true,
            pageSize: this.state.pageSize,
            current: this.state.pageNumber,
            onShowSizeChange:function (current, pageSize) {
                this.state.pageNumber = current;
                this.state.pageSize = pageSize;
                var data = {
                    "pageNumber": this.state.pageNumber,
                    "pageSize": this.state.pageSize,
                    "searchText": this.state.searchText,
                    "searchTimeFrom": that.state.startDate,
                    "searchTimeTo": that.state.endDate
                };
                this.setState({loading: true});
                this.ajaxQueryLiveLog(data);
            }.bind(this),
            onChange:function(current) {
                this.state.pageNumber = current;
                var data = {
                    "pageNumber": this.state.pageNumber,
                    "pageSize": this.state.pageSize,
                    "searchText": this.state.searchText,
                    "searchTimeFrom": that.state.startDate,
                    "searchTimeTo": that.state.endDate
                };
                this.setState({loading: true});
                this.ajaxQueryLiveLog(data);
            }.bind(this)
        };
         
        var banTable = <LiveLogTable
                            queryLiveLogData={this.state.queryLiveLogData}
                            pagination={pagination}
                            ></LiveLogTable>

        var userInfo = this.state.userInfo;
        var that = this;
        var state = that.state;

        return(
            <Spin spining={state.loading} tip="loading...">
                <div className="m-signed-query">
                    <Row type="flex" justify="start">
                        <Col span="24" className="titleHead">
                            Broadcaster Live Log
                        </Col>
                    </Row>
                    <div style={{ height: 20 }}></div>
                    <Row type="flex" justify="start">
                        <Col span="20">
                            <div className="searchInput">
                                <SearchInput
                                    placeholder="Search by PIXY ID"
                                    onSearch={that.handleSearch.bind(that)} style={{ width:400 }} />
                            </div>
                        </Col>
                    </Row>
                    <div style={{ height: 20 }}></div>
                    <Row type="flex" justify="start">
                        <Col span="24">
                            <div>
                                {(!userInfo) ?
                                    (
                                        <div>
                                            <Alert message={state.message}
                                                    showIcon
                                                    type={state.alertType}
                                            />
                                        </div>
                                    ) :
                                    (
                                        <div>
                                            <BasicInformation userInfo={userInfo}></BasicInformation>
                                        </div>
                                    )
                                }
                            </div>
                        </Col>
                    </Row>
                    <Row className="searchDiv">
                        <Col>
                            <div className="searchTime">
                                CreateTime : &nbsp;&nbsp;&nbsp;
                                <RangePicker locale={{...enUS}} format="yyyy-MM-dd"
                                            style={{ width: 184 }}
                                            startPlaceholder='start date'
                                            endPlaceholder='end date'
                                            onOk={that.onChangeDatePicker.bind(this)}
                                            onChange={that.onChangeDatePicker.bind(this)}/>
                            </div>
                            <div className="searchData">
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                total Time : &nbsp;&nbsp;&nbsp;
                                <span className="timeNum">{state.totalTime}</span>
                            </div>
                            <div className="searchData">
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                total Stars : &nbsp;&nbsp;&nbsp;
                                <span className="timeNum">{state.totalStar}</span>
                            </div>
                        </Col>
                    </Row>
                    {banTable}
                </div>
            </Spin>
            
        )
    }
}