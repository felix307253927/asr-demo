"use strict";
// DOM文档加载函数
function DOMReady(fn) {
    if (document.addEventListener) {
        document.addEventListener('DOMContentLoaded', fn, false);
    } else {
        document.attachEvent('onreadystatechange', function() {
            if (document.readyState == 'complete') {
                (fn && typeof(fn) === "function") && fn();
            }
        });
    }
}
// 获取元素css属性值
function getStyle(obj, name) {
    return obj.currentStyle ? obj.currentStyle[name] : getComputedStyle(obj, false)[name];
}
// 设置css2样式
function setStyle(obj, json) {
    if (obj.length) {
        for (var i = 0; i < obj.length; i++) {
            setStyle(obj[i], json);
        }
    } else {
        if (arguments.length == 2) { // json
            for (var i in json) {
                setStyle(obj, i, json[i]);
            }
        } else { // name, value
            switch (arguments[1].toLowerCase()) {
                case 'opacity':
                    obj.style.filter = 'alpha(opacity:' + arguments[2] + ')';
                    obj.style.opacity = arguments[2] / 100;
                    break;
                default:
                    if (typeof arguments[2] == 'number') {
                        obj.style[arguments[1]] = arguments[2] + 'px';
                    } else {
                        obj.style[arguments[1]] = arguments[2];
                    }
                    break;
            }
        }
    }
}
// 设置CSS3样式
function setStyle3(obj, name, value) {
    var str = name.charAt(0).toUpperCase() + name.substring(1);
    obj.style['Webkit' + str] = value;
    obj.style['Moz' + str] = value;
    obj.style['ms' + str] = value;
    obj.style['O' + str] = value;
    obj.style[name] = value;
}

function removeElement(elem) {
    elem.parentNode.removeChild(elem);
}
// 鼠标滚轴
function addMouseWheel(obj, fn) {
    obj.onmousewheel = fnWheel;
    if (obj.addEventListener) {
        obj.addEventListener('DOMMouseScroll', fnWheel, false);
    }

    function fnWheel(ev) {
        var oEvent = ev || event;
        var bDown = true;
        if (oEvent.wheelDelta) {
            if (oEvent.wheelDelta < 0) {
                bDown = true;
            } else {
                bDown = false;
            }
        } else {
            if (oEvent.detail > 0) {
                bDown = true;
            } else {
                bDown = false;
            }
        }
        fn && fn(bDown, oEvent);
        if (oEvent.preventDefault) {
            oEvent.preventDefault();
        }
        return false;
    }
}
// 随机数
function rnd(n, m) {
    return parseInt(Math.random() * (m - n) + n);
}
// 根据className获取元素
function getByClass(oParent, sClass) {
    oParent = oParent || document;
    var aEle = oParent.getElementsByTagName('*');
    var aResult = [];
    var re = new RegExp('\\b' + sClass + '\\b', 'i');
    for (var i = 0; i < aEle.length; i++) {
        if (aEle[i].className.search(re) != -1) {
            aResult.push(aEle[i]);
        }
    }
    return aResult;
}

function id(name) {
    return !!(typeof document !== "undefined" && document && document.getElementById) && document.getElementById(name);
}
// 说明：添加、移除、检测 className
function hasClass(element, clsName) {
    var reg = new RegExp('(\\s|^)' + clsName + '(\\s|$)');
    return element.className.match(reg);
}

function hasClassByJQ($JQ, className) {
    var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
    return $JQ.attr("class").match(reg);
}

function addClass(element, className) {
    if (!hasClass(element, className)) {
        element.className += " " + className;
    }
}

function removeClass(element, className) {
    if (!element) return;
    if (hasClass(element, className)) {
        var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
        element.className = trim(element.className.replace(reg, ' '));
    }
}

function toggleClass(obj, cls) {
    if (hasClass(obj, cls)) {
        removeClass(obj, cls);
    } else {
        addClass(obj, cls);
    }
}
/**
 * 去掉字符串前后的空格
 * 
 * @param {String}
 *            字符串
 * @return {String} 去除空格后的字符串
 */
function trim(str) {
    return null == str || 0 == str.length ? "" : str.replace(/(^\s*)|(\s*$)/g, "")
}

function addEvent(elem, type, fn) {
    if (elem.addEventListener) {
        elem.addEventListener(type, fn, false);
    } else if (elem.attachEvent) {
        elem.attachEvent("on" + type, fn);
    } else {
        fn();
    }
}
// 事件绑定
function bindEvent(obj, ev, fn) {
    obj.addEventListener ? obj.addEventListener(ev, fn, false) : obj.attachEvent('on' + ev, fn);
}

function unbindEvent(obj, ev, fn) {
    obj.removeEventListener ? obj.removeEventListener(ev, fn, false) : obj.detachEvent('on' + ev, fn);
}
/**
 * 对象复制 返回 a
 */
