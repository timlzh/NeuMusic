//更改进度条
$(".totalProgress").unbind('click').click(function (el) {
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

//绑定红心功能
$("#bar_heart").unbind('click').click(function () {
    let fl = likeASong($(this).attr("name"));
    $(this).attr("style", (fl ? "color: #000000" : "color: #E79796"));
}
)