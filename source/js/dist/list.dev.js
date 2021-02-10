"use strict";

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
  var itemHtml = '<div class="item"><div class="item_info">';
  itemHtml = itemHtml + '<span class="item_name" href = "song" pro = "play"' + ' id = "' + item.id + '" name = "' + i + '">';
  itemHtml = itemHtml + item.name + '</span></br><div class="song_SA"><a class="singer" id= "' + item.ar[0].id + '">';
  itemHtml = itemHtml + item.ar[0].name + '</a> - <a class="album" id="' + item.al.id + '">' + item.al.name + '</a></div></div><div class="process"><i class="fas fa-play"  href = "song" pro = "play"' + ' id = "' + item.id + '" name = "' + i + '">' + '</i><i class="fas fa-plus"  href = "song" pro = "plus"' + ' id = "' + item.id + '" name = "' + i + '">' + '</i>';
  if (likeList.indexOf(item.id) >= 0) itemHtml = itemHtml + '<i class="fas fa-heart"  href = "song" pro = "heart"' + ' id = "' + item.id + '" name = "' + i + '" style ="color : #E79796">' + '</i></div></div>';else itemHtml = itemHtml + '<i class="fas fa-heart"  href = "song" pro = "heart"' + ' id = "' + item.id + '" name = "' + i + '" style ="color : #000000">' + '</i></div></div>';
  listId[i] = item.id;
  $(itemHtml).appendTo(appendToWhere);
} //将播放列表添加到列表


function appendPlayList(item) {
  var itemHtml = '<div class="item"><div class="item_info">';
  itemHtml = itemHtml + '<span class="item_name" href="playlist"' + ' id = "' + item.id + '">';
  itemHtml = itemHtml + item.name + '</span></br><div class="playlist_author"><a class="author">';
  itemHtml = itemHtml + item.author + '</a></div></div><div class="process"><i class="fas fa-play" href="playlist" href = "playlist" pro = "play"' + ' id = " ' + item.id + '">' + '</i>';
  if (item.subscribed == -1) itemHtml = itemHtml + '<i class="fas fa-star" style ="color : #00000050" href="playlist"' + ' id = "' + item.id + '" href = "playlist" pro = "star">' + '</i></div></div>';else if (item.subscribed) itemHtml = itemHtml + '<i class="fas fa-star" style ="color : #E79796" href="playlist"' + ' id = "' + item.id + '"  href = "playlist" pro = "star">' + '</i></div></div>';else itemHtml = itemHtml + '<i class="fas fa-star" href="playlist"' + ' id = "' + item.id + '"  href = "playlist" pro = "star">' + '</i></div></div>';
  console.log(itemHtml);
  $(itemHtml).appendTo(appendToWhere);
} //将专辑添加到列表


function appendAlbumToList(item) {
  var itemHtml = '<div class="item"><div class="item_info">';
  itemHtml = itemHtml + '<span class="item_name" href="album"' + ' id = "' + item.id + '">';
  itemHtml = itemHtml + item.name + '</span></br><div class="album_author"><a class="author">';
  itemHtml = itemHtml + item.author + '</a></div></div><div class="process"><i class="fas fa-play" href="album" href = "album" pro = "play"' + ' id = " ' + item.id + '">' + '</i>';
  console.log(itemHtml);
  $(itemHtml).appendTo(appendToWhere);
} //更改列表


function changeList(list_info, items, type, el) {
  if (el.attr("id") == "item_list") {
    listId = [];
    $("#item_list").html('<div class="list_info">播放列表</div>');
    $(".list_info").html(list_info);
  } else if (el.attr("id") == "search_list") {
    $("#search_list").html('<div class="ser_pro_bar"><span class="fas fa-arrow-left" id="arrow" href="backward"></span><span class="change_search_method" href="1" style="box-shadow: inset 0.2vh 0.2vh 1vh #cdcdcd, inset -0.3vh -0.3vh 0.6vh #ffffff">单曲</span><span class="change_search_method" href="1000">歌单</span><span class="change_search_method" href="10">专辑</span><span class="fas fa-arrow-right" id="arrow" href="forward"></span></div>');
  }

  console.log(items);
  appendToWhere = el;
  if (type == "playlist") items.forEach(appendPlayList);else if (type == "song") items.forEach(appendSongToList);else if (type == "album") items.forEach(appendAlbumToList);
  initItem();
} //为列表里的item绑定点击事件


