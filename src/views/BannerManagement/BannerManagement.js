import React from 'react'
import classNames from 'classnames';
import { Row, Col, Icon, Table, Pagination, Modal, message,Input,Button,Spin,Form,Radio,Select,Upload,Switch,InputNumber} from 'antd';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const InputGroup = Input.Group;
import {i18n} from '../../utils/i18n'
import SearchInput from '../../components/Common/SearchInput';
import CommonUtils from '../../utils/CommonUtils';
import {AjaxUtil} from '../auth'
import './index.less'


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
        this.initBannerTableColumns();
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
     * 定义表格所有的咧
     */
    initBannerTableColumns() {
        var that = this;
        this.bannerTableColumns = [
            {
                title: 'Order',
                dataIndex: 'order_no',
                width: 60,
            },
            {
                title: 'Status',
                dataIndex: 'is_active',
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
            {
                title: 'Title',
                dataIndex: 'title'
            },
            {
                title: 'Banner',
                dataIndex: 'pic_url',
                render: function (text, row, index) {
                    var url = row['pic_url'];
                    if (!url) {
                        return <div></div>
                    }
                    return (
                        <div>
                            <a target="_blank" href={url}>
                                <img src={url} style={{width:140,height:40}}/>
                            </a>
                        </div>);
                }
            },
            {
                title: 'Link',
                dataIndex: 'link_url'
            },
            {
                title: 'Share Text',
                dataIndex: 'share_text_url'
            },
            {
                title: 'H5 Pic',
                dataIndex: 'deep_pic_url',
                render: function (text, row, index) {
                    var url = row['deep_pic_url'];
                    if (!url) {
                        return <div></div>
                    }
                    return (
                        <div>
                            <a target="_blank" href={url}>
                                <img src={url} style={{width:40,height:60}}/>
                            </a>
                        </div>);
                }
            },
            {
                title: 'User ID',
                dataIndex: 'uid'
            },
            //{
            //    title: 'Author',
            //    dataIndex: 'address5'
            //},
            {
                title: 'Page Title',
                dataIndex: 'page_title'
            },
            {
                title: 'Language',
                dataIndex: 'lang'
            },
            {
                title: 'Operation',
                dataIndex: 'id',
                width: 100,
                render: function (text, row, index) {
                    return (
                        <div>
                            <a className="tableOperation" onClick={that.onEditItem.bind(that,row)}>Edit</a>
                            <span> | </span>
                            <a className="tableOperation" onClick={that.onDeleteItem.bind(that,row)}>Delete</a>
                        </div>
                    );
                }
            }
        ];
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
                var is_active = checked ? 1 : 0;
                AjaxUtil.bannerSaveOrUpdate({
                    banner_id: row.banner_id,
                    is_active: is_active
                }, function () {
                    that.queryTableContent();
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
        console.log("onDeleteItem", row);
        Modal.confirm({
            title: 'Warning',
            content: 'Are you sure you want  to delete this banner and all its related information?',
            okText: 'Confirm',
            cancelText: 'Cancel',
            onOk() {
                console.log('Yes');
                //delete the item
                AjaxUtil.bannerDeleteItem(row.banner_id, function () {
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
        console.log("onEditItem", row);
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
        console.log("onClickAddBanner");
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
    onEditOK() {
        var that = this;

        var editDialog = that.state.editDialog || {};

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

            that.setState({editDialogVisible: false});
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


    /**
     * 编辑对话框单选按钮Change
     */
    editDialogRadioChange(attr, e) {
        console.log('radio checked', e.target.value);
        this.state.editDialog.type = e.target.value;
        this.setState({
            editDialogRadioValue: e.target.value
        });
    }


    /**
     * 编辑对话框的输入按钮
     * @param a
     * @param b
     * @param c
     */
    editDialogInputChange(attr, e, c) {
        if (attr === 'order_no') {
            this.state.editDialog[attr] = e;
        }
        else if (attr ==='lang'){
            this.state.editDialog[attr] = e;
        }
        else {
            this.state.editDialog[attr] = e.target.value;
        }
        this.setState({});
    }

    /**
     * 编辑对话框的上传组件
     * @param attr
     * @param url
     */
    editDialogUploadChange(attr, url) {
        this.state.editDialog[attr] = url;
        this.setState({});
    }

    renderEditDialog() {

        var that = this;

        var editDialog = this.state.editDialog || {};

        const formItemLayout = {
            labelCol: {span: 6},
            wrapperCol: {span: 14}
        };

        var imagesTypeList = ['image/jpeg', "image/png"];
        var uploadProps = {
            showUploadList: false,
            action: '/upload/file5/upload/official.json?type=image',
            beforeUpload(file) {
                var fileType = file.type;
                const isImg = (imagesTypeList.indexOf(fileType) >= 0);
                if (!isImg) {
                    message.error('只能上传 JPG,PNG 文件哦！');
                }
                return isImg;
            },
            onChange: function (event, b, c, d) {
                that.setState({bannerUploading1:(<div>uploading...</div>)});
                var status = CommonUtils.getObjectValue(event, "file.status");
                if (status === 'done') {
                    var thumbUrl = CommonUtils.getObjectValue(event, "file.response.data.thumb_url");
                    var url = CommonUtils.getObjectValue(event, "file.response.data.url");
                    that.editDialogUploadChange("pic_url", url);
                    that.setState({bannerUploading1:null});
                    that.setState({
                        editPreviewImage1: url,
                        editPreviewImageUrl1: url,
                        editPreviewImageVisible1: true
                    });
                }
            }
        };

        var uploadProps2 = {
            showUploadList: false,
            action: '/upload/file5/upload/official.json?type=image',
            beforeUpload(file) {
                var fileType = file.type;
                const isImg = (imagesTypeList.indexOf(fileType) >= 0);
                if (!isImg) {
                    message.error('只能上传 JPG,PNG 文件哦！');
                }
                return isImg;
            },
            onChange: function (event, b, c, d) {
                that.setState({bannerUploading2:(<div>uploading...</div>)});
                var status = CommonUtils.getObjectValue(event, "file.status")
                if (status === 'done') {
                    var thumbUrl = CommonUtils.getObjectValue(event, "file.response.data.thumb_url");
                    var url = CommonUtils.getObjectValue(event, "file.response.data.url");
                    that.editDialogUploadChange("deep_pic_url", url);
                    that.setState({bannerUploading2:null});
                    that.setState({
                        editPreviewImage2: url,
                        editPreviewImageUrl2: url,
                        editPreviewImageVisible2: true
                    });
                }
            }
        };


        var bannerImgStyle1 = {
            display: this.state.editPreviewImageVisible1 ? "block" : "none",
            width: 160,
            height: 60
        };

        var bannerImgStyle2 = {
            display: this.state.editPreviewImageVisible2 ? "block" : "none",
            width: 80,
            height: 120
        };


        var radioContent = null;
        if (this.state.editDialogRadioValue === 1) {
            radioContent = (
                <div>
                    <div className="bannerUpload0">
                        <div className="bannerUpload1">
                            <span className="bannerRequired"> * </span>
                            <Upload {...uploadProps2}>
                                <Button type="ghost">
                                    <Icon type="upload"/> Upload
                                </Button>
                            </Upload>
                        </div>
                        <div className="bannerUpload2">
                            <img src={this.state.editPreviewImage2} style={bannerImgStyle2}/>
                        </div>
                        {this.state.bannerUploading2}
                        <div className="clearfix"></div>
                    </div>
                    <div style={{height:20}}></div>
                    <div style={{width:300}}>
                        <InputGroup size="large">
                            <Col span="8">
                                <span style={{width:70,display:'inline-block'}}>Page Title</span>
                            </Col>
                            <Col span="16">
                                <Input className="" placeholder="Page Title" value={editDialog.page_title}
                                       onChange={this.editDialogInputChange.bind(this,"page_title")}/>
                            </Col>
                        </InputGroup>
                        <div style={{height:20}}></div>
                        <InputGroup size="large" required>
                            <Col span="8">
                                <span style={{width:70,display:'inline-block'}}> User ID </span>
                            </Col>
                            <Col span="16">
                                <Input className="" placeholder="User ID" value={editDialog.uid}
                                       onChange={this.editDialogInputChange.bind(this,"uid")}/>
                            </Col>
                        </InputGroup>
                    </div>
                </div>
            );
        } else {
            radioContent = (
                <div>

                    <InputGroup size="large">
                        <Col span="8">
                            <span style={{width:70,display:'inline-block'}}> <span className="bannerRequired"> * </span> Link Url</span>
                        </Col>
                        <Col span="16">
                            <Input className="" placeholder="Link Url" value={editDialog.link_url}
                                   onChange={this.editDialogInputChange.bind(this,"link_url")}/>
                        </Col>
                    </InputGroup>
                    <div style={{height:20}}></div>
                    <InputGroup size="large" required>
                        <Col span="8">
                            <span style={{width:70,display:'inline-block'}}> <span className="bannerRequired">  </span> Share Text </span>
                        </Col>
                        <Col span="16">
                            <Input className="" placeholder="Link Text" value={editDialog.share_text_url}
                                   onChange={this.editDialogInputChange.bind(this,"share_text_url")}/>
                        </Col>
                    </InputGroup>
                </div>
            );
        }


        return (
            <div>
                <Modal title="Edit Banner" visible={this.state.editDialogVisible}
                       width={700}
                       onOk={this.onEditOK.bind(this)}
                       onCancel={this.onEditCancel.bind(this)}
                       okText='OK' cancelText='Cancel'>
                    <Form horizontal onSubmit={this.onEditOK.bind(this)}>
                        <FormItem  {...formItemLayout} label="Title :&nbsp;">
                            <Input type="text" placeholder="Title" value={editDialog.title}
                                   onChange={this.editDialogInputChange.bind(this,"title")}/>
                        </FormItem>
                        <FormItem required {...formItemLayout} label="Banner Image :&nbsp;">
                            <div className="bannerUpload0">
                                <div className="bannerUpload1">
                                    <Upload {...uploadProps}>
                                        <Button type="ghost">
                                            <Icon type="upload"/> Upload
                                        </Button>
                                    </Upload>
                                </div>
                                <div className="bannerUpload2">
                                    <img src={this.state.editPreviewImage1} style={bannerImgStyle1}/>
                                </div>
                                {this.state.bannerUploading1}
                                <div className="clearfix"></div>
                            </div>
                        </FormItem>
                        <FormItem required {...formItemLayout} label="Order :&nbsp;">
                            <InputNumber value={editDialog.order_no}
                                         onChange={this.editDialogInputChange.bind(this,"order_no")}/>
                        </FormItem>
                        <FormItem required {...formItemLayout} label="Language :&nbsp;">
                            <Select style={{ width: 120 }} value={editDialog.lang} onChange={this.editDialogInputChange.bind(this,"lang")}>
                                <Option value="all">all</Option>
                                <Option value="en">en</Option>
                                <Option value="ar">ar</Option>
                            </Select>
                        </FormItem>
                        <FormItem {...formItemLayout} label="Jump Option :&nbsp;">
                            <RadioGroup onChange={this.editDialogRadioChange.bind(this,'type')}
                                        value={this.state.editDialogRadioValue}>
                                <Radio key="1" value={1}>H5 Pic</Radio>
                                <Radio key="0" value={0}>Link</Radio>
                            </RadioGroup>
                            {radioContent}
                        </FormItem>
                    </Form>
                </Modal>
            </div>
        );
    }

    render() {

        var that = this;
        var tableColumns = that.bannerTableColumns;
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

        var editDialog = that.renderEditDialog();

        return (
            <div>
                <Spin spining={this.state.loading} tip="loading...">
                    <div>
                        <Row type="flex" justify="start">
                            <Col span="24" className="titleHead">
                                List of banners
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
                        <Table columns={tableColumns} dataSource={tableRows} pagination={pagination}
                               locale = {i18n.tableLocale}
                               scroll={{ y: 240 }}/>
                    </div>
                </Spin>

                <div>
                    {editDialog}
                </div>
            </div>
        )
    }
}
