//显示正在播放页面
function showPlaying() {
    hideAll();
    $(".playing_div").show();
    $("#item_list").show();
    showPlayingList();
}

//更改进度条
$(".playing_totalProgress").unbind('click').click(function (el) {
    let ratio = getRatioPlaying(el);
    $(".playing_currentProgress").css({
        'width': ratio * 100 + '%'
    });
    audio.currentTime = audio.duration * ratio;
});

//获取播放百分比
function getRatioPlaying(el) {
    let totalWidth = $(".playing_totalProgress")[0].offsetWidth;
    let totalX = $(".playing_totalProgress").offset().left;
    let mouseX = el.clientX;
    let ratio = (mouseX - totalX) / totalWidth;
    return ratio;
}

//显示播放列表
function showPlayingList() {
    if ($(".playing_div").css("display") == "none") return;
    let playingIds;
    if (playMethod == 2) {
        playingIds = playingListId[shuffledPlayingIndexs[playingIndex]];
        for (let i = playingIndex + 1; i < playingListId.length; i++) playingIds = playingIds + ',' + String(playingListId[shuffledPlayingIndexs[i]]);
        for (let i = 0; i < playingIndex; i++) playingIds = playingIds + ',' + String(playingListId[shuffledPlayingIndexs[i]]);
    } else {
        playingIds = playingListId[playingIndex];
        for (let i = playingIndex + 1; i < playingListId.length; i++) playingIds = playingIds + ',' + String(playingListId[i]);
        for (let i = 0; i < playingIndex; i++) playingIds = playingIds + ',' + String(playingListId[i]);
    }
    let api_adr = apiAd + "song/detail?" + cookieStr + "&ids=" + playingIds;
    let data;
    if (data = ajaxGet(api_adr)) changeList("播放列表", data.songs, "song", $("#item_list"));
}

//绑定红心功能
$("#playing_bar_heart").unbind('click').click(function () {
    let fl = likeASong($(this).attr("name"));
    $(this).attr("style", (fl ? "color: #000000" : "color: #E79796"));
}
)