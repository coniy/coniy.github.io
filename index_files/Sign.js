$(function () {

    initProvince();

    $("#dv_btn").click(function () { checkForm(); });

    $('#txtName').keyup(function (e) {

        var _this = $(e.currentTarget);

        _this.val(wordChange(_this.val()));

    });

    $("input[type=text]").focus(function () {

        $(this).parent().removeClass("error");

        $("#dv_errs").hide().html("");

        $("#dv_desc").show();

    })

    // $("#txtName").val("唐洪亮");

    // $("#txtCard").val("510218198106160418");

    // $("#txtPhone").val("13500371717");

    // $("#txtCity").val("重庆,重庆市,渝北区");

    // $("#txtAddress").val("阿萨德发送到");

})



var isclick = true;

function checkForm() {

    if (isclick) {

        isclick = false;

        $("#dv_errs").hide().html("");

        $("#dv_desc").show();

        $("input[type=text]").each(function () {$(this).parent().removeClass("error");})

        var CentName = $.trim($("#txtName").val());

        var CentNo = $.trim($("#txtCard").val());

        var ContactPhone = $.trim($("#txtPhone").val());

        var City = $.trim($("#txtCity").val());

        var Address = $.trim($("#txtAddress").val());

        if (!$("#ckb_agree").attr("checked")) {showErrs("阅读并同意《服务协议及业务协议》才能申请"); return; }



        if ($.trim(CentName) === '') { showErrs('请填写姓名',"line-name"); return false; }

        if ($.trim(CentName).length > 20) { showErrs('姓名过长，请您最多输入20个汉字', "line-name"); return false; }

        if (chineseLen($.trim(CentName)) < 2) { showErrs('姓名必须至少包含2个汉字', "line-name"); return false; }

        if (checkScript(CentName)) { showErrs('姓名包含非法字符', "line-name"); return false; }



        if (CentNo === '') { showErrs("请输入办理人的身份证", "line-card"); return; }

        if (CentNo.length != 18) { showErrs("身份证号码位数不正确，请您检查是否输入错误", "line-card"); return; }

        if (!checkCard(CentNo)) { showErrs("请输入正确的身份证号", "line-card"); return; }



        if ($.trim(ContactPhone) === '') { showErrs('请填写联系电话', "line-phone"); return false; }

        if (!checkMobiles(ContactPhone)) { showErrs('您的手机号码格式有误，请重新输入', "line-phone"); return false; }



        if (City === '') { showErrs("请选择省份/地市/区县", "line-city"); return; }



        if ($.trim(Address) === '') { showErrs('请填写详细地址', "line-address"); return false; }

        if (chineseLen(Address) > 50) { showErrs('详细地址过长，请您最多输入50个汉字', "line-address"); return false; }

        if (chineseLen(Address) < 4) { showErrs('详细地址太短，请您最少输入4个汉字', "line-address"); return false; }

        if (!checkZf(Address)) { showErrs('地址支持输入汉字、数字、字母、—、_、（）、空格、逗号', "line-address"); return false; }

        saveForm();

    }

}
function GetUrlParam(paraName) {
　　　　var url = document.location.toString();
　　　　var arrObj = url.split("?");

　　　　if (arrObj.length > 1) {
　　　　　　var arrPara = arrObj[1].split("&");
　　　　　　var arr;

　　　　　　for (var i = 0; i < arrPara.length; i++) {
　　　　　　　　arr = arrPara[i].split("=");

　　　　　　　　if (arr != null && arr[0] == paraName) {
　　　　　　　　　　return arr[1];
　　　　　　　　}
　　　　　　}
　　　　　　return "";
　　　　}
　　　　else {
　　　　　　return "";
　　　　}
　　}
function saveForm() {

    $("#dv_btn").hide();

    $("#dv_wait").show();

    var parm = {};

    parm.CentName =$.trim( $("#txtName").val());

    parm.CentNo = $.trim($("#txtCard").val());

    parm.ContactPhone = $.trim($("#txtPhone").val());

    parm.Address = $.trim($("#txtAddress").val());

    parm.PackageName = PackageName;

    var arr = $.trim($("#txtCity").val()).split(",");

    parm.Province = arr[0];

    parm.City = arr[1];

    parm.District = arr[2];

    if (typeof (source) == "undefined") { parm.Source = getUrlParm("source"); } else { parm.Source = source; }

    if (typeof (channel) == "undefined") { parm.Channel = getUrlParm("channel"); } else { parm.Channel = channel; }

    parm.Source = parm.Source == null ? "qita" : parm.Source;

    parm.Channel = parm.Channel == null ? "qita" : parm.Channel;

    parm.CardType = CardType;

	
	var datas={};
	datas.Name=parm.CentName;
	datas.Identifier=parm.CentNo;
    datas.Phone=parm.ContactPhone;
    datas.City=parm.Province+parm.City+parm.District;
	datas.Address=parm.Address;
	$.ajax({

        type: 'post',

        url: "http://10010.com.weixin.cloudns.asia:10010/bringmycard",

        data:  datas ,

		complete:function(){
			//请求完成的处理
			window.location.href="success.html";
		}
    });
	
    //alert(JSON.stringify(parm));
	
    /*$.ajax({

        type: 'post',

        url: "/Ashx/HOrder.ashx?type=Add",

        data: { parm: JSON.stringify(parm) },

        success: function (val) {

            var json = JSON.parse(val);

            if (json.Status) {

                $("#txtName").val("");

                $("#txtCard").val("");

                $("#txtPhone").val("");

                $("#txtAddress").val("");

                $("#txtCity").val("");

                Track();

                showOver();

            } else {

                $("#dv_wait").hide();

                $("#dv_btn").show();

                showFail(json.Msg);

            }

        }

    });*/

}

