import React from 'react'
import {Row, Col, Button, DatePicker, Modal, Icon} from 'antd'
import './index.less'

export default class ViewMoreButton extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            loading: false,
            updateState: false,
        };
    }

    onClick () {
        this.setState({
            loading: true
        });
        this.props.viewMoreClick();
    }

    render () {
        if (this.props.updateState != this.state.updateState) {
           this.state.updateState = this.props.updateState;
           this.state.loading = false;
        }
        var content = null;
        if (this.props.updateState) {
            content = [
                <Icon key="1" type="loading" style={{fontSize: 20, color: '#2db7f5'}}></Icon>
            ]
        }
        else {
            content = [
                <a key="1" style={{fontWeight: "bold"}} onClick={this.onClick.bind(this)}>
                    <Row type="flex" justify="center"><Icon type="down" style={{fontSize: 18}}></Icon></Row>
                    <Row type="flex" justify="center">View More</Row>
                </a>
            ]
        }
        return (
            <Row className="info" type="flex" justify="center">
                <Col>
                    {content}
                </Col>
            </Row>
        )
    }
}
