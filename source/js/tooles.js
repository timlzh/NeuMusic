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

function colorRGBtoHex(color) {
    var rgb = color.split(',');
    var r = parseInt(rgb[0]);
    var g = parseInt(rgb[1]);
    var b = parseInt(rgb[2]);
    var hex = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    return hex;
}

function stamp() {
    var timestamp = new Date().getTime();
    return timestamp;
}