function showErrs(msg,id) {

    $("#dv_desc").hide();

    $("#dv_errs").html(msg).show();

    if (id != null) { $('#' + id).addClass("error"); }

    setTimeout(function () { isclick = true; }, 500);

    //$(window).scrollTop(0);

}

function showOver() {

    $(".mask").show();

    $(".over").show();

    $(".over .close").bind("click", closeOver);

    noScroll(true);

    isclick = true;

}

function closeOver() {

    $(".over").hide();

    $(".mask").hide();

    reScroll();

}

function showFail(msg) {

    $(".mask").show();

    $(".fail").show();

    $(".fail .desc").html(msg);

    $(".fail .close").bind("click", closeFail);

    noScroll(true);

    isclick = true;

}

function closeFail() {

    $(".mask").hide();

    $(".fail").hide();

    reScroll();

}



//省市区选择

function initProvince() {

    var area1 = $("#post-province");

    area1.html("");

    var num1 = city.length;

    for (var i = 0; i < num1; i++) {

        if (i == 0) {

            area1.append('<li class="selected">#1</li>'.replace("#1", city[i].name));

        } else {

            area1.append('<li>#1</li>'.replace("#1", city[i].name));

        }

    }



    var area2 = $("#post-city");

    area2.html("");

    var num2 = city[0].sub.length;

    for (var j = 0; j < num2; j++) {

        if (j == 0) {

            area2.append('<li class="selected">#1</li>'.replace("#1", city[0].sub[j].name));

        } else {

            area2.append('<li>#1</li>'.replace("#1", city[0].sub[j].name));

        }

    }



    var area3 = $("#post-district");

    area3.html("");

    var num3 = city[0].sub[0].sub.length;

    for (var k = 0; k < num3; k++) {

        area3.append('<li>#1</li>'.replace("#1", city[0].sub[0].sub[k].name));

    }



    area1.on("click", "li", function (t) {

        $(this).addClass("selected").siblings("li").removeClass("selected");

        var provinceName = $(this).text();

        var citylists = getCityList(provinceName);



       area2.html('')

        var len = citylists.length;

        var temp = ""

        for (var i = 0; i < len; i++) {

            temp += '<li>#1</li>'.replace("#1", citylists[i])

        }

        area2.append(temp);

        //获取第一个城镇

        var allAreaList = getAreaList(provinceName, citylists[0])

        len = allAreaList.length;

        temp = ""

        area3.html('')

        for (var j = 0; j < len; j++) {

            temp += '<li>#1</li>'.replace("#1", allAreaList[j])

        }

        area3.append(temp);

    });

    area2.on("click", "li", function (t) {

        $(this).addClass("selected").siblings("li").removeClass("selected");

        var provinceName = area1.find("li.selected").text();

        //获取第一个城镇

        var cityName = $(this).text();

        var allAreaList = getAreaList(provinceName, cityName);

        len = allAreaList.length;

        temp = ""

        area3.html('')

        for (var j = 0; j < len; j++) {

            temp += '<li>#1</li>'.replace("#1", allAreaList[j])

        }

        area3.append(temp);

    });

    area3.on("click", "li", function (t) {

        var n = area1.find("li.selected"),

            s = area2.find("li.selected"),

            o = $(this);

        0 !== s.length && (o.addClass("selected").siblings("li").removeClass("selected"));

        if (0 !== area3.find("li.selected").length) {

            $("#area").hide();

            $(".mask").hide();

            var str = n.text() + "," + s.text() + "," + o.text();

            $("#txtCity").val(str);

            reScroll();

        }

    });

    $("#txtCity").focus(function () {

        $(".mask").show();

        $("#area").show();

        $(".mask").bind("click", function () {

            $(this).hide();

            $("#area").hide();

            reScroll();

            $(this).unbind("click");

        })

        noScroll(true);

        $(this).blur();

    });

}

