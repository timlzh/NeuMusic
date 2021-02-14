$(".nav_avatar").unbind('click').click(function () {
    hideAll();
    if (loginStatus) $(".me").show();
    else $(".login").show();
})

//初始化主页
function initMe() {
    $(".me_avatar").css("background", 'url(' + avatar_url + ') no-repeat');
    $(".me").show();
    $("#item_list").show();
    $(".user_id").html(nickname);
    greeting();
    getUserPlayLists();

    fetch('https://v1.hitokoto.cn?c=i')
        .then(response => response.json())
        .then(data => {
            $(".hitokoto").html('『' + data.hitokoto + '』');
        })
        .catch(console.error)

}

//更改greeting
function greeting() {
    let time = new Date(), hour = time.getHours();
    if (hour < 6) $(".good").html("Good Night");
    else if (hour < 12) $(".good").html("Good Moring");
    else if (hour < 17) $(".good").html("Good Afternoon");
    else if (hour < 23) $(".good").html("Good Evening");
    else $(".good").html("Good Night");
}

//获取用户的播放列表
function getUserPlayLists() {
    let api_adr = apiAd + "user/playlist?" + cookieStr + "&uid=" + uid + "&timestamp=" + stamp();
    let data;
    if (data = ajaxGet(api_adr)) {
        userPlayLists = data;
        $("#creat_list_cover").css("background", 'url(' + userPlayLists.playlist[0].coverImgUrl + ') no-repeat');
        $(userPlayLists.playlist).each(function (i, pl) {
            console.log(pl);
            if (pl.subscribed) {
                $("#fav_list_cover").css("background", 'url(' + pl.coverImgUrl + ') no-repeat');
                return false;
            }
        });
        $(userPlayLists.playlist).each(function (i, pl) {
            if (pl.subscribed) userFavPlaylistIds[i] = pl.id;
            else userCreatPlaylistIds[i] = pl.id;
        });
    }
}

//我创建的歌单
$(".creat_lists").unbind('click').click(function () {
    $("#item_list").show();
    let items = new Array();
    $(userPlayLists.playlist).each(function (i, pl) {
        if (pl.subscribed) return false;
        let item = {
            "name": pl.name,
            "id": pl.id,
            "coverImgUrl": pl.coverImgUrl,
            "author": pl.creator.nickname,
            "subscribed": -1,
        }
        items[i] = item;
    });
    changeList("我创建的歌单", items, "playlistCover", $("#item_list"));
    initItem();
});

//我收藏的歌单
$(".fav_lists").unbind('click').click(function () {
    $("#item_list").show();
    let items = new Array();
    $(userPlayLists.playlist).each(function (i, pl) {
        if (!pl.subscribed) return true;
        let item = {
            "name": pl.name,
            "id": pl.id,
            "coverImgUrl": pl.coverImgUrl,
            "author": pl.creator.nickname,
            "subscribed": 1,
        }
        items[i] = item;
        subscribedLists.push(parseInt(pl.id));
    });
    changeList("我收藏的歌单", items, "playlistCover", $("#item_list"));
    initItem();
});

//红心歌曲
function likeASong(id) {
    let fl = likeList.indexOf(parseInt(id));
    let api_adr = apiAd + "like?" + cookieStr + "&id=" + id + "&like=" + !(fl + 1);
    if (ajaxGet(api_adr)) {
        getLikeList(uid);
        return (fl + 1);
    } else alert("红心失败");
}

//收藏歌单
function starAList(id) {
    let t = 1;
    if (subscribedLists.indexOf(parseInt(id)) >= 0) {
        t = 2;
        subscribedLists.splice(subscribedLists.indexOf(parseInt(id)), 1);
    }
    let api_adr = apiAd + "playlist/subscribe?" + cookieStr + "&id=" + id + "&t=" + t;
    if (ajaxGet(api_adr)) return t;
    else alert("收藏失败");
}