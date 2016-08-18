import {Modal} from 'antd'
import Session from './Session'
import {History} from './RoutePath/History';
import {formPost} from '../utils/CommonUtils';

function onAjaxError (e,onError) {

  if (onError) {
    onError(e);
    return;
  }

  var msgMap = {
    '401': {
      msg: 'Page login information has expired, please re login',
      handler: function () {
        History.replace('/login');
        Session.setLogined(false);
      }
    },
    '404': {
      msg: '404',
      handler: function () {
      }
    },
    '207':{
      msg: 'system error',
      handler: function () {
      }
    }
  };


  var msgObject = msgMap['' + e.status];
  if (msgObject) {
    Modal.error({
      title: 'notice',
      content: msgObject.msg,
      okText: 'OK',
      onOk() {
        msgObject.handler();
      }
    });
  }

}



export class CheckToken {
  /**
   * check 如果失败,就跳转到登录页面
   */
  static check () {
    var cbsuccess = function (cont, txtStatus, xhr) {

    };
    var cberror = function () {
      Modal.error({
        title: '注意',
        content: 'Page login information has expired, please re login',
        okText: 'OK',
        onOk() {
          History.replace('/login');
          Session.setLogined(false);
        }
      });
    };
    AjaxUtil.checkToken(cbsuccess.bind(this), cberror.bind(this));
  }
}

/**
 * 与$.post的区别是使用payload传输数据,并提供了默认的异常处理
 * @param url
 * @param callback
 * @param onError
 */
function ajaxPost(url,data,callback,onError,onComplete){
  $.ajax({
    url: url,
    type: 'POST',
    contentType: 'application/json; charset=utf-8',
    dataType:"json",
    success: callback,
    data:JSON.stringify(data),
    error: function(e){
      onAjaxError(e,onError);
    },
    complete:onComplete
  });
}

function ajaxGet(url,callback,onError,onComplete){
  $.ajax({
    url: url,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    success: callback,
    error: function(e){
      onAjaxError(e,onError);
    },
    complete:onComplete
  });
}

function ajaxDelete(url,callback,onError,onComplete){
  $.ajax({
    url: url,
    type: 'DELETE',
    contentType: 'application/json; charset=utf-8',
    success: callback,
    error: function(e){
      onAjaxError(e,onError);
    },
    complete:onComplete
  });
}




export class AjaxUtil {

  static checkToken(cbsuccess,cberror) {
    $.ajax({
      url: '/api/v1/back/heartbeat',
      type: 'GET',
      contentType: 'application/json; charset=utf-8',
      xhrFields: {
        withCredentials: true
      },
      async: true,
      success: cbsuccess,
      error: cberror
    })
  }

  static login(cbsuccess,email,passwd) {
    $.ajax({
      url: '/api/v1/back/login?email=' + email + '&passwd=' + passwd,
      type: 'GET',
      dataType: 'json',
      contentType: 'application/json; charset=utf-8',
      async: true,
      success: cbsuccess
    })
  }

  static logout(cbsuccess,cberror) {
    $.ajax({
      url: '/api/v1/back/logout',
      type: 'GET',
      dataType: 'json',
      contentType: 'application/json; charset=utf-8',
      async: true,
      success: cbsuccess,
      error: cberror
    })
  }

  static register(cbsuccess,cberror,email,passwd,rolename) {
    $.ajax({
      url: '/api/v1/back/register',
      type: 'POST',
      dataType: 'json',
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify({
        "email":email,
        "passwd":passwd,
        "rolename":rolename
      }),
      async: true,
      success: cbsuccess,
      error: cberror
    })
  }

  static getrolepermission(cbsuccess, cberror) {
    $.ajax({
      url: '/api/v1/back/getrolepermission',
      type: 'GET',
      dataType: 'json',
      contentType: 'application/json; charset=utf-8',
      async: true,
      success: cbsuccess,
      error: cberror
    })
  }

  static modifypasswd(cbsuccess,cberror,email,passwd,changepasswd) {
    $.ajax({
      url: '/api/v1/back/modifypasswd',
      type: 'PUT',
      dataType: 'json',
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify({
        "email":email,
        "passwd":passwd,
        "changepasswd":changepasswd
      }),
      async: true,
      success: cbsuccess,
      error: cberror
    })
  }
  /**
   *  获取所有客服信息
   */
  static getoperators(cbsuccess,cberror) {
    $.ajax({
      url: '/api/v1/back/getoperators',
      type: 'GET',
      dataType: 'json',
      contentType: 'application/json; charset=utf-8',
      async: true,
      success: cbsuccess,
      error: cberror
    })
  }
  /**
   *  删除客服
   */
  static deletestaff(cbsuccess,operatiorid) {
    $.ajax({
      url: '/api/v1/back/deletestaff/' + operatiorid,
      type: 'DELETE',
      dataType: 'json',
      contentType: 'application/json; charset=utf-8',
      async: true,
      success: cbsuccess,
    })
  }
  /**
   *  修改客服信息
   */
  static modifystaff(cbsuccess,cberror,email,passwd,rolename) {
    $.ajax({
      url: '/api/v1/back/modifystaff',
      type: 'PUT',
      dataType: 'json',
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify({
        "email":email,
        "passwd":passwd,
        "rolename":rolename
      }),
      async: true,
      success: cbsuccess,
      error: cberror
    })
  }
  /***********************************
   *******  UserQuery
   /***********************************

   /**
   *  使用Pixy id 查询用户信息
   */
  static queryUserInfo (cbsuccess, cberror, uid) {
    ajaxGet('/api/v1/back/user/info?uid=' + uid, cbsuccess, cberror);
  }

