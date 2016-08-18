import React from 'react'
import { Modal, Button, Form, Input, Row, Col, message} from 'antd';
import './index.less'
import {AjaxUtil} from '../auth'
import {Session} from '../Session'
const createForm = Form.create;
const FormItem = Form.Item;


function noop() {
    return false;
}

export class ModifyPasswd extends React.Component {
    constructor(props) {
        super(props);
        //this.state = {newpasswd: "", passwd:"", verifypasswd:""};
    }

    componentWillMount () {
    }

    setPasswordVisible() {
        this.props.canclePasswdDialog();
    }

    static contextTypes = {
        router: React.PropTypes.object.isRequired
    }

    error(text) {
        let self = this;
        Modal.error({
            title: 'warning',
            content: text,
            okText:'OK'
        });
    }

    tokenError(e) {
        var self = this;
        Modal.error({
            title: 'warning',
            content: 'Page login information has expired, please re login!',
            okText: 'OK',
            onOk() {
                self.context.router.replace('/login');
                Session.setLogined(false);
            }
        });
    }

    success () {
        message.success('success modify password!');
    }

    handleSubmit(e) {
        let self = this;
        const email = this.props.email;
        console.log('收到表单值：', this.props.form.getFieldsValue());
        this.props.form.validateFields((errors, values) => {
            if (!!errors) {
                console.log('Errors in form!!!');
                return;
            } else {
                console.log("保存成功");
                var cbsuccess = function (cont, txtStatus, xhr) {
                    if (xhr.status === 200) {
                        console.log("修改密码成功");
                        self.success();
                    } else if(xhr.status === 403){
                        self.error('用户所属角色权限不够，无法执行该方法');
                    } else {
                        self.error("error modify password");
                    }
                }
                var cberror = function () {
                    self.tokenError();
                }
                AjaxUtil.modifypasswd(cbsuccess.bind(this),cberror.bind(this),email,values.passwd,values.rePasswd);
                this.props.canclePasswdDialog();
            }

        });
    }

    checkPass(rule, value, callback) {
        const { validateFields } = this.props.form;
        if (value) {
            validateFields(['rePasswd'], { force: true });
        }
        callback();
    }

    checkPass2(rule, value, callback) {
        const { getFieldValue } = this.props.form;
        if (value && value !== getFieldValue('newPasswd')) {
            callback('Two input passwords are not consistent!');
        } else {
            callback();
        }
    }

    handleInputKeyPress (e) {
        //监听enter键
        if (e.keyCode == '13') {
            this.handleSubmit();
        }
    }


    render () {
        var passwordVisible = this.props.passwordVisible;
        const { getFieldProps, getFieldError, isFieldValidating } = this.props.form;
        const passwdProps = getFieldProps('passwd', {
            rules: [
                { required: true, whitespace: true, message: 'Please fill in the password' }
            ]
        });
        const newPasswdProps = getFieldProps('newPasswd', {
            rules: [{
                required: true,
                whitespace: true,
                message: 'Please fill in the new password'
            }, {
                validator: this.checkPass.bind(this)
            }]
        });
        const rePasswdProps = getFieldProps('rePasswd', {
            rules: [{
                required: true,
                whitespace: true,
                message: 'Please enter your password again'
            }, {
                validator: this.checkPass2.bind(this)
            }]
        });
        

        return (
            <div>
                <Modal
                    title="Modify Password"
                    wrapClassName="vertical-center-modal"
                    visible={passwordVisible}
                    onOk={this.handleSubmit.bind(this)}
                    onCancel={this.setPasswordVisible.bind(this)}
                    okText="Save"
                    cancelText="Cancel">
                    <Row className="" type="flex" justify="space-around" align="middle">
                        <Col span="24" offset="2">
                            <Form form={this.props.form} horizontal>
                                <FormItem
                                    label='Old Password：'
                                    labelCol={{ span: 8 }}
                                    wrapperCol={{ span: 12 }}
                                    hasFeedback
                                >
                                    <Input type='password' {...passwdProps} autoComplete="off"
                                           onContextMenu={noop} onPaste={noop} onCopy={noop} onCut={noop} onKeyDown={this.handleInputKeyPress.bind(this)} />
                                </FormItem>
                                <FormItem
                                    label='New Password：'
                                    labelCol={{ span: 8 }}
                                    wrapperCol={{ span: 12 }}
                                    hasFeedback
                                >
                                    <Input type='password' {...newPasswdProps} autoComplete="off"
                                           onContextMenu={noop} onPaste={noop} onCopy={noop} onCut={noop} onKeyDown={this.handleInputKeyPress.bind(this)} />
                                </FormItem>
                                <FormItem
                                    label='Confirm Password：'
                                    labelCol={{ span: 8 }}
                                    wrapperCol={{ span: 12 }}
                                    hasFeedback
                                >
                                    <Input type='password' {...rePasswdProps} autoComplete="off"
                                           onContextMenu={noop} onPaste={noop} onCopy={noop} onCut={noop} onKeyDown={this.handleInputKeyPress.bind(this)} />
                                </FormItem>
                            </Form>
                        </Col>
                    </Row>
                </Modal>
            </div>
        )
    }
}

ModifyPasswd = createForm()(ModifyPasswd);
