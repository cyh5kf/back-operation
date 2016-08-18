import React, { PropTypes } from 'react'
import { Form, Input, Button, Row, Col, notification, Modal } from 'antd'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {Link} from 'react-router'
import Session from '../Session'
import $ from "jquery"

const createForm = Form.create;
const FormItem = Form.Item;

import './index.less'

function noop() {
    return false;
}


let Register = React.createClass({

    getInitialState() {
        return {
            modalVisible:false
        };
    },

    handleReset(e) {
        e.preventDefault();
        this.props.form.resetFields();
    },

    contextTypes: {
        router: React.PropTypes.object.isRequired
    },

    success(e) {
        let self = this;
        Modal.success({
            title: 'successful registration',
            content: 'Registration success, click the confirmation button to return to the home page',
            okText:'OK',
            onOk() {
                self.context.router.replace('/');
            },
        });
    },

    error(text) {
        let self = this;
        Modal.error({
            title: 'registration failed',
            content: text,
            okText:'OK',
        });
    },

    handleSubmit(e) {
        let self = this;
        console.log('收到表单值：', this.props.form.getFieldsValue());
        this.props.form.validateFields((errors, values) => {
            if (!!errors) {
                console.log('Errors in form!!!');
                return;
            } else {
                $.ajax({
                    url: '/api/v1/cs/register',
                    type: 'post',
                    dataType: 'json',
                    contentType: 'application/json; charset=utf-8',
                    data: JSON.stringify({
                        "name":values.name,
                        "passwd":values.passwd
                    }),
                    async: true,
                    success: function (cont, txtStatus, xhr) {
                        console.log(cont.message);
                        if (xhr.status != 200) {
                            var text = cont.message;
                            console.log("注册失败");
                            self.error(text);
                        } else {
                            console.log("注册成功");
                            self.success();
                            Session.setLogined(true);
                        }

                    },
                })

            }

        });
    },

    userExists(rule, value, callback) {
        if (!value) {
            callback();
        } else {
            setTimeout(() => {
                if (value === 'JasonWood') {
                    callback([new Error('抱歉，该用户名已被占用。')]);
                } else {
                    callback();
                }
            }, 800);
        }
    },

    checkPass(rule, value, callback) {
        const { validateFields } = this.props.form;
        if (value) {
            validateFields(['rePasswd'], { force: true });
        }
        callback();
    },

    checkPass2(rule, value, callback) {
        const { getFieldValue } = this.props.form;
        if (value && value !== getFieldValue('passwd')) {
            callback('两次输入密码不一致！');
        } else {
            callback();
        }
    },


    render() {
        const { getFieldProps, getFieldError, isFieldValidating } = this.props.form;
        const nameProps = getFieldProps('name', {
            rules: [
                { required: true, min: 5, message: '用户名至少为 5 个字符' },
                { validator: this.userExists },
            ],
        });

        const passwdProps = getFieldProps('passwd', {
            rules: [
                { required: true, whitespace: true, message: '请填写密码' },
                { validator: this.checkPass },
            ],
        });
        const rePasswdProps = getFieldProps('rePasswd', {
            rules: [{
                required: true,
                whitespace: true,
                message: '请再次输入密码',
            }, {
                validator: this.checkPass2,
            }],
        });

        return (
            <Row className="login-row" type="flex" justify="space-around" align="middle">
                <Col span="8">
                    <Form form={this.props.form} horizontal>
                        <div className="registerTitle">注册</div>
                        <div className="login-form">
                            <FormItem
                                label='用户名：'
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 14 }}
                                help={isFieldValidating('name') ? '校验中...' : (getFieldError('name') || []).join(', ')}
                                hasFeedback
                            >
                                <Input placeholder='admin'  {...nameProps} />
                            </FormItem>
                            <FormItem
                                label='密码：'
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 14 }}
                                hasFeedback
                            >
                                <Input type='password' placeholder='123456' {...passwdProps} autoComplete="off"
                                       onContextMenu={noop} onPaste={noop} onCopy={noop} onCut={noop} />
                            </FormItem>
                            <FormItem
                                label='确认密码：'
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 14 }}
                                hasFeedback
                            >
                                <Input type='password' placeholder='123456' {...rePasswdProps} autoComplete="off" placeholder="两次输入密码保持一致"
                                       onContextMenu={noop} onPaste={noop} onCopy={noop} onCut={noop} />
                            </FormItem>
                            <Row>
                                <Col span='16' offset='6'>
                                    <Button type='primary' onClick={this.handleSubmit}>注册</Button>
                                    &nbsp;&nbsp;&nbsp;
                                    <Button type="ghost" onClick={this.handleReset}>重置</Button>
                                </Col>
                            </Row>
                        </div>
                    </Form>
                </Col>
            </Row>
        );
    },
});

Register = createForm()(Register);

export default Register;