  /**
   *  使用Pixy id 查询recharge records
   */
  static queryUserRecharge (cbsuccess, cberror, data) {
    ajaxPost('/api/v1/back/user/charge', data, cbsuccess, cberror);
  }

  /**
   *  使用Pixy id 查询exchange records
   */
  static queryUserExchange (cbsuccess, cberror, data) {
    ajaxPost('/api/v1/back/user/exchange', data, cbsuccess, cberror);
  }

  /**
   *  使用Pixy id 查询withdrawal records
   */
  static queryUserWithdrawal (cbsuccess, cberror, data) {
    ajaxPost('/api/v1/back/user/withdrawal', data, cbsuccess, cberror);
  }

  /**
   *  使用Pixy id 查询illegal records
   */
  static queryUserIllegal (cbsuccess, cberror, data) {
    ajaxPost('/api/v1/back/user/illegal', data, cbsuccess, cberror);
  }
  /**
   *  使用Pixy id 查询illegal records
   */
  static queryUserGiftsend (cbsuccess, cberror, data) {
    ajaxPost('/api/v1/back/user/giftsend', data, cbsuccess, cberror);
  }
  /**
   *  使用Pixy id 查询illegal records
   */
  static queryUserGiftreceived (cbsuccess, cberror, data) {
    ajaxPost('/api/v1/back/user/giftreceived', data, cbsuccess, cberror);
  }


  /***********************************
   *******  WithdrawalLimit
  /***********************************

  /**
   *  获取全部数据
   */
  static querywithdrawlimit (cbsuccess) {
    $.ajax({
      url: '/api/v1/back/operation/querywithdrawlimit',
      type: 'GET',
      dataType: 'json',
      contentType: 'application/json; charset=utf-8',
      async: true,
      success: cbsuccess
    })
  }
  /**
   *  提交新数据(全量数据,包括老的数据)
   */
  static publishWithdrawlimit  (cbsuccess, data) {
    ajaxPost('/api/v1/back/operation/publishwithdrawlimit', data, cbsuccess);
  }

  /***********************************
   *******  PurchaseDiamonds
   /***********************************

   /**
   *  获取全部数据
   */
  static queryCashChargeProduct (cbsuccess, channel) {
    ajaxGet('/api/v1/back/operation/querycashchargeproduct?channel=' + channel, cbsuccess);
  }
  /**
   *  提交新数据(全量数据,包括老的数据)
   */
  static publishCashChargeProduct  (cbsuccess, data) {
    ajaxPost('/api/v1/back/operation/publishcashchargeproduct', data, cbsuccess);
  }

  /***********************************
   *******  ExchangeDiamonds
   /***********************************

   /**
   *  获取全部数据
   */
  static queryStarChargeProduct (cbsuccess, channel) {
    ajaxGet('/api/v1/back/operation/querystarchargeproduct?channel=' + channel, cbsuccess);
  }
  /**
   *  提交新数据(全量数据,包括老的数据)
   */
  static publishStarChargeProduct (cbsuccess, data) {
    ajaxPost('/api/v1/back/operation/publishstarchargeproduct', data, cbsuccess);
  }

  /********************************************
   * pixy data
   *******************************************/
  /**
   * 总用户数
   */
  static getTotalUser (cbsuccess) {
    ajaxGet('/api/v1/statis/offline/getTotalUser', cbsuccess);
  }

