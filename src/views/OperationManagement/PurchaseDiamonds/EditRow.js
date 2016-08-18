import React from 'react';
import { Row, Col, Input, Button, Checkbox, Menu, Icon, Select} from 'antd';
import classNames from 'classnames';
import './index.less';

export default class EditRow extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
        };
    }

    checkboxChange(e) {
        this.props.checkboxChange(this.props.rowIndex, e.target.checked ? 1 : 0);
    }

    inputChange(e) {
        this.props.inputChange(this.props.rowIndex, parseFloat(e.target.value));
    }

    render () {

        const data = this.props.data;

        return(
            <div className="m-edit-row">
                <Row className="wrap f-vcenter" type="flex" justify="start">
                    <Col className="u-dia icn f-vcenter">
                        <i className="u-ic u-ic-diamonds-normal"></i>
                        <span className="text">{data.diamonds_amount}</span>
                    </Col>
                    <Col className="chck f-vcenter">
                        <Checkbox defaultChecked={data.tag==0?false:true} onChange={this.checkboxChange.bind(this)}>Checkbox</Checkbox>
                    </Col>
                    <Col className="hot f-vcenter f-hcenter">
                        HOT
                    </Col>
                    <Col className="text1 f-hcenter">
                        Donate
                    </Col>
                    <Col className="ipt f-vcenter">
                        <Input placeholder={data.donate_diamonds_amount} onChange={this.inputChange.bind(this)}></Input>
                    </Col>
                    <Col className="text2">
                        diamonds
                    </Col>
                    <Col className="u-tbox f-vcenter f-hcenter">
                        {'$'+data.price}
                    </Col>
                </Row>
            </div>
        )
    }
}