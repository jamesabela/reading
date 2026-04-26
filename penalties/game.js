// Phaser Game Configuration
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    backgroundColor: '#000',
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

let wordsData = null;
let gameMode = '1P'; // '1P' or '2P'
let setupStep = 1;
let isGameReady = false;
let pendingStartGame = false;

let player1 = { name: "PLAYER 1", color: "#3498db", score: 0, goalieType: 'female' };
let player2 = { name: "PLAYER 2", color: "#e74c3c", score: 0, goalieType: 'female' };
let currentPlayer = null;
let turnCount = 0;

let isAnswerCorrect = false;
let currentWord = null;
let selectedAnswer = null;
let currentChoices = [];
let canSelectShot = false;
let soundVolume = 0.3;
let menuMusic = null;
let activeQuestionSetName = 'Default set';
const MAX_QUESTIONS = 50;
const EDITOR_SET_KEY = 'penaltyQuestionEditorSet';

const colors = [
    { name: 'Red', hex: '#ff0000' }, { name: 'Blue', hex: '#3498db' },
    { name: 'White', hex: '#ffffff' }, { name: 'Sky Blue', hex: '#87CEEB' },
    { name: 'Yellow', hex: '#f1c40f' }, { name: 'Navy', hex: '#2c3e50' },
    { name: 'Black', hex: '#000000' }, { name: 'Maroon', hex: '#800000' }, { name: 'Green', hex: '#27ae60' },
    { name: 'Purple', hex: '#9b59b6' }, { name: 'Light Orange', hex: '#f4b183' }
];

// Assets
let ball, ballShadow, goalie, background;
const goalChoicePoints = {
    'TL': { x: 250, y: 275 },
    'TR': { x: 550, y: 275 },
    'BL': { x: 250, y: 385 },
    'BR': { x: 550, y: 385 }
};
const goalShotTargets = {
    'TL': { x: 310, y: 285 },
    'TR': { x: 490, y: 285 },
    'BL': { x: 315, y: 335 },
    'BR': { x: 485, y: 335 }
};
const goalSaveTargets = {
    'TL': { x: 355, y: 306 },
    'TR': { x: 445, y: 306 },
    'BL': { x: 355, y: 352 },
    'BR': { x: 445, y: 352 }
};
const GOALIE_SCALE = 0.26;
const GOALIE_DIVE_DISTANCE = 45;
const GOALIE_Y = 330;

function preload() {
    this.load.setPath('penalties/');
    this.load.json('words', 'penaltyshootout.json');
    this.load.image('background', 'assets/stadium_background_v2_1776206365228.png');
    this.load.image('ball', 'assets/ball.png');
    this.load.audio('goal-sfx', 'assets/goal.mp3');
    this.load.audio('miss-sfx', 'assets/booing.mp3');
    this.load.audio('menu-music', 'Match Of The Day.mp3');
    
    // Load both types
    ['female', 'male'].forEach(t => {
        for (let i = 0; i < 3; i++) {
            this.load.image(`${t}_idle_${i}`, `assets/${t}_idle_${i}.png`);
            this.load.image(`${t}_dive_right_${i}`, `assets/${t}_dive_right_${i}.png`);
            this.load.image(`${t}_dive_left_${i}`, `assets/${t}_dive_left_${i}.png`);
        }
    });
}

function create() {
    this.background = this.add.image(400, 300, 'background').setDisplaySize(800, 600);
    ballShadow = this.add.graphics({ fillStyle: { color: 0x000000, alpha: 0.4 } });
    ballShadow.fillCircle(0, 0, 40);
    ballShadow.setVisible(false);
    this.sound.volume = soundVolume;
    startMenuMusic(this);

    setupAudioControls();
    setupQuestionSetLoader();

    isGameReady = true;
    if (pendingStartGame) {
        pendingStartGame = false;
        startGame();
    }

    // Initial nav state
    toggleMainNav(true);
}

function toggleMainNav(visible) {
    const nav = document.getElementById('main-nav');
    if (nav) {
        if (visible) nav.classList.add('visible');
        else nav.classList.remove('visible');
    }
}

