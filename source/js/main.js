//变量声明
let apiAd = localStorage.apiAd;
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
let userCreatPlaylistIds = new Array();
let userFavPlaylistIds = new Array();
let listId = new Array();
let listSongs;
let playing;
let audio = document.getElementById("audio");
let playingIndex;
let playingListId = new Array();
let subscribedLists = new Array();
let playMethod;
let playMethodIcon = new Array();
let shuffledPlayingIndexs = new Array();
let likeList = new Array();
let searchMethod = 1;
let appendToWhere;
let nowPage = 0;
let nowWord = "";

//隐藏contianer中的所有元素(可改进)
function hideAll() {
    $(".contianer").children().each(function () {
        $(this).hide();
    })
}

//ajax请求
function ajaxGet(api_adr) {
    let res;
    $.ajax({
        url: api_adr,
        datatype: "json",
        type: "GET",
        async: false,
        success: function (data) {
            console.log(data);
            if (data.code == "200") res = data;
        }
    });
    if (res) return res;
    else return false;
}

//变量初始化
playingIndex = parseInt(localStorage.playingIndex) ? parseInt(localStorage.playingIndex) : 0;
playMethod = (localStorage.playMethod == undefined) ? (localStorage.playMethod = 0) : localStorage.playMethod;
playingListId = localStorage.playingListId ? JSON.parse(localStorage.playingListId) : [];
playMethodIcon = ["source/img/loop.svg", "source/img/loop-1.svg", "source/img/random.svg"];
shuffledPlayingIndexs = localStorage.shuffledPlayingIndexs ? JSON.parse(localStorage.shuffledPlayingIndexs) : [];

//初始化
$(".me").hide();
$(".list").hide();
$(".playing_div").hide();
if(!apiAd){
    localStorage.apiAd = apiAd = prompt("请输入api地址 \n 一定不要忘了地址最后的/","http://localhost:3000/");
    location.reload();
}else{
    let api_adr = apiAd + "search/hot";
    let data;
    if (!(data = ajaxGet(api_adr))) { 
        localStorage.apiAd = apiAd = "";
        location.reload();
    }
}
transInputIcon(".search_input", ".search_btn");
transInputIcon("#account_input", ".fa-envelope");
transInputIcon("#account_input", ".fa-mobile-alt");
transInputIcon("#pwd_input", ".fa-lock");
$("#loginMethodChanger").click();
initLogin();
playSongFromId(lastPlayedId, false);
$(".bar_loop_svg").html('<embed src="' + playMethodIcon[playMethod] + '" type="image/svg+xml" pluginspage="http://www.adobe.com/svg/viewer/install/" />');
navigator.mediaSession.setActionHandler('play',startToPlay);
navigator.mediaSession.setActionHandler('pause',pausePlaying);
navigator.mediaSession.setActionHandler('previoustrack', function () {
    changeSong(0);
});
navigator.mediaSession.setActionHandler('nexttrack', function () {
    changeSong(1);
});