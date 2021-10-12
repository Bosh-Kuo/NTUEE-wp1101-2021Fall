//
var pictures = [
    ["https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Natural_scenery_of_nepal_07.jpg/1599px-Natural_scenery_of_nepal_07.jpg", 
    "https://live.staticflickr.com/3821/10345247155_67b25ec9ac_b.jpg", 
    "https://p0.pxfuel.com/preview/856/603/675/enchanting-forest-walk-hike.jpg"],
    ["https://p1.pxfuel.com/preview/615/178/465/ice-cream-fruits-dessert.jpg", 
    "https://p1.pxfuel.com/preview/282/948/15/dessert-hands-ice-cream-outside.jpg", 
    "https://p1.pxfuel.com/preview/947/596/996/food-drink-dessert-food-fruit.jpg", 
    "https://cdn.pixabay.com/photo/2020/03/10/03/49/red-velvet-cake-4917734_1280.jpg", 
    "https://cakeiy.com/_next/image?url=%2Fimg%2Fchocolate-round-cake%2Fbirthday-cake-name-your-name.png&w=1920&q=75", 
    "https://img.rawpixel.com/s3fs-private/rawpixel_images/website_content/wk64480505-image-kp6aizc0.jpg?w=1300&dpr=1&fit=default&crop=default&q=80&vib=3&con=3&usm=15&bg=F4F4F3&ixlib=js-2.2.1&s=7c3f2bbb08528e79634f6aafc5c8d292",
    "https://p0.pxfuel.com/preview/594/211/683/food-and-drink-bread-sandwich.jpg",
    "https://p1.pxfuel.com/preview/850/545/143/restaurant-sandwich.jpg",
    "https://p1.pxfuel.com/preview/547/251/642/food-ham-filling-sandwich-cheese-delicious.jpg"],
    ["https://p1.pxfuel.com/preview/642/154/417/headphones-audio-technology.jpg", 
    "https://p1.pxfuel.com/preview/193/599/760/headphones-headset-music-white.jpg", 
    "https://p1.pxfuel.com/preview/152/192/1003/headphones-music-song-foam-black-playlist.jpg"],
    ["https://p0.pxfuel.com/preview/458/296/59/friends-hugging-mountain-people.jpg", 
    "https://p1.pxfuel.com/preview/602/371/800/family-sunset-beach-happiness.jpg",
    "https://p0.pxfuel.com/preview/69/812/850/man-child-running-family.jpg"],
    ["https://upload.wikimedia.org/wikipedia/commons/4/4b/Dog_meme.jpg", 
    "https://upload.wikimedia.org/wikipedia/commons/a/af/Elder_meme.jpg", 
    "https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Wikipedia_meme.jpg/1599px-Wikipedia_meme.jpg"]
];

// 圖框html二維元素陣列
var imgFrame = []
imgFrame.push(document.getElementsByClassName("scenery"));
imgFrame.push(document.getElementsByClassName("food"));
imgFrame.push(document.getElementsByClassName("life"));
imgFrame.push(document.getElementsByClassName("family"));
imgFrame.push(document.getElementsByClassName("meme"));

// 目前high light的indeex
var highLightIndex = {
    album: 0,
    img: 0
}

// 相簿按鈕元素與展示大圖元素
var albumButtons = document.getElementsByName("buttons"), 
    displayImg = document.getElementById("display");  

// 相片數量html文字元素
var total = document.getElementById("total"),
    this_album = document.getElementById("this_album"),
    nuber = document.getElementById("no.");
total.getElementsByTagName("span")[0].innerText = getTotalImg();
this_album.getElementsByTagName("span")[0].innerText = getTotalImg();
nuber.getElementsByTagName("span")[0].innerText = 1;

// 獲取目前相片總數
function getTotalImg(){
    let total = 0;
    for(let i=0; i<pictures.length; i++){
        for(let j=0; j<pictures[i].length;j++){
            total ++;
        }
    }
    return total;
}

// 獲取此相簿相片總數
function getThisAlbumImg(i){
    return pictures[i].length;
}

// 獲取此相片編號
function getThisImgNo(albumIndex,imgIndex){
    let number = 0;
    for(let i=0; i<albumIndex; i++){
        for(let j=0; j<pictures[i].length;j++){
            number ++;
        }
    }
    number = number + imgIndex + 1;
    return number;
}

// 變更展示區的圖片
function setImg(albumIndex, imgIndex) {
    displayImg.src = pictures[albumIndex][imgIndex];
}

// 將前一個預覽圖框的class="highLight"移除，並為當下的預覽圖框加入 class="highLight"
function highLight_imgFrame(albumIndex, imgIndex){
    imgFrame[highLightIndex.album][highLightIndex.img].classList.remove("highLight");
    highLightIndex.album = albumIndex;
    highLightIndex.img = imgIndex;
    imgFrame[highLightIndex.album][highLightIndex.img].classList.add("highLight");
}

//將所有預覽圖框加入EventListener，當點擊時呼叫highLight_imgFrame()與setImg()
function set_imgFrame(){
    for(let i = 0; i < imgFrame.length; i++){
        for(let j = 0; j < imgFrame[i].length; j++){
            imgFrame[i][j].addEventListener("click", function(){highLight_imgFrame(i,j)});
            imgFrame[i][j].addEventListener("click", function(){setImg(i,j)});
            imgFrame[i][j].addEventListener("click", function(){nuber.getElementsByTagName("span")[0].innerText = getThisImgNo(i,j)});
        }
    }
}


// 設定各相簿按鈕按下時的反應
function set_albumButtons(){
    for(let i = 0; i < albumButtons.length; i++){  
        // 注意此處必須用let，若用var i為全域，傳入function中的parameter會隨著i++一起變動
        if (albumButtons[i].id !== "blank"){
            if (i!=0){
                albumButtons[i].addEventListener("click", function(){setImg(i-1,0)});
                albumButtons[i].addEventListener("click", function(){highLight_imgFrame(i-1,0)});
                albumButtons[i].addEventListener("click", function(){this_album.getElementsByTagName("span")[0].innerText = getThisAlbumImg(i-1)});
                albumButtons[i].addEventListener("click", function(){nuber.getElementsByTagName("span")[0].innerText = getThisImgNo(i-1,0)});
            }
            else{
                albumButtons[i].addEventListener("click", function(){setImg(i,0)});
                albumButtons[i].addEventListener("click", function(){highLight_imgFrame(i,0)});
                albumButtons[i].addEventListener("click", function(){this_album.getElementsByTagName("span")[0].innerText = getTotalImg()});
            }
        }
        else{
            albumButtons[i].addEventListener("click", function(){alert("此為空白相簿！")});
        }
    }
}

set_imgFrame();
set_albumButtons();



