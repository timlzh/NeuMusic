//开始播放
function startToPlay() {
    if (audio.paused) {
        audio.play();
        $('#bar_play').hide();
        $('#bar_pause').show();
        $('#playing_bar_play').hide();
        $('#playing_bar_pause').show();
        //设置播放状态检查定时器
        let timer = setInterval(function () {
            if (audio.ended) {
                if (playMethod == 0 || playMethod == 2) changeSong(1);
                else if (playMethod == 1) {
                    audio.currentTime = 0;
                    audio.play();
                }
            } else {
                let ratio = audio.currentTime / audio.duration;
                $(".currentProgress").css({
                    'width': ratio * 100 + '%'
                });
                $(".playing_currentProgress").css({
                    'width': ratio * 100 + '%'
                });
            }
        }, 100)
        navigator.mediaSession.playbackState = "playing";
    }
}

//暂停播放
function pausePlaying() {
    audio.pause();
    $('#bar_play').show();
    $('#bar_pause').hide();
    $('#playing_bar_play').show();
    $('#playing_bar_pause').hide();
    navigator.mediaSession.playbackState = "Paused";
}

//播放歌曲
function playSongFromId(id, play) {
    let api_adr = apiAd + "song/detail?" + cookieStr + "&ids=" + id;
    if (playing = ajaxGet(api_adr)) {
        if ('mediaSession' in navigator) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: playing.songs[0].name,
                artist: playing.songs[0].ar[0].name,
                album: playing.songs[0].al.name,
                artwork: [{ src: playing.songs[0].al.picUrl }]
            });
        }
        $(".bar_cover_img").css("background", 'url(' + playing.songs[0].al.picUrl + ') no-repeat');
        $("#bar_song_name").html(playing.songs[0].name);
        $("#bar_singer").html(playing.songs[0].ar[0].name);
        $("#bar_album").html(playing.songs[0].al.name);
        $("#bar_heart").attr("name", id);
        $("#playing_bar_heart").attr("name", id);
        $(".playing_cover").css("background", 'url(' + playing.songs[0].al.picUrl + ') no-repeat');
        $(".playing_name").html(playing.songs[0].name);
        $(".playing_singer").html(playing.songs[0].ar[0].name);
        $(".playing_album").html(playing.songs[0].al.name);
        $(".playing_album_cover").css("background", 'url(' + playing.songs[0].al.picUrl + ') no-repeat');
        $(".playing_album_cover").attr("id", playing.songs[0].al.id);
        if (likeList.indexOf(parseInt(id)) >= 0) {
            $("#bar_heart").attr("style", "color: #E79796");
            $("#playing_bar_heart").attr("style", "color: #E79796");
        }
        else {
            $("#bar_heart").attr("style", "color: #000000");
            $("#playing_bar_heart").attr("style", "color: #000000");
        }
        let api_adr = apiAd + "song/url?" + cookieStr + "&id=" + id;
        let data;
        if (data = ajaxGet(api_adr)) {
            console.log(data);
            let audioUrl;
            audioUrl = (data.code == "200") ? (data.data[0].url) : ("https://music.163.com/song/media/outer/url?id=" + id + ".mp3 ");
            lastPlayedId = localStorage.lastPlayedId = id;
            $(".playing").attr("src", audioUrl);
            if (play) startToPlay();
            else pausePlaying();
            initItem();
        }
    } else return false;
    return true;
}

//检查歌曲可用性
function checkSongAvalibility(id) {
    let api_adr = apiAd + "check/music?id=" + id;
    let avalibility = false;
    let data;
    if (data = ajaxGet(api_adr)) avalibility = data.success;
    return avalibility;
}

//打乱播放列表(随机播放)
function shuffle() {
    shuffledPlayingIndexs = [];
    let t, j;
    for (let i = 0; i < playingListId.length; i++) {
        shuffledPlayingIndexs[i] = i;
    }

    for (let i = 0; i < playingListId.length; i++) {
        j = getRandomInt(0, i);
        if (j == playingIndex || i == playingIndex) continue;
        t = shuffledPlayingIndexs[i];
        shuffledPlayingIndexs[i] = shuffledPlayingIndexs[j];
        shuffledPlayingIndexs[j] = t;
    }
    localStorage.shuffledPlayingIndexs = JSON.stringify(shuffledPlayingIndexs);
}

//上/下一首 dir为0上一首，1为下一首
function changeSong(dir) {
    audio.currentTime = 0;
    audio.pause();
    localStorage.playingIndex = playingIndex = ((!dir) ? ((playingIndex + playingListId.length - 1) % playingListId.length) : ((playingIndex + 1) % playingListId.length));
    if (playMethod == 2) playSongFromId(playingListId[shuffledPlayingIndexs[playingIndex]], true);
    else playSongFromId(playingListId[playingIndex], true);
    showPlayingList();
}

//更改播放模式
function changeLoopMethod() {
    localStorage.playMethod = playMethod = (playMethod + 1) % 3;
    $(".bar_loop_svg").html("");
    $(".bar_loop_svg").html('<embed src="' + playMethodIcon[playMethod] + '" type="image/svg+xml" pluginspage="http://www.adobe.com/svg/viewer/install/" />');
    if (playMethod == 2) shuffle();
    showPlayingList();
}

//获取喜欢列表
function getLikeList(uid) {
    let api_adr = apiAd + "likelist?" + cookieStr + "&uid=" + uid + "&timestamp=" + stamp();
    let data;
    if (data = ajaxGet(api_adr)) likeList = data.ids;
}
