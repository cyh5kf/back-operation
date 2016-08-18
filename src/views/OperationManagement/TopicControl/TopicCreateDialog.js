import React from 'react';
import { Row, Col, Icon, Table, Input, Button, Checkbox,DatePicker,Switch,Modal,Pagination,Select,Form} from 'antd';
const FormItem = Form.Item;



class CreateForm extends React.Component{


    handleSubmit(e){
        var that = this;
        e.preventDefault();
        console.log('收到表单值：', this.props.form.getFieldsValue());
        this.props.form.validateFields((errors, values) => {
            if (!!errors) {
                console.log('Errors in form!!!');
                return;
            }
            console.log('Submit!!!');
            that.props.onCreateTopicSuccess(values);
        });

    }


    handleCancel(){
        this.props.onCloseDialog();
    }


    render(){

        const { getFieldProps } = this.props.form;

        const topicProps = getFieldProps('topic', {
            rules: [
                { required: true, whitespace: true, max:40,message: 'topic is required , at most 40 characters' }
            ]
        });
        const orderProps = getFieldProps('order', {
            rules: [{required: true,message: 'please input order'}]
        });

        return (
            <Form horizontal form={this.props.form} onSubmit={this.handleSubmit.bind(this)}>
                <FormItem
                    id="control-input-topic"
                    label="Topic : &nbsp;&nbsp;"
                    required
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 14 }}
                >
                    <Input {...topicProps} placeholder="Please enter..."  />
                </FormItem>

                <FormItem
                    id="control-input-order"
                    label="Order : &nbsp;&nbsp;"
                    required
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 14 }}
                >
                    <Input {...orderProps} placeholder="Please enter..." />
                </FormItem>
                <FormItem wrapperCol={{ span: 16, offset: 6 }} style={{ marginTop: 24 }}>
                    <Button type="primary" htmlType="submit">Save</Button>
                    &nbsp;&nbsp;
                    <Button type="ghost" onClick={this.handleCancel.bind(this)} >Cancel</Button>
                </FormItem>
            </Form>
        );
    }
}




export default class TopicCreateDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    handleOk(){

    }


    render() {
        var that = this;
        var state = that.state || {};
        var handleCancel = function(){
            that.props.onCloseDialog();
        };
        var CreateForm0 = Form.create()(CreateForm);
        console.log("TopicCreateDialog render ..")
        return (
            <div>
                <Modal ref="modal"
                       visible={this.props.visible}
                       title="Add Topic" onOk={this.handleOk} onCancel={handleCancel}
                       footer={[]}>
                    <CreateForm0 onCloseDialog={this.props.onCloseDialog} onCreateTopicSuccess={this.props.onCreateTopicSuccess}></CreateForm0>
                </Modal>
            </div>
        );
    }

}