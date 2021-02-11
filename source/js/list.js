/* 
<div class="item">
    <div class="item_info">
        <span class="item_name" href = "song" pro = "play" id = item.id  name =  i></span>
        </br>
        <div class="song_SA">
            <a class="singer" id= item.ar[0].id> item.ar[0].name + '-'</a> <a class="album" id= item.al.id > item.al.name </a>
        </div>
    </div>
    <div class="process">
        <i class="fas fa-play"  href = "song" pro = "play" id = item.id  name = i > item.name </i>
        <i class="fas fa-plus"  href = "song" pro = "plus" id = item.id  name = i></i>
        <i class="fas fa-heart"  href = "song" pro = "heart"' id = item.id  name = i" style ="color : #000000/#E79796"></i>
    </div>
</div>
*/

//将歌曲添加到列表
function appendSongToList(item, i) {
    let itemHtml = '<div class="item"><div class="item_info">';
    itemHtml = itemHtml + '<span class="item_name" href = "song" pro = "play"' + ' id = "' + item.id + '" name = "' + i + '">';
    itemHtml = itemHtml + item.name + '</span></br><div class="song_SA"><a class="singer" id= "' + item.ar[0].id + '">';
    itemHtml = itemHtml + item.ar[0].name + '</a> - <a class="album" id="' + item.al.id + '">' + item.al.name + '</a></div></div><div class="process"><i class="fas fa-play"  href = "song" pro = "play"' + ' id = "' + item.id + '" name = "' + i + '">' + '</i><i class="fas fa-plus"  href = "song" pro = "plus"' + ' id = "' + item.id + '" name = "' + i + '">' + '</i>';
    if (likeList.indexOf(item.id) >= 0) itemHtml = itemHtml + '<i class="fas fa-heart"  href = "song" pro = "heart"' + ' id = "' + item.id + '" name = "' + i + '" style ="color : #E79796">' + '</i></div></div>';
    else itemHtml = itemHtml + '<i class="fas fa-heart"  href = "song" pro = "heart"' + ' id = "' + item.id + '" name = "' + i + '" style ="color : #000000">' + '</i></div></div>';
    listId[i] = item.id;
    $(itemHtml).appendTo(appendToWhere);
}

//将播放列表添加到列表
function appendPlaylistToList(item) {
    let itemHtml = '<div class="item"><div class="item_info">';
    itemHtml = itemHtml + '<span class="item_name" href="playlist"' + ' id = "' + item.id + '">';
    itemHtml = itemHtml + item.name + '</span></br><div class="playlist_author"><a class="author">';
    itemHtml = itemHtml + item.author + '</a></div></div><div class="process"><i class="fas fa-play" href="playlist" href = "playlist" pro = "play"' + ' id = " ' + item.id + '">' + '</i>';
    if (item.subscribed == -1) itemHtml = itemHtml + '<i class="fas fa-star" style ="color : #00000050" href="playlist"' + ' id = "' + item.id + '" href = "playlist" pro = "star">' + '</i></div></div>';
    else if (item.subscribed) itemHtml = itemHtml + '<i class="fas fa-star" style ="color : #E79796" href="playlist"' + ' id = "' + item.id + '"  href = "playlist" pro = "star">' + '</i></div></div>';
    else itemHtml = itemHtml + '<i class="fas fa-star" href="playlist"' + ' id = "' + item.id + '"  href = "playlist" pro = "star">' + '</i></div></div>';
    console.log(itemHtml);
    $(itemHtml).appendTo(appendToWhere);
}

//将专辑添加到列表
function appendAlbumToList(item) {
    let itemHtml = '<div class="item"><div class="item_info">';
    itemHtml = itemHtml + '<span class="item_name" href="album"' + ' id = "' + item.id + '">';
    itemHtml = itemHtml + item.name + '</span></br><div class="album_author"><a class="author">';
    itemHtml = itemHtml + item.author + '</a></div></div><div class="process"><i class="fas fa-play" href="album" href = "album" pro = "play"' + ' id = " ' + item.id + '">' + '</i>';
    console.log(itemHtml);
    $(itemHtml).appendTo(appendToWhere);
}

//将歌单封面照添加到list
function appendPlaylistCoverToList(item) {
    var itemHtml = '<div class="res"><div class="res_cover" id="pic" style="background: url(' + item.coverImgUrl + ') no-repeat;"><div class="res_play" id="' + item.id + '" href="playlist"><i class = "fas fa-play" id="' + item.id + '" pro = "play" href="playlist"></i></div></div><div class="res_name" id="' + item.id + '" href="playlist"><a>' + item.name + '</a></div></div>';
    $(itemHtml).appendTo(appendToWhere);
}

//更改列表
function changeList(list_info, items, type, el) {
    if (el.attr("id") == "item_list") {
        listId = [];
        $("#item_list").html('<div class="list_info">播放列表</div>');
        $(".list_info").html(list_info);
    } else if (el.attr("id") == "search_list") {
        $("#search_list").html('<div class="ser_pro_bar"><span class="fas fa-arrow-left" id="arrow" href="backward" onclick="turnResPage(-30)"></span><span class="change_search_method" id = "csm1" href="1" onclick="changeSearchMethod(1)" style="box-shadow: inset 0.2vh 0.2vh 1vh #cdcdcd, inset -0.3vh -0.3vh 0.6vh #ffffff">单曲</span><span class="change_search_method" id = "csm1000" href="1000" onclick="changeSearchMethod(1000)">歌单</span><span class="change_search_method" id = "csm10" href="10" onclick="changeSearchMethod(10)">专辑</span><span class="fas fa-arrow-right" id="arrow" href="forward" onclick="turnResPage(30)"></span></div>');
    }
    console.log(items);
    appendToWhere = el;
    el.css("display","block");
    if (type == "playlist") items.forEach(appendPlaylistToList);
    else if (type == "song") items.forEach(appendSongToList);
    else if (type == "album") items.forEach(appendAlbumToList);
    else if (type == "playlistCover"){
        el.css("display","grid");
        items.forEach(appendPlaylistCoverToList);
    }
    initItem();
}

