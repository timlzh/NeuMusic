//绑定搜索按钮
$(".search_btn").unbind('click').click(function () {
    searchpage = 0;
    search();
})

//绑定回车键搜索
$(".search_input").on('keypress', function (key) {
    if (key.keyCode == 13) {
        searchpage = 0;
        search();
    }
});

//更换搜索规则 单曲 1 专辑 10 歌单 1000
function changeSearchMethod(n, flag = nowWord) {
    n = parseInt(n);
    searchMethod = n;
    $(".change_search_method").css("box-shadow", "0.2vh 0.2vh 1vh #cdcdcd, -0.3vh -0.3vh 0.6vh #ffffff");
    if (n == 1) $("#csm1").css("box-shadow", "inset 0.2vh 0.2vh 1vh #cdcdcd, inset -0.3vh -0.3vh 0.6vh #ffffff");
    else if (n == 10) $("#csm10").css("box-shadow", "inset 0.2vh 0.2vh 1vh #cdcdcd, inset -0.3vh -0.3vh 0.6vh #ffffff");
    else if (n == 1000) $("#csm1000").css("box-shadow", "inset 0.2vh 0.2vh 1vh #cdcdcd, inset -0.3vh -0.3vh 0.6vh #ffffff");
    if (flag) search(nowWord);
}

//翻页
function turnResPage(n) {
    nowPage += n;
    if (nowPage >= 0) search(nowWord, nowPage);
}

//搜索
function search(keyword = $(".search_input").val(), page = 0) {
    if (keyword == "") return;
    hideAll();
    $("#search_list").show();
    nowPage = page;
    nowWord = keyword;
    let api_adr = apiAd + "search?keywords=" + keyword + "&offset=" + page + "&type=" + searchMethod;
    let data;
    if (data = ajaxGet(api_adr)) {
        let search_res = new Array();
        switch (parseInt(searchMethod)) {
            case 1:
                $("#search_list").css("display", "block");
                let songs = data.result.songs;
                $(songs).each(function (i, song) {
                    let item = {
                        "name": song.name,
                        "id": song.id,
                        "al": song.album,
                        "ar": song.artists,
                    };
                    search_res[i] = item;
                });
                changeList("", search_res, "song", $("#search_list"));
                break;
            case 10:
                $("#search_list").css("display", "block");
                let albums = data.result.albums;
                $(albums).each(function (i, album) {
                    let item = {
                        "name": album.name,
                        "id": album.id,
                        "coverImgUrl": album.picUrl,
                        "author": album.artist.name,
                    }
                    search_res[i] = item;
                });
                changeList("", search_res, "album", $("#search_list"));
                break;
            case 1000:
                let playlists = data.result.playlists;
                $(playlists).each(function (i, pl) {
                    let sub = 0;
                    if (userCreatPlaylistIds.indexOf(pl.id) >= 0) sub = -1;
                    else if (userFavPlaylistIds.indexOf(pl.id) >= 0) sub = 1;
                    let item = {
                        "name": pl.name,
                        "id": pl.id,
                        "coverImgUrl": pl.coverImgUrl,
                        "author": "",
                        "subscribed": sub,
                    }
                    search_res[i] = item;
                });
                changeList("", search_res, "playlistCover", $("#search_list"));
                break;
        }
    }
    changeSearchMethod(searchMethod, false);
}