  static getDataWithoutDim (cbsuccess, data) {
    ajaxGet('/api/v1/statis/offline/dataWithoutDim?indicatorName=' + data.indicatorName
        + '&fromDateStr=' + data.fromDateStr
        + '&toDateStr=' + data.toDateStr, cbsuccess);
  }
  static getDataWithOneDim (cbsuccess, data) {
    ajaxGet('/api/v1/statis/offline/dataWithOneDim?indicatorName=' + data.indicatorName
        + '&fromDateStr=' + data.fromDateStr
        + '&toDateStr=' + data.toDateStr
        + '&dim1Key=' + data.type, cbsuccess);
  }
  /**
   * 七日留存数据
   */
  static retainDataWithoutDim (cbsuccess, data) {
    ajaxGet('/api/v1/statis/offline/retainDataWithoutDim?registerDateStr=' + data.registerDateStr, cbsuccess);
  }
  static retainDataWithOneDim (cbsuccess, data) {
    ajaxGet('/api/v1/statis/offline/retainDataWithOneDim?'
        + 'registerDateStr=' + data.registerDateStr
        + '&dim1Key=' + data.type, cbsuccess);
  }
  /**
   * 实时数据
   */
  static onlineStatisticsData (cbsuccess, data) {
    ajaxPost('/api/v1/statis/online', data, cbsuccess);
  }
  /**
   * 获取各个维度的所有可选项
   */
  static onlineStatisticsDim (cbsuccess, data) {
    ajaxGet('/api/v1/statis/online/dim?dimName='+data.dimName, cbsuccess);
  }
  /***********************************
  *******  ReviewReport
  /***********************************

  /**
  *  获取全部举报数据
  *  @size: 数据条数
  */
  static queryreport (cbsuccess, size) {
    $.ajax({
      url: '/api/v1/back/report?size=' + size,
      type: 'GET',
      dataType: 'json',
      contentType: 'application/json; charset=utf-8',
      async: true,
      success: cbsuccess
    })
  }
  /**
   *  提交一条举报记录的操作, 包括操作结果\原因\时间等
   */
  static commitreport (cbsuccess, cberror, data) {
    $.ajax({
      url: '/api/v1/back/report',
      type: 'POST',
      dataType: 'json',
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify(data),
      async: true,
      success: cbsuccess,
      error: function(e){
        onAjaxError(e);
      }
    })
  }

  /**
   *  获取监控截图
   */
  static monitorPicture (cbsuccess, cberror) {
    $.ajax({
      url: '/api/v1/back/monitor',
      type: 'GET',
      dataType: 'json',
      contentType: 'application/json; charset=utf-8',
      async: true,
      success: cbsuccess,
      error: cberror
    })
  }


  /**
   * 监控页面关闭频道
   */
  static monitorKillChannel(channel_id, userId, onSuccess) {
    ajaxGet('/api/v1/back/killchannel?channel_id=' + channel_id + '&userId=' + userId, onSuccess);
  }

 /**
   * 查询已被ban用户
   */
  static queryBan(onSuccess,onError,data){
    ajaxPost("/api/v1/back/ban/userlist",data,onSuccess,onError);
  }

 /**
   * 查询用户直播间状态
   */
  static queryChannelInfo (cbsuccess, cberror, uid) {
    ajaxGet('/api/v1/back/user/channelinfo?uid=' + uid, cbsuccess, cberror);
  }

  /**
   * 关闭频道
   */
  static closeChannel (cbsuccess, cberror, channel_id) {
    ajaxGet('/api/v1/back/user/channel/kill?channel_id=' + channel_id, cbsuccess, cberror);
  }

  /**
   * 解禁被ban用户
   */
  static recoverChannel (cbsuccess, cberror, uid) {
    ajaxGet('/api/v1/back/user/illegal/recover?uid=' + uid, cbsuccess, cberror);
  }


  /**
   * 查询Banner表格的数据
   * @param onSuccess
   */
  static bannerQuery(queryCondition,onSuccess,onComplete){
    console.log('queryBannerTable',queryCondition);
    ajaxPost("/api/v1/back/banner",queryCondition,onSuccess,null,onComplete);
  }


  /**
   * 删除一条banner记录
   * @param banner_id
   * @param onSuccess
     */
  static bannerDeleteItem(banner_id,onSuccess){
    ajaxDelete("/api/v1/back/banner/"+banner_id,onSuccess);
  }


  /**
   * 保存或编辑一个banner记录
   * @param data
   * @param onSuccess
     */
  static bannerSaveOrUpdate(data,onSuccess){
    ajaxPost('/api/v1/back/banner/edit',data,onSuccess);
  }


  /**
   * 提现申请列表的查询接口
   */
  static queryWithdrawalApplicationList(data,onSuccess){
    ajaxPost('/api/v1/back/withdrawal/application/list',data,onSuccess);
  }


  /**
   * 提现申请列表的操作接口,reject
   */
  static rejectWithdrawalApplication(model,onSuccess){
    ajaxPost('/api/v1/back/withdrawal/application/reject',model,onSuccess);
  }

  /**
   * 提现申请列表的操作接口,approve
   */
  static approveWithdrawalApplication(model,onSuccess){
    ajaxPost('/api/v1/back/withdrawal/application/approve',model,onSuccess);
  }



  /**
   * 发送直播通知
   * @param pixyId
   * @param onSuccess
   */
  static sendLiveNotice(pixyId, onSuccess,onError) {
    ajaxGet('/api/v1/back/liveNotice/sendLiveNotice?pixyId=' + pixyId, onSuccess,onError);
  }




