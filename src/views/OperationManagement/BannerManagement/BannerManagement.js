import React from 'react'
import classNames from 'classnames';
import { Row, Col, Icon, Table, Pagination, Modal, message,Input,Button,Spin,Form,Radio,Select,Upload,Switch,InputNumber} from 'antd';
import {i18n} from '../../../utils/i18n'
import SearchInput from '../../../components/Common/SearchInput';
import CommonUtils from '../../../utils/CommonUtils';
import {AjaxUtil} from '../../auth';
import './index.less';
import TableList from './TableList';
import BannerDialog from './BannerDialog';

/**
 * Banner 管理功能
 */
export default class BannerManagement extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            tableRows: [],
            tableTotalCount: 0,
            loading: false,
            editDialogVisible: false,
            editDialog: {},
            editPreviewImage1: "",
            editPreviewImageVisible1: false,
            editPreviewImage2: "",
            editPreviewImageVisible2: false,

            queryCondition: {
                pageSize: 20,
                pageNumber: 1,
                searchText: "",
                status: "2"
            }
        };
    }

    /**
     * 初始化编辑对话框的数据
     */
    initEditDialog() {

        var editDialog = this.state.editDialog || {};
        var pic_url = editDialog.pic_url;
        var deep_pic_url = editDialog.deep_pic_url;
        var type = editDialog.type;
        editDialog.lang = editDialog.lang || "all";
        editDialog.category = editDialog.category || "live";
        this.setState({
            editPreviewImage1: pic_url,
            editPreviewImageUrl1: pic_url,
            editPreviewImageVisible1: (!!pic_url),
            bannerUploading1:null,
            editPreviewImage2: deep_pic_url,
            editPreviewImageUrl2: deep_pic_url,
            editPreviewImageVisible2: (!!deep_pic_url),
            bannerUploading2:null,
            editDialogRadioValue: type
        });
    }

    /**
     * 点击表格中的Switch按钮
     * @param row
     * @param checked
     */
    onSwitchButtonChange(row) {
        var that = this;
        var tips = '';
        var checked = row.is_active;
        if(!checked){
            tips='Are you sure you want to send this banner to all user ?';
        }else {
            tips='Are you sure you want to remove this online banner?';
        }
        Modal.confirm({
            title: 'Warning',
            content: tips,
            okText: 'Confirm',
            cancelText: 'Cancel',
            onOk() {
                row.is_active = checked ? 0 : 1;
                that.setState({loading: true});
                AjaxUtil.bannerSaveOrUpdate({
                    banner_id: row.banner_id,
                    is_active: row.is_active
                }, function () {
                    that.setState({loading: false});
                });
            },
            onCancel() {}
        });

    }


    /**
     * 第一次查询数据
     */
    componentWillMount() {
        this.queryTableContent();
    }

    /**
     * 点击表格后面的删除按钮
     * @param row
     */
    onDeleteItem(row) {
        var that = this;
        Modal.confirm({
            title: 'Warning',
            content: 'Are you sure you want  to delete this banner and all its related information?',
            okText: 'Confirm',
            cancelText: 'Cancel',
            onOk() {
                //delete the item
                that.setState({loading: true});
                AjaxUtil.bannerDeleteItem(row.banner_id, function () {
                    message.success('delete successfully');
                    //re query
                    that.queryTableContent();
                });
            },
            onCancel() {
            }
        });
    }

    /**
     * 点击表格后面的编辑按钮
     * @param row
     */
    onEditItem(row) {
        this.state.editDialog = row;
        this.initEditDialog();
        this.setState({editDialogVisible: true});
    }

    /**
     * 查询表格中的数据
     */
    queryTableContent() {
        var that = this;
        that.setState({loading: true});
        AjaxUtil.bannerQuery(this.state.queryCondition, function (data) {

            var rows = data.rows || [];
            rows.forEach(function (row, i) {
                row.key = "bannerId_" + row.banner_id || ("key_" + i);
                let category = row.category;
                if(category === 0) {
                    row.category = "live";
                } else if(category === 1) {
                    row.category = "talker";
                }
            });
            that.setState({tableRows: rows, tableTotalCount: data.totalCount, loading: false});
        }, function () {
            that.setState({loading: false});
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
     * 点击查询按钮
     * @param value
     */
    onTableSearch(value) {
        var searchText = value.trim();
        this.setQueryCondition({
            pageNumber:1,
            searchText:searchText
        });
        this.queryTableContent();
    }

    changeSelectStatus(a){
        this.setQueryCondition({
            pageNumber:1,
            status:a
        });
        this.queryTableContent();
    }

    /**
     * 点击添加banner按钮
     */
    onClickAddBanner() {
        this.state.editDialog = {type: 1};
        this.initEditDialog();
        this.setState({editDialogVisible: true});
    }


    validateEditDialog(editDialog) {
        if (!editDialog.pic_url || editDialog.pic_url.trim().length === 0) {
            message.error("Banner image cannot empty !");
            return false;
        }

        if (!editDialog.order_no && editDialog.order_no !== 0) {
            message.error("Order cannot empty !");
            return false;
        }

        if(editDialog.type==1){
            var deep_pic_url = editDialog.deep_pic_url;
            if(!deep_pic_url || deep_pic_url.trim().length===0){
                message.error("H5 pic cannot empty !");
                return false;
            }
        }
        else {
            if(!editDialog.link_url || editDialog.link_url.trim().length===0){
                message.error("link cannot empty !");
                return false;
            }
        }

        return true;
    }


    /**
     * 编辑按钮的确定
     */
    onEditOK(editDialog) {
        var that = this;
        var isOK = that.validateEditDialog(editDialog);

        if (isOK) {

            var uid = editDialog.uid;
            if(!uid || (CommonUtils.isString(uid) && uid.trim().length===0)){
                editDialog.uid = 0;
            }

            var link_url = editDialog.link_url;
            if(!link_url){
                editDialog.link_url = "";
            }
            var share_text_url = editDialog.share_text_url;
            if(!share_text_url){
                editDialog.share_text_url = '';
            }
            
            var category = editDialog.category;
            if(category === "live") {
                editDialog.category = 0;
            } else if(category === "talker") {
                editDialog.category = 1;
            }

            that.setState({editDialogVisible: false, loading: true});
            AjaxUtil.bannerSaveOrUpdate(editDialog, function () {
                message.success('saved successfully');
                that.queryTableContent();
            });
        }
    }

    /**
     * 编辑按钮的取消
     */
    onEditCancel() {
        this.setState({editDialogVisible: false});
    }

    render() {

        var that = this;
        var tableRows = this.state.tableRows || [];
        var pagination = {
            total: that.state.tableTotalCount || 0,
            showSizeChanger: true,
            pageSize: that.state.queryCondition.pageSize,
            onShowSizeChange(current, pageSize) {
                that.setQueryCondition({
                    pageNumber:current,
                    pageSize:pageSize
                });
                that.queryTableContent();
            },
            onChange(current) {
                that.setQueryCondition({
                    pageNumber:current
                });
                that.queryTableContent();
            }
        };

        return (
            <div>
                <Spin spining={this.state.loading} tip="loading...">
                    <div>
                        <Row type="flex" justify="start">
                            <Col span="24" className="titleHead">
                                Home Advertisement
                            </Col>
                        </Row>
                        <div style={{ height: 20 }}></div>
                        <Row className="search" type="flex" justify="start">
                            <Col span="20">
                                <div style={{float:'left'}}>
                                    <SearchInput placeholder="Search by title" onSearch={this.onTableSearch.bind(this)} style={{ width: 300 }} />
                                </div>
                                &nbsp;&nbsp;&nbsp;
                                Search by status:&nbsp;&nbsp;&nbsp;
                                    <Select style={{ width: 120 }} value={that.state.queryCondition.status}
                                            onChange={this.changeSelectStatus.bind(this)}>
                                        <Option value="2">ALL</Option>
                                        <Option value="0">OFF</Option>
                                        <Option value="1">ON</Option>
                                    </Select>
                            </Col>

                            <Col span="4">
                                <div className="bannerAddBtn">
                                    <Button type="ghost" onClick={this.onClickAddBanner.bind(this)}>+ Add
                                        Banner</Button>
                                </div>
                            </Col>

                        </Row>
                        <div style={{ height: 20 }}></div>
                        <TableList tableRows={tableRows} pagination={pagination}
                               locale = {i18n.tableLocale}  parent={this}
                               scroll={{ y: 240 }} ></TableList>
                    </div>
                </Spin>

                <div>
                    <BannerDialog parent={this}
                                  editDialog={this.state.editDialog} 
                                  editPreviewImageVisible1={this.state.editPreviewImageVisible1} 
                                  editPreviewImageVisible2={this.state.editPreviewImageVisible2} 
                                  editDialogRadioValue={this.state.editDialogRadioValue}
                                  editPreviewImage1={this.state.editPreviewImage1}
                                  editPreviewImage2={this.state.editPreviewImage2}
                                  bannerUploading1={this.state.bannerUploading1}
                                  bannerUploading2={this.state.bannerUploading2}
                                  editDialogVisible={this.state.editDialogVisible}
                    ></BannerDialog>
                </div>
            </div>
        )
    }
}