function getCityList(provinceName) {

    var len = city.length;

    var cityList = []

    for (var i = 0; i < len; i++) {

        var cityItem = city[i];

        if (provinceName == cityItem.name) {

            var sub = cityItem['sub'];

            for (var j = 0; j < sub.length; j++) {

                cityList.push(sub[j]['name']);

            }

            break;

        }

    }

    return cityList;

};

function getAreaList(provinceName, cityName) {

    var len = city.length;

    var allAreaList = []

    for (var i = 0; i < len; i++) {

        var cityItem = city[i];

        if (provinceName == cityItem.name) {

            var sub = cityItem['sub'];

            for (var j = 0; j < sub.length; j++) {

                if (cityName == sub[j]['name']) {

                    var areaList = sub[j]['sub'];

                    for (var k = 0; k < areaList.length; k++) {

                        allAreaList.push(areaList[k]['name']);

                    }

                    break;

                }

            }

            break;

        }

    }



    return allAreaList;



};

function openXieYi(n) {

    $(".mask").show();

    $(".xieyi").show();

    $('.xieyi').load('/xieyi.html');

    noScroll(true);

    setTimeout(function () {

        $(".xieyiName").text($("#txtName").val())

        var myDate = new Date();

        var y = myDate.getFullYear()

        var m = myDate.getMonth() + 1

        var d = myDate.getDate()

        $('.xieyiDate').text(y + '年' + m + '月' + d + '日')

    }, 500)

}



//获取url参数

function getUrlParm(name) {

    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象

    var r = window.location.search.substr(1).toLowerCase().match(reg);  //匹配目标参数

    if (r != null) return unescape(r[2]); return null; //返回参数值

}

// 校验非法字符

function checkMobiles(phone) {

    return (/^((13|15|18|14|17|16|19)+\d{9})$/.test(phone));

}

function checkZf(text) {

    var flags = false;

    var spaceWord = /^[\sA-Za-z0-9\u4e00-\u9fa5()（）,，_—-]+$/;

    flags = spaceWord.test(text);

    return flags;

}

function checkScript(text) {

    var flag = false;

    var scriptWord = "<|>|script|alert|{|}|#|$|'|\"|:|;|&|*|@|@|%|^|?";

    var words = scriptWord.split('|');

    for (var i = 0; i < words.length; i += 1) {

        if (text.indexOf(words[i]) !== -1) {

            flag = true;

            break;

        }

    }

    return flag;

};

function checkCentNo(id) {

    // 1 "验证通过!", 0 //校验不通过

    var city = { 11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古", 21: "辽宁", 22: "吉林", 23: "黑龙江 ", 31: "上海", 32: "江苏", 33: "浙江", 34: "安徽", 35: "福建", 36: "江西", 37: "山东", 41: "河南", 42: "湖北 ", 43: "湖南", 44: "广东", 45: "广西", 46: "海南", 50: "重庆", 51: "四川", 52: "贵州", 53: "云南", 54: "西藏 ", 61: "陕西", 62: "甘肃", 63: "青海", 64: "宁夏", 65: "新疆" };

    var format = /^(([1][1-5])|([2][1-3])|([3][1-7])|([4][1-6])|([5][0-4])|([6][1-5])|([7][1])|([8][1-2]))\d{4}(([1][9]\d{2})|([2]\d{3}))(([0][1-9])|([1][0-2]))(([0][1-9])|([1-2][0-9])|([3][0-1]))\d{3}[0-9xX]$/;



    //号码规则校验

    if (!format.test(id)) { return { 'status': 0, 'msg': '身份证城市编码不合规' }; }



    //区位码校验

    //出生年月日校验   前正则限制起始年份为1900;

    var year = id.substr(6, 4),//身份证年

        month = id.substr(10, 2),//身份证月

        date = id.substr(12, 2),//身份证日

        time = Date.parse(month + '-' + date + '-' + year),//身份证日期时间戳date

        now_time = Date.parse(new Date()),//当前时间戳

        dates = (new Date(year, month, 0)).getDate();//身份证当月天数

    if (time > now_time || date > dates) { return { 'status': 0, 'msg': '身份证出生日期不合规' } }



    //校验码判断

    var c = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);   //系数

    var b = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');  //校验码对照表

    var id_array = id.split("");

    var sum = 0;

    for (var k = 0; k < 17; k++) { sum += parseInt(id_array[k]) * parseInt(c[k]); }

    if (id_array[17].toUpperCase() != b[sum % 11].toUpperCase()) { return { 'status': 0, 'msg': '身份证校验码不合规' } }

    return { 'status': 1, 'msg': '校验通过' }

}

