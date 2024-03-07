document.addEventListener('DOMContentLoaded', function () {
    const tarotCardsBack = document.querySelectorAll('.tarot-card-back');
    const tarotButton = document.querySelector('.tarot-button');
    let selectedCount = 0;

    // 点击卡牌逻辑
    tarotCardsBack.forEach(card => {
        card.addEventListener('click', function () {
            if (selectedCount < 3 || this.classList.contains('selected')) {
                this.classList.toggle('selected');
                this.style.transform = this.classList.contains('selected') ? 'translateY(-30px)' : 'translateY(0px)';
                selectedCount = document.querySelectorAll('.tarot-card-back.selected').length; // 修正选中数量的计算
            } else {
                alert('最多只能選擇三枚卡牌。');
            }
        });
    });

    // 点击按钮逻辑
    tarotButton.addEventListener('click', function () {
        if (selectedCount !== 3) {
            alert('請選滿三枚卡牌。');
        } else {
            fetchTarotFiles().then(files => {
                updateImageSources(files);
                tarotCardsBack.forEach(card => {
                    card.classList.remove('selected'); // Reset selection
                    card.style.transform = 'translateY(0px)';
                });
                selectedCount = 0; // 重置选中计数
            }).catch(error => console.error('Failed to fetch tarot files:', error));
        }
    });

    async function fetchTarotFiles() {
        const response = await fetch('../dist/layout/json/tarot-files.json'); // 本機路徑
        // const response = await fetch('../dist/layout/json/tarot-files.json'); // 雲端路徑
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data.files;
    }

    function updateImageSources(files) {
        const terms = ['past', 'present', 'future'];
        let basePathSet = new Set(); // 用于确保基础路径的唯一性
        let selectedFiles = {};

        // 随机选择符合条件的文件，确保基础路径不重复
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
            } while (!selectedFiles[term] && attempt < 10); // 防止无限循环
        });

        terms.forEach((term, index) => {
            const targetImg = document.querySelector(`[data-bs-target="#imageModal-${index + 1}"] img`);
            const modalImg = document.querySelector(`#imageModal-${index + 1} .modal-body img`);

            if (targetImg && modalImg && selectedFiles[term]) {
                const baseName = selectedFiles[term].split('-')[0];
                const fileName = selectedFiles[term];
                targetImg.src = `../dist/assets/${fileName}`;
                // targetImg.src = `../assets/${fileName}`; //雲端路徑

                // 查找与选择的tarot卡片相匹配的content文件
                const contentFileName = files.find(file => file.startsWith(baseName) && file.includes('-content-'));
                if (contentFileName) {
                    modalImg.src = `../dist/assets/${contentFileName}`;
                    // modalImg.src = `../assets/${contentFileName}`; //雲端路徑
                } else {
                    console.error(`No content file found matching base name "${baseName}".`);
                }
            } else {
                console.error(`Failed to update images for term "${term}". Make sure the elements and file names exist.`);
            }
        });
    }
});