function update() {}

function startMenuMusic(scene) {
    if (!scene || !scene.sound || !scene.cache.audio.exists('menu-music')) return;
    
    if (!menuMusic) {
        menuMusic = scene.sound.add('menu-music', {
            loop: true,
            volume: 1
        });
    }

    if (menuMusic.isPlaying) return;

    const playMusic = () => {
        if (game.sound.context.state === 'suspended') {
            game.sound.context.resume();
        }
        
        if (!menuMusic.isPlaying) {
            menuMusic.play();
        }
        
        window.removeEventListener('click', playMusic);
        window.removeEventListener('keydown', playMusic);
    };

    if (game.sound.context.state === 'running') {
        playMusic();
    } else {
        window.addEventListener('click', playMusic);
        window.addEventListener('keydown', playMusic);
    }
}

function stopMenuMusic() {
    if (menuMusic && menuMusic.isPlaying) {
        menuMusic.stop();
    }
}

function setupAudioControls() {
    const muteBtn = document.getElementById('mute-toggle-btn');
    const volumeSlider = document.getElementById('volume-slider');
    const volumeLabel = document.getElementById('volume-label');

    if (!muteBtn || !volumeSlider || !volumeLabel) return;

    const syncAudioUI = () => {
        volumeSlider.value = Math.round(soundVolume * 100);
        volumeLabel.innerText = `VOLUME: ${Math.round(soundVolume * 100)}%`;
    };

    muteBtn.onclick = () => {
        soundVolume = 0;
        if (game.sound) {
            game.sound.volume = soundVolume;
        }
        syncAudioUI();
    };

    volumeSlider.oninput = (event) => {
        soundVolume = Number(event.target.value) / 100;
        if (game.sound) {
            game.sound.volume = soundVolume;
        }
        syncAudioUI();
    };

    syncAudioUI();
}

function setupQuestionSetLoader() {
    const loadBtn = document.getElementById('load-json-btn');
    const fileInput = document.getElementById('question-json-input');
    const status = document.getElementById('loaded-set-label');

    if (!loadBtn || !fileInput || !status) return;

    if (!loadLinkedQuestionSet(status)) {
        loadEditorQuestionSet(status);
    }

    loadBtn.onclick = () => fileInput.click();
    fileInput.onchange = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            const data = JSON.parse(await file.text());
            wordsData = normalizeQuestionSet(data);
            activeQuestionSetName = file.name;
            status.style.color = '#b7f5c8';
            status.innerText = `Loaded: ${file.name} (${wordsData.questions.length} questions)`;
        } catch (error) {
            console.error(error);
            status.style.color = '#ffb4b4';
            status.innerText = error.message || 'Could not load JSON file.';
        } finally {
            fileInput.value = '';
        }
    };
}

function getSafeQuestionSetUrl(rawUrl) {
    if (!rawUrl) return '';

    const decodedUrl = decodeURIComponent(rawUrl).trim();
    if (
        decodedUrl.startsWith('/') ||
        (decodedUrl.startsWith('../') && !decodedUrl.startsWith('../editor/samples/')) ||
        decodedUrl.includes('://') ||
        decodedUrl.includes('\\') ||
        !decodedUrl.endsWith('.json')
    ) {
        throw new Error('Question set links must use a relative .json file.');
    }

    return decodedUrl;
}

function loadLinkedQuestionSet(status) {
    const params = new URLSearchParams(window.location.search);
    const rawSetUrl = params.get('set');
    if (!rawSetUrl) return false;

    try {
        const setUrl = getSafeQuestionSetUrl(rawSetUrl);
        fetch(setUrl)
            .then((response) => {
                if (!response.ok) throw new Error(`Could not load ${setUrl}.`);
                return response.json();
            })
            .then((data) => {
                wordsData = normalizeQuestionSet(data);
                activeQuestionSetName = setUrl;
                status.style.color = '#b7f5c8';
                status.innerText = `Loaded from link: ${setUrl} (${wordsData.questions.length} questions)`;
            })
            .catch((error) => {
                console.error(error);
                status.style.color = '#ffb4b4';
                status.innerText = error.message || 'Linked question set could not be loaded.';
            });
        return true;
    } catch (error) {
        console.error(error);
        status.style.color = '#ffb4b4';
        status.innerText = error.message || 'Invalid question set link.';
        return true;
    }
}

