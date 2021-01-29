var loginMethod = 1;
var loginStatus = 0;
var loginCookie = localStorage.cookie;
var lastPlayedId = localStorage.lastPlayedId;
var cookieStr = "cookie=" + loginCookie;
var avatar_url;
var nickname;
var AcData;
var uid;
var userPlayLists;
var listId = new Array();
var listSongs;
var playing;
var audio = document.getElementById("audio");


function stamp() {
    var date = new Date().getTime();
    return ("timestamp=" + date);
}

function checkTel(value) {
    var patrn = /^1([38]\d|5[0-35-9]|7[3678])\d{8}$/;
    if (patrn.test(value)) {
        return true;
    } else {
        return false;
    }
}

function transInputIcon(input, i) {
    $(input).focus(function () {
        $(i).css("color", "#000000");
    });

    $(input).blur(function () {
        $(i).css("color", "#00000070");
    });
}

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

$(".login_btn").click(function () {
    var account = $("#account_input").val();
    if ($("#pwd_input").val() == "") {
        alert("密码不能为空!");
        return;
    }
    var pwd = md5($("#pwd_input").val());
    var api_adr = "http://csgo.itstim.xyz:3000/login/";

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
        xhrFields: { withCredentials: true },
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

function initLogin() {
    var api_adr = "http://csgo.itstim.xyz:3000/user/account?" + cookieStr;
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
                console.log(avatar_url);
                nickname = AcData.profile.nickname;
                console.log(nickname);
                uid = AcData.account.id;
                console.log(uid);
                $("#avatar").css("background", 'url(' + avatar_url + ') no-repeat');
                $(".me_avatar").css("background", 'url(' + avatar_url + ') no-repeat');
                $("#avatar_i").hide();
                $(".login").hide();
                $(".me").show();
                $(".list").show();
                $(".user_id").html(nickname);
                getUserPlayLists();
            } else return;
        }
    })

    fetch('https://v1.hitokoto.cn?c=i')
        .then(response => response.json())
        .then(data => {
            $(".hitokoto").html('『' + data.hitokoto + '』');
        })
        .catch(console.error)

}

function getUserPlayLists() {
    var api_adr = "http://csgo.itstim.xyz:3000/user/playlist?" + cookieStr + "&uid=" + uid;
    $.ajax({
        url: api_adr,
        datatype: "json",
        type: "GET",
        success: function (data) {
            console.log(data);
            if (data.code == "200") {
                userPlayLists = data;
                $("#creat_list_cover").css("background", 'url(' + userPlayLists.playlist[0].coverImgUrl + ') no-repeat');
                $(userPlayLists.playlist).each(function (i, pl) {
                    console.log(pl);
                    if (pl.subscribed) {
                        $("#fav_list_cover").css("background", 'url(' + pl.coverImgUrl + ') no-repeat');
                        return false;
                    }
                });
            } else return;
        }
    })
}

function appendSongList(item, i) {
    var itemHtml = '<div class="item"><div class="item_info">';
    itemHtml = itemHtml + '<span class="item_name" href = "song"' + ' id = "' + item.id + '">';
    itemHtml = itemHtml + item.name + '</span></br><div class="song_SA"><a class="singer" id= "' + item.ar[0].id + '">';
    itemHtml = itemHtml + item.ar[0].name + '</a> - <a class="album" id="' + item.al.id + '">' + item.al.name + '</a></div></div><div class="process"><i class="fas fa-play"></i><i class="fas fa-plus"></i><i class="fas fa-heart"></i></div></div>';
    listId[i] = item.id;
    $(itemHtml).appendTo($(".list"));
    initItem();
}

function appendPlayList(item, i) {
    var itemHtml = '<div class="item"><div class="item_info">';
    itemHtml = itemHtml + '<span class="item_name" href="playlist"' + ' id = "' + item.id + '">';
    itemHtml = itemHtml + item.name + '</span></br><div class="playlist_author"><a class="author">';
    itemHtml = itemHtml + item.author + '</a></div></div><div class="process"><i class="fas fa-play"></i><i class="fas fa-plus"></i>';
    if (item.subscribed == -1) itemHtml = itemHtml + '<i class="fas fa-star" style ="color : #00000050"></i></div></div>';
    else if (item.subscribed) itemHtml = itemHtml + '<i class="fas fa-star" style ="color : #E79796"></i></div></div>';
    else itemHtml = itemHtml + '<i class="fas fa-star"></i></div></div>';
    listId[i] = item.id;
    console.log(itemHtml);
    $(itemHtml).appendTo($(".list"));
    initItem();
}

