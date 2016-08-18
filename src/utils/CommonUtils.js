/**
 * a = {
 *   b:{
 *      c:{
 *          d:1
 *      }
 *   }
 * }
 *
 * str : b.c.d
 * @param obj
 * @param str
 * @demo :
 *  var d = getObjectValue(a,'b.c.d');
 */
function getObjectValue(obj,str){
    var propArr=str.split(".");
    var tmpObj = obj;
    var i = 0 ;
    while (i<propArr.length){
        if(!tmpObj){
            return null;
        }
        var prop = propArr[i];
        tmpObj = tmpObj[prop];
        i++;
    }
    return tmpObj;
}


function isString(x){
    return typeof x ==='string';
}

function getThumbUrl (url, width, heigth) {
    if(!url){
        return "";
    }
    try {
        var index = url.lastIndexOf('.');
        if (index <= 0) return url;
        return url.substr(0, index) + "_" + width + "x" + heigth + url.substr(index);
    }catch (e){
        return url;
    }
}



/**
// ("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
// ("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
**/
exports.dateFormat = function (date, fmt) {
    var o = {
        "M+": date.getMonth() + 1, //月份
        "d+": date.getDate(), //日
        "h+": date.getHours(), //小时
        "m+": date.getMinutes(), //分
        "s+": date.getSeconds(), //秒
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度
        "S": date.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};



function getTimeOnlyDate(date){
    if(!date){
        return null;
    }
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    return date.getTime();
}

// 转换成这样的格式：yyyy-MM-dd 00:00:00
function getDateFormat(data) {
    var date = new Date(data),
    Y = date.getFullYear() + '-',
    M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-',
    D = (date.getDate() < 10 ? '0'+(date.getDate()) : date.getDate()) + ' ',
    // h = date.getHours() + ':',
    // m = date.getMinutes() + ':',
    // s = date.getSeconds();
    h = '00:',
    m = '00:',
    s = '00'; 
    var fmt = Y + M + D + h + m + s;
    return fmt;
}


function isArray(obj){
    return Object.prototype.toString.call(obj)=='[object Array]';
}


/**
 * 使用一个隐藏的form表单提交数据，主要用于文件下载
 * @param actionURL 要提交的地址
 * @param dataObject 一个KeyValue的结构，value必须为字符串
 */
function formPost(actionURL, dataObject) {

    var keys = Object.keys(dataObject);

    var template = '' +
        '<form action="' + actionURL + '" method="post" target="_blank" > '+
            (function(){
                var inputArr = keys.map(function(key){
                    return '<input name="'+key+'" type="input" />';
                });
                return inputArr.join('');
            })() +
        '</form>';

    var $body = $("body");
    var $area = $body.find(".cm-form-hidden");
    if (!$area || $area.length === 0) {
        $body.append('<div class="cm-form-hidden" style="display:none; "></div>');
        $area = $body.find(".cm-form-hidden");
    }

    $area.html(template);
    var $form = $area.find("form");

    //将数据设置到表单中

    keys.forEach(function(key){
        var value = dataObject[key];
        $form.find('input[name='+key+']').val(value);
    });

    $form.submit();
}

exports.formPost = formPost;
exports.isString = isString;
exports.isArray = isArray;
exports.getObjectValue = getObjectValue;
exports.getThumbUrl = getThumbUrl;
exports.getTimeOnlyDate = getTimeOnlyDate;
exports.getDateFormat = getDateFormat;
exports.getThumbUrl40 = function(url){return getThumbUrl(url,40,40);};
exports.getThumbUrl70 = function(url){ return getThumbUrl(url,70,70);};