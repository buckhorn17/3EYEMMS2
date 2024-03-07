document.addEventListener('DOMContentLoaded', function () {
    const tarotCardsBack = document.querySelectorAll('.tarot-card-back');
    const tarotButton = document.querySelector('.tarot-button');
    let selectedCount = 0;

    // 點擊卡牌功能
    tarotCardsBack.forEach(card => {
        card.addEventListener('click', function () {
            if (selectedCount < 3 || this.classList.contains('selected')) {
                this.classList.toggle('selected');
                this.style.transform = this.classList.contains('selected') ? 'translateY(-30px)' : 'translateY(0px)';
                selectedCount = document.querySelectorAll('.tarot-card-back.selected').length; // 修正選取數量的計算
            } else {
                alert('最多只能選擇三枚卡牌。');
            }
        });
    });

    // 點擊按鈕功能
    tarotButton.addEventListener('click', function () {
        if (selectedCount !== 3) {
            alert('請選滿三枚卡牌。');
        } else {
            fetchTarotFiles().then(files => {
                updateImageSources(files);
                tarotCardsBack.forEach(card => {
                    card.classList.remove('selected'); // 重置選擇
                    card.style.transform = 'translateY(0px)';
                });
                selectedCount = 0; // 重置選取數量
            }).catch(error => console.error('Failed to fetch tarot files:', error));
        }
    });

    async function fetchTarotFiles() {
        // const response = await fetch('../layout/json/tarot-files.json'); // 本機路徑
        const response = await fetch('/3EYEMMS2/json/tarot-files.json'); // 雲端路徑
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data.files;
    }

    function updateImageSources(files) {
        const terms = ['past', 'present', 'future'];
        let basePathSet = new Set(); // 用於確保基礎路徑的唯一性
        let selectedFiles = {};
    
        // 隨機選擇符合條件的文件，確保基礎路徑不重複
        terms.forEach(term => {
            let filteredFiles;
            let attempt = 0;
            do {
                filteredFiles = files.filter(file => file.includes(`-${term}-`) && !basePathSet.has(file.split('-')[0]));
                if (filteredFiles.length > 0) {
                    const randomIndex = Math.floor(Math.random() * filteredFiles.length);
                    selectedFiles[term] = filteredFiles[randomIndex];
                    basePathSet.add(filteredFiles[randomIndex].split('-')[0]);
                }
                attempt++;
            } while (!selectedFiles[term] && attempt < 10); // 防止無限循環
        });
    
        terms.forEach((term, index) => {
            const targetImg = document.querySelector(`[data-bs-target="#imageModal-${index + 1}"] img`);
            const modalImg = document.querySelector(`#imageModal-${index + 1} .modal-body img`);
    
            if (targetImg && modalImg && selectedFiles[term]) {
                const baseName = selectedFiles[term].split('-')[0];
                const fileName = selectedFiles[term];
                // targetImg.src = `../dist/assets/${fileName}`; //本機路徑
                targetImg.src = `/3EYEMMS2/assets/${fileName}`; //雲端路徑
    
                // 移除之前可能存在的動畫結束事件監聽器
                targetImg.removeEventListener('animationend', handleAnimationEnd);
                
                // 添加翻轉動畫類
                targetImg.classList.add('flip-animation');
                
                // 監聽動畫結束事件，並在動畫結束後移除動畫類
                targetImg.addEventListener('animationend', handleAnimationEnd);
    
                // 尋找與選擇的tarot卡相符的content文件
                const contentFileName = files.find(file => file.startsWith(baseName) && file.includes('-content-'));
                if (contentFileName) {
                    // modalImg.src = `../dist/assets/${contentFileName}`; //本機路徑
                    modalImg.src = `/3EYEMMS2/assets/${contentFileName}`; //雲端路徑
                } else {
                    console.error(`No content file found matching base name "${baseName}".`);
                }
            } else {
                console.error(`Failed to update images for term "${term}". Make sure the elements and file names exist.`);
            }
        });
    
        function handleAnimationEnd(event) {
            event.target.classList.remove('flip-animation');
            event.target.removeEventListener('animationend', handleAnimationEnd);
        }
    }
});
