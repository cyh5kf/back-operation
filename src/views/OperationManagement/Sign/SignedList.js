import React from 'react'
import {Table, Row, Col, Button, Icon,Select} from 'antd'
import {AjaxUtil,CheckToken} from '../../auth'
import ViewMoreButton from './ViewMoreButton'
import {i18n} from '../../../utils/i18n'
import './index.less'

export default class SignedList extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            tableTotalCount:0,
            querySignedUserData: [],
            childUpdateState: false,

            queryCondition:{
                status:"2" ,
                pageNumber: 1,
                pageSize: 10
            }
        }
    }


    ajaxQuerySignedUser () {
        this.props.loading(true);

        var data = {
            "pageNumber": this.state.queryCondition.pageNumber,
            "pageSize": this.state.queryCondition.pageSize,
            "status":this.state.queryCondition.status,
            signed:-1,
            cert:-1
        };

        this.setState({
            queryCondition:{
                pageNumber: data.pageNumber,
                pageSize: data.pageSize,
                status:data.status
            },
            childUpdateState: true
        });
        AjaxUtil.querySignedUser(this.handleQuerySignedUserSuccess.bind(this), this.handleQuerySignedUserError.bind(this), data);
    }

    handleQuerySignedUserSuccess (data) {
        data = data|| {};
        var querySignedUserData = data.rows || [];
        querySignedUserData.forEach(function(d,i){
            d.key = i;
        });

        this.setState({
            tableTotalCount:data.totalCount || 0,
            querySignedUserData: querySignedUserData,
            childUpdateState: false
        });

        this.props.loading(false);
        console.log("querySignedUserData:",this.state.querySignedUserData);
    }

    handleQuerySignedUserError (e) {
        if (e.status===401) {
            CheckToken.check();
        }
        this.setState({
            childUpdateState: false
        });
        this.props.loading(false);
    }


    componentDidMount() {
        this.ajaxQuerySignedUser();
    }

    componentWillUpdate (nextProps, nextState){
        if(nextProps.isReloadTable ===true){
            this.props.finishReloadTableData();
            this.state.queryCondition.pageNumber = 1;
            this.ajaxQuerySignedUser();
        }
    }

    changeSelectBroadcasterState(a){
        this.state.queryCondition.pageNumber=1;
        this.state.queryCondition.status = a;
        this.ajaxQuerySignedUser();
    }

    //导出为excel
    exportAsExcel(){
        var condition = {
            condition:JSON.stringify(this.state.queryCondition)
        };
        AjaxUtil.exportAsExcelSignUser(condition);
    }


    render () {
        var that = this;
        const signedUserColumns = [{
            title: 'Avatar',
            dataIndex: 'avatar',
            key: 'avatar',
            render: (text, record, index) => {
                return (
                    <div>
                        <img className="small-avatar" src={record.avatar} />
                    </div>
                )
            }
        },  {
            title: 'PIXY ID',
            dataIndex: 'uid',
            key: 'uid'
        },  {
            title: 'Name',
            dataIndex: 'name',
            key: 'name'
        }, {
            title: 'Gender',
            dataIndex: 'gender',
            key: 'gender',
            render: (text, record, index) => {
                var gender = '';
                if(record.gender == 1) {
                    gender = 'female';
                } else if(record.gender == 2) {
                    gender = 'male';
                } else if(record.gender == 0) {
                    gender = 'Unspecified';
                }
                return (
                    <span>{gender}</span>
                )
            }
        },
            //{
            //    title: 'Signed',
            //    dataIndex: 'signed',
            //    key: 'signed',
            //    render:function(text){
            //        if(text==1){
            //            return (<Icon className="signedLabel" type="check-circle" />);
            //        }
            //        return (<div></div>)
            //    }
            //} ,
            //{
            //    title: 'Certified',
            //    dataIndex: 'cert',
            //    key: 'cert',
            //    render:function(text){
            //        if(text==1){
            //            return (<Icon className="signedLabel" type="check-circle" />);
            //        }
            //        return (<div></div>)
            //    }
            //},

            {
                title: 'Status',
                dataIndex: 'status',
                key: 'status'
            },
            {
            title: 'Email',
            dataIndex: 'email',
            key: 'email'
        },  {
            title: 'Diamonds',
            dataIndex: 'diamond_amount',
            key: 'diamond_amount'
        },  {
            title: 'Stars',
            dataIndex: 'star_amount',
            key: 'star_amount'
        },  {
            title: 'Followers',
            dataIndex: 'follower_count',
            key: 'follower_count'
        },  {
            title: 'Following',
            dataIndex: 'following_count',
            key: 'following_count'
        },  {
            title: 'Earnings',
            dataIndex: 'earnings',
            key: 'earnings'
        },  {
            title: 'Level',
            dataIndex: 'level',
            key: 'level'
        }];

        var pagination = {
            total: that.state.tableTotalCount || 0,
            showSizeChanger: true,
            pageSize: that.state.queryCondition.pageSize,
            onShowSizeChange(current, pageSize) {
                that.state.queryCondition.pageNumber=current;
                that.state.queryCondition.pageSize=pageSize;
                that.ajaxQuerySignedUser();
            },
            onChange(current) {
                that.state.queryCondition.pageNumber=current;
                that.ajaxQuerySignedUser();
            }
        };
        const signedUserData = this.state.querySignedUserData;
        var state = this.state;
        return (
            <div className="query-signed-user">
                <Row type="flex" justify="start">
                    <Col span="24" className="titleHead">
                        Signed & Certified Broadcaster

                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <span className="searchTitle"> Status:</span>  &nbsp;&nbsp;&nbsp;
                        <Select style={{ width: 120 }} value={state.queryCondition.status}
                                onChange={this.changeSelectBroadcasterState.bind(this)}>
                            <Option value="0">Intern</Option>
                            <Option value="1">Certified</Option>
                            <Option value="2">Signed</Option>
                        </Select>

                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <Button type="primary" onClick={this.ajaxQuerySignedUser.bind(this)}>Refresh</Button>

                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <Button type="primary" onClick={this.exportAsExcel.bind(this)}>Export As Excel</Button>

                    </Col>
                </Row>
                <Row className="signedUser_list" type="flex" justify="start">
                    <Col span="24">
                        <Table columns={signedUserColumns} dataSource={signedUserData} className="tableStyle" pagination={pagination}  locale = {i18n.tableLocale} />
                    </Col>
                </Row>

            </div>
        )
    }

}
