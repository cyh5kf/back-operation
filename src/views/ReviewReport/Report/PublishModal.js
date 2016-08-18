import React from 'react'
import {Modal, Radio, Row} from 'antd'
import './index.less'

const RadioGroup = Radio.Group;

export default class PublishModal extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            value: 1
        }
    }

    handleOk () {
        this.props.comfirmPublishModal();
    }

    handleCancel () {
        this.props.canclePublishModal();
    }

    onChange (e) {
        this.setState({
            value: e.target.value,
        });
    }

    render () {
        var publishModalVisibal = this.props.publishModalVisibal;

        const radioStyle = {
            display: 'block',
            height: '30px',
            lineHeight: '30px',
        };

        return (
            <div>
                <Modal title="Publish" visible={publishModalVisibal}
                       onOk={this.handleOk.bind(this)} onCancel={this.handleCancel.bind(this)}>
                    <RadioGroup onChange={this.onChange.bind(this)} value={this.state.value}>
                        <Radio style={radioStyle} key="a" value={1}>Freeze account for 1 day</Radio>
                        <Radio style={radioStyle} key="b" value={2}>Freeze account for 15 days</Radio>
                        <Radio style={radioStyle} key="c" value={3}>Freeze account permanently</Radio>
                    </RadioGroup>
                </Modal>
            </div>
        )
    }
}
