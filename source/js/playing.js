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

function showPlayingList() {
    if($(".playing_div").css("display") == "none") return;
    let playingIds;
    if(playMethod == 2){
        playingIds = playingListId[shuffledPlayingIndexs[playingIndex]];
        for(let i = playingIndex+1;i < playingListId.length;i++) playingIds = playingIds + ',' + String(playingListId[shuffledPlayingIndexs[i]]);
        for(let i = 0;i < playingIndex;i++) playingIds = playingIds + ',' + String(playingListId[shuffledPlayingIndexs[i]]);
    }else{
        playingIds = playingListId[playingIndex];
        for(let i = playingIndex+1;i < playingListId.length;i++) playingIds = playingIds + ',' + String(playingListId[i]);
        for(let i = 0;i < playingIndex;i++) playingIds = playingIds + ',' + String(playingListId[i]);
    }
    let api_adr = "http://csgo.itstim.xyz:3000/song/detail?" + cookieStr + "&ids=" + playingIds;
    let data;
    if (data = ajaxGet(api_adr)) changeList("播放列表",data.songs,"song",$("#item_list"));
}