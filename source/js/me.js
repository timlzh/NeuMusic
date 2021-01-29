function initMe() {
    $(".me_avatar").css("background", 'url(' + avatar_url + ') no-repeat');
    $(".me").show();
    $(".list").show();
    $(".user_id").html(nickname);
    getUserPlayLists();

    fetch('https://v1.hitokoto.cn?c=i')
        .then(response => response.json())
        .then(data => {
            $(".hitokoto").html('『' + data.hitokoto + '』');
        })
        .catch(console.error)

}

//获取用户的播放列表
function getUserPlayLists() {
    let api_adr = "http://csgo.itstim.xyz:3000/user/playlist?" + cookieStr + "&uid=" + uid;
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


//我创建的歌单
$(".creat_lists").click(function () {
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
    changeList("我创建的歌单", items, "playlist");
    initItem();
});

//我收藏的歌单
$(".fav_lists").click(function () {
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
    });
    changeList("我收藏的歌单", items, "playlist");
    initItem();
});