  /***********************************
  *******  签约解约操作接口
  /***********************************/
  

  static sign(onSuccess,onError,data){
    ajaxPost("/api/v1/back/operation/sign",data,onSuccess,onError);
  }

  static querySignedUser(onSuccess,onError,data){
    ajaxPost("/api/v1/back/operation/querysigneduser",data,onSuccess,onError);
  }

  static exportAsExcelSignUser(condition){
    formPost('/api/v1/back/operation/exportAsExcelSignUser',condition);
  }

    /***********************************
  *******  推荐主播列表操作接口
  /***********************************/
  
  //查询推荐主播信息
  static queryRecommend(onSuccess,onError,data){
    ajaxPost("/api/v1/back/user/recommend",data,onSuccess,onError);
  }

  // static addRecommend(onSuccess,onError,data){
  //   ajaxPost("/api/v1/back/user/recommend/add",data,onSuccess,onError);
  // }
  //添加编辑推荐主播
  static editRecommend(onSuccess,onError,data,addOrEdit){
    ajaxPost("/api/v1/back/user/recommend/"+addOrEdit,data,onSuccess,onError);
  }
  //删除推荐主播
  static deleteRecommend(onSuccess,onError,data){
    ajaxDelete('/api/v1/back/user/recommend/'+data,onSuccess,onError);
  }


  /********************************************
   * 直播互动接口
   *******************************************/
  static getRobotList(onSuccess, onError) {
    //获取机器人列表
    ajaxGet('/api/v1/back/robotlist', onSuccess, onError);
  }

  static getChannelList(onSuccess, onError) {
    //获取频道列表
    ajaxGet('/api/v1/back/channellist', onSuccess, onError);
  }

  static enterRoomAction(actionMo, onSuccess, onError,onComplete) {
    //进入频道
    ajaxPost('/api/v1/back/enterroom', actionMo, onSuccess, onError,onComplete);
  }

  static leaveRoomAction(actionMo, onSuccess, onError,onComplete) {
    //离开频道
    ajaxPost('/api/v1/back/leaveroom', actionMo, onSuccess, onError,onComplete);
  }

  static sendInteractionMsg(actionMo, onSuccess, onError,onComplete) {
    //发送消息
    ajaxPost('/api/v1/back/sendmessage', actionMo, onSuccess, onError,onComplete);
  }


  /***********************************
   *******  主播直播历史接口
   /***********************************/


  static queryLiveLog(onSuccess,onError,data){
    ajaxPost("/api/v1/back/livelog",data,onSuccess,onError);
  }


  /****主播申请表 from SOMA  ****/
  static queryJoinApplicationList(condition,onSuccess, onError,onComplete){
    ajaxPost('/api/v1/back/joinApplication/list',condition,onSuccess, onError,onComplete);
  }

  static rejectJoinApplication(joinApplicationMo,onSuccess, onError,onComplete){
    ajaxPost('/api/v1/back/joinApplication/reject',joinApplicationMo,onSuccess, onError,onComplete);
  }

  static approveJoinApplication(joinApplicationMo,onSuccess, onError,onComplete){
    ajaxPost('/api/v1/back/joinApplication/approve',joinApplicationMo,onSuccess, onError,onComplete);
  }


  /****主播申请表from pixy ****/
  static queryPixyJoinApplicationList(condition,onSuccess, onError,onComplete){
    ajaxPost('/api/v1/back/joinApplicationPixy/list',condition,onSuccess, onError,onComplete);
  }

  static rejectPixyJoinApplication(joinApplicationMo,onSuccess, onError,onComplete){
    ajaxPost('/api/v1/back/joinApplicationPixy/reject',joinApplicationMo,onSuccess, onError,onComplete);
  }

  static approvePixyJoinApplication(joinApplicationMo,onSuccess, onError,onComplete){
    ajaxPost('/api/v1/back/joinApplicationPixy/approve',joinApplicationMo,onSuccess, onError,onComplete);
  }


  /***主播排序额外权重预设表***/
  static queryBroadcasterSortWeightList(condition, onSuccess, onError, onComplete) {
    ajaxPost('/api/v1/back/broadcasterSortWeight/list', condition, onSuccess, onError, onComplete);
  }

  static saveBroadcasterSortWeight(entity, isUpdate, onSuccess, onError, onComplete) {
    ajaxPost('/api/v1/back/broadcasterSortWeight/save?is_update=' + isUpdate, entity, onSuccess, onError, onComplete);
  }

  static deleteBroadcasterSortWeight(uid, onSuccess, onError, onComplete) {
    ajaxDelete('/api/v1/back/broadcasterSortWeight/'+uid, onSuccess, onError, onComplete);
  }




};