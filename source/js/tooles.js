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