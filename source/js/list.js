//将歌曲添加到列表
function appendSongList(item, i) {
    let itemHtml = '<div class="item"><div class="item_info">';
    itemHtml = itemHtml + '<span class="item_name" href = "song"' + ' id = "' + item.id + '" name = "' + i + '">';
    itemHtml = itemHtml + item.name + '</span></br><div class="song_SA"><a class="singer" id= "' + item.ar[0].id + '">';
    itemHtml = itemHtml + item.ar[0].name + '</a> - <a class="album" id="' + item.al.id + '">' + item.al.name + '</a></div></div><div class="process"><i class="fas fa-play"></i><i class="fas fa-plus"></i><i class="fas fa-heart"></i></div></div>';
    listId[i] = item.id;
    $(itemHtml).appendTo($(".list"));
    initItem();
}

//将播放列表添加到列表
function appendPlayList(item, i) {
    let itemHtml = '<div class="item"><div class="item_info">';
    itemHtml = itemHtml + '<span class="item_name" href="playlist"' + ' id = "' + item.id + '">';
    itemHtml = itemHtml + item.name + '</span></br><div class="playlist_author"><a class="author">';
    itemHtml = itemHtml + item.author + '</a></div></div><div class="process"><i class="fas fa-play"></i><i class="fas fa-plus"></i>';
    if (item.subscribed == -1) itemHtml = itemHtml + '<i class="fas fa-star" style ="color : #00000050"></i></div></div>';
    else if (item.subscribed) itemHtml = itemHtml + '<i class="fas fa-star" style ="color : #E79796"></i></div></div>';
    else itemHtml = itemHtml + '<i class="fas fa-star"></i></div></div>';
    console.log(itemHtml);
    $(itemHtml).appendTo($(".list"));
    initItem();
}

//更改列表
function changeList(list_info, items, type) {
    $(".list").html('<div class="list_info">播放列表</div>');
    listId = [];
    $(".list_info").html(list_info);
    console.log(items);
    if (type == "playlist") items.forEach(appendPlayList);
    else if (type == "song") items.forEach(appendSongList);
}

//为列表里的item绑定点击事件
function initItem() {
    $(".item_name").click(function () {
        let id = $(this).attr('id');
        let type = $(this).attr('href');

        if (type == "playlist") {
            let api_adr = "http://csgo.itstim.xyz:3000/playlist/detail?" + cookieStr + "&id=" + id;
            $.ajax({
                url: api_adr,
                datatype: "json",
                type: "GET",
                success: function (data) {
                    console.log(data);
                    if (data.code == "200") {
                        let ids = new Array();
                        $(data.playlist.trackIds).each(function (i, trackId) {
                            ids[i] = trackId.id;
                        });
                        changeList(data.playlist.name, data.playlist.tracks, "song");
                    } else return;
                }
            });
        } else if (type == "song") {
            playSongFromId(id, true);
            localStorage.playingListId = JSON.stringify(playingListId = listId);
            localStorage.playingIndex = playingIndex = $(this).attr('name');
            if (playMethod == 2) shuffle();
        }
    });
}

//从id获取歌曲
function getSongsFromTrackIds(ids) {
    let api_adr = "http://csgo.itstim.xyz:3000/song/detail?" + cookieStr + "&ids=" + ids;
    $.ajax({
        url: api_adr,
        datatype: "json",
        type: "GET",
        success: function (data) {
            console.log(data);
            if (data.code == "200") {
                listSongs = data.songs;
            } else return;
        }
    });
}