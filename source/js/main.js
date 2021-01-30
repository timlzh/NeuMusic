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
let playingIndex;
let playingListId = new Array();
let playMethod;
let playMethodIcon = new Array();
let shuffledPlayingIndexs = new Array();
let likeList = new Array();

playingIndex = parseInt(localStorage.playingIndex) ? parseInt(localStorage.playingIndex) : 0;
playMethod = (localStorage.playMethod == undefined) ? (localStorage.playMethod = 0) : localStorage.playMethod;
playingListId = localStorage.playingListId ? JSON.parse(localStorage.playingListId) : [];
playMethodIcon = ["source/img/loop.svg", "source/img/loop-1.svg", "source/img/random.svg"];
shuffledPlayingIndexs = localStorage.shuffledPlayingIndexs ? JSON.parse(localStorage.shuffledPlayingIndexs) : [];

function hideAll() {
    $(".contianer").children().each(function () {
        $(this).hide();
    })
}

$(".me").hide();
$(".list").hide();
transInputIcon(".search_input", ".search_btn");
transInputIcon("#account_input", ".fa-envelope");
transInputIcon("#account_input", ".fa-mobile-alt");
transInputIcon("#pwd_input", ".fa-lock");
$("#loginMethodChanger").unbind('click').click();
initLogin();
playSongFromId(lastPlayedId, false);
$(".bar_loop_svg").html('<embed src="' + playMethodIcon[playMethod] + '" type="image/svg+xml" pluginspage="http://www.adobe.com/svg/viewer/install/" />');
setInterval(function(){
    getLikeList();
}, 3000);