//为列表里的item绑定点击事件
function initItem() {
    $(".item_name").unbind('click').click(function () {
        itemClick($(this));
    });
    $(".process i").unbind('click').click(function () {
        itemClick($(this));
    })
    $(".res_play").unbind('click').click(function () {
        itemClick($(this));
    })
    $(".res_name").unbind('click').click(function () {
        itemClick($(this));
    })
    $(".res_play i").unbind('click').click(function () {
        itemClick($(this));
    })
    $(".playing_album_cover").unbind('click').click(function () {
        itemClick($(this));
    })
}

//列表item点击事件
function itemClick(el) {
    let id = el.attr('id');
    let type = el.attr('href');
    let pro = el.attr('pro');
    console.log(pro);
    if (type == "playlist") {
        let api_adr = "http://csgo.itstim.xyz:3000/playlist/detail?" + cookieStr + "&id=" + id;
        let data;
        if (data = ajaxGet(api_adr)) {
            changeList(data.playlist.name, data.playlist.tracks, "song", $("#item_list"));
            $("#item_list").show();
            if (pro == "play") {
                playSongFromId(data.playlist.trackIds[0].id, true);
                localStorage.playingListId = JSON.stringify(playingListId = listId);
                localStorage.playingIndex = playingIndex = 0;
                if (playMethod == 2) shuffle();
            } else if (pro == "star") {
                let t = starAList(id);
                $(this).attr("style", ((t == 2) ? "color: #000000" : "color: #E79796"));
            }
        }
    } else if (type == "song") {
        if (pro == "play") {
            playSongFromId(id, true);
            localStorage.playingListId = JSON.stringify(playingListId = listId);
            localStorage.playingIndex = playingIndex = el.attr('name');
            if (playMethod == 2) shuffle();
        } else if (pro == "plus") {
            playAtNext(id);
        } else if (pro == "heart") {
            let fl = likeASong(id);
            $(this).attr("style", (fl ? "color: #000000" : "color: #E79796"));
        }
    } else if (type == "album") {
        let api_adr = "http://csgo.itstim.xyz:3000/album?" + cookieStr + "&id=" + id;
        let data;
        if (data = ajaxGet(api_adr)) {
            let songs = data.songs;
            changeList(data.album.name, songs, "song", $("#item_list"));
            $("#item_list").show();
            if(pro == "play"){
                playSongFromId(songs[0].id, true);
                localStorage.playingListId = JSON.stringify(playingListId = listId);
                localStorage.playingIndex = playingIndex = 0;
                if (playMethod == 2) shuffle();
            }
        }
    }
    showPlayingList();
}

//下一首播放
function playAtNext(id) {
    if (playMethod == 2) {
        let ori = playingListId.indexOf(parseInt(id), 0);
        let des = shuffledPlayingIndexs[parseInt(playingIndex)] + 1;
        if (id == shuffledPlayingIndexs[playingIndex] || (ori == des && shuffledPlayingIndexs[playingIndex + 1] == ori)) return;
        if (ori) {
            playingListId.splice(ori, 1);
            playingListId.splice(des, 0, parseInt(id));
            if (shuffledPlayingIndexs.indexOf(ori) < parseInt(playingIndex)) playingIndex = parseInt(playingIndex) - 1;
            shuffledPlayingIndexs.splice(shuffledPlayingIndexs.indexOf(ori), 1);
            if (ori > des) {
                for (let i = 0; i < shuffledPlayingIndexs.length; i++) {
                    if (shuffledPlayingIndexs[i] >= des && shuffledPlayingIndexs[i] < ori)
                        shuffledPlayingIndexs[i]++;
                }
            } else if (ori < des) {
                for (let i = 0; i < shuffledPlayingIndexs.length; i++) {
                    if (shuffledPlayingIndexs[i] < des && shuffledPlayingIndexs[i] > ori)
                        shuffledPlayingIndexs[i]--;
                }
                des--;
            }
        } else {
            playingListId.splice(des, 0, parseInt(id));
            for (let i = 0; i < shuffledPlayingIndexs.length; i++) {
                if (shuffledPlayingIndexs[i] >= des)
                    shuffledPlayingIndexs[i]++;
            }
        }
        shuffledPlayingIndexs.splice(parseInt(playingIndex) + 1, 0, des);
    } else {
        if (id == playingListId[playingIndex]) return;
        let ind = playingListId.indexOf(parseInt(id), 0);
        if (ind) playingListId.splice(ind, 1);
        playingListId.splice(playingIndex + 1, 0, parseInt(id));
    }
}

//从id获取歌曲
function getSongsFromTrackIds(ids) {
    let api_adr = "http://csgo.itstim.xyz:3000/song/detail?" + cookieStr + "&ids=" + ids;
    let data;
    if (data = ajaxGet(api_adr)) listSongs = data.songs;
}