function loadEditorQuestionSet(status) {
    const savedSet = localStorage.getItem(EDITOR_SET_KEY);
    if (!savedSet) return;

    try {
        wordsData = normalizeQuestionSet(JSON.parse(savedSet));
        activeQuestionSetName = 'Editor set';
        status.style.color = '#b7f5c8';
        status.innerText = `Loaded from editor (${wordsData.questions.length} questions)`;
    } catch (error) {
        console.error(error);
        localStorage.removeItem(EDITOR_SET_KEY);
        status.style.color = '#ffb4b4';
        status.innerText = 'Editor set could not be loaded.';
    }
}

function normalizeQuestionSet(data) {
    if (!data || !Array.isArray(data.questions)) {
        throw new Error('JSON must contain a questions array.');
    }

    const validQuestions = data.questions
        .map((item) => ({
            word: String(item.word || item.answer || '').trim(),
            definition: String(item.definition || item.question || '').trim(),
            clue: String(item.clue || '').trim(),
            explanation: String(item.explanation || '').trim()
        }))
        .filter((item) => item.word && item.definition);
    const questions = validQuestions.slice(0, MAX_QUESTIONS);

    if (questions.length < 4) {
        throw new Error('Question sets need at least 4 valid word/definition pairs.');
    }

    return {
        metadata: {
            ...(data.metadata || {}),
            total_questions: questions.length,
            format: data.metadata?.format || 'flat'
        },
        questions
    };
}

function playResultSound(key) {
    const scene = game.scene.scenes[0];
    if (!scene || !scene.sound || !scene.cache.audio.exists(key)) return;
    scene.sound.play(key);
}

// --- Mode Logic ---

function selectGK(type) {
    if (setupStep === 1) player1.goalieType = type;
    else player2.goalieType = type;
    
    document.querySelectorAll('.gk-opt').forEach(btn => {
        btn.style.borderColor = 'transparent';
        btn.style.background = 'rgba(255, 255, 255, 0.1)';
    });
    const selected = document.getElementById(`gk-${type}`);
    selected.style.borderColor = '#3498db';
    selected.style.background = 'rgba(52, 152, 219, 0.2)';
}

function selectMode(mode) {
    gameMode = mode;
    document.getElementById('mode-overlay').style.display = 'none';
    showSetup(1);
    toggleMainNav(true); // Still in menu (setup)
}

function showSetup(step) {
    setupStep = step;
    document.getElementById('setup-overlay').style.display = 'block';
    document.getElementById('setup-title').innerText = step === 1 ? "PLAYER 1 SETUP" : "PLAYER 2 SETUP";
    document.getElementById('team-name-input').value = "";
    
    const picker = document.getElementById('color-picker');
    picker.innerHTML = '';
    colors.forEach(c => {
        const btn = document.createElement('button');
        btn.style.background = c.hex;
        btn.style.border = '2px solid #fff';
        btn.style.borderRadius = '4px';
        btn.style.cursor = 'pointer';
        btn.onclick = () => {
            if (step === 1) player1.color = c.hex;
            else player2.color = c.hex;
            document.querySelectorAll('#color-picker button').forEach(b => b.style.outline = 'none');
            btn.style.outline = '3px solid #fff';
        };
        picker.appendChild(btn);
    });

    // Reset GK selection UI
    const type = step === 1 ? player1.goalieType : player2.goalieType;
    selectGK(type);

    document.getElementById('next-setup-btn').onclick = () => {
        const nameInput = document.getElementById('team-name-input').value.trim();
        if (step === 1) {
            player1.name = nameInput ? nameInput.toUpperCase() : "PLAYER 1";
            if (gameMode === '2P') {
                showSetup(2);
            } else {
                setupCPU();
                document.getElementById('setup-overlay').style.display = 'none';
                startGame();
            }
        } else {
            player2.name = nameInput ? nameInput.toUpperCase() : "PLAYER 2";
            document.getElementById('setup-overlay').style.display = 'none';
            startGame();
        }
    };
}