function extend(a, b) {
    for (var prop in b) {
        if (b[prop] === undefined) {
            delete a[prop];
            // Avoid "Member not found" error in IE8 caused by setting
            // window.constructor
        } else if (prop !== "constructor" || a !== window) {
            a[prop] = b[prop];
        }
    }
    return a;
}
// from Sizzle.js
function getText(elems) {
    var ret = "",
        elem;
    for (var i = 0; elems[i]; i++) {
        elem = elems[i];
        // Get the text from text nodes and CDATA nodes
        if (elem.nodeType === 3 || elem.nodeType === 4) {
            ret += elem.nodeValue;
            // Traverse everything else, except comment nodes
        } else if (elem.nodeType !== 8) {
            ret += getText(elem.childNodes);
        }
    }
    return ret;
}
// from jquery.js
function inArray(elem, array) {
    if (array.indexOf) {
        return array.indexOf(elem);
    }
    for (var i = 0, length = array.length; i < length; i++) {
        if (array[i] === elem) {
            return i;
        }
    }
    return -1;
}
/**
 * 跨越访问
 */
function jsonp(url, data, fnCb, cbName) {
    data = data || {};
    fnCb = fnCb || function() {};
    cbName = cbName || "callback";
    var fnName = 'jsonp_' + Math.random();
    fnName = fnName.replace('.', '');
    window[fnName] = function() {
        fnCb.apply(this, arguments);
        oHead.removeChild(oS);
        window[fnName] = null;
        // fnCb(arguments);
    };
    data[cbName] = fnName;
    // data->'xxx&xxx&xxx'
    var arr = [];
    for (var i in data) {
        arr.push(i + '=' + data[i]);
    }
    var str = "";
    if (url.indexOf("?") == -1) {
        str = url + '?' + arr.join('&');
    } else {
        str = url + '&' + arr.join('&');
    }
    var oS = document.createElement('script');
    oS.src = str;
    var oHead = document.getElementsByTagName('head')[0];
    oHead.appendChild(oS);
}

function escapeInnerText(s) {
    if (!s) {
        return "";
    }
    s = s + "";
    return s.replace(/[\&<>]/g, function(s) {
        switch (s) {
            case "&":
                return "&amp;";
            case "<":
                return "&lt;";
            case ">":
                return "&gt;";
            default:
                return s;
        }
    });
}

function replaceSpecialChart(inputStr) {
    var temp = inputStr;
    return null != temp && (temp = temp.replaceAll("<", "&lt;"), temp = temp.replaceAll(">", "&gt;"), temp = temp.replaceAll('"', "&quot;")), temp
}
var regExp = /<\/?[^>]+>/gi;

function replaceTags(xStr) {
    return xStr = xStr.replace(regExp, "")
}

function filterHTML(str) {
    return str.replace(/<\/?[^>]*>/g, "")
};

function getImg(src) {
    return '<img src="' + src + '"> '
}

function getFileName(s) {
    var index = s.lastIndexOf("/");
    return 0 > index ? "" : s.substr(index + 1)
}
/*
 * window.open(url, "_blank")
 * /^application\/x\-www\-form\-urlencoded/.test(b.contentType);
 */
/*
 * $.ajax({ type: "post", contentType: "application/x-www-form-urlencoded;
 * charset=utf-8", url: "/async.action?t=" + ((new Date).getTime() +
 * Math.random()).replace(/\D/g, ""), async: !0, data: { requestText: text },
 * success: successCB, dataType: "json" });
 */
