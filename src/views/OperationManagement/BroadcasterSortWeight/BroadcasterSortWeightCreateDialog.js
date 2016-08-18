import React from 'react';
import { Row, Col, Icon, Table, Input, InputNumber,Button, Checkbox,DatePicker,Switch,Modal,Pagination,Select,Form} from 'antd';
const FormItem = Form.Item;


class CreateForm extends React.Component{


    handleSubmit(e){
        var that = this;
        var props = this.props || {};
        var data = props.data || {};

        e.preventDefault();
        console.log('收到表单值：', this.props.form.getFieldsValue());
        this.props.form.validateFields((errors, values) => {
            if (!!errors) {
                console.log('Errors in form!!!');
                return;
            }
            console.log('Submit!!!');
            var newValues = Object.assign({},data,values);
            that.props.onCreateRecordSuccess(newValues,that.props.dialogDataIsUpdate);
        });

    }


    handleCancel(){
        this.props.onCloseDialog();
    }

    checkNumber(rule, value, callback) {
        if ((parseInt(value,10)+"")!=(""+value)) {
            callback(new Error('Must be an integer'));
        } else {
            callback();
        }
    }

    render(){

        var props = this.props || {};
        var data = props.data || {};
        const { getFieldProps } = this.props.form;

        var uidProps = getFieldProps('uid', {
            initialValue:data.uid,
            rules: (!props.dialogDataIsUpdate) ? [{ required: true, message: 'PIXY ID is required' }] :[]
        });

        var weightProps = getFieldProps('weight', {
            initialValue:data.weight,
            rules: (!props.dialogDataIsUpdate) ? [{ required: true, message: 'Must be an integer' ,validator: this.checkNumber}] :[]
        });


        return (
            <Form horizontal form={this.props.form} onSubmit={this.handleSubmit.bind(this)}>
                <FormItem
                    id="control-input-topic"
                    label="PIXY ID : &nbsp;&nbsp;"
                    required
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 14 }}
                >
                    <Input {...uidProps} disabled={this.props.dialogDataIsUpdate} placeholder="Please enter..."  />
                </FormItem>

                <FormItem
                    id="control-input-order"
                    label="Weight : &nbsp;&nbsp;"
                    required
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 14 }}
                >
                    <Input {...weightProps}  placeholder="Please enter..." />
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




export default class BroadcasterSortWeightCreateDialog extends React.Component {
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
                       title="Broadcaster Sort Weight" onOk={this.handleOk} onCancel={handleCancel}
                       footer={[]}>
                    <CreateForm0 dialogDataIsUpdate={this.props.dialogDataIsUpdate} data={this.props.data} onCloseDialog={this.props.onCloseDialog} onCreateRecordSuccess={this.props.onCreateRecordSuccess}></CreateForm0>
                </Modal>
            </div>
        );
    }

}