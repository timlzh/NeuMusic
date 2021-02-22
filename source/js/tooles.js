//生成随机数
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//检查电话号码
function checkTel(value) {
    let patrn = /^1([38]\d|5[0-35-9]|7[3678])\d{8}$/;
    if (patrn.test(value)) {
        return true;
    } else {
        return false;
    }
}

//获取时间戳
function stamp() {
    var timestamp = new Date().getTime();
    return timestamp;
}

//获取播放列表作者
function getPlaylistAuthor(id) {
    let api_adr = apiAd + "playlist/detail?" + cookieStr + "&id=" + id;
    let data;
    if (data = ajaxGet(api_adr)) {
        return data.playlist.creator.nickname;
    }
}

//获取二维码图片
function getQRCodeImg(url) {
    return ("https://api.pwmqr.com/qrcode/create/?url=" + url);
}