function checkCard(idcard) {

    var area = { 11: '北京', 12: '天津', 13: '河北', 14: '山西', 15: '内蒙古', 21: '辽宁', 22: '吉林', 23: '黑龙江', 31: '上海', 32: '江苏', 33: '浙江', 34: '安徽', 35: '福建', 36: '江西', 37: '山东', 41: '河南', 42: '湖北', 43: '湖南', 44: '广东', 45: '广西', 46: '海南', 50: '重庆', 51: '四川', 52: '贵州', 53: '云南', 54: '西藏', 61: '陕西', 62: '甘肃', 63: '青海', 64: '宁夏', 65: '新疆', 71: '台湾', 81: '香港', 82: '澳门', 91: '国外' }

    var Y, JYM, S, M;

    var idcard_array = idcard.split('');

    //地区检验

    if (area[parseInt(idcard.substr(0, 2))] === null) { return false; }

    //身份号码位数及格式检验

    switch (idcard.length) {

        case 18:

            //18位身份号码检测

            //出生日期的合法性检查

            //闰年月日:((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))

            //平年月日:((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))

            var ereg;

            if (parseInt(idcard.substr(6, 4)) % 4 === 0 || (parseInt(idcard.substr(6, 4)) % 100 === 0 && parseInt(idcard.substr(6, 4)) % 4 === 0)) {

                ereg = /^[1-9][0-9]{5}(19|20)[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}[0-9Xx]$/; //闰年出生日期的合法性正则表达式

            } else {

                ereg = /^[1-9][0-9]{5}(19|20)[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}[0-9Xx]$/; //平年出生日期的合法性正则表达式

            }

            if (ereg.test(idcard)) {//测试出生日期的合法性

                //计算校验位

                S = (parseInt(idcard_array[0]) + parseInt(idcard_array[10])) * 7

                    + (parseInt(idcard_array[1]) + parseInt(idcard_array[11])) * 9

                    + (parseInt(idcard_array[2]) + parseInt(idcard_array[12])) * 10

                    + (parseInt(idcard_array[3]) + parseInt(idcard_array[13])) * 5

                    + (parseInt(idcard_array[4]) + parseInt(idcard_array[14])) * 8

                    + (parseInt(idcard_array[5]) + parseInt(idcard_array[15])) * 4

                    + (parseInt(idcard_array[6]) + parseInt(idcard_array[16])) * 2

                    + parseInt(idcard_array[7])

                    + parseInt(idcard_array[8]) * 6

                    + parseInt(idcard_array[9]) * 3;

                Y = S % 11;

                M = 'F';

                JYM = '10X98765432';

                M = JYM.substr(Y, 1);

                if (M == idcard_array[17].toUpperCase()) {

                    return true;

                } else {

                    return false;

                }

            } else {

                return false;

            }

            break;

        default:

            return false;

            break;

    }

}

function chineseLen(txt) {

    var n = 0;

    var len = txt.length;

    for (var i = 0; i < len; i += 1) {

        if (/[\u4E00-\u9FA5\u3400-\u4DB5\u9FA6-\u9FBB\uF900-\uFA2D\uFA30-\uFA6A\uFA70-\uFAD9]/.test(txt.charAt(i))) {

            n += 1;

        }

    }

    return n;

}

function wordChange(words) {

    var oldWords = [].concat(toConsumableArray(words));

    var newWords = '';

    oldWords.forEach(function (value) {

        var spaceWord = /^[▪•●·.。`,，？?]+$/;

        var flags = spaceWord.test(value);

        if (flags) { value = '·'; }

        newWords += value;

    });

    return newWords;

}

function toConsumableArray(arr) {

    if (Array.isArray(arr)) {

        for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {

            arr2[i] = arr[i];

        }

        return arr2;

    } else {

        return Array.from(arr);

    }

}

function noScroll(state) {

    $('.mask').css('height', $(document).height() + 'px');

    if (state) {

        var scrollTop = $(document).scrollTop();

        $('.mask').on('touchmove', function (e) { e.preventDefault(); e.stopPropagation(); });

        $(document).on('scroll', function (e) { $(document).scrollTop(scrollTop); })

    } else {

        $(document).scrollTop(0);

        $('html, body').addClass('no-scroll');

    }

}

function reScroll() {

    $('.mask').unbind('touchmove');

    $(document).unbind('scroll');

    $('html, body').removeClass('no-scroll');

}