function setupCPU() {
    const cpuNames = ["BINARY BALLERS", "LOGIC LIONS", "THE PIXEL PUNTS", "SYNTAX STRIKERS", "GOALIE GOLIATHS"];
    player2.name = cpuNames[Math.floor(Math.random() * cpuNames.length)];
    player2.color = player1.color;
    player2.goalieType = player1.goalieType;
}

async function startGame() {
    if (!isGameReady) {
        pendingStartGame = true;
        return;
    }

    // Reset state for new game
    turnCount = 0;
    player1.score = 0;
    player2.score = 0;
    document.getElementById('p1-score').innerText = '0';
    document.getElementById('p2-score').innerText = '0';
    document.getElementById('solo-score').innerText = '0';

    if (!wordsData) {
        const scene = game.scene.scenes[0];
        try {
            const cachedWords = scene.cache.json.get('words');
            if (cachedWords) {
                wordsData = normalizeQuestionSet(cachedWords);
            } else {
                const response = await fetch('penaltyshootout.json');
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                wordsData = normalizeQuestionSet(await response.json());
            }
            activeQuestionSetName = 'Default set';
        } catch (error) {
            console.error("Vocabulary data not loaded yet.", error);
            return;
        }
    }

    document.getElementById('setup-overlay').style.display = 'none';
    document.getElementById('question-overlay').style.display = 'none';
    document.getElementById('result-overlay').style.display = 'none';
    document.getElementById('gameover-overlay').style.display = 'none';
    document.getElementById('scoreboard').style.display = 'flex';
    
    if (gameMode === '1P') {
        document.getElementById('p1-score-unit').style.display = 'block';
        document.getElementById('p2-score-unit').style.display = 'block';
        document.getElementById('solo-score-unit').style.display = 'none';
        document.getElementById('p1-name-display').innerText = player1.name;
        document.getElementById('p2-name-display').innerText = 'CPU';
        document.getElementById('p1-name-display').parentElement.style.borderBottomColor = player1.color;
        document.getElementById('p2-name-display').parentElement.style.borderBottomColor = player2.color;
    } else {
        document.getElementById('p1-score-unit').style.display = 'block';
        document.getElementById('p2-score-unit').style.display = 'block';
        document.getElementById('solo-score-unit').style.display = 'none';
        document.getElementById('p1-name-display').innerText = player1.name;
        document.getElementById('p2-name-display').innerText = player2.name;
        document.getElementById('p1-name-display').parentElement.style.borderBottomColor = player1.color;
        document.getElementById('p2-name-display').parentElement.style.borderBottomColor = player2.color;
    }

    currentPlayer = player1;
    toggleMainNav(false); // Hide nav when actual gameplay starts
    try {
        await initPitch();
    } catch (error) {
        console.error("Could not set up the pitch.", error);
        showBlockingMessage("Could not start round", "The goalkeeper assets could not be prepared. Check the browser console for details.");
        toggleMainNav(true); // Show nav if error
        return;
    }
    nextRound();
}

async function initPitch() {
    const scene = game.scene.scenes[0];
    if (goalie) goalie.destroy();
    if (ball) ball.destroy();

    const defender = (currentPlayer === player1) ? player2 : player1;
    await applyRecolor(defender);
    
    const hexKey = defender.color.replace('#', '');
    const goalieType = defender.goalieType;
    
    goalie = scene.add.sprite(400, GOALIE_Y, `goalie_tileset_${hexKey}_${goalieType}`).setScale(GOALIE_SCALE);
    goalie.play(`goalie_idle_anim_${hexKey}_${goalieType}`);

    ball = scene.add.sprite(400, 580, 'ball').setScale(0.2);
    ballShadow.setVisible(true).setX(400).setY(590).setScale(0.2);
}

