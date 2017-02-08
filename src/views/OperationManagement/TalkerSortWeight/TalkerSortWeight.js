import React from 'react';
import { Row, Col, Icon, Table, Input, Button, Checkbox,DatePicker,Spin,Switch,Modal,Pagination,Select,message} from 'antd';
import enUS from 'antd/lib/date-picker/locale/en_US';
import {i18n} from '../../../utils/i18n'
import {getThumbUrl40,getTimeOnlyDate} from '../../../utils/CommonUtils';
const confirm = Modal.confirm;
const RangePicker = DatePicker.RangePicker;
import {AjaxUtil} from '../../auth'
const InputGroup = Input.Group;
import SearchInput from '../../../components/Common/SearchInput';
import TalkerSortWeightCreateDialog from './TalkerSortWeightCreateDialog';
import img from "../../../images/head_default.png";


export default class TalkerSortWeight extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            //默认创建对话框不显示
            isCreateDialogVisible: false,
            dialogData: {},

            /**
             * 表格数据
             */
            tableRows: [],
            tableTotalCount: 0,
            /**
             * 查询条件
             */
            queryCondition: {
                pageNumber: 1,
                pageSize: 10
            },
            /**
             * 是否全局搜索
             */
            isGlobalSearch: false
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
        that.setState({loading: true});
        AjaxUtil.queryTalkerSortWeightList(queryCondition,function(data){
            data = data|| {};
            var tableRows = data.rows || [];
            tableRows.forEach(function(d,i){
                d.key = i;
            });

            that.setState({
                tableRows:tableRows,
                tableTotalCount:data.totalCount || 0,
                loading: false
            });
        },function(){
            that.setState({
                tableRows:[],
                tableTotalCount:0,
                loading: false
            });
        });
    }


    /**
     * 点击搜索按钮查询单条信息
     */
    onClickSearch(a,b,c) {
        a = a || "";
        a = a.trim();
        this.setQueryCondition({
            searchText:a,
            searchTextField:"uid"
        });
        this.queryTableList();
    }

    setQueryCondition(condition) {
        var queryCondition = this.state.queryCondition;
        queryCondition = Object.assign({}, queryCondition, condition);
        this.state.queryCondition = queryCondition;
        this.setState({
            queryCondition: queryCondition
        });
    }

    /**
     * 点击某一行的编辑score按钮
     * @param record
     */
    handleEditItem(record){
        var that = this;
        this.setState({
            dialogData:record,
            isCreateDialogVisible: true
        });
    }

    /**
     * 对话框点击确定按钮
     */
    onCreateRecordSuccess(newRecord){
        var that = this;
        that.setState({loading: true});
        that.setQueryCondition({
            pageNumber: 1,
            pageSize: 10
        });
        AjaxUtil.updateTalkerSortWeight(newRecord,function(){
            message.success(i18n.msg.OperationSucceeded);
            that.queryTableList();
        });
        that.setState({
            isCreateDialogVisible: false
        });
    }

    /**
     * 刷新表格信息
     */
    refreshTable() {
        var that = this;
        let queryCondition = this.state.queryCondition;
        that.setQueryCondition({
            pageNumber: 1,
            pageSize: 10,
            searchText:"",
            searchTextField:""
        });
        that.queryTableList();
        that.refs.SearchInput.clearValue();
    }

    /**
     * 表格列的定义
     */
    getTableColumns() {

        var that = this;
        //Avatar	PIXY ID	Order	Name	Gender	Email	Language	Diamonds	Stars	Followers	Following	Earnings	Level	Operation

        return [{
            title: 'Avatar',
            dataIndex: 'avatar',
            key: 'avatar',
            width: 10,
            render: (text, record, index) => {
                if(text) {
                    return (
                        <div>
                            <img className="small-avatar" src={record.avatar} />
                        </div>
                    )
                } else {
                    return (
                        <div>
                            <img className="small-avatar" src={img} />
                        </div>
                    )
                }
            }
        },  {
            title: 'PIXY ID',
            dataIndex: 'uid',
            key: 'uid',
            width: 10
        },  {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            width: 10
        },  {
            title: 'Gender',
            dataIndex: 'gender',
            key: 'gender',
            width: 10,
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
        },  {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 10
        },  {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            width: 10
        },  {
            title: 'Diamonds',
            dataIndex: 'diamond_amount',
            key: 'diamond_amount',
            width: 10
        },  {
            title: 'Stars',
            dataIndex: 'star_amount',
            key: 'star_amount',
            width: 10
        },  {
            title: 'Followers',
            dataIndex: 'follower_count',
            key: 'follower_count',
            width: 10
        },  {
            title: 'Following',
            dataIndex: 'following_count',
            key: 'following_count',
            width: 10
        },  {
            title: 'Earnings',
            dataIndex: 'earnings',
            key: 'earnings',
            width: 10
        },  {
            title: 'Level',
            dataIndex: 'level',
            key: 'level',
            width: 10
        },  {
            title: 'Score',
            dataIndex: 'score',
            key: 'score',
            width: 10,
            render: (text, record, index) => {
                return (
                    <div>
                        <Button type="ghost" onClick={this.handleEditItem.bind(this,record)}>{text}</Button>
                    </div>
                )
            }
        }]
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
                    pageSize: pageSize,
                    searchText:"",
                    searchTextField:""
                });
                that.queryTableList();
            },
            onChange(current) {
                that.setQueryCondition({
                    pageNumber: current,
                    searchText:"",
                    searchTextField:""
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
                <Spin spining={this.state.loading} tip="loading...">
                    <Row type="flex" justify="start">
                        <Col span="24" className="titleHead">
                            Talker Sort Weight
                        </Col>
                    </Row>

                    <div style={{ height: 20 }}></div>
                    <Row type="flex" justify="start">
                        <Col span="7">
                            <div>
                                <SearchInput
                                     ref="SearchInput"
                                    placeholder="Search by PIXY ID"
                                    onSearch={this.onClickSearch.bind(this)} style={{ width:400 }} />
                            </div>
                        </Col>

                        <Col span="5">
                            <Button type="primary" onClick={this.refreshTable.bind(this)}>Refresh</Button>
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
                </Spin>
                
                <TalkerSortWeightCreateDialog
                    data = {state.dialogData}
                    visible={state.isCreateDialogVisible}
                    onCloseDialog = {()=>this.setState({isCreateDialogVisible:false})}
                    onCreateRecordSuccess={this.onCreateRecordSuccess.bind(this)}>
                </TalkerSortWeightCreateDialog>

            </div>
        )
    }
}