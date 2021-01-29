let loginMethod = 1;
let loginStatus = 0;
let loginCookie = localStorage.cookie;
let lastPlayedId = localStorage.lastPlayedId;
let cookieStr = "cookie=" + loginCookie;
let avatar_url;
let nickname;
let AcData;
let uid;
let userPlayLists;
let listId = new Array();
let listSongs;
let playing;
let audio = document.getElementById("audio");
let playingIndex = localStorage.playingIndex;
let playingListId = new Array();
let playMethod;
let playMethodIcon = new Array();
let shuffledPlayingIndexs = new Array();

playMethod = (localStorage.playMethod == undefined) ? (localStorage.playMethod = 0) : localStorage.playMethod;
playingListId = localStorage.playingListId ? JSON.parse(localStorage.playingListId) : [];
playMethodIcon = ["source/img/loop.svg", "source/img/loop-1.svg", "source/img/random.svg"];
shuffledPlayingIndexs = localStorage.shuffledPlayingIndexs ? JSON.parse(localStorage.shuffledPlayingIndexs) : [];

//生成随机数
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

//检查电话号码
function checkTel(value) {
  let patrn = /^1([38]\d|5[0-35-9]|7[3678])\d{8}$/;
  if (patrn.test(value)) {
    return true;
  } else {
    return false;
  }
}

//更换登录样式时更换图标
function transInputIcon(input, i) {
  $(input).focus(function () {
    $(i).css("color", "#000000");
  });

  $(input).blur(function () {
    $(i).css("color", "#00000070");
  });
}

//更换登录样式
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

//登录
$(".login_btn").click(function () {
  let account = $("#account_input").val();
  if ($("#pwd_input").val() == "") {
    alert("密码不能为空!");
    return;
  }
  let pwd = md5($("#pwd_input").val());
  let api_adr = "http://csgo.itstim.xyz:3000/login/";

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
    xhrFields: {
      withCredentials: true
    },
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

//初始化登录状态、个人主页
function initLogin() {
  let api_adr = "http://csgo.itstim.xyz:3000/user/account?" + cookieStr;
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

//播放歌曲
function playSongFromId(id, play) {
  if (!checkSongAvalibility(id)) {
    return false;
  }
  let api_adr = "http://csgo.itstim.xyz:3000/song/detail?" + cookieStr + "&ids=" + id;
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
        let api_adr = "http://csgo.itstim.xyz:3000/song/url?" + cookieStr + "&id=" + id;
        $.ajax({
          url: api_adr,
          datatype: "json",
          type: "GET",
          success: function (data) {
            console.log(data);
            let audioUrl;
            audioUrl = (data.code == "200") ? (data.data[0].url) : ("https://music.163.com/song/media/outer/url?id=" + id + ".mp3 ");
            lastPlayedId = localStorage.lastPlayedId = id;
            $(".playing").attr("src", audioUrl);
            if (play) $('#bar_play').click();
            else $('#bar_pause').click();
          }
        });
      } else return false;
    }
  });
  return true;
}

//检查歌曲可用性（待改进
function checkSongAvalibility(id) {
  let api_adr = "http://csgo.itstim.xyz:3000/check/music?id=" + id;
  let avalibility = false;
  $.ajax({
    url: api_adr,
    datatype: "json",
    type: "GET",
    async: false,
    timeout: 5000,
    success: function (data) {
      console.log(data.success);
      avalibility = data.success;
    }
  });
  console.log(avalibility);
  return avalibility;
}

//底部栏播放
$('#bar_play').click(function () {
  if (audio.paused) {
    audio.play();
    $('#bar_play').hide();
    $('#bar_pause').show();
    //设置播放状态检查定时器
    let timer = setInterval(function () {
      if (audio.ended) {
        if (playMethod == 0 || playMethod == 2) $("#bar_forward").click();
        else if (playMethod == 1){
          audio.currentTime = 0;
          audio.play();
        }
      } else {
        let ratio = audio.currentTime / audio.duration;
        $(".currentProgress").css({
          'width': ratio * 100 + '%'
        });
      }
    }, 100)
  }
});

//底部栏暂停
$('#bar_pause').click(function () {
  audio.pause();
  $('#bar_play').show();
  $('#bar_pause').hide();
});

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

//更改进度条
$(".totalProgress").click(function (el) {
  let ratio = getRatio(el);
  $(".currentProgress").css({
    'width': ratio * 100 + '%'
  });
  audio.currentTime = audio.duration * ratio;
});

//获取播放百分比
function getRatio(el) {
  let totalWidth = $(".totalProgress")[0].offsetWidth;
  let totalX = $(".totalProgress").offset().left;
  let mouseX = el.clientX;
  let ratio = (mouseX - totalX) / totalWidth;
  return ratio;
}

//上一首
$("#bar_backward").click(function () {
  audio.currentTime = 0;
  audio.pause();
  localStorage.playingIndex = playingIndex = (--playingIndex + playingListId.length) % playingListId.length;
  if (playMethod == 2) playSongFromId(playingListId[shuffledPlayingIndexs[playingIndex]], true);
  else playSongFromId(playingListId[playingIndex], true);
});

//下一首
$("#bar_forward").click(function () {
  audio.currentTime = 0;
  audio.pause();
  localStorage.playingIndex = playingIndex = (playingIndex + 1) % playingListId.length;
  if (playMethod == 2) playSongFromId(playingListId[shuffledPlayingIndexs[playingIndex]], true);
  else playSongFromId(playingListId[playingIndex], true);
});

//更改播放模式
$(".bar_loop_svg").click(function () {
  localStorage.playMethod = playMethod = (playMethod + 1) % 3;
  $(".bar_loop_svg").html("");
  $(".bar_loop_svg").html('<embed src="' + playMethodIcon[playMethod] + '" type="image/svg+xml" pluginspage="http://www.adobe.com/svg/viewer/install/" />');
  if (playMethod == 2) shuffle();
});

//打乱播放列表(随机播放)
function shuffle() {
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

$(".me").hide();
$(".list").hide();
transInputIcon(".search_input", ".search_btn");
transInputIcon("#account_input", ".fa-envelope");
transInputIcon("#account_input", ".fa-mobile-alt");
transInputIcon("#pwd_input", ".fa-lock");
$("#loginMethodChanger").click();
initLogin();
playSongFromId(lastPlayedId, false);
$(".user_id").textfill();
$(".bar_loop_svg").html('<embed src="' + playMethodIcon[playMethod] + '" type="image/svg+xml" pluginspage="http://www.adobe.com/svg/viewer/install/" />');