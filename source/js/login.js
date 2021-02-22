//登录
$(".login_btn").unbind('click').click(function () {
    login();
})

//绑定回车登录
$("#pwd_input").on('keypress', function (key) {
    if (key.keyCode == 13) login();
});

//登录主程序
function login() {
    let account = $("#account_input").val();

    if ($("#pwd_input").val() == "") {
        alert("密码不能为空!");
        return;
    }
    let pwd = md5($("#pwd_input").val());
    let api_adr = apiAd + "login/";

    if (loginMethod) api_adr += "login?email=" + account + "&md5_password=" + pwd;
    else if (!checkTel(account)) {
        alert("请输入正确的手机号码!");
        return;
    } else api_adr += "cellphone?phone=" + account + "&md5_password=" + pwd;
    localStorage.api_adr = api_adr;

    let data;
    if (data = ajaxGet(api_adr)) {
        AcData = data;
        alert("登录成功");
        loginCookie = data.cookie;
        localStorage.cookie = loginCookie;
        cookieStr = "cookie=" + loginCookie;
        initLogin();
    } else {
        alert("用户名或密码错误");
        $("#pwd_input").value = "";
    }
}

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
$("#loginMethodChanger").unbind('click').click(function () {
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
    let api_adr = apiAd + "user/account?" + cookieStr;
    let data;
    if (data = ajaxGet(api_adr)) {
        AcData = data;
        loginStatus = 1;
        avatar_url = AcData.profile.avatarUrl;
        nickname = AcData.profile.nickname;
        uid = AcData.account.id;
        $(".login").hide();
        $("#avatar").css("background", 'url(' + avatar_url + ') no-repeat');
        $("#avatar_i").hide();
        initMe();
        getLikeList(uid);
    }
}

//注销 登出
function logout() {
    let api_adr = apiAd + "logout";
    if (ajaxGet(api_adr)) {
        loginStatus = 0;
        hideAll();
        $(".login").show();
        $("#avatar").css("background", '');
        $("#avatar_i").show();
        loginCookie = localStorage.cookie = "";
    }
}

//更换成二维码登录模式
$("#login_with_qrcode").unbind("click").click(function () {
    if (!QRCode) {
        QRCode = 1;
        $(".login_box").hide();
        $("#login_btn_icon").attr("class", "fas fa-keyboard");
        $(".login_qrcode_box").show();
        $("#login").hide();
        let api_adr = apiAd + "login/qr/key?timestamp=" + stamp();
        let data;
        if (data = ajaxGet(api_adr)) {
            let key = data.data.unikey;
            let QRCodeImgUrl = getQRCodeImg("https://music.163.com/login?codekey=" + key);
            $(".login_qrcode").attr("src", QRCodeImgUrl);
            QRCodeStatusChecker(key);
        } 
    } else {
        QRCode = 0;
        $(".login_box").show();
        $("#login_btn_icon").attr("class", "fas fa-qrcode");
        $(".login_qrcode_box").hide();
        $("#login").show();
    }
})

//检查二维码登录状态
function QRCodeStatusChecker(key) {
    let QRTimer = setInterval(function () {
        let api_adr = apiAd + "login/qr/check?key=" + key +  "&timestamp=" + stamp();
        let data;
        if (data = ajaxGet(api_adr, false)) {
            if (data.code === 800) {
                alert('二维码已过期,正在重新获取');
                QRCode=0;
                $("#login_with_qrcode").click();
                clearInterval(QRTimer);
            }else if (data.code === 803) {
                clearInterval(QRTimer);
                alert("登录成功");
                loginCookie = data.cookie;
                localStorage.cookie = loginCookie;
                cookieStr = "cookie=" + loginCookie;
                initLogin();
            }
        }
    }, 3000);
}