import React from 'react';
import { Row, Col, Icon, Table, Input, Button, Checkbox,DatePicker,Switch,Modal,Pagination,Select} from 'antd';
import enUS from 'antd/lib/date-picker/locale/en_US';
const confirm = Modal.confirm;
const RangePicker = DatePicker.RangePicker;
import {AjaxUtil} from '../../auth'
const InputGroup = Input.Group;
import SearchInput from '../../../components/Common/SearchInput';
import TopicCreateDialog from './TopicCreateDialog';


export default class TopicControl extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

            //默认创建对话框不显示
            isCreateDialogVisible:false,

            /**
             * 表格数据
             */
            rows:[{key:"111"},{key:"11122"}],

            /**
             * 查询条件
             */
            queryCondition: {
                searchText: "",
                pageNumber: 1,
                pageSize: 20
            }
        };
    }

    /**
     * 第一次查询数据
     */
    componentWillMount() {
        this.queryTopicList();
    }


    /**
     * 查询列表数据
     */
    queryTopicList() {
        //TODO
    }


    /**
     * 设置查询条件
     * @param condition
     */
    setQueryCondition(condition) {
        var queryCondition = this.state.queryCondition;
        queryCondition = Object.assign({}, queryCondition, condition);
        this.setState({
            queryCondition: queryCondition
        });
    }

    


    /**
     * 点击右上角的查找按钮
     */
    onClickSearch() {
        this.queryTopicList();
    }


    /**
     * 点击某一行的Switch按钮
     * @param record
     */
    onSwitchButtonChange(record){
        //TODO
    }

    /**
     * 点击某一行的删除按钮
     * @param record
     */
    onClickDeleteTopic(record){
        //TODO
    }


    /**
     * 点击添加Topic按钮
     */
    onClickAddTopic(){
        this.setState({
            isCreateDialogVisible: true
        });
    }


    /**
     * 对话框点击确定按钮
     */
    onCreateTopicSuccess(newTopic){

        //TODO

        this.setState({
            isCreateDialogVisible: false
        });
    }



    /**
     * 表格列的定义
     */
    getTableColumns() {
        var that = this;
        return [
            {title: 'Order', dataIndex: 'applyTime', key: 'applyTime'},
            {title: 'Topic', dataIndex: 'pixyId', key: 'pixyId'},
            {title: 'Author', dataIndex: 'withdrawalAmount', key: "withdrawalAmount"},
            {
                title: 'Manage',
                dataIndex: 'handleStatus',
                key: 'handleStatus',
                render: function (text, record, index) {
                    var isActive = true;//TODO
                    return (
                        <div>
                            <span onClick={that.onClickDeleteTopic.bind(that,record)}>Delete</span>
                            &nbsp;&nbsp;
                            <Switch checked={isActive} checkedChildren="On" unCheckedChildren="Off"
                                    onChange={that.onSwitchButtonChange.bind(that,record)}/>
                        </div>
                    );
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
            total: 100,//TODO
            showSizeChanger: true,
            pageSize: queryCondition.pageSize,
            onShowSizeChange(current, pageSize) {
                that.setQueryCondition({
                    pageNumber: current,
                    pageSize: pageSize
                });
                that.queryTopicList();
            },
            onChange(current) {
                that.setQueryCondition({
                    pageNumber: current
                });
                that.queryTopicList();
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
                        List of Topics
                    </Col>
                </Row>

                <div style={{ height: 20 }}></div>
                <Row type="flex" justify="start">
                    <Col span="20">
                        <SearchInput
                            placeholder="input search text"
                            onSearch={this.onClickSearch.bind(this)} style={{ width: 400 }}/>
                    </Col>

                    <Col span="4">
                        <div className="bannerAddBtn">
                            <Button type="ghost" onClick={this.onClickAddTopic.bind(this)}>+ Add Topic</Button>
                        </div>
                    </Col>
                </Row>

                <div style={{ height: 20 }}></div>
                <Row type="flex" justify="start">
                    <Col span="24">
                        <Table columns={columns}
                               dataSource={state.rows}
                               className="table"
                               pagination={pagination}
                        />
                    </Col>
                </Row>

                <TopicCreateDialog
                    visible={state.isCreateDialogVisible}
                    onCloseDialog = {()=>this.setState({isCreateDialogVisible:false})}
                    onCreateTopicSuccess={this.onCreateTopicSuccess.bind(this)}>
                </TopicCreateDialog>

            </div>
        )
    }
}