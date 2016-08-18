import React from 'react'
import {Row, Col, Icon, Menu, Dropdown, Modal, Button} from 'antd'
import './index.less'
import {Link} from 'react-router'
import Session from '../../views/Session'
import {AjaxUtil} from '../../views/auth'
import $ from "jquery"

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

export default class Header extends React.Component {
  constructor(props) {
    super(props);

  }

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  error = (event) => {

    Modal.error({
      title: 'notice',
      content: 'Page login information has expired, please re login',
      okText: 'OK',
      onOk: () => {
        this.context.router.replace('/login');
        Session.setLogined(false);
      }
    });
  }

  handleClick(e) {
    console.log('click ', e);
    this.setState({
      current: e.key
    });
  }

  handleLogout = (event) => {
    var cbsuccess = function (cont, txtStatus, xhr) {
      if (xhr.status === 200) {
        Session.setLogined(false);
        this.context.router.replace('/login');
      }
    }
    var cberror = function () {
      this.error();
    }
    AjaxUtil.logout(cbsuccess.bind(this), cberror.bind(this));

  }

  render() {
    var user = Session.getUser();

    return (
        <div className='ant-layout-header'>
          <div className="header-logo">PIXY Operation</div>
          <div className="header-right">
            <Link to="/PersonalInfomation">
              <span className="userName"><i className="iconfont" >&#xe602;</i>{user}</span>
            </Link>
            <span className="logout" onClick={this.handleLogout}><Icon type="poweroff" className="poweroff" />Logout</span>
          </div>
        </div>
    )
  }
}