import React from 'react'
import { Row, Col, Icon, Table, Pagination, Modal, message} from 'antd';
import './index.less'
import {ModifyPasswd} from './ModifyPasswd'
import {AddStaff} from './AddStaff'
import {AjaxUtil} from '../../views/auth'
import Session from '../Session'
const confirm = Modal.confirm;

export default class PersonalInfomation extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            isStaffSettingShow: false,
            passwordVisible: false,
            addstaffVisible: false,
            tableData:[],
            customerServiceData: [],
            reviewReportData: [],
            withdrawalData: [],
            serviceClerkData: [],
            systemOperatorData: [],
            liveInteractionData: [],
            statisticsData: [],             //实时数据查看权限 用户数据
        };
        this.currentRowData = null;         //表示当前选中行的数据,用于编辑时自动填充表单
        this.staffDialogMode = 'ADD';       //对话框为添加模式,用于传给子组件AddStaff时,用来区分当前是添加还是编辑用户
    }
    /**
     *  获取所有数据请求的回调函数
     */
    handleGetOperators (data, txtStatus, xhr) {
        if (xhr.status == 200) {
            var customerServiceData = [];
            var reviewReportData = [];
            var withdrawalData = [];
            var serviceClerkData = [];
            var systemOperatorData = [];
            var liveInteractionData = [];
            var statisticsData = [];

            function pushData(l, data) {
                if (l instanceof Array) {
                    var key = l.length + 1;
                    l.push({
                        key: key,
                        name: data.email,
                        password: data.password,
                        rolename: data.rolename,
                        operator_id: data.operator_id
                    })
                }
            }

            for (var i=0, len=data.length; i<len; i++) {
                if (data[i].rolename == 'customerService') {
                    pushData(customerServiceData, data[i]);
                }
                else if (data[i].rolename == 'reviewReport') {
                    pushData(reviewReportData, data[i]);
                }
                else if (data[i].rolename == 'withdrawal') {
                    pushData(withdrawalData, data[i]);
                }
                else if (data[i].rolename == 'serviceClerk') {
                    pushData(serviceClerkData, data[i]);
                }
                else if (data[i].rolename == 'systemOperator') {
                    pushData(systemOperatorData, data[i]);
                }
                else if (data[i].rolename == 'liveInteraction') {
                    pushData(liveInteractionData, data[i]);
                }
                else if (data[i].rolename == 'statistics') {
                    pushData(statisticsData, data[i]);
                }
            }
            
            this.setState({
                isStaffSettingShow: true,
                customerServiceData: customerServiceData,
                reviewReportData: reviewReportData,
                withdrawalData: withdrawalData,
                serviceClerkData: serviceClerkData,
                systemOperatorData: systemOperatorData,
                liveInteractionData: liveInteractionData,
                statisticsData,
            });
        }
        else if (xhr.status == 403) {
            this.setState({
                isStaffSettingShow: false
            })
        }
    }

    componentWillMount () {
        this.getAllData();
    }


    handlePasswdDialog (event) {
        if('x' === event) {
            this.setState({passwordVisible:false});
        } else if('a' === event) {
            this.setState({passwordVisible:true});
        }
    }

    handleStaffDialog (event) {
        this.currentRowData = null;
        this.staffDialogMode = 'ADD';
        if('x' === event) {
            this.setState({addstaffVisible:false});
        } else if('a' === event) {
            this.setState({addstaffVisible:true});
        }
    }
    /**
     *  请求后台获取所有表格数据
     */
    getAllData () {
        AjaxUtil.getoperators(this.handleGetOperators.bind(this));
    }
    /**
     *  编辑表格数据
     */
    handleEditTableData (data) {
        this.currentRowData = data;
        this.staffDialogMode = 'EDIT';
        this.setState({addstaffVisible:true});
    }

    /**
     *  更新表格数据
     */
    handleAddTableData (data) {
        this.getAllData();
    }
    /**
     *  删除表格一行
     */
    handleDelTableData (record) {

        //对话框确认函数
        function onOk () {
            function cbSuccess(txtStatus, xhr) {
                message.success('success delete staff!');
                this.getAllData();
            }
            var key = record.key;
            var email = record.name;
            var operator_id = record.operator_id;
            AjaxUtil.deletestaff(cbSuccess.bind(this), operator_id);
        }
        //提示对话框
        confirm({
            title: 'Are you sure you want to delete this staff',
            onOk: onOk.bind(this),
            onCancel() {},
            okText:'Delete',
            cancelText:'Cancle',
        });
    }

    render () {
        //创建不同标题的表格
        var columnFactory = (title) => ([{
            title: title,
            dataIndex: 'name',
            key: 'name',
            width: '70%',
            operator_id: 'operator_id'
        },  {
            key: 'operation',
            render: (text, record, index) => (
                <span>
                  <a onClick={this.handleEditTableData.bind(this, record)}>Edit</a>
                  <span className="ant-divider"></span>
                  <a onClick={this.handleDelTableData.bind(this, record)}>Delete</a>
                </span>
            )
        }]);

        var customerServiceColunm = columnFactory('Customer Service');
        var reviewReportColunm = columnFactory('Review Report');
        var withdrawalColunm = columnFactory('Withdrawal');
        var serviceClerkColunm = columnFactory('Service Clerk');
        var systemOperatorColunm = columnFactory('System Operator');
        var liveInteractionColunm = columnFactory('Live Interaction');
        var statisticsColunm = columnFactory('Statistics');


        const customerServiceData = this.state.customerServiceData;
        const reviewReportData = this.state.reviewReportData;
        const withdrawalData = this.state.withdrawalData;
        const serviceClerkData = this.state.serviceClerkData;
        const systemOperatorData = this.state.systemOperatorData;
        const liveInteractionData = this.state.liveInteractionData;
        const statisticsData = this.state.statisticsData;

        const email = Session.getUser();

        if (this.state.isStaffSettingShow) {
            var staffSettingContent = [
                <Row key="r1" className="home-row staff" type="flex" justify="start">
                    <Col span="24" className="titleHead">
                        Staff Settings
                    </Col>
                </Row>,
                <Row key="r2" className="home-row" type="flex" justify="start">
                    <Col span="4" >
                    <span className="addStaff" onClick={this.handleStaffDialog.bind(this,'a')}><Icon type="plus-circle-o" className="plusIcon" />Add Staff</span>
                    </Col>
                </Row>,
                <Row key="r3" className="home-row" type="flex" justify="start">
                    <Col span="14">
                    <Table columns={customerServiceColunm} dataSource={customerServiceData} size="middle" className="tableStyle" pagination={customerServiceData.length>5?{pageSize:5}:false} />
                    </Col>
                </Row>,
                <Row key="r4" className="home-row" type="flex" justify="start">
                    <Col span="14">
                    <Table columns={reviewReportColunm} dataSource={reviewReportData} size="middle" className="tableStyle" pagination={reviewReportData.length>5?{pageSize:5}:false} />
                    </Col>
                </Row>,
                <Row key="r5" className="home-row" type="flex" justify="start">
                    <Col span="14">
                    <Table columns={withdrawalColunm} dataSource={withdrawalData} size="middle" className="tableStyle" pagination={withdrawalData.length>5?{pageSize:5}:false} />
                    </Col>
                </Row>,
                <Row key="r6" className="home-row" type="flex" justify="start">
                    <Col span="14">
                    <Table columns={serviceClerkColunm} dataSource={serviceClerkData} size="middle" className="tableStyle" pagination={serviceClerkData.length>5?{pageSize:5}:false} />
                    </Col>
                </Row>,
                <Row key="r7" className="home-row" type="flex" justify="start">
                    <Col span="14">
                    <Table columns={systemOperatorColunm} dataSource={systemOperatorData} size="middle" className="tableStyle" pagination={systemOperatorData.length>5?{pageSize:5}:false} />
                    </Col>
                </Row>,
                <Row key="r8" className="home-row" type="flex" justify="start">
                    <Col span="14">
                    <Table columns={liveInteractionColunm} dataSource={liveInteractionData} size="middle" className="tableStyle" pagination={liveInteractionData.length>5?{pageSize:5}:false} />
                    </Col>
                </Row>,
                <Row key="r9" className="home-row" type="flex" justify="start">
                    <Col span="14">
                    <Table columns={statisticsColunm} dataSource={statisticsData} size="middle" className="tableStyle" pagination={statisticsData.length>5?{pageSize:5}:false} />
                    </Col>
                </Row>
            ];
        }
        else {
            var staffSettingContent = null;
        }
        var addNewPage = null;
        if (this.state.passwordVisible) {
            addNewPage = <ModifyPasswd
                            passwordVisible={this.state.passwordVisible}
                            canclePasswdDialog = {this.handlePasswdDialog.bind(this,'x')}
                            email={email}
                        />;
        } else if(this.state.addstaffVisible) {
            addNewPage = <AddStaff
                            addstaffVisible={this.state.addstaffVisible}
                            cancleStaffDialog = {this.handleStaffDialog.bind(this,'x')}
                            handleAddTableData = {this.handleAddTableData.bind(this)}
                            userData = {this.currentRowData}
                            staffDialogMode = {this.staffDialogMode}
                        />;
        }

        return (
            <div>
                <Row className="home-row" type="flex" justify="start">
                    <Col span="24" className="titleHead">
                        Personal Information
                    </Col>
                </Row>
                <Row className="home-row" type="flex" justify="start">
                    <Col span="2">
                        Email:
                    </Col>
                    <Col span="4">
                        {email}
                    </Col>
                </Row>
                <Row className="home-row" type="flex" justify="start">
                    <Col span="2">
                        Password:
                    </Col>
                    <Col span="4">
                        <input className="password" type="password" value="******"/>
                    </Col>
                    <Col span="2">
                        <span className="modify" onClick={this.handlePasswdDialog.bind(this,'a')}>Modify</span>
                    </Col>
                </Row>
                {staffSettingContent}
                {addNewPage}
            </div>
        )
    }
}
