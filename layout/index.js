let tarotButton = document.querySelector(".tarot-button");
let tarotCards = document.querySelectorAll(".tarot-card-back");

// 使用 import.meta.glob 动态导入图片
const images = import.meta.glob('/assets/images/card/inFrame/**/*.{png,jpg}', { eager: true });

// 計算已選擇的卡牌數量
function countSelectedCards() {
    let selectedCount = 0;
    tarotCards.forEach(function(card) {
        if (card.style.transform === "translateY(-30px)") {
            selectedCount++;
        }
    });
    return selectedCount;
}

// 點擊 tarotCards 時切換選擇狀態
tarotCards.forEach(function(card) {
    card.addEventListener("click", function() {
        let selectedCount = countSelectedCards();
        if (selectedCount < 3 || card.style.transform === "translateY(-30px)") {
            if (card.style.transform === "translateY(-30px)") {
                card.style.transform = "translateY(0px)";
            } else {
                card.style.transform = "translateY(-30px)";
            }
        } else {
            alert("最多只能選擇三枚卡牌。");
        }
    });
});

// 點擊 tarotButton 時執行的函數
tarotButton.addEventListener("click", function() {
    let selectedCount = countSelectedCards();

    if (selectedCount < 3) {
        alert("請選滿三枚卡牌。");
        return;
    }

    // 設定圖片路徑
    let paths = [
        "../assets/images/card/inFrame/past/",
        "../assets/images/card/inFrame/present/",
        "../assets/images/card/inFrame/future/"
    ];

    // 隨機不重複地選取圖片
    let images = ["I.png", "II.png", "III.png", "IV.png", "V.png", "VI.png", "VII.png", "VIII.png", "IX.png", "X.png", "XI.png", "XII.png", "XIII.png", "XIV.png", "XV.png", "XVI.png", "XVII.png", "XVIII.png", "XIX.png", "XX.png", "XXI.png", "O.png"];
    let randomImages = shuffleArray(images);

    // 更新圖片路徑並添加轉牌動畫效果
    paths.forEach(function(path, index) {
        updateImagePath(path, `imageModal-${index + 1}`, "CARDB", randomImages[index]);
        let resultImg = document.querySelector(`[data-bs-target="#imageModal-${index + 1}"] img`);
        resultImg.classList.add("flip-animation");
        setTimeout(function() {
            resultImg.classList.remove("flip-animation");
        }, 1200);
    });

    // 將已選擇的卡牌恢復到 translateY(0px)
    tarotCards.forEach(function(card) {
        card.style.transform = "translateY(0px)";
    });
});

// 更新圖片路徑函数，现在使用动态导入的图片
function updateImagePath(modalId, imageIndex) {
    // 从 images 中找到匹配的图片，注意路径要与 glob 模式匹配
    const imagePath = Object.keys(images).find(path => path.includes(imageIndex));

    if (imagePath) {
        const imageModule = images[imagePath];
        const imageUrl = imageModule.default; // 使用导入的图片URL
        
        // 更新 modal 图片
        let modalBody = document.getElementById(modalId).querySelector(".modal-body img");
        modalBody.src = imageUrl;
        
        // 更新结果图片
        let resultImage = document.querySelector(`[data-bs-target="#${modalId}"] img`);
        resultImage.src = imageUrl;
    }
}

// 洗牌函數
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