async function applyRecolor(player) {
    const scene = game.scene.scenes[0];
    const hex = player.color;
    const hexKey = hex.replace('#', '');
    const type = player.goalieType;
    
    if (scene.textures.exists(`goalie_tileset_${hexKey}_${type}`)) return;

    const baseSprites = [
        `${type}_idle_0`, `${type}_idle_1`, `${type}_idle_2`,
        `${type}_dive_left_0`, `${type}_dive_left_1`, `${type}_dive_left_2`,
        `${type}_dive_right_0`, `${type}_dive_right_1`, `${type}_dive_right_2`
    ];

    const frameW = 200, frameH = 200;
    const canvas = document.createElement('canvas');
    canvas.width = frameW * 9; // Flat layout for simplicity
    canvas.height = frameH;
    const ctx = canvas.getContext('2d');

    for (let i = 0; i < baseSprites.length; i++) {
        const img = scene.textures.get(baseSprites[i]).getSourceImage();
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = img.width; tempCanvas.height = img.height;
        const tctx = tempCanvas.getContext('2d');
        tctx.drawImage(img, 0, 0);
        
        const imgData = tctx.getImageData(0, 0, img.width, img.height);
        const data = imgData.data;
        const targetRGB = Phaser.Display.Color.HexStringToColor(hex);
        const targetBrightness = (targetRGB.r + targetRGB.g + targetRGB.b) / (3 * 255);

        for (let j = 0; j < data.length; j += 4) {
            if (data[j+3] < 10) continue;
            // Orange jersey detection
            if (data[j] > 150 && data[j+1] > 60 && data[j+1] < 180 && data[j+2] < 120) {
                const lum = (data[j] + data[j+1] + data[j+2]) / (3 * 255);
                const minShade = 0.35 + (targetBrightness * 0.35);
                const shade = minShade + (lum * (1 - minShade));

                data[j] = Math.min(255, targetRGB.r * shade);
                data[j+1] = Math.min(255, targetRGB.g * shade);
                data[j+2] = Math.min(255, targetRGB.b * shade);
            }
        }
        tctx.putImageData(imgData, 0, 0);

        // Preserve each source frame's aspect ratio and align the feet to reduce jitter.
        const scale = Math.min(frameW / img.width, frameH / img.height);
        const drawW = img.width * scale;
        const drawH = img.height * scale;
        const drawX = (i * frameW) + ((frameW - drawW) / 2);
        const drawY = frameH - drawH;

        ctx.drawImage(tempCanvas, drawX, drawY, drawW, drawH);
    }

    scene.textures.addSpriteSheet(`goalie_tileset_${hexKey}_${type}`, canvas, { frameWidth: frameW, frameHeight: frameH });

    scene.anims.create({
        key: `goalie_idle_anim_${hexKey}_${type}`,
        frames: [
            { key: `goalie_tileset_${hexKey}_${type}`, frame: 0 },
            { key: `goalie_tileset_${hexKey}_${type}`, frame: 1 },
            { key: `goalie_tileset_${hexKey}_${type}`, frame: 2 },
            { key: `goalie_tileset_${hexKey}_${type}`, frame: 1 }
        ],
        frameRate: 6, repeat: -1
    });
    scene.anims.create({
        key: `goalie_dive_left_anim_${hexKey}_${type}`,
        frames: [
            { key: `goalie_tileset_${hexKey}_${type}`, frame: 3 },
            { key: `goalie_tileset_${hexKey}_${type}`, frame: 4 },
            { key: `goalie_tileset_${hexKey}_${type}`, frame: 5 }
        ],
        frameRate: 10
    });
    scene.anims.create({
        key: `goalie_dive_right_anim_${hexKey}_${type}`,
        frames: [
            { key: `goalie_tileset_${hexKey}_${type}`, frame: 6 },
            { key: `goalie_tileset_${hexKey}_${type}`, frame: 7 },
            { key: `goalie_tileset_${hexKey}_${type}`, frame: 8 }
        ],
        frameRate: 10
    });
}

