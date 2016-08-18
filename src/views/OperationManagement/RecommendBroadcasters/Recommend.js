import React from 'react'
import { Row, Col, Icon, Table, Input, Button, Tabs, DatePicker, Modal, Spin, message, Select} from 'antd';
import classNames from 'classnames';
import AddModifyModal from './AddModifyModal';
import RecommendList from './RecommendList';
import './index.less';
import {AjaxUtil,CheckToken} from '../../auth';
const InputGroup = Input.Group;
const TabPane = Tabs.TabPane;
const confirm = Modal.confirm;
const Option = Select.Option;

export default class Recommend extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            focus: false,
            userPixyId: '',
            isUserInfoShow: false,
            loading: false,
            editDialogVisible: false,
            addOrEdit: '',
            queryRecommendData: [],
            childUpdateState: false,
            pageNumber: 1,
            pageSize: 10,
            editModalData: '',
            language: 'all',
            viewMoreVisible: true,
            messageText: ''
        };
    }

    errorModal (text) {
        Modal.error({
            title: 'Warning',
            content: text,
            okText:'OK'
        });
    }

    //更改搜索框的值
    handleInputChange(e) {
        this.setState({
            userPixyId: e.target.value
        });
    }

    handleFocusBlur(e) {
        this.setState({
            focus: e.target === document.activeElement,
        });
    }

    //点击搜索按钮
    handleSearch() {
        if (this.props.onSearch) {
            this.props.onSearch(this.state.value);
        }
        var data = {
            "searchText":this.state.userPixyId
        }
        this.setState({
            loading: true,
            isUserInfoShow: true,
            viewMoreVisible: false
        });
        this.ajaxUpadateRecommend(data);

    }

    handleInputKeyPress (e) {
        //监听enter键
        if (e.keyCode == '13') {
            this.handleSearch();
        }
    }

    //点击添加或者编辑按钮事件
    handleAddModify(e) {
        if(e == 'add') {
            this.setState({
                editDialogVisible: true,
                addOrEdit: 'add'
            });
        } else {
            this.setState({
                editDialogVisible: true,
                addOrEdit: 'edit'
            });
        }
        
    }

    //弹窗显示隐藏控制
    handlecancelModal() {
        this.setState({editDialogVisible: false});
    }

    //查询推荐主播接口
    componentWillMount() {
        var data = {
            "pageNumber": this.state.pageNumber,
            "pageSize": this.state.pageSize,
            "language": 'all'
        };
        this.setState({loading: true});
        this.ajaxQueryRecommend(data);
        
    }

    //第一次加载列表
    ajaxQueryRecommend (data) {
        AjaxUtil.queryRecommend(this.handleQueryRecommendSuccess.bind(this), this.handleQueryRecommendError.bind(this), data);
    }

    handleQueryRecommendSuccess (data) {
        var queryRecommendData = this.state.queryRecommendData;
        for (let i=0, len=data.length; i<len; i++) {
            queryRecommendData.push({
                key: (this.state.pageNumber-1)*10 + i,
                uid: data[i].uid,
                name: data[i].name,
                gender: data[i].gender,
                avatar: data[i].avatar,
                email: data[i].email,
                diamond_amount: data[i].diamond_amount,
                star_amount: data[i].star_amount,
                follower_count: data[i].follower_count,
                following_count: data[i].following_count,
                earnings: data[i].earnings,
                level: data[i].level,
                order: data[i].order,
                language: data[i].lang
            })
        }
        this.setState({
            queryRecommendData: queryRecommendData,
            childUpdateState: false,
            loading: false
        })
        console.log("queryRecommendData:",this.state.queryRecommendData);
    }

    handleQueryRecommendError (e) {
        if (e.status===401) {
            CheckToken.check();
        }
        this.setState({
            childUpdateState: false,
            loading: false
        })
    }

    handleViewMoreClick () {
        this.state.pageNumber ++;
        var data = {
            "pageNumber": this.state.pageNumber,
            "pageSize": this.state.pageSize,
            "language": this.state.language
        };
        this.ajaxQueryRecommend(data);
        this.setState({
            childUpdateState: true
        })
    }

    
    //点击删除按钮
    handleDeleteItem(record) {
        //对话框确认函数
        function onOk () {
            var uid = record.uid;
            AjaxUtil.deleteRecommend(this.handleDeleteRecommendSuccess.bind(this), this.handleQueryRecommendError.bind(this), uid);
        }
        //提示对话框
        confirm({
            title: 'Are you sure you want to delete this broadcast',
            onOk: onOk.bind(this),
            onCancel() {},
            okText:'Delete',
            cancelText:'Cancle',
        });
    }

    handleDeleteRecommendSuccess () {
        var data = {
            "pageNumber": 1,
            "pageSize": 10,
            "language": this.state.language
        };
        this.setState({
            loading: true,
            viewMoreVisible: true,
            messageText: 'delete'
        });
        this.ajaxUpadateRecommend(data);
    }

    //点击编辑按钮
    handleEditItem(record) {
        var uid = record.uid;
        var data = {
            uid: record.uid,
            order: record.order,
            language: record.language
        }
        this.setState({editModalData: data});
        this.handleAddModify('edit');
    }

    //重新加载推荐主播列表
    ajaxUpadateRecommend(data) {
        AjaxUtil.queryRecommend(this.updateQueryRecommendSuccess.bind(this), this.handleQueryRecommendError.bind(this), data);
    }

    updateQueryRecommendSuccess (data) {
        this.setState({
            queryRecommendData: [],
            pageNumber: 1
        });
        var queryRecommendData = this.state.queryRecommendData;
        for (let i=0, len=data.length; i<len; i++) {
            queryRecommendData.push({
                key: (this.state.pageNumber-1)*10 + i,
                uid: data[i].uid,
                name: data[i].name,
                gender: data[i].gender,
                avatar: data[i].avatar,
                email: data[i].email,
                diamond_amount: data[i].diamond_amount,
                star_amount: data[i].star_amount,
                follower_count: data[i].follower_count,
                following_count: data[i].following_count,
                earnings: data[i].earnings,
                level: data[i].level,
                order: data[i].order,
                language: data[i].lang
            })
        }
        this.setState({
            queryRecommendData: queryRecommendData,
            childUpdateState: false,
            loading: false,
            isUserInfoShow: false
        });
        if(this.state.messageText == 'add') {
            message.success('success add Recommend Broadcast!');
        } else if(this.state.messageText == 'edit') {
            message.success('success edit Recommend Broadcast!');
        } else if(this.state.messageText == 'delete') {
            message.success('success delete broadcast!');
        } 
        console.log("queryRecommendData:",this.state.queryRecommendData);
    }



    //添加编辑推荐主播接口
    handleEditRecommend(data) {
        var addOrEdit = this.state.addOrEdit;
        AjaxUtil.editRecommend(this.handleEditRecommendSuccess.bind(this), this.handleEditRecommendError.bind(this), data, addOrEdit);
    }

    handleEditRecommendSuccess(data, txtStatus, xhr) {
        if(xhr.status === 200) {
            
            this.setState({
                loading: true,
                viewMoreVisible: true
            });
            if(this.state.addOrEdit == 'add') {
                this.setState({
                    messageText: 'add',
                    language: 'all'
                });
            } else if(this.state.addOrEdit == 'edit') {
                this.setState({messageText: 'edit'});
            }
            var requestData = {
                "pageNumber": 1,
                "pageSize": 10,
                "language": this.state.language
            };
            this.ajaxUpadateRecommend(requestData);
        } else if(xhr.status === 207) {
            this.errorModal(data.message);
        }
        

    }

    handleEditRecommendError(e) {
        if (e.status === 401) {
            CheckToken.check();
        } else {
            this.errorModal("system error!");
        }
    }

    //语言过滤
    changeSelectLanguage(e) {
        this.setState({
            loading: true,
            language: e,
            viewMoreVisible: true
        });
        var data = {
            "pageNumber": 1,
            "pageSize": 10,
            "language": e
        };
        this.ajaxUpadateRecommend(data);
    }

    render () {
        const btnCls = classNames({
            'ant-search-btn': true,
            'ant-search-btn-noempty': !!this.state.userPixyId.trim(),
        });

        const searchCls = classNames({
            'ant-search-input': true,
            'ant-search-input-focus': this.state.focus,
        });

        var rowCls = classNames({
            'search': true,
            'search-1': this.state.isUserInfoShow ? true : false
        });

        if(this.state.editDialogVisible) {
            var addModifyModal = null;
            addModifyModal = <AddModifyModal
                                editDialogVisible={this.state.editDialogVisible}  
                                addOrEdit={this.state.addOrEdit}
                                cancelModal={this.handlecancelModal.bind(this)}
                                editRecommend={this.handleEditRecommend.bind(this)}
                                editModalData={this.state.editModalData}
                            >
                            </AddModifyModal>
        }
        
        
        var recommendList = <RecommendList
                                queryRecommendData={this.state.queryRecommendData}
                                viewMoreClick={this.handleViewMoreClick.bind(this)}
                                childUpdateState={this.state.childUpdateState}
                                deleteItem={this.handleDeleteItem.bind(this)}
                                editItem={this.handleEditItem.bind(this)}
                                viewMoreVisible={this.state.viewMoreVisible}
                                >
                            </RecommendList>

        return(
            <Spin spining={this.state.loading} tip="loading...">
                <div className="m-signed-query">
                    <Row type="flex" justify="start">
                        <Col span="24" className="titleHead">
                            Recommended Broadcaster
                        </Col>
                    </Row>
                    <Row className={rowCls} type="flex" justify="start">
                        <Col className="c1" span="3">
                            PIXY ID:
                        </Col>
                        <Col span="8">
                            <div className="ant-search-input-wrapper">
                                <InputGroup className={searchCls}>
                                    <Input value={this.state.userPixyId}
                                           onChange={this.handleInputChange.bind(this)}
                                           onKeyUp={this.handleInputKeyPress.bind(this)}
                                    />
                                    <div className="ant-input-group-wrap">
                                        <Button className={btnCls} onClick={this.handleSearch.bind(this)} style={{height: 26}}>
                                            <Icon type="search" />
                                        </Button>
                                    </div>
                                </InputGroup>
                            </div>
                        </Col>
                        <Col span="8">
                            Search by Language : &nbsp;&nbsp;&nbsp;
                            <Select style={{ width: 120 }} value={this.state.language}
                                    onChange={this.changeSelectLanguage.bind(this)}>
                                <Option value="all">all</Option>
                                <Option value="en">en</Option>
                                <Option value="ar">ar</Option>
                            </Select>
                        </Col>
                        <Col span="5">
                            <div className="add-modify-btn">
                                <Button type="primary" onClick={this.handleAddModify.bind(this, 'add')}>Add Recommendation</Button>
                            </div>
                        </Col>
                    </Row>
                    {recommendList}
                    {addModifyModal}
                </div>
            </Spin>
            
        )
    }
}