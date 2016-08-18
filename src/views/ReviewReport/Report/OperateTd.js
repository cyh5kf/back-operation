import React from 'react';
import {Row, Button, Modal} from 'antd';
const confirm = Modal.confirm;

export default class OperateTd extends React.Component {
    constructor (props) {
        super (props);
        this.state = {
            type: 'operate'
        };
    }

    punishClick () {
        const self = this;
        confirm({
            title: 'Are you sure to punish ?',
            content: '',
            onOk() {
                //self.setState({
                //    type: 'punish',
                //});
                self.props.handlePunish();
            },
            onCancel() {},
        });
    }

    ignoreClick () {
        const self = this;
        confirm({
            title: 'Are you sure to ignore ?',
            content: '',
            onOk() {
                //self.setState({
                //    type: 'ignore',
                //});
                self.props.handleIgnore();
            },
            onCancel() {},
        });
    }

    render () {
        const type = this.state.type || 'operate';
        var content = null;
        if (type == 'operate') {
            content = [
                <Row key="r1" type="flex" justify="start" style={{marginBottom: 30}}>
                    <Button type="primary" className="u-btn u-btn-1" onClick={this.punishClick.bind(this)}>Punish</Button>
                </Row>,
                <Row key="r2" type="flex" justify="start">
                    <Button className="u-btn u-btn-1" onClick={this.ignoreClick.bind(this)}>Ignore</Button>
                </Row>
            ];
        }
        else if (type == 'punish')  {
            content = [
                <Row key="r1" type="flex" justify="start" style={{marginBottom: 30}}>
                    <span>Punished</span>
                </Row>
            ];
        }
        else if (type == 'ignore')  {
            content = [
                <Row key="r1" type="flex" justify="start" style={{marginBottom: 30}}>
                    <span>Ignored</span>
                </Row>
            ];
        }

        return (
            <div>
                {content}
            </div>
        )
    }
}
