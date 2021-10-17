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
var albumArray = ["scenery", "food", "life", "family", "meme"];
var imgFrame = [], selectedAlbum;
for (let i = 0; i < albumArray.length; i++){
    imgFrame.push(document.getElementsByClassName(albumArray[i]));
}
// var selectedAlbum;

// 目前high light的indeex
var highLightIndex = {
    album: 0,
    img: 0
}

// 相簿按鈕元素與展示大圖元素
var albumButtons = document.getElementsByName("buttons"),   // array
    displayImg = document.getElementById("display");  

// 相片數量html文字元素
var total = document.getElementById("total"),
    this_album = document.getElementById("this_album"),
    nuber = document.getElementById("no.");
// 初始化count bar數字
total.getElementsByTagName("span")[0].innerText = getTotalImg();
this_album.getElementsByTagName("span")[0].innerText = getTotalImg();
nuber.getElementsByTagName("span")[0].innerText = 1;

// 新增照片與刪除照片選單元素與按鈕元素
var addSelect = document.getElementById("Add"),
    removeSelect = document.getElementById("Remove"),
    addButton = document.getElementById("Add-Button"),
    removeButton = document.getElementById("Remove-Button");
addSelect.addEventListener("change",function(event){selectedAlbum = event.target.value});
removeSelect.addEventListener("change",function(event){selectedAlbum = event.target.value});
addButton.addEventListener("click", addPhoto);
removeButton.addEventListener("click", function(){removePhoto()});

// 設定點擊輸入照片url按鈕反應
function addPhoto(){
    if (selectedAlbum != '' && selectedAlbum != undefined){
        var url = prompt("請輸入欲新增之圖片的url");

        // 若按取消，url = null
        if (url !== null){
            console.log(url);
            newContainer = document.createElement("div");
            newImg = document.createElement("img");
            newContainer.classList.add("image", albumArray[selectedAlbum]);
            newImg.src = url;
            newImg.alt = "找不到此圖片";
            newContainer.appendChild(newImg);

            // photo-container 中新增圖匡
            var photo_container = document.getElementsByClassName("photo-container")[0] ;
            let insertIndex = 0;
            // 計算加入照片的index
            for (let i = 0; i <= selectedAlbum; i++){
                insertIndex += pictures[i].length;
            }
            //  在photo_container加入一child element，並在pictures array該相簿尾端新增一url
            photo_container.insertBefore(newContainer, photo_container.children[insertIndex]);            
            pictures[selectedAlbum].push(url);

            // 重新設定圖框、相簿按鈕的EventListener，更新總圖片數
            set_imgFrame();
            updateTotalCount(1);
            set_albumButtons();
        }
    }else{
        alert("請先選擇一相簿！")
    }
}

// 設定點擊輸入照片編號按鈕反應
function removePhoto(){
    if (selectedAlbum != '' && selectedAlbum != undefined){
        var index = prompt("請輸入欲刪除此相簿第幾張圖片");  //index由第一張開始算，最大到該相簿長度;

        // 若按取消，url = null
        if (index != null){
            var showIndex = nuber.getElementsByTagName("span")[0].innerText;
            var removeIndex = 0;
            // 計算移除照片的index
            for (let i = 0; i < selectedAlbum; i++){
                removeIndex += pictures[i].length;
            }
            removeIndex = removeIndex + Number(index) - 1; 

            //若輸入數字符合相簿範圍
            if (index > 0 && index <= pictures[selectedAlbum].length){

                //若輸入數字與展示中圖片相同
                if(showIndex == (removeIndex + 1)){
                    alert("請勿刪除正在展示中的相片");
                }else{
                    var photo_container = document.getElementsByClassName("photo-container")[0];
                    photo_container.children[removeIndex].remove();
                    pictures[selectedAlbum].splice(index-1, 1);
                    
                    // 重新設定圖框、相簿按鈕的EventListener，更新總圖片數
                    
                    updateTotalCount(-1);
                    set_albumButtons();
                    set_imgFrame();
                    // for(let i = 0; i < imgFrame.length; i++){
                    //     for(let j = 0; j < imgFrame[i].length; j++){
                    //         set_imgFrame(i,j);
                    //     }
                    // }
                }
            }else{
                alert("輸入的數字超出此相簿相片編號範圍了！\n請輸入相簿數量範圍內的數字");
            }
        }
    }else{
        alert("請先選擇一相簿！");
    }
}

// 獲取目前相片總數
function getTotalImg(){
    let total = 0;
    for(let i=0; i<pictures.length; i++){
        total += pictures[i].length;
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

//更新目前count bar
function updateTotalCount(index){
    total.getElementsByTagName("span")[0].innerText = getTotalImg();
    this_album.getElementsByTagName("span")[0].innerText = Number(index) + Number(this_album.getElementsByTagName("span")[0].innerText);
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
            imgFrame[i][j].addEventListener("click", function(){console.log(i, j)});
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
                albumButtons[i].addEventListener("click", function(){nuber.getElementsByTagName("span")[0].innerText = getThisImgNo(i,0)});
            }
        }
        else{
            albumButtons[i].addEventListener("click", function(){alert("此為空白相簿！")});
        }
    }
}


// 設定初始畫面圖框、相簿按鈕的EventListener
set_imgFrame();
set_albumButtons();
