import React from 'react';
import { Row, Col, Icon, Table, Input, InputNumber,Button, Checkbox,DatePicker,Switch,Modal,Pagination,Select,Form} from 'antd';
const FormItem = Form.Item;


class CreateForm extends React.Component{
     constructor(props) {
        super(props);
        this.state= {
            score:this.props.data.score
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({score:nextProps.data.score});
    }


    handleSubmit(e){
        e.preventDefault();
        let newRecord = {
            score: this.state.score,
            uid: this.props.data.uid
        }
        this.props.onCreateRecordSuccess(newRecord);
    }


    onChangeScore(e) {
        this.setState({
            score:e.target.value
        });
    }


    handleCancel(){
        this.props.onCloseDialog();
    }

    render(){
        let score = this.state.score;

        return (
            <Form horizontal form={this.props.form} onSubmit={this.handleSubmit.bind(this)}>
                <FormItem
                    id="control-input-topic"
                    label="Score : &nbsp;&nbsp;"
                    required
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 14 }}
                >
                    <Input value={score} onChange={this.onChangeScore.bind(this)} placeholder="Please enter..."  />
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

CreateForm = Form.create()(CreateForm);




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
        return (
            <div>
                <Modal ref="modal"
                       visible={this.props.visible}
                       title="Talker Sort Weight" onOk={this.handleOk} onCancel={handleCancel}
                       footer={[]}>
                    <CreateForm data={this.props.data} onCloseDialog={this.props.onCloseDialog} onCreateRecordSuccess={this.props.onCreateRecordSuccess}></CreateForm>
                </Modal>
            </div>
        );
    }

}