function initItem() {
  $(".item_name").unbind('click').click(function () {
    itemClick($(this));
  });
  $(".process i").unbind('click').click(function () {
    itemClick($(this));
  });
} //列表item点击事件


function itemClick(el) {
  var id = el.attr('id');
  var type = el.attr('href');
  var pro = el.attr('pro');
  console.log(pro);

  if (type == "playlist") {
    var api_adr = "http://csgo.itstim.xyz:3000/playlist/detail?" + cookieStr + "&id=" + id;
    var data;

    if (data = ajaxGet(api_adr)) {
      changeList(data.playlist.name, data.playlist.tracks, "song", $("#item_list"));

      if (pro == "play") {
        playSongFromId(data.playlist.trackIds[0].id, true);
        localStorage.playingListId = JSON.stringify(playingListId = listId);
        localStorage.playingIndex = playingIndex = 0;
        if (playMethod == 2) shuffle();
      } else if (pro == "star") {
        var t = starAList(id);
        $(this).attr("style", t == 2 ? "color: #000000" : "color: #E79796");
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
      var fl = likeASong(id);
      $(this).attr("style", fl ? "color: #000000" : "color: #E79796");
    }
  } else if (type == "album") {
    var _api_adr = "http://csgo.itstim.xyz:3000/album?" + cookieStr + "&id=" + id;

    var _data;

    if (_data = ajaxGet(_api_adr)) {
      var songs = _data.songs;
      changeList(_data.album.name, songs, "song", $("#item_list"));
      playSongFromId(songs[0].id, true);
      localStorage.playingListId = JSON.stringify(playingListId = listId);
      localStorage.playingIndex = playingIndex = 0;
      if (playMethod == 2) shuffle();
      $("#item_list");
    }
  }
} //下一首播放


function playAtNext(id) {
  if (playMethod == 2) {
    var ori = playingListId.indexOf(parseInt(id), 0);
    var des = shuffledPlayingIndexs[parseInt(playingIndex)] + 1;
    if (id == shuffledPlayingIndexs[playingIndex] || ori == des && shuffledPlayingIndexs[playingIndex + 1] == ori) return;

    if (ori) {
      playingListId.splice(ori, 1);
      playingListId.splice(des, 0, parseInt(id));
      if (shuffledPlayingIndexs.indexOf(ori) < parseInt(playingIndex)) playingIndex = parseInt(playingIndex) - 1;
      shuffledPlayingIndexs.splice(shuffledPlayingIndexs.indexOf(ori), 1);

      if (ori > des) {
        for (var i = 0; i < shuffledPlayingIndexs.length; i++) {
          if (shuffledPlayingIndexs[i] >= des && shuffledPlayingIndexs[i] < ori) shuffledPlayingIndexs[i]++;
        }
      } else if (ori < des) {
        for (var _i = 0; _i < shuffledPlayingIndexs.length; _i++) {
          if (shuffledPlayingIndexs[_i] < des && shuffledPlayingIndexs[_i] > ori) shuffledPlayingIndexs[_i]--;
        }

        des--;
      }
    } else {
      playingListId.splice(des, 0, parseInt(id));

      for (var _i2 = 0; _i2 < shuffledPlayingIndexs.length; _i2++) {
        if (shuffledPlayingIndexs[_i2] >= des) shuffledPlayingIndexs[_i2]++;
      }
    }

    shuffledPlayingIndexs.splice(parseInt(playingIndex) + 1, 0, des);
  } else {
    if (id == playingListId[playingIndex]) return;
    var ind = playingListId.indexOf(parseInt(id), 0);
    if (ind) playingListId.splice(ind, 1);
    playingListId.splice(playingIndex + 1, 0, parseInt(id));
  }
} //从id获取歌曲


function getSongsFromTrackIds(ids) {
  var api_adr = "http://csgo.itstim.xyz:3000/song/detail?" + cookieStr + "&ids=" + ids;
  var data;
  if (data = ajaxGet(api_adr)) listSongs = data.songs;
}