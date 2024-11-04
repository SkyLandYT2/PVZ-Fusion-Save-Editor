let saveData = null;

document.getElementById('fileInput').addEventListener('change', loadFile);

function loadFile(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    
    reader.onload = (e) => {
        saveData = JSON.parse(e.target.result);
        renderLevels();
        initializeAdvLevelInput();
    };
    
    reader.readAsText(file);
}

function initializeAdvLevelInput() {
    // Подсчитываем текущее количество true в advLevelCompleted и устанавливаем значение в input
    const initialTrueCount = saveData.advLevelCompleted.filter(completed => completed).length;
    document.getElementById('advLevelInput').value = initialTrueCount;
}

function renderLevels() {
    const levelsDiv = document.getElementById('levels');
    levelsDiv.innerHTML = ''; 

    const advLevelInputContainer = document.getElementById('advLevelInputContainer');
    advLevelInputContainer.innerHTML = `
        <button id="decreaseButton">-</button>
        <input type="text" id="advLevelInput" value="0" readonly style="padding: 10px; font-size: 16px; width: 60px; text-align: center;" />
        <button id="increaseButton">+</button>
    `;

    const advLevelInput = document.getElementById('advLevelInput');
    const decreaseButton = document.getElementById('decreaseButton');
    const increaseButton = document.getElementById('increaseButton');

    decreaseButton.onclick = () => {
        const currentValue = parseInt(advLevelInput.value);
        if (currentValue > 0) {
            advLevelInput.value = currentValue - 1;
            updateAdvLevelCompleted(parseInt(advLevelInput.value));
        }
    };

    increaseButton.onclick = () => {
        const currentValue = parseInt(advLevelInput.value);
        const falseCount = saveData.advLevelCompleted.filter(completed => !completed).length;
        if (currentValue < saveData.advLevelCompleted.length) {
            advLevelInput.value = currentValue + 1;
            updateAdvLevelCompleted(parseInt(advLevelInput.value));
        }
    };

    saveData.clgLevelCompleted.forEach((completed, index) => {
        const levelDiv = document.createElement('div');
        levelDiv.classList.add('level');
        
        const levelImage = document.createElement('img');
        levelImage.src = `./clgLevelCompleted/img/${index + 1}.png`;
        
        if (completed) levelDiv.classList.add('selected');
        
        levelDiv.addEventListener('click', () => toggleLevel(index, levelDiv));
        
        levelImage.onerror = () => {
            levelDiv.remove();
        };

        levelDiv.appendChild(levelImage);
        levelsDiv.appendChild(levelDiv);
    });

    saveData.gameLevelCompleted.forEach((completed, index) => {
        const levelDiv = document.createElement('div');
        levelDiv.classList.add('level');
        
        const levelImage = document.createElement('img');
        levelImage.src = `./gameLevelCompleted/img/${index + 1}.png`;
        
        if (completed) levelDiv.classList.add('selected');
        
        levelDiv.addEventListener('click', () => toggleGameLevel(index, levelDiv));
        
        levelImage.onerror = () => {
            levelDiv.remove();
        };

        levelDiv.appendChild(levelImage);
        levelsDiv.appendChild(levelDiv);
    });
}

// Функция для обновления advLevelCompleted на основе значения в advLevelInput
function updateAdvLevelCompleted(count) {
    for (let i = 0; i < saveData.advLevelCompleted.length; i++) {
        saveData.advLevelCompleted[i] = i < count;
    }
}

function toggleLevel(index, element) {
    const isCompleted = saveData.clgLevelCompleted[index];
    saveData.clgLevelCompleted[index] = !isCompleted;
    element.classList.toggle('selected', !isCompleted);
}

function toggleGameLevel(index, element) {
    const isCompleted = saveData.gameLevelCompleted[index];
    saveData.gameLevelCompleted[index] = !isCompleted;
    element.classList.toggle('selected', !isCompleted);
}

function submitChanges() {
    const blob = new Blob([JSON.stringify(saveData, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'playerData.json';
    link.click();
}
