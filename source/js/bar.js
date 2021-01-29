
//更改进度条
$(".totalProgress").click(function (el) {
    let ratio = getRatio(el);
    $(".currentProgress").css({
        'width': ratio * 100 + '%'
    });
    audio.currentTime = audio.duration * ratio;
});

//获取播放百分比
function getRatio(el) {
    let totalWidth = $(".totalProgress")[0].offsetWidth;
    let totalX = $(".totalProgress").offset().left;
    let mouseX = el.clientX;
    let ratio = (mouseX - totalX) / totalWidth;
    return ratio;
}

