import React from 'react'
import {Table, Row, Col, Button, Icon, Switch, message, InputNumber, Modal, Input, Form, Select} from 'antd'
import './index.less'
import '../../../components/Common/common.less'
import {AjaxUtil,CheckToken} from '../../auth';
const createForm = Form.create;
const FormItem = Form.Item;
const Option = Select.Option;

function noop() {
    return false;
}

export default class AddModifyModal extends React.Component {
    constructor (props) {
        super(props);
        this.state={
            addOrMdify: '',
            pixyId: '',
            order: '',
            language: '',
            disabled: ''
        };
    }


    success() {
        message.success('Successful Recommend');
    }

    error() {
        message.error('Recommend failure');
    }

        /**
     * 编辑按钮的确定
     */
    onAddEditOK() {
        var isOK = this.validateEditDialog();
        if (isOK) {
            var data = {
                "uid": this.state.pixyId,
                "order": this.state.order,
                "lang": this.state.language
            }
            this.props.cancelModal();
            this.props.editRecommend(data);
        }
    }

    validateEditDialog() {
        var reg = /^\d{8}$/;
        if (!this.state.pixyId) {
            message.error("pixyId cannot empty !");
            return false;
        } else if(!reg.test(this.state.pixyId)) {
            message.error("Please enter the 8-digit");
            return false;
        }

        if (!this.state.order) {
            message.error("Order cannot empty !");
            return false;
        }

        if(!this.state.language){
            message.error("language cannot empty !");
            return false;
        }

        return true;
    }

    /**
     * 编辑按钮的取消
     */
    onAddEditCancel() {
        this.props.cancelModal();
    }

    /**
     * 编辑对话框的输入按钮
     */
    editDialogInputChange(attr, e) {
        if (attr === 'pixyId') {
            this.setState({pixyId: e.target.value});
        } else if(attr === 'order') {
            this.setState({order: e});
        } else if(attr === 'language') {
            this.setState({language: e});
        }  
    }

    componentWillMount() {
        var addOrEdit = this.props.addOrEdit;
        if (addOrEdit == 'edit') {
            var uid = this.props.editModalData.uid;
            var order = this.props.editModalData.order;
            var language = this.props.editModalData.language;
            this.setState({
                pixyId: uid,
                order: order,
                language: language,
                disabled: 'disabled'
            })
        } else {
            this.setState({
                pixyId: '',
                order: '',
                language: '',
                disabled: ''
            })
        }
    }

    render () {
        const formItemLayout = {
            labelCol: {span: 6},
            wrapperCol: {span: 14}
        };

        return (
            <div>
                <Modal title={this.props.addOrEdit} visible={this.props.editDialogVisible}
                       width={700}
                       onOk={this.onAddEditOK.bind(this)}
                       onCancel={this.onAddEditCancel.bind(this)}
                       okText='OK' cancelText='Cancel'>
                    <Form horizontal>
                        <FormItem  {...formItemLayout} label="PIXY ID :&nbsp;&nbsp;" required>
                            <Input type="text" disabled={this.state.disabled} value={this.state.pixyId} onChange={this.editDialogInputChange.bind(this, 'pixyId')} />
                        </FormItem>
                        <FormItem required {...formItemLayout} label="Order :&nbsp;&nbsp;">
                            <InputNumber value={this.state.order} onChange={this.editDialogInputChange.bind(this, 'order')} />
                        </FormItem>
                        <FormItem
                            label="language :&nbsp;&nbsp;"
                            {...formItemLayout}
                            required>
                            <Select value={this.state.language} onChange={this.editDialogInputChange.bind(this, 'language')}> 
                                <Option value="en">English</Option>
                                <Option value="ar">Arabic</Option>
                                <Option value="all">All</Option>
                            </Select>
                        </FormItem>
                    </Form>
                </Modal>
            </div>
        );
    }
}

AddModifyModal = Form.create({})(AddModifyModal);
