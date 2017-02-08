import React, { PropTypes } from 'react'
import { Menu, Icon } from 'antd'
import {Link} from 'react-router'
import '../views/Sidebar/index.less'

const SubMenu = Menu.SubMenu;

export default class OMGSidebar extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            
        };
    }

    render () {
        var pathname = location.pathname;
        const selectedKeys = [pathname];

        return (
            <div className={this.props.class_name}>
                <Menu style={{height: "100%"}}
                      selectedKeys = {selectedKeys}>
                    <Menu.Item key="/homeAd">
                        <Link to="/homeAd">
                            SOMA Home Advertisement
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="/gameCenter">
                        <Link to="/gameCenter">
                            SOMA Game Center
                        </Link>
                    </Menu.Item> 
                </Menu>
            </div>
        )
    }
}