function changeList(list_info, items, type) {
    $(".list").html('<div class="list_info">播放列表</div>');
    listId = [];
    $(".list_info").html(list_info);
    console.log(items);
    if (type == "playlist") items.forEach(appendPlayList);
    else if (type == "song") items.forEach(appendSongList);
}

$(".creat_lists").click(function () {
    var items = new Array();
    $(userPlayLists.playlist).each(function (i, pl) {
        if (pl.subscribed) return false;
        var item = {
            "name": pl.name,
            "id": pl.id,
            "coverImgUrl": pl.coverImgUrl,
            "author": pl.creator.nickname,
            "subscribed": -1,
        }
        items[i] = item;
    });
    changeList("我创建的歌单", items, "playlist");
    initItem();
});

$(".fav_lists").click(function () {
    var items = new Array();
    $(userPlayLists.playlist).each(function (i, pl) {
        if (!pl.subscribed) return true;
        var item = {
            "name": pl.name,
            "id": pl.id,
            "coverImgUrl": pl.coverImgUrl,
            "author": pl.creator.nickname,
            "subscribed": 1,
        }
        items[i] = item;
    });
    changeList("我收藏的歌单", items, "playlist");
    initItem();
});

function initItem() {
    $(".item_name").click(function () {
        var id = $(this).attr('id');
        var type = $(this).attr('href');

        if (type == "playlist") {
            var api_adr = "http://csgo.itstim.xyz:3000/playlist/detail?" + cookieStr + "&id=" + id;
            $.ajax({
                url: api_adr,
                datatype: "json",
                type: "GET",
                success: function (data) {
                    console.log(data);
                    if (data.code == "200") {
                        var ids = new Array();
                        $(data.playlist.trackIds).each(function (i, trackId) {
                            ids[i] = trackId.id;
                        });
                        changeList(data.playlist.name, data.playlist.tracks, "song");
                    } else return;
                }
            });
        } else if (type == "song") {
            playSongFromId(id,true);
        }

    });
}

function playSongFromId(id,play){
    var api_adr = "http://csgo.itstim.xyz:3000/song/detail?" + cookieStr + "&ids=" + id;
    $.ajax({
        url: api_adr,
        datatype: "json",
        type: "GET",
        success: function (data) {
            console.log(data);
            if (data.code == "200") {
                playing = data;
                $(".bar_cover_img").css("background", 'url(' + playing.songs[0].al.picUrl + ') no-repeat');
                $("#bar_song_name").html(playing.songs[0].name);
                $("#bar_singer").html(playing.songs[0].ar[0].name);
                $("#bar_album").html(playing.songs[0].al.name);
                var audioUrl = "https://music.163.com/song/media/outer/url?id=" + id + ".mp3 ";     
                lastPlayedId = localStorage.lastPlayedId = id;
                $(".playing").attr("src", audioUrl);
                if(play) $('#bar_play').click();
                else $('#bar_pause').click();
            } else return;
        }
    });
}

$('#bar_play').click(function () {
    if (audio.paused) {
        audio.play();
        $('#bar_play').hide();
        $('#bar_pause').show();
        timer = setInterval(function () {
            if (audio.ended) {
                $('#bar_play').show();
                $('#bar_pause').hide();
            } else {
                var ratio = audio.currentTime / audio.duration;
                $(".currentProgress").css({ 'width': ratio * 100 + '%' });
            }
        }, 100)
    }
});

$('#bar_pause').click(function () {
    audio.pause();
    $('#bar_play').show();
    $('#bar_pause').hide();
});

function getSongsFromTrackIds(ids) {
    var de = new $.Deferred();
    var api_adr = "http://csgo.itstim.xyz:3000/song/detail?" + cookieStr + "&ids=" + ids;
    $.ajax({
        url: api_adr,
        datatype: "json",
        type: "GET",
        success: function (data) {
            console.log(data);
            if (data.code == "200") {
                de.resolve = (listSongs = data.songs);
            } else return;
        }
    });
    return de;
}

$(".totalProgress").click(function (el) {
    var ratio = getRatio(el);
    $(".currentProgress").css({'width': ratio * 100 + '%'});
    audio.currentTime = audio.duration * ratio;
});

function getRatio(el){
    var totalWidth = $(".totalProgress")[0].offsetWidth;
    var totalX = $(".totalProgress").offset().left;
    var mouseX = el.clientX;
    var ratio = (mouseX - totalX) / totalWidth;
    return ratio;
}


$(".me").hide();
$(".list").hide();
transInputIcon(".search_input", ".search_btn");
transInputIcon("#account_input", ".fa-envelope");
transInputIcon("#account_input", ".fa-mobile-alt");
transInputIcon("#pwd_input", ".fa-lock");
$("#loginMethodChanger").click();
initLogin();
playSongFromId(lastPlayedId,false);