function unescape(args) {
    return args ? args.replace(/\\'/g, "'").replace(/\\\\/g, "\\") : null
}

function outerHtml(elem) {
    var div = document.createElement("div");
    return div.appendChild(elem.cloneNode(!0)), div.innerHTML
}
/**
 * 时间格式
 */
Date.prototype.Format = function(formatStr) {
    var str = formatStr,
        Week = ["\u65e5", "\u4e00", "\u4e8c", "\u4e09", "\u56db", "\u4e94", "\u516d"];
    // ["日", "一", "二", "三", "四", "五", "六"];
    return str = str.replace(/yyyy|YYYY/, this.getFullYear()),
        str = str.replace(/yy|YY/, this.getYear() % 100 > 9 ? (this.getYear() % 100).toString() : "0" + this.getYear() % 100),
        str = str.replace(/MM/, this.getMonth() > 8 ? (this.getMonth() + 1).toString() : "0" + (this.getMonth() + 1)),
        str = str.replace(/M/g, this.getMonth() + 1),
        str = str.replace(/w|W/g, Week[this.getDay()]),
        str = str.replace(/dd|DD/, this.getDate() > 9 ? this.getDate().toString() : "0" + this.getDate()),
        str = str.replace(/d|D/g, this.getDate()),
        str = str.replace(/hh|HH/, this.getHours() > 9 ? this.getHours().toString() : "0" + this.getHours()),
        str = str.replace(/h|H/g, this.getHours()),
        str = str.replace(/mm/, this.getMinutes() > 9 ? this.getMinutes().toString() : "0" + this.getMinutes()),
        str = str.replace(/m/g, this.getMinutes()),
        str = str.replace(/ss|SS/, this.getSeconds() > 9 ? this.getSeconds().toString() : "0" + this.getSeconds()),
        str = str.replace(/s|S/g, this.getSeconds())
};
var pluses = /\+/g;

function decoded(s) {
    return decodeURIComponent(s.replace(pluses, " "));
}
/*
 * 其正确的使用方法是为：IE:obj.style.styleFloat，其他浏览器:obj.style.cssFloat。 cssProps: {
 * "float": f.support.cssFloat ? "cssFloat" : "styleFloat" ,}
 * 
 * var isChinaMobileNo =
 * /^(134|135|136|137|138|139|147|150|151|152|157|158|159|182|183|187|188)[\d]{8}$/,
 * isChinaUnicomNo = /^(130|131|132|155|156|185|186)[\d]{8}$/, isChinaTelecomNo =
 * /^(133|153|180|189)[\d]{8}$/; isChinaMobileNo.test(applyPhone) ||
 * isChinaUnicomNo.test(applyPhone) || isChinaTelecomNo.test(applyPhone)
 */
var jsTemplate = '<script src="${src}" charset="utf-8" type="text/javascript" id="${id}"></script>',
    cssTemplate = '<link rel="stylesheet" type="text/css" href="${href}">';
/**
 * 关闭窗口
 */
function windowclose() {
    var browserName = navigator.appName;
    if ("Netscape" == browserName) {
        window.open("", "_self", ""), window.close();
        try {
            window.open("", "_self"), window.close()
        } catch (e) {
            try {
                window.open("", "_parent", ""), window.close()
            } catch (e) {
                window.close()
            }
        }
        window.location.href = "about:blank "
    } else "Microsoft Internet Explorer" == browserName && (window.opener = null, window.open("", "_top"), window.close())
}
/*
 * (function(window,document,$, undefined) {
 * 
 * )(window,document,jQuery);}
 */
/**
 * 获取元素的html 元素
 * 
 * @param {DOM
 *            obj} 字符串
 * @return DOM obj
 */
function dupElement(obj) {
    var oTmpDiv = document.createElement('div');
    oTmpDiv.innerHTML = obj.outerHTML;
    return oTmpDiv.children[0];
}
/**
 * 获取元素的html 元素
 * 
 * @param {String}
 *            字符串
 * @return DOM obj
 */
function dupInnerHTML(innerHTML) {
    var oTmpDiv = document.createElement('div');
    oTmpDiv.innerHTML = innerHTML;
    return oTmpDiv.children[0];
}
/**
 * 获取元素的html 元素
 * 
 * @param {String}
 *            字符串
 * @param {data}
 *            json
 * @return DOM obj
 */
function formatData(str, data) {
    return str.replace(/\{\$\w+\}/g, function(s) {
        s = s.substring(2, s.length - 1);
        return data[s];
    });
}

function findParentNode(obj, parentNodeName) {
    while (obj) {
        if (obj.nodeName.toLowerCase() == parentNodeName) return obj;
        obj = obj.parentNode;
    }
    return false;
}

function delHtmlTag(str) {
    return str.replace(/<[^>]+>/g, ""); // 去掉所有的html标记
}
// 处理 HTML 语句
function html(code) {
    // 压缩多余空白与注释
    code.replace(/[\n\r\t\s]+/g, ' ').replace(/<!--.*?-->/g, '');
    return code;
}

function getEleByClassName(classStr, tagName) {
    if (document.getElementsByClassName) {
        return document.getElementsByClassName(classStr)
    } else {
        var nodes = document.getElementsByTagName(tagName),
            ret = [];
        for (var i, i = 0; i < nodes.length; i++) {
            if (hasClass(nodes[i], classStr)) {
                ret.push(nodes[i])
            }
        }
        return ret;
    }
}

function alertMessage(message) {
    // var dialog = new BootstrapDialog({
    //     title: '提示'
    // });
    // dialog.setMessage(message);
    // dialog.open();
    alert(message)
}
/*function deleModel(){
	var str;
	BootstrapDialog.show({
		 title: '提示',
		 message: '你确定要删除吗？',
		 buttons: [{
			 label: '确定',
			 action:function(dialogItself){
				 dialogItself.close();
				 privateTermDele();
				 str = true;
			 }
		 },{
			 label: '取消',
			 action:function(dialogItself){
				 dialogItself.close();
				 str = false;
			 }
		 }
		 ]
	});
}*/
function printJSON(jsonData) {
    console.log(JSON.stringify(jsonData));
}
/**
 * 根据页面链接获取参数
 */
function getParamValue(paramName) {
    var search = location.search;
    search = search.substring(1, search.length);
    var searchArray = search.toString().split("&");
    for (var i = 0; i < searchArray.length; i++) {
        var tempName = searchArray[i].split("=", 2)[0];
        if (tempName == paramName) {
            return searchArray[i].split("=", 2)[1];
        }
    }
};
/**
 * 给同类元素移除某指定类 (表格中)
 * 
 * @param $thiz:jQuery对象
 * @param className:要移除和检测的class
 */
function removeSiblingsClass($thiz, className) {
    $thiz.siblings("tr").each(function(index, ele) {
        if (hasClass(ele, className)) {
            removeClass(ele, className);
        }
    });
}
/**
 * 
 * @param params
 *            所有数据 {"param":"XXXX",.....}
 * @param shouldValidateMap
 *            待验证的项 {"appName":"应用名称",...}
 */
function validateForm(params, shouldValidateMap, type) {
    var invalid = false;
    for (var name in params) {
        for (var validateName in shouldValidateMap) {
            if (name == validateName) {
                if (name != "schemaId") { // 提示信息不一样 需要优化
                    var paramValue = trim(params[name]);
                    var isInvalidVal = validateOneValue(paramValue, shouldValidateMap[name]);
                    if (isInvalidVal) {
                        return invalid = true;
                    }
                } else {
                    if (type != '8') {
                        var paramValue = trim(params[name]);
                        var failMsg = shouldValidateMap[name] + "为必选项！";
                        if (paramValue == "") {
                            alertMessage(failMsg);
                            return invalid = true;
                        }
                    } else {
                    	return invalid = false;
                    }
                }
            }
        }
    }
    return invalid;
}
/**
 * 验证一个表单项不能为空
 * @param value
 * @param itemName
 * @returns {Boolean}
 */
function validateOneValue(value, itemName) {
    var isInvalidVal = false;
    if (trim(value) == "") {
        alertMessage(itemName + "不能为空！");
        return isInvalidVal = true;
    }
    return isInvalidVal;
}
/**
 * 验证一个表单项不能为空
 * @param value
 * @param itemName
 * @returns {Boolean}
 */
function uniCodeTest(code, codeName) {
    var isInvalidCode = false;
    var reg = /^[a-zA-Z]+[a-zA-Z0-9_]*/;
    if (!reg.test(code)) {
        alertMessage(codeName + "只能由字母、数字和下划线组成，且下划线和数字不能开头、下划线不能结尾。");
        return isInvalidCode = true;
    }
    return isInvalidCode;
}
//事件工具
var EventUtil = {
    addHandler: function(element, type, handler) {
        if (element.addEventListener) {
            element.addEventListener(type, handler, false);
        } else if (element.attachEvent) {
            element.attachEvent("on" + type, handler);
        } else {
            element["on" + type] = handler;
        }
    },
    removeHandler: function(element, type, handler) {
        if (element.removeEventListener) {
            element.removeEventListener(type, handler, false);
        } else if (element.detachEvent) {
            element.detachEvent("on" + type, handler);
        } else {
            element["on" + type] = null;
        }
    }
};
// json 格式化
function jsonPrettify(obj) {
    var jsonStr = JSON.stringify(obj, undefined, 4);
    var highlightJsonStr = syntaxHighlight(jsonStr);
    return highlightJsonStr;
}

function syntaxHighlight(json) {
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function(match) {
        var cls = 'json_number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'json_key';
            } else {
                cls = 'json_string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'json_boolean';
        } else if (/null/.test(match)) {
            cls = 'json_null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}

function changeToNav(order) {
    //导航头的切换
    order = order - 1;
    $(".selectedLi").removeClass("selectedLi");
    $("#topNav li:nth-child(" + order + ") a").addClass("selectedLi");
}
/**
 * 将form表单元素的值序列化成对象
 * 
 * @param oForm:jquery对象
 */
function serializeObject(oForm) { /*将form表单元素的值序列化成对象*/
    var obj = {};
    $.each(oForm.serializeArray(), function(index) {
        var name = this["name"];
        var value = $.trim(this["value"]);
        if (value === "###") { //特殊处理combobox空值自动填充的问题
            value = "";
        }
        if (obj[name]) {
            obj[name] = obj[name] + "," + value;
        } else {
            if (value || value === 0) {
                obj[name] = value;
            }
        }
    });
    //console.log(JSON.stringify(obj));
    return obj;
};
/**
 * 序列化表格（值为空时仍有该字段）
 * @param $form form的jq对象
 * @returns json数据
 */
function serializeForm($form) {
    var resultMap = {};
    var array = $form.serializeArray();
    for (var index in array) {
        var map = array[index];
        var name = map["name"];
        var value = $.trim(map["value"]);
        resultMap[name] = value;
    }
    return resultMap;
}
/*
 * js字符过滤html标签互转函数
 */
function htmlencode(str) {
    if (str == null || str == "null") {
        return "";
    }
    str = str.replace(/&/g, '&amp;');
    str = str.replace(/</g, '&lt;');
    str = str.replace(/>/g, '&gt;');
    str = str.replace(/(?:t| |v|r)*n/g, '<br />');
    str = str.replace(/  /g, '&nbsp; ');
    str = str.replace(/t/g, '&nbsp; &nbsp; ');
    str = str.replace(/x22/g, '&quot;');
    str = str.replace(/x27/g, '&#39;');
    return str;
}

function htmldecode(str) {
    if (str == null || str == "null") {
        return "";
    }
    str = str.replace(/&amp;/gi, '&');
    str = str.replace(/&nbsp;/gi, ' ');
    str = str.replace(/&quot;/gi, '"');
    str = str.replace(/&#39;/g, "'");
    str = str.replace(/&lt;/gi, '<');
    str = str.replace(/&gt;/gi, '>');
    str = str.replace(/<br[^>]*>(?:(rn)|r|n)?/gi, 'n');
    return str;
}

function loadAndBuildProvinces(creatorId) {
    $.ajax({
        url: "loadProvinces.action",
        type: "post",
        dataType: "json",
        data: "creatorId=" + creatorId,
        async: false,
        success: function(result) {
            var provinces = {
                "provinces": result
            };
            var html = template('provinceIdTemplate', provinces);
            document.getElementById("provinceId").innerHTML = html;
        }
    });
}

function loadAndBuildCities(creatorId, provinceId) {
    $.ajax({
        url: "loadCities.action",
        type: "post",
        dataType: "json",
        data: "creatorId=" + creatorId + "&provinceId=" + provinceId,
        async: false,
        success: function(result) {
            var cities = {
                "cities": result
            };
            var html = template('cityIdTemplate', cities);
            document.getElementById("cityId").innerHTML = html;
        }
    });
}

function isIE() { //ie?  
    if (!!window.ActiveXObject || "ActiveXObject" in window) return true;
    else return false;
}

function getExplorer() {
    var explorer = window.navigator.userAgent;
    //ie 
    if (explorer.indexOf("MSIE") >= 0) {
        return "IE";
    }
    //firefox 
    else if (explorer.indexOf("Firefox") >= 0) {
        return "FIREFOX";
    }
    //Chrome
    else if (explorer.indexOf("Chrome") >= 0) {
        return "CHROME";
    }
    //Opera
    else if (explorer.indexOf("Opera") >= 0) {
        return "OPERA";
    }
    //Safari
    else if (explorer.indexOf("Safari") >= 0) {
        return "SAFARI";
    }
    if (isIE) { //针对IE11
        return "IE";
    }
}
//每个页面根据menucode 选中侧导航
function selectMenuByCode(menuCode) {
    $("#" + menuCode).addClass("currentA");
}
var has_clicked_offline = false;
var has_clicked_center = false; //记录是不是已经点击"开发中心"
var has_clicked_sdk = false; //记录是不是已经点击"SDK下载"
var has_clicked_order_btn = false;
var clicked_schema_code; //下载某SDK
var clicked_schema_Id; //直接使用某SDK
var clicked_tech_Id; //技术页面下载SDK
$(function() {
    var userName = $.trim($("#global_userName_div").html());
    var userType = $.trim($("#global_userType_div").html());
    var globalServerPath = $.trim($("#global_server_path").html());
    var global_creatorId = $.trim($("#global_creatorId").html());
    var global_roleId = $.trim($("#global_roleId").html());
    var pathname = location.pathname;
    /*alert(pathname.indexOf("analysis"));*/
    //通过username判断是否登录
    if (userName != null && userName != "null") { //已登录
        $(".dropdown").show();
        $(".logoutA").live("click", function() {
            $.ajax({
                url: "logout.action",
                type: "post",
                dataType: "json",
                async: false,
                success: function(result) {
                    var status = result.status;
                    if (status == 0) {
                        location.href = globalServerPath + "/index.jsp";
                    }
                }
            });
        });
        //修改密码返回后需要退出登录
        var fromPassport = getParamValue("fromPassport");
        if (fromPassport) {
            $.ajax({
                url: "logout.action",
                type: "post",
                dataType: "json",
                async: false,
                success: function(result) {
                    var status = result.status;
                    if (status == 0) {
                        location.href = globalServerPath + "/index.jsp";
                    }
                }
            });
        }
    } else {
        $("#topNav").append("<li><a href='javascript:void(0)' data-toggle='modal' data-target='#loginModal'>登录/注册</a></li>");
    }
    //在当前demand区 ,展开当前的二级菜单
    if (pathname.indexOf("demand") != -1) {
        $("#commit_demand").addClass("expand");
        $("#client_demands").addClass("expand");
        $("#reply").addClass("expand");
        $("#server_demands").addClass("expand");
        $(".hasChildrenLi").live("click", function() {
            if ($(this).find("#appCallNum").length != 0 //开发者
                || $(this).find("#userNumTrend").length != 0) { //内部人员
                var $children = $(this).children(".childA");
                $children.each(function(index, dom) {
                    $(dom).toggleClass("expand");
                });
            }
        });
    }
    /*else if(pathname.indexOf("analysis") != -1){ //在当前analysis区 ,展开当前的二级菜单
    		$("#appCallNum").addClass("expand");
    		$("#userNumTrend").addClass("expand");
    		$("#appNumTrend").addClass("expand");
    		$("#monthlyReport").addClass("expand");
    		$("#callNum4OP").addClass("expand");
    		$("#activeUserNum").addClass("expand");
    		$("#responseTimeTrend").addClass("expand");
    		$("#sdkDownTrend").addClass("expand");
    		$("#platTotalAnalysis").addClass("expand");
    		$("#respTimeAnalysis").addClass("expand");
    		$("#netDelayAnalysis").addClass("expand");
    		
    		$(".hasChildrenLi").live("click",function(){
    			if($(this).find("#server_demands").length != 0 //内部人员
    					|| $(this).find("#commit_demand").length != 0  ){//开发者
    				var $children = $(this).children(".childA");
    				$children.each(function(index,dom){
    					$(dom).toggleClass("expand");
    				});
    			}
    		});
    		
    	}*/
    else if (pathname.indexOf("p_analysis") != -1) {
        $("#p_platView").addClass("expand");
        $("#p_schemeAnalysis").addClass("expand");
        $("#p_terminalAttrAnalysis").addClass("expand");
        $("#p_funModuleAnalysis").addClass("expand");
        $("#p_errorAnalysis").addClass("expand");
        $("#p_callTimeConsuming").addClass("expand");
        $(".hasChildrenLi").live("click", function() {
            $(".hasChildrenLi .childA").removeClass("expand");
            var $children = $(this).children(".childA");
            $children.each(function(index, dom) {
                $(dom).toggleClass("expand");
            });
        });
    } else if (pathname.indexOf("b_analysis") != -1) {
        $("#b_businessProfile").addClass("expand");
        $("#b_schemeAnalysis").addClass("expand");
        $("#b_terminalAttrAnalysis").addClass("expand");
        $("#b_funModuleAnalysis").addClass("expand");
        $("#b_errorAnalysis").addClass("expand");
        $("#b_callTimeConsuming").addClass("expand");
        $(".hasChildrenLi").live("click", function() {
            $(".hasChildrenLi .childA").removeClass("expand");
            var $children = $(this).children(".childA");
            $children.each(function(index, dom) {
                $(dom).toggleClass("expand");
            });
        });
    } else if (pathname.indexOf("news") != -1 || pathname.indexOf("notice") != -1) {
        $(".hasChildrenLi .childA").addClass("expand");
    } else {
        //其他区域二级菜单都是闭合的，是可以展开的
        $(".hasChildrenLi").live("click", function() {
            var $children = $(this).children(".childA");
            $children.each(function(index, dom) {
                $(dom).toggleClass("expand");
            });
        });
    }
    if (userType == 1) { //内部人员
        //导航头换成“我的服务”
        $("#user_center_nav").html("我的服务");
        //方案中的sdk下载按钮
        $("#schema-sdk-useItNow").hide();
        $("#schema-sdk-useItNow").parent().css({
            "left": "480px"
        });
        //“回复优化”需求在外部页面需要隐藏
        if (pathname.indexOf("demand") != -1) {
            $(".hasChildrenLi .childA:eq(1)").hide();
        }
        //定时更新需求消息
        /*getGlobalDemandMessage("loadDemandMessage.action",global_creatorId);
        setInterval(function(){
        	getGlobalDemandMessage("loadDemandMessage.action",global_creatorId);
        },1000*60);*/
    } else if (userType == 2) { //开发者
        //定时更新需求消息
        /*getGlobalDemandMessage("loadReplyMessage.action",global_creatorId);
        setInterval(function(){
        	getGlobalDemandMessage("loadReplyMessage.action",global_creatorId);
        },1000*60);*/
    }
    //设置全局的需求消息
    function getGlobalDemandMessage(actionName, creatorId) {
        $.ajax({
            url: actionName,
            type: "post",
            dataType: "json",
            data: "creatorId=" + creatorId,
            async: true,
            success: function(result) {
                var count = result.count;
                if (count > 0) {
                    if (userType == 1 && $("#global_message_span").length <= 0) {
                        //推送消息
                        $("#demandTopNav").append("<li><a href='" + globalServerPath + "/demand/server_demands.jsp'><i class='fa fa-bell'></i>优化需求<span id='global_message_span' class='badge'>0</span></a></li>");
                    } else if (userType == 2 && $("#global_message_span").length <= 0) {
                        //推送消息
                        $("#demandTopNav").append("<li><a href='" + globalServerPath + "/demand/client_demands.jsp'><i class='fa fa-bell'></i>需求回复<span id='global_message_span' class='badge'>0</span></a></li>");
                    }
                    $("#global_message_span").addClass("alertMessage");
                    $("#global_message_span").html(count);
                }
            }
        });
    }
    //footer链接
    //passport链接下载
    var type = getParamValue("type");
    if (type == "offline") {
        if (userName != null && userName != "null") {
            location.href = globalServerPath + "/sdk_download/offline_sdk.jsp";
        } else {
            has_clicked_offline = true;
            $('#loginModal').modal('show');
        }
    }
    //点击个人中心
    $("#user_center_nav").click(function() {
        if (userName != null && userName != "null") {
            //如果是内部人员，跳转到“我的服务”
            if (userType == 1) {
                if (global_roleId == 2) {
                    location.href = globalServerPath + "/customOptim/customOptim.jsp";
                } else if (global_roleId == 3) {
                    location.href = globalServerPath + "/analysis/user_num_trend.jsp";
                } else if (global_roleId == 11) {
                	location.href = globalServerPath + "/karAdmin/kar_content_service.jsp";
                }  else {
                    location.href = globalServerPath + "/service/my_service.jsp";
                }
            } else {
                if (global_roleId == 7) {
                    location.href = globalServerPath + "/b_analysis/businessProfile.jsp";
                }else {
                    location.href = globalServerPath + "/app/my_app.jsp";
                }
            }
        } else {
            has_clicked_center = true;
            $('#loginModal').modal('show');
        }
    });
    $("#myApp").click(function() {
        if (userName != null && userName != "null") {
            //如果是内部人员，跳转到“我的服务”
            if (userType == 1) {
                if (global_roleId == 2) {
                    location.href = globalServerPath + "/customOptim/customOptim.jsp";
                } else if (global_roleId == 3) {
                    location.href = globalServerPath + "/analysis/user_num_trend.jsp";
                } else {
                    location.href = globalServerPath + "/service/my_service.jsp";
                }
            } else {
                location.href = globalServerPath + "/app/my_app.jsp";
            }
        } else {
            has_clicked_center = true;
            $('#loginModal').modal('show');
        }
    });
    $("#addApp").click(function() {
        if (userName != null && userName != "null") {
            location.href = globalServerPath + "/AppAction!toAdd.action?creatorId=" + global_creatorId;
        } else {
            has_clicked_center = true;
            $('#loginModal').modal('show');
        }
    })
    //方案页面  “SDK下载”
    $("#sdk_download_nav").click(function() {
        if (userName != null && userName != "null") {
            location.href = globalServerPath + "/sdk_download/schema_sdk.jsp";
        } else {
            has_clicked_sdk = true;
            $('#loginModal').modal('show');
        }
    });
    $("#sdkDown").click(function() {
        if (userName != null && userName != "null") {
            location.href = globalServerPath + "/sdk_download/schema_sdk.jsp";
        } else {
            has_clicked_sdk = true;
            $('#loginModal').modal('show');
        }
    });
    //方案页面  “立即使用”
    $("#schema-sdk-useItNow").click(function() {
        clicked_schema_Id = getSchemaId(this);
        if (userName != null && userName != "null") {
            location.href = globalServerPath + "/AppAction!toAdd.action?creatorId=" + global_creatorId + "&schemaId=" + clicked_schema_Id;
        } else {
            $('#loginModal').modal('show');
        }
    });
    $(".scheme_carousel .scheme_case a").on("click", function() {
        var schema_Id = $(this).parent().attr("id");
        if (userName != null && userName != "null") {
            location.href = globalServerPath + "/AppAction!toAdd.action?creatorId=" + global_creatorId + "&schemaId=" + schema_Id;
        } else {
            $('#loginModal').modal('show');
        }
    })
    //sdk下载页面 点击“SDK下载” 和 “直接使用”
    $("#schema-sdk-download").click(function() {
        clicked_schema_code = getSchemaCode(this);
        if (userName != null && userName != "null") {
            location.href = globalServerPath + "/sdk_download/schema_sdk.jsp?schemaCode=" + clicked_schema_code;
        } else {
            $('#loginModal').modal('show');
        }
    });
    //技术服务页面 点击“在线SDK下载”
    $("#tech-sdk-download").click(function() {
        clicked_tech_Id = $(this).parent().attr("id");
        if (userName != null && userName != "null") {
            if (clicked_tech_Id == "asr") {
                location.href = globalServerPath + "/sdk_download/schema_sdk.jsp?schemaCode=voiceInputSchema";
            } else if (clicked_tech_Id == "nlu") {
                location.href = globalServerPath + "/sdk_download/schema_sdk.jsp?schemaCode=commonSchema";
            } else if (clicked_tech_Id == "tts") {
                location.href = globalServerPath + "/sdk_download/schema_sdk.jsp?schemaCode=commonSchema";
            }
        } else {
            $('#loginModal').modal('show');
        }
    });
    //技术服务页面 点击“离线SDK下载”
    $("#tech-sdk-download-unline").click(function() {
        clicked_tech_Id = $(this).parent().attr("id");
        if (userName != null && userName != "null") {
            location.href = globalServerPath + "/sdk_download/offline_sdk.jsp?techId=" + clicked_tech_Id;
        } else {
            $('#loginModal').modal('show');
        }
    });
    //订购SDK的按钮
    $(".order_sdk_btn").click(function(e) {
        e.preventDefault();
        if (userName != null && userName != "null") {
            location.href = $(this).attr("href");
        } else {
            has_clicked_order_btn = true;
            $('#loginModal').modal('show');
        }
    });
    //获取方案页面上的schemaCode 和 schemaId
    function getSchemaCode(thiz) {
        var idStr = $(thiz).parent().attr("id");
        return idStr.split(",", 2)[0];
    }

    function getSchemaId(thiz) {
        var idStr = $(thiz).parent().attr("id");
        return idStr.split(",", 2)[1];
    }
    /**
     * 检测词条正确性
     * @param $dict  词条;
     * @param regs   需要检验的正则LISt: string[];
     * @param title  信息头
     * @returns {*}
     */
    window.testCorrectDict = function($dict, title, regs) {
        var t = title + ': ';
        var dist = $dict;
        //非字符串处理
        if (typeof dist !== 'string') {
            if (window.JSON.stringify) {
                dist = JSON.stringify(dist);
            } else {
                return {
                    isCorrect: false,
                    msg: [t, '传入格式有误'].join('')
                };
            }
        }
        // 字符串验证分隔符
        var dblDelimiter = /\|{2,}/g.test(dist); // 双分隔符
        var hfDelimiter = /^\||\|$/g.test(dist); // 首尾分隔符
        if (hfDelimiter) {
            return {
                isCorrect: !hfDelimiter,
                msg: !hfDelimiter ? [t, '输入正确'].join('') : [t, '首尾不允许出现分隔符'].join('')
            };
        }
        return {
            isCorrect: !dblDelimiter,
            msg: !dblDelimiter ? [t, '输入正确'] : [t, '分隔符不允许连续两个(||)或以上(|||...)'].join('')
        };
    }
});


window.$addEvent =  function(tag, type, fn) {
      if (window.addEventListener) {
        tag.addEventListener(type, function(e){
          fn(e, tag)
        }, false)
      } else if (window.attachEvent) {
        tag.attachEvent('on' + type, function(e){
          fn(e, tag)
        })
      } else {
        var evt = 'on' + type;
        tag[evt] = function(e){
          fn(e, tag);
        }
      }
    }



/**
 * 获取缓存
 * @param  {Function} fn [description]
 * @return {[type]}      [description]
 */
window.getFunc = function(fn) {
    var _catch = {};
    return function() {
        return _catch[JSON.stringify(arguments)] = _catch[JSON.stringify(arguments)] || fn.apply(null, arguments)
    }
}
/**
 * 页码初始化
 * @param  {[type]} currentPage [description] 当前页
 * @param  {[type]} totalPage   [description] 总页数
 * @param  {Array}  items)      {                   if (currentPage < 1 || totalPage < 1 || items < 1) return undefined;        var reset [description] 显示几条
 * @return {[type]}             [description]
 */
window.getPageList = getFunc(function(currentPage, totalPage, items) {
    if (currentPage < 1 || totalPage < 1 || items < 1) return undefined;
    var reset = [];
    var middle = Math.floor(totalPage / 2);
    var v = totalPage - currentPage < middle ? totalPage % totalPage - items + 1 : currentPage - middle;
    v < 1 && (v = 1);
    if (currentPage > items) {
        if (currentPage % items > 0) {
            v = currentPage - currentPage % items + 1;
        } else {
            v = currentPage - items + 1
        }
    }
    for (var i = 0; i < items && v <= totalPage; i++) {
        reset[i] = v++;
    }
    return reset;
});