function getContrastingColor(hex) {
    // Return a simple opposing color for the goalie
    return hex === '#e74c3c' ? '#2ecc71' : '#e74c3c';
}

function nextRound() {
    const maxShots = (gameMode === '1P') ? 5 : 10;
    if (turnCount >= maxShots) {
        endGame();
    } else {
        showQuestion();
    }
}

function showQuestion() {
    const overlay = document.getElementById('question-overlay');
    overlay.style.borderColor = currentPlayer.color;
    document.getElementById('question-title').innerHTML = `<span style="color:${currentPlayer.color}">${currentPlayer.name}</span>: Choose the correct corner`;

    const words = wordsData?.questions;
    if (!Array.isArray(words) || words.length < 4) {
        console.error("Invalid question data or words not loaded.");
        showBlockingMessage("Question data unavailable", "The vocabulary file must contain a flat questions array with at least 4 entries.");
        return;
    }

    const target = words[Math.floor(Math.random() * words.length)];
    currentWord = target;
    selectedAnswer = null;

    document.getElementById('question-def').innerText = target.definition;

    const choices = [target.word];
    while (choices.length < 4) {
        const randomWord = words[Math.floor(Math.random() * words.length)].word;
        if (!choices.includes(randomWord)) choices.push(randomWord);
    }
    shuffleArray(choices);
    currentChoices = choices;
    stopMenuMusic(); // Stop music when question appears
    overlay.style.display = 'block';
    enterShotMode();
}

function showBlockingMessage(title, message) {
    const overlay = document.getElementById('question-overlay');
    overlay.style.borderColor = '#e74c3c';
    document.getElementById('question-title').innerText = title;
    document.getElementById('question-def').innerText = message;
    overlay.style.display = 'block';
}

function enterShotMode() {
    const scene = game.scene.scenes[0];
    const zones = [];
    const markers = [];
    const cornerKeys = Object.keys(goalChoicePoints);
    canSelectShot = true;
    cornerKeys.forEach((key, index) => {
        const pos = goalChoicePoints[key];
        const zone = scene.add.circle(pos.x, pos.y, 45, 0xffffff, 0.1)
            .setInteractive()
            .on('pointerdown', () => performKick(key, currentChoices[index]));
        
        scene.tweens.add({
            targets: zone,
            alpha: 0.4,
            duration: 600,
            yoyo: true,
            repeat: -1
        });
        zones.push(zone);

        const label = scene.add.text(pos.x, pos.y, currentChoices[index], {
            fontSize: '16px',
            fontFamily: 'Outfit',
            fontWeight: 'bold',
            color: '#ffffff',
            stroke: '#000',
            strokeThickness: 5,
            align: 'center',
            wordWrap: { width: 180 }
        }).setOrigin(0.5).setDepth(20);
        markers.push(label);
    });
    scene.zones = zones;
    scene.answerMarkers = markers;
}

