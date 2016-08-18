import React from 'react';
import { Row, Col, Icon, Table, Input, Button, Checkbox,DatePicker,Switch,Modal,Pagination,Select,message} from 'antd';
import enUS from 'antd/lib/date-picker/locale/en_US';
import {i18n} from '../../../utils/i18n'
import {getThumbUrl40,getTimeOnlyDate} from '../../../utils/CommonUtils';
const confirm = Modal.confirm;
const RangePicker = DatePicker.RangePicker;
import {AjaxUtil} from '../../auth'
const InputGroup = Input.Group;
import SearchInput from '../../../components/Common/SearchInput';
import BroadcasterSortWeightCreateDialog from './BroadcasterSortWeightCreateDialog';


export default class BroadcasterSortWeight extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

            //默认创建对话框不显示
            isCreateDialogVisible: false,
            dialogData: {},
            dialogDataIsUpdate: false,

            /**
             * 表格数据
             */
            tableRows: [],
            tableTotalCount: 0,
            /**
             * 查询条件
             */
            queryCondition: {
                searchText: "",
                pageNumber: 1,
                pageSize: 20,
                status: "-1"
            }
        };
    }

    /**
     * 第一次查询数据
     */
    componentWillMount() {
        this.queryTableList();
    }


    /**
     * 查询列表数据
     */
    queryTableList() {
        var that = this;
        var queryCondition = this.state.queryCondition;
        AjaxUtil.queryBroadcasterSortWeightList(queryCondition,function(d){
            var rows = d.rows || [];
            var tableRows = rows.map(function(x,i){
                var user = x.userInfo || {};
                return {
                    key:i,
                    created:x.created,
                    is_active:x.is_active,
                    uid:x.uid,
                    weight:x.weight,
                    updated:x.updated,

                    user_avatar:user.avatar,
                    user_ban_level:user.ban_level,
                    user_currentScore:user.currentScore,
                    user_diamond_amount:user.diamond_amount,
                    user_earnings:user.earnings,
                    user_email:user.email,
                    user_follower_count:user.follower_count,
                    user_following_count:user.following_count,
                    user_gender:user.gender,
                    user_lang:user.lang,
                    user_level:user.level,
                    user_name:user.name,
                    user_order:user.order,
                    user_register_type:user.register_type,
                    user_signature:user.signature,
                    user_signed:user.signed,
                    user_star_amount:user.star_amount
                };
            });

            that.setState({
                tableRows:tableRows,
                tableTotalCount:d.totalCount || 0
            });
        },function(){
            that.setState({
                tableRows:[],
                tableTotalCount:0
            });
        });
    }


    /**
     * 设置查询条件
     * @param condition
     */
    setQueryCondition(condition) {
        var queryCondition = this.state.queryCondition;
        queryCondition = Object.assign({}, queryCondition, condition);
        this.state.queryCondition = queryCondition;
        this.setState({
            queryCondition: queryCondition
        });
    }

    


    /**
     * 点击右上角的查找按钮
     */
    onClickSearch(a,b,c) {
        a = a || "";
        a = a.trim();
        this.setQueryCondition({
            searchText:a
        });
        this.queryTableList();
    }



    /**
     * 点击某一行的删除按钮
     * @param record
     */
    handleDeleteItem(record){
        var that = this;
        var uid = record.uid;
        AjaxUtil.deleteBroadcasterSortWeight(uid,function(){
            message.success(i18n.msg.OperationSucceeded);
            that.queryTableList();
        });
    }

    /**
     * 点击某一行的编辑按钮
     * @param record
     */
    handleEditItem(record){
        var that = this;
        this.setState({
            dialogData:record,
            dialogDataIsUpdate:true,
            isCreateDialogVisible: true
        });
    }


    /**
     * 点击添加按钮
     */
    onClickAddItem(){
        this.setState({
            dialogData:{},
            dialogDataIsUpdate:false,
            isCreateDialogVisible: true
        });
    }


    validateUserExist(newRecord,callback){
        var uid = newRecord.uid;
        var that = this;
        AjaxUtil.queryUserInfo(function(d){
            if(d && d.uid!==0){
                callback(true);
            }else {
                callback(false);
            }
        },function(c){
            callback(false);
        },uid);
    }


    saveBroadcasterSortWeight(newRecord,isUpdate){
        var that = this;
        AjaxUtil.saveBroadcasterSortWeight(newRecord,isUpdate,function(){
            message.success(i18n.msg.OperationSucceeded);
            that.queryTableList();
        });
        this.setState({
            isCreateDialogVisible: false
        });
    }


    /**
     * 对话框点击确定按钮
     */
    onCreateRecordSuccess(newRecord,isUpdate){
        var that = this;
        if(!isUpdate){
            newRecord.is_active  = 1 ;
            that.validateUserExist(newRecord,function(isExist){
                if(isExist){
                    that.saveBroadcasterSortWeight(newRecord,isUpdate);
                }else {
                    message.error(i18n.msg.USER_NOT_EXIST);
                }
            });
        }else {
            that.saveBroadcasterSortWeight(newRecord,isUpdate);
        }
    }


    changeSelectStatus(a,b,c){
        this.setQueryCondition({
            pageNumber:1,
            status:a
        });
        this.queryTableList();
    }

    /**
     * 点击表格中的Switch按钮
     * @param row
     * @param checked
     */
    onSwitchButtonChange(row, checked) {
        var that = this;


        var tips = '';
        if(checked){
            tips='Are you sure you want to disable the setting ?';
        }else {
            tips='Are you sure you want to enable the setting ?';
        }

        Modal.confirm({
            title: 'Warning',
            content: tips,
            okText: 'Confirm',
            cancelText: 'Cancel',
            onOk() {
                var is_active = checked ? 1 : 0;
                var record = {
                    is_active:is_active,
                    uid:row.uid,
                    weight:row.weight
                };
                that.saveBroadcasterSortWeight(record,true);
            },
            onCancel() {}
        });

    }



    /**
     * 表格列的定义
     */
    getTableColumns() {

        var that = this;
        //Avatar	PIXY ID	Order	Name	Gender	Email	Language	Diamonds	Stars	Followers	Following	Earnings	Level	Operation

        return [
            {title: 'Avatar', dataIndex: 'user_avatar', key: 'user_avatar',
                render: function (text, row, index) {
                    if (text){
                        return (<img className="table-avatar" src={getThumbUrl40(text)} alt=""/>)
                    }else {
                        return <span></span>
                    }
                }
            },
            {title: 'PIXY ID', dataIndex: 'uid', key: 'uid'},
            {title: 'Weight', dataIndex: 'weight', key: 'weight'},
            {title: 'IsActive', dataIndex: 'is_active', key: 'is_active',

                width: 150,
                render: function (text, row, index) {

                    var is_active = (row['is_active'] === 1);

                    return (
                        <div>
                            <Switch checked={is_active} checkedChildren="On" unCheckedChildren="Off"
                                    onChange={that.onSwitchButtonChange.bind(that,row)}/>
                        </div>);
                    //return <div></div>
                }

            },
            {title: 'Name', dataIndex: 'user_name', key: "user_name"},
            {
                title: 'Gender', dataIndex: 'user_gender', key: "user_gender",
                render: (text, record, index) => {
                    var gender = '';
                    if (record.gender == 1) {
                        gender = 'female';
                    } else if (record.gender == 2) {
                        gender = 'male';
                    } else {
                        gender = 'Unspecified';
                    }
                    return (
                        <span>{gender}</span>
                    )
                }
            },
            {title: 'Email', dataIndex: 'user_email', key: "user_email"},
            {title: 'Lang', dataIndex: 'user_lang', key: "user_lang"},
            {title: 'Level', dataIndex: 'user_level', key: "user_level"},
            {
                title: 'Operation',
                dataIndex: 'uid',
                key: 'Operation',
                render: (text, record, index) => {
                    return (
                        <span>
                            <a onClick={that.handleEditItem.bind(that,record)}>Edit</a>
                            <span className="ant-divider"></span>
                            <a onClick={that.handleDeleteItem.bind(that,record)}>Delete</a>
                        </span>
                    )
                }
            }
        ];
    }


    /**
     * 获取分页的定义
     */
    getPagination(){
        var that = this;
        var state = that.state;

        var queryCondition = state.queryCondition;

        return {
            total: state.tableTotalCount,
            showSizeChanger: true,
            pageSize: queryCondition.pageSize,
            onShowSizeChange(current, pageSize) {
                that.setQueryCondition({
                    pageNumber: current,
                    pageSize: pageSize
                });
                that.queryTableList();
            },
            onChange(current) {
                that.setQueryCondition({
                    pageNumber: current
                });
                that.queryTableList();
            }
        };
    }


    render() {
        var that = this;
        var state = that.state;
        var columns = that.getTableColumns() || [];
        var pagination = this.getPagination();

        return (
            <div className="m-topic-control">
                <Row type="flex" justify="start">
                    <Col span="24" className="titleHead">
                        Broadcaster Sort Weight
                    </Col>
                </Row>

                <div style={{ height: 20 }}></div>
                <Row type="flex" justify="start">
                    <Col span="20">
                        <div>
                            <SearchInput
                                placeholder="Search by PIXY ID"
                                onSearch={this.onClickSearch.bind(this)} style={{ width:400 }} />
                        </div>
                    </Col>

                    <Col span="4">
                        <div className="bannerAddBtn">
                            <Button type="primary" onClick={this.onClickAddItem.bind(this)}>+ Add Setting
                            </Button>
                        </div>
                    </Col>
                </Row>

                <div style={{ height: 20 }}></div>
                <Row type="flex" justify="start">
                    <Col span="24">
                        <Table columns={columns}
                               dataSource={state.tableRows}
                               className="table"
                               pagination={pagination}
                        />
                    </Col>
                </Row>

                <BroadcasterSortWeightCreateDialog
                    data = {state.dialogData}
                    dialogDataIsUpdate = {state.dialogDataIsUpdate}
                    visible={state.isCreateDialogVisible}
                    onCloseDialog = {()=>this.setState({isCreateDialogVisible:false})}
                    onCreateRecordSuccess={this.onCreateRecordSuccess.bind(this)}>
                </BroadcasterSortWeightCreateDialog>

            </div>
        )
    }
}