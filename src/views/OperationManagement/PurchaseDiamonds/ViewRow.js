import React from 'react';
import { Row, Col, Input, Button, Dropdown, Menu, Icon, Select} from 'antd';
import classNames from 'classnames';
import './index.less';

export default class ViewRow extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
        };
    }

    render () {
        const data = this.props.data;
        var donate = '';
        if (data.donate_diamonds_amount != 0) {
            donate = 'Donate' + data.donate_diamonds_amount + 'diamonds';
        }

        var hotContent = <Col style={{width: 60}}></Col>;
        if (data.tag == 1) {
            hotContent = <Col className="hot f-vcenter f-hcenter">HOT</Col>;
        }
        return(
            <div className="m-view-row">
                <Row className="wrap f-vcenter" type="flex" justify="start">
                    <Col className="u-dia icn f-vcenter">
                        <i className="u-ic u-ic-diamonds-normal"></i>
                        <span className="text">{data.diamonds_amount}</span>
                    </Col>
                    {hotContent}
                    <Col className="tip f-vcenter fs14">
                        {donate}
                    </Col>
                    <Col className="u-tbox f-vcenter f-hcenter">
                        {'$'+data.price}
                    </Col>
                </Row>
            </div>
        )
    }
}