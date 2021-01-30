//登录
$(".login_btn").click(function () {
    let account = $("#account_input").val();

    if ($("#pwd_input").val() == "") {
        alert("密码不能为空!");
        return;
    }
    let pwd = md5($("#pwd_input").val());
    let api_adr = "http://csgo.itstim.xyz:3000/login/";

    if (loginMethod) api_adr += "login?email=" + account + "&md5_password=" + pwd;
    else if (!checkTel(account)) {
        alert("请输入正确的手机号码!");
        return;
    } else api_adr += "cellphone?phone=" + account + "&md5_password=" + pwd;
    localStorage.api_adr = api_adr;

    $.ajax({
        url: api_adr,
        datatype: "json",
        type: "GET",
        xhrFields: {
            withCredentials: true
        },
        success: function (data) {
            console.log(data);
            AcData = data;
            if (data.code == "200") {
                alert("登录成功");
                loginCookie = data.cookie;
                localStorage.cookie = loginCookie;
                cookieStr = "cookie=" + loginCookie;
                avatar_url = data.profile.avatarUrl + "?param=40y40";
                console.log(avatar);
                $("#avatar").css("background", 'url(' + avatar_url + ')');
                $("#avatar_i").hide();
                initLogin();
            } else {
                alert("用户名或密码错误");
                $("#pwd_input").value = "";
            }
        }
    })
})

//更换登录样式时更换图标
function transInputIcon(input, i) {
    $(input).focus(function () {
        $(i).css("color", "#000000");
    });

    $(input).blur(function () {
        $(i).css("color", "#00000070");
    });
}

//更换登录样式
$("#loginMethodChanger").click(function () {
    if (loginMethod) {
        loginMethod = 0;
        $("#loginMethodChanger").html("使用邮箱账号登录");
        $("#account_input").attr("placeholder", "请输入网易云音乐账号");
        $(".fa-envelope").hide();
        $(".fa-mobile-alt").show();
    } else {
        loginMethod = 1;
        $("#loginMethodChanger").html("使用手机号登录");
        $("#account_input").attr("placeholder", "请输入邮箱");
        $(".fa-envelope").show();
        $(".fa-mobile-alt").hide();
    }
});

//初始化登录状态
function initLogin() {
    let api_adr = "http://csgo.itstim.xyz:3000/user/account?" + cookieStr;
    $.ajax({
        url: api_adr,
        datatype: "json",
        type: "GET",
        success: function (data) {
            console.log(data);
            if (data.code == "200") {
                AcData = data;
                loginStatus = 1;
                avatar_url = AcData.profile.avatarUrl;
                nickname = AcData.profile.nickname;
                uid = AcData.account.id;
                $(".login").hide();
                $("#avatar").css("background", 'url(' + avatar_url + ') no-repeat');
                $("#avatar_i").hide();
                initMe();
            } else return;
        }
    })
}

function logout() {
    let api_adr = "http://csgo.itstim.xyz:3000/logout";
    $.ajax({
        url: api_adr,
        datatype: "json",
        type: "GET",
        success: function (data) {
            console.log(data);
            if (data.code == "200") {
                loginStatus = 0;
                hideAll();
                $(".login").show();
                $("#avatar").css("background", '');
                $("#avatar_i").show();
                loginCookie = localStorage.cookie = "";
            } else return;
        }
    })
}