function performKick(corner, selectedChoice) {
    if (!canSelectShot) return;
    canSelectShot = false;

    // Resume music immediately when answer is clicked
    startMenuMusic(game.scene.scenes[0]);

    const scene = game.scene.scenes[0];
    scene.zones.forEach(z => z.destroy());
    if (scene.answerMarkers) {
        scene.answerMarkers.forEach(marker => marker.destroy());
        scene.answerMarkers = [];
    }

    selectedAnswer = selectedChoice;
    isAnswerCorrect = (selectedChoice === currentWord.word);
    document.getElementById('question-overlay').style.display = 'none';

    const targetPos = { ...(isAnswerCorrect ? goalShotTargets[corner] : goalSaveTargets[corner]) };
    const targetScale = isAnswerCorrect ? 0.025 : 0.085;
    const defender = (currentPlayer === player1) ? player2 : player1;
    
    let goalieAction = 'idle';
    if (!isAnswerCorrect) {
        goalieAction = corner.includes('L') ? 'left' : 'right';
    } else {
        goalieAction = corner.includes('L') ? 'right' : 'left';
    }

    const syncBallShadow = () => {
        if (!ball || !ballShadow) return;
        ballShadow.x = ball.x;
        ballShadow.y = 400 + (ball.y - 400) * 1.05;
        ballShadow.setScale(ball.scale);
    };
    const finishShot = () => {
        const isGoal = isAnswerCorrect;
        const answerDetail = selectedAnswer === currentWord.word
            ? `Correct answer: ${currentWord.word}`
            : `Your answer: ${selectedAnswer}  |  Correct answer: ${currentWord.word}`;

        if (isGoal) {
            currentPlayer.score++;
            if (gameMode === '1P') {
                document.getElementById('p1-score').innerText = currentPlayer.score;
            } else {
                document.getElementById(currentPlayer === player1 ? 'p1-score' : 'p2-score').innerText = currentPlayer.score;
            }
            playResultSound('goal-sfx');
            showResultOverlay("GOAL!", "#2ecc71", answerDetail, currentWord.explanation);
        } else {
            playResultSound('miss-sfx');
            showResultOverlay("MISS / WRONG!", "#e74c3c", answerDetail, currentWord.explanation);
        }
    };

    scene.tweens.add({
        targets: ball,
        x: targetPos.x, y: targetPos.y, scale: targetScale, duration: 900, ease: 'Quad.out',
        onUpdate: syncBallShadow,
        onComplete: () => {
            finishShot();
        }
    });

    goalie.stop();
    const defHexKey = defender.color.replace('#', '');
    if (goalieAction === 'left') {
        goalie.play(`goalie_dive_left_anim_${defHexKey}_${defender.goalieType}`);
        scene.tweens.add({ targets: goalie, x: goalie.x - GOALIE_DIVE_DISTANCE, y: goalie.y + 10, duration: 400 });
    } else if (goalieAction === 'right') {
        goalie.play(`goalie_dive_right_anim_${defHexKey}_${defender.goalieType}`);
        scene.tweens.add({ targets: goalie, x: goalie.x + GOALIE_DIVE_DISTANCE, y: goalie.y + 10, duration: 400 });
    }
    if (goalieAction === 'idle') {
        goalie.play(`goalie_idle_anim_${defHexKey}_${defender.goalieType}`);
    }
}

function showResultOverlay(text, color, detail = '', explanation = '') {
    const overlay = document.getElementById('result-overlay');
    const title = document.getElementById('result-title');
    const answer = document.getElementById('result-answer');
    const explanationEl = document.getElementById('result-explanation');
    const continueBtn = document.getElementById('result-continue-btn');

    title.innerText = text;
    title.style.color = color;
    answer.innerText = detail;
    const linkedExplanation = explanation.replace(/Concept Grid/g, '<a href="../videos.html" style="color: #00d2ff; text-decoration: underline;" target="_blank">Concept Grid</a>');
    explanationEl.innerHTML = linkedExplanation;
    overlay.style.borderColor = color;
    overlay.style.display = 'block';

    continueBtn.onclick = async () => {
        overlay.style.display = 'none';
        turnCount++;
        if (gameMode === '2P') {
            currentPlayer = (currentPlayer === player1) ? player2 : player1;
        }
        await initPitch();
        nextRound();
    };
}

function endGame() {
    document.getElementById('gameover-overlay').style.display = 'block';
    toggleMainNav(true); // Show nav on game over screen
    
    if (gameMode === '1P') {
        document.getElementById('final-result').innerText = "GAME OVER";
        document.getElementById('final-score').innerText = `TOTAL GOALS: ${player1.score} / 5`;
    } else {
        let result = "DRAW!";
        if (player1.score > player2.score) result = `${player1.name} WINS!`;
        else if (player2.score > player1.score) result = `${player2.name} WINS!`;
        
        document.getElementById('final-result').innerText = result;
        document.getElementById('final-score').innerText = `${player1.score} - ${player2.score}`;
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
