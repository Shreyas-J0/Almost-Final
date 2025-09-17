// ===== GLOBAL VARIABLES =====
let gameState = {
    isTyping: false,
    startTime: 0,
    currentCharIndex: 0,
    totalChars: 0,
    correctChars: 0,
    totalErrors: 0,
    combo: 0,
    maxCombo: 0,
    testMode: '60s',
    difficulty: 'medium',
    language: 'en',
    wordList: [],
    targetText: '',
    wpmHistory: [],
    timerInterval: null,
    chartInterval: null
};

let userProfile = {
    stats: {
        totalTests: 0,
        bestWPM: 0,
        avgWPM: 0,
        avgAccuracy: 0,
        streak: 0
    },
    achievements: {
        speedDemon: { name: "Speed Demon", desc: "Reach 80 WPM", icon: "⚡", threshold: 80, unlocked: false },
        perfectionist: { name: "Perfectionist", desc: "100% accuracy", icon: "✨", threshold: 100, unlocked: false },
        marathon: { name: "Marathon", desc: "Complete 5-min test", icon: "🏃", unlocked: false },
        combo50: { name: "Combo Master", desc: "50 combo streak", icon: "🔥", threshold: 50, unlocked: false },
        persistent: { name: "Persistent", desc: "10 tests completed", icon: "💪", threshold: 10, unlocked: false }
    },
    preferences: {
        theme: 'light',
        soundEnabled: true,
        volume: 30,
        fontSize: 24,
        smoothCaret: true,
        showKeyboard: false,
        stopOnError: false,
        blindMode: false
    }
};

// Word lists for different languages
const wordLists = {
    en: {
        easy: ["the", "be", "to", "of", "and", "a", "in", "that", "have", "I", "it", "for", "not", "on", "with", "he", "as", "you", "do", "at"],
        medium: ["about", "would", "there", "their", "which", "people", "through", "being", "because", "before", "between", "during", "however", "another", "without", "against", "nothing", "someone", "something", "everything"],
        hard: ["accommodate", "achievement", "acknowledge", "acquaintance", "agriculture", "atmosphere", "beautiful", "beginning", "believe", "business", "calendar", "caribbean", "committee", "communicate", "community", "competition", "completely", "confidence", "congratulations", "consequence"],
        expert: ["antidisestablishmentarianism", "electroencephalography", "immunoelectrophoresis", "psychopharmacology", "spectrophotometrically", "thermodynamically", "uncharacteristically", "conceptualization", "internationalization", "multidimensionality"]
    },
    es: {
        easy: ["el", "la", "de", "que", "y", "a", "en", "un", "ser", "se", "no", "haber", "por", "con", "su", "para", "como", "estar", "tener", "le"],
        medium: ["trabajo", "persona", "ejemplo", "importante", "también", "público", "durante", "después", "siempre", "político", "gobierno", "momento", "problema", "información", "derecho", "proyecto", "Internacional", "programa", "relación", "desarrollo"],
        hard: ["establecimiento", "responsabilidad", "administración", "organización", "conocimiento", "procedimiento", "participación", "reconocimiento", "aprovechamiento", "desenvolvimiento", "enriquecimiento", "esclarecimiento", "fortalecimiento", "mantenimiento", "planteamiento", "procesamiento", "pronunciamiento", "relacionamiento", "representación", "agradecimiento"]
    },
    fr: {
        easy: ["le", "de", "un", "être", "et", "à", "il", "avoir", "ne", "je", "son", "que", "se", "qui", "ce", "dans", "elle", "au", "pour", "pas"],
        medium: ["personne", "travail", "exemple", "toujours", "politique", "permettre", "important", "développement", "entreprise", "programme", "question", "gouvernement", "information", "différent", "difficile", "intéressant", "maintenant", "mouvement", "population", "communauté"],
        hard: ["développement", "administration", "considération", "environnement", "particulièrement", "malheureusement", "caractéristique", "bibliothèque", "réglementation", "fonctionnement", "transformation", "communication", "documentation", "représentation", "détermination", "collaboration", "participation", "organisation", "interrogation", "investigation"]
    },
    de: {
        easy: ["der", "die", "und", "in", "den", "von", "zu", "das", "mit", "sich", "auf", "für", "ist", "im", "dem", "nicht", "ein", "eine", "als", "auch"],
        medium: ["arbeit", "beispiel", "bereich", "berlin", "deutschland", "entwicklung", "geschichte", "gesellschaft", "haben", "information", "können", "leben", "menschen", "möglich", "natürlich", "politisch", "problem", "schließlich", "universität", "unternehmen"],
        hard: ["arbeitsgemeinschaft", "auseinandersetzung", "berücksichtigung", "besonderheiten", "betriebswirtschaft", "bundesrepublik", "dienstleistung", "durchführung", "einrichtungen", "entscheidung", "entwicklungsländer", "gegebenenfalls", "gemeinschaft", "gerechtigkeit", "geschwindigkeit", "gewerkschaft", "gleichberechtigung", "grundsätzlich", "kulturwissenschaft", "landwirtschaft"]
    },
    code: {
        easy: ["var", "let", "const", "if", "else", "for", "while", "do", "break", "continue", "function", "return", "true", "false", "null", "undefined", "new", "this", "try", "catch"],
        medium: ["import", "export", "default", "class", "extends", "static", "async", "await", "promise", "then", "catch", "finally", "throw", "typeof", "instanceof", "constructor", "prototype", "super", "yield", "delete"],
        hard: ["addEventListener", "getElementById", "querySelector", "createElement", "appendChild", "removeChild", "setAttribute", "getAttribute", "localStorage", "sessionStorage", "setTimeout", "setInterval", "clearTimeout", "clearInterval", "JSON.stringify", "JSON.parse", "Object.keys", "Object.values", "Array.prototype", "Map.prototype.forEach"],
        expert: ["Object.defineProperty", "Proxy.revocable", "Reflect.construct", "Symbol.hasInstance", "WeakMap.prototype.has", "ArrayBuffer.isView", "DataView.prototype.getFloat32", "Intl.NumberFormat", "WebAssembly.instantiate", "performance.measureUserAgentSpecificMemory", "IntersectionObserver", "MutationObserver", "ResizeObserver", "requestAnimationFrame", "cancelAnimationFrame", "getComputedStyle", "encodeURIComponent", "decodeURIComponent", "TextEncoder", "TextDecoder"]
    }
};

// Sound system
const sounds = {
    keypress: { url: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZijYHGGm98OScTgwOUanz7blmFgU7k9n1unEiBC13yO/eizEIHWq+8+OWT' },
    correct: { url: 'data:audio/wav;base64,UklGRiQCAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQACAADt/ur+8/7u/uz+6/7q/uj+5/7l/uT+4v7g/t/+3f7b/tn+1/7V/tP+0f7P/s3+y/7J/sf+xP7C/sD+vf67/rj+tv6z/rH+rv6r/qn+pv6j/qD+nf6a/pf+lP6R/o7+i/6H' },
    error: { url: 'data:audio/wav;base64,UklGRiQBAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQABAAD/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////7+/v7+' }
};

// Initialize sound objects
Object.keys(sounds).forEach(key => {
    const audio = new Audio(sounds[key].url);
    audio.volume = 0.3;
    sounds[key].audio = audio;
});

// ===== DOM ELEMENTS =====
const elements = {
    // Controls
    testMode: document.getElementById('testMode'),
    difficulty: document.getElementById('difficulty'),
    language: document.getElementById('language'),
    newGameBtn: document.getElementById('newGameBtn'),
    settingsBtn: document.getElementById('settingsBtn'),
    
    // Stats
    wpm: document.getElementById('wpm'),
    accuracy: document.getElementById('accuracy'),
    timer: document.getElementById('timer'),
    combo: document.getElementById('combo'),
    errors: document.getElementById('errors'),
    bestWPM: document.getElementById('bestWPM'),
    avgWPM: document.getElementById('avgWPM'),
    totalTests: document.getElementById('totalTests'),
    streak: document.getElementById('streak'),
    
    // Game area
    gameArea: document.getElementById('game-area'),
    targetWords: document.getElementById('target-words'),
    cursor: document.getElementById('cursor'),
    focusPrompt: document.getElementById('focus-prompt'),
    progressBar: document.getElementById('progressBar'),
    
    // Results
    resultsPanel: document.getElementById('results-panel'),
    finalWPM: document.getElementById('finalWPM'),
    finalAccuracy: document.getElementById('finalAccuracy'),
    finalTime: document.getElementById('finalTime'),
    finalCombo: document.getElementById('finalCombo'),
    totalChars: document.getElementById('totalChars'),
    correctCharsCount: document.getElementById('correctCharsCount'),
    totalErrorsCount: document.getElementById('totalErrorsCount'),
    rawWPM: document.getElementById('rawWPM'),
    retryBtn: document.getElementById('retryBtn'),
    nextBtn: document.getElementById('nextBtn'),
    shareBtn: document.getElementById('shareBtn'),
    
    // Settings
    settingsModal: document.getElementById('settings-modal'),
    closeSettings: document.getElementById('closeSettings'),
    themeSelect: document.getElementById('themeSelect'),
    fontSize: document.getElementById('fontSize'),
    fontSizeValue: document.getElementById('fontSizeValue'),
    soundEnabled: document.getElementById('soundEnabled'),
    volume: document.getElementById('volume'),
    volumeValue: document.getElementById('volumeValue'),
    smoothCaret: document.getElementById('smoothCaret'),
    showKeyboard: document.getElementById('showKeyboard'),
    stopOnError: document.getElementById('stopOnError'),
    blindMode: document.getElementById('blindMode'),
    exportStats: document.getElementById('exportStats'),
    resetStats: document.getElementById('resetStats'),
    
    // Other
    loadingScreen: document.getElementById('loading-screen'),
    keyboard: document.getElementById('keyboard'),
    wpmChart: document.getElementById('wpmChart'),
    achievementsPanel: document.getElementById('achievements-panel'),
    achievementsGrid: document.getElementById('achievementsGrid')
};

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    loadUserProfile();
    initializeEventListeners();
    initializeChart();
    updateUI();
    hideLoadingScreen();
    generateText();
});

function hideLoadingScreen() {
    setTimeout(() => {
        elements.loadingScreen.classList.add('fade-out');
        setTimeout(() => {
            elements.loadingScreen.style.display = 'none';
        }, 500);
    }, 1000);
}

function loadUserProfile() {
    const saved = localStorage.getItem('userProfile');
    if (saved) {
        userProfile = JSON.parse(saved);
    }
    applyPreferences();
}

function saveUserProfile() {
    localStorage.setItem('userProfile', JSON.stringify(userProfile));
}

function applyPreferences() {
    const prefs = userProfile.preferences;
    
    // Apply theme
    document.body.className = `theme-${prefs.theme}`;
    if (elements.themeSelect) elements.themeSelect.value = prefs.theme;
    
    // Apply font size
    elements.targetWords.style.fontSize = `${prefs.fontSize}px`;
    if (elements.fontSize) {
        elements.fontSize.value = prefs.fontSize;
        elements.fontSizeValue.textContent = `${prefs.fontSize}px`;
    }
    
    // Apply sound settings
    if (elements.soundEnabled) elements.soundEnabled.checked = prefs.soundEnabled;
    if (elements.volume) {
        elements.volume.value = prefs.volume;
        elements.volumeValue.textContent = `${prefs.volume}%`;
    }
    Object.values(sounds).forEach(sound => {
        if (sound.audio) sound.audio.volume = prefs.volume / 100;
    });
    
    // Apply other preferences
    if (elements.smoothCaret) elements.smoothCaret.checked = prefs.smoothCaret;
    if (elements.showKeyboard) elements.showKeyboard.checked = prefs.showKeyboard;
    if (elements.stopOnError) elements.stopOnError.checked = prefs.stopOnError;
    if (elements.blindMode) elements.blindMode.checked = prefs.blindMode;
    
    // Show/hide keyboard
    if (prefs.showKeyboard) {
        elements.keyboard.classList.remove('hidden');
    }
}

// ===== EVENT LISTENERS =====
function initializeEventListeners() {
    // Game controls
    elements.newGameBtn.addEventListener('click', startNewGame);
    elements.retryBtn.addEventListener('click', startNewGame);
    elements.nextBtn.addEventListener('click', startNewGame);
    elements.shareBtn.addEventListener('click', shareResults);
    
    // Settings
    elements.settingsBtn.addEventListener('click', openSettings);
    elements.closeSettings.addEventListener('click', closeSettings);
    
    // Game area
    elements.gameArea.addEventListener('click', () => elements.gameArea.focus());
    elements.gameArea.addEventListener('keydown', handleKeyDown);
    elements.gameArea.addEventListener('focus', handleFocus);
    elements.gameArea.addEventListener('blur', handleBlur);
    
    // Settings listeners
    if (elements.themeSelect) {
        elements.themeSelect.addEventListener('change', (e) => {
            userProfile.preferences.theme = e.target.value;
            document.body.className = `theme-${e.target.value}`;
            saveUserProfile();
        });
    }
    
    if (elements.fontSize) {
        elements.fontSize.addEventListener('input', (e) => {
            const size = e.target.value;
            userProfile.preferences.fontSize = parseInt(size);
            elements.targetWords.style.fontSize = `${size}px`;
            elements.fontSizeValue.textContent = `${size}px`;
            saveUserProfile();
        });
    }
    
    if (elements.soundEnabled) {
        elements.soundEnabled.addEventListener('change', (e) => {
            userProfile.preferences.soundEnabled = e.target.checked;
            saveUserProfile();
        });
    }
    
    if (elements.volume) {
        elements.volume.addEventListener('input', (e) => {
            const volume = e.target.value;
            userProfile.preferences.volume = parseInt(volume);
            elements.volumeValue.textContent = `${volume}%`;
            Object.values(sounds).forEach(sound => {
                if (sound.audio) sound.audio.volume = volume / 100;
            });
            saveUserProfile();
        });
    }
    
    if (elements.showKeyboard) {
        elements.showKeyboard.addEventListener('change', (e) => {
            userProfile.preferences.showKeyboard = e.target.checked;
            if (e.target.checked) {
                elements.keyboard.classList.remove('hidden');
            } else {
                elements.keyboard.classList.add('hidden');
            }
            saveUserProfile();
        });
    }
    
    if (elements.exportStats) {
        elements.exportStats.addEventListener('click', exportStatistics);
    }
    
    if (elements.resetStats) {
        elements.resetStats.addEventListener('click', resetStatistics);
    }
    
    // Mode/difficulty/language changes
    elements.testMode.addEventListener('change', generateText);
    elements.difficulty.addEventListener('change', generateText);
    elements.language.addEventListener('change', generateText);
}

// ===== GAME FUNCTIONS =====
function startNewGame() {
    resetGame();
    generateText();
    elements.gameArea.focus();
}

function resetGame() {
    gameState = {
        isTyping: false,
        startTime: 0,
        currentCharIndex: 0,
        totalChars: 0,
        correctChars: 0,
        totalErrors: 0,
        combo: 0,
        maxCombo: 0,
        testMode: elements.testMode.value,
        difficulty: elements.difficulty.value,
        language: elements.language.value,
        wordList: [],
        targetText: '',
        wpmHistory: [],
        timerInterval: null,
        chartInterval: null
    };
    
    clearInterval(gameState.timerInterval);
    clearInterval(gameState.chartInterval);
    
    elements.resultsPanel.classList.add('hidden');
    elements.progressBar.style.width = '0%';
    updateStats();
}

function generateText() {
    const mode = elements.testMode.value;
    const difficulty = elements.difficulty.value;
    const language = elements.language.value;
    
    // Get word list based on language and difficulty
    const availableWords = wordLists[language]?.[difficulty] || wordLists.en.medium;
    
    // Determine number of words
    let wordCount = 50;
    if (mode.endsWith('w')) {
        wordCount = parseInt(mode);
    } else if (mode.endsWith('s')) {
        const seconds = parseInt(mode);
        wordCount = Math.ceil(seconds / 1.5); // Approximate words needed
    } else if (mode === 'zen') {
        wordCount = 200;
    }
    
    // Generate random text
    const words = [];
    for (let i = 0; i < wordCount; i++) {
        const randomWord = availableWords[Math.floor(Math.random() * availableWords.length)];
        words.push(randomWord);
    }
    
    gameState.wordList = words;
    gameState.targetText = words.join(' ');
    
    displayText();
}

function displayText() {
    elements.targetWords.innerHTML = '';
    
    const text = gameState.targetText;
    for (let i = 0; i < text.length; i++) {
        const span = document.createElement('span');
        span.className = 'char pending';
        span.textContent = text[i];
        if (text[i] === ' ') {
            span.classList.add('space-char');
        }
        elements.targetWords.appendChild(span);
    }
    
    updateCursor();
}

function handleKeyDown(e) {
    // Prevent default for space to avoid scrolling
    if (e.key === ' ') {
        e.preventDefault();
    }
    
    // Ignore modifier keys
    if (e.ctrlKey || e.altKey || e.metaKey || ['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Tab', 'Escape'].includes(e.key)) {
        return;
    }
    
    // Start game on first keypress
    if (!gameState.isTyping && !['Enter', 'Backspace'].includes(e.key)) {
        startTyping();
    }
    
    if (!gameState.isTyping) return;
    
    // Handle backspace
    if (e.key === 'Backspace') {
        handleBackspace();
        return;
    }
    
    // Handle character input
    if (e.key.length === 1) {
        handleCharacterInput(e.key);
    }
    
    // Show key press on virtual keyboard
    if (userProfile.preferences.showKeyboard) {
        const key = elements.keyboard.querySelector(`[data-key="${e.key.toLowerCase()}"]`);
        if (key) {
            key.classList.add('active');
            setTimeout(() => key.classList.remove('active'), 100);
        }
    }
}

function handleCharacterInput(key) {
    const targetChar = gameState.targetText[gameState.currentCharIndex];
    
    if (!targetChar) {
        endGame();
        return;
    }
    
    const charSpan = elements.targetWords.children[gameState.currentCharIndex];
    
    gameState.totalChars++;
    
    if (key === targetChar) {
        // Correct character
        charSpan.classList.remove('pending');
        charSpan.classList.add('correct');
        gameState.correctChars++;
        gameState.combo++;
        
        if (gameState.combo > gameState.maxCombo) {
            gameState.maxCombo = gameState.combo;
        }
        
        // Show combo notification
        if (gameState.combo > 0 && gameState.combo % 20 === 0) {
            showComboNotification(gameState.combo);
        }
        
        playSound('correct');
    } else {
        // Incorrect character
        charSpan.classList.remove('pending');
        charSpan.classList.add('incorrect');
        gameState.totalErrors++;
        gameState.combo = 0;
        
        playSound('error');
        
        // Stop on error if enabled
        if (userProfile.preferences.stopOnError) {
            return;
        }
    }
    
    gameState.currentCharIndex++;
    updateCursor();
    updateStats();
    updateProgress();
    
    // Check if test is complete
    if (gameState.currentCharIndex >= gameState.targetText.length) {
        endGame();
    }
}

function handleBackspace() {
    if (gameState.currentCharIndex > 0) {
        gameState.currentCharIndex--;
        const charSpan = elements.targetWords.children[gameState.currentCharIndex];
        
        if (charSpan.classList.contains('correct')) {
            gameState.correctChars--;
        } else if (charSpan.classList.contains('incorrect')) {
            gameState.totalErrors--;
        }
        
        charSpan.classList.remove('correct', 'incorrect');
        charSpan.classList.add('pending');
        
        gameState.totalChars--;
        updateCursor();
        updateStats();
        updateProgress();
    }
}

function startTyping() {
    gameState.isTyping = true;
    gameState.startTime = Date.now();
    
    // Start timer
    gameState.timerInterval = setInterval(updateTimer, 100);
    
    // Start WPM chart updates
    gameState.chartInterval = setInterval(updateChart, 1000);
}

function endGame() {
    gameState.isTyping = false;
    
    clearInterval(gameState.timerInterval);
    clearInterval(gameState.chartInterval);
    
    // Calculate final stats
    const timeInSeconds = (Date.now() - gameState.startTime) / 1000;
    const timeInMinutes = timeInSeconds / 60;
    const wpm = Math.round((gameState.correctChars / 5) / timeInMinutes);
    const accuracy = Math.round((gameState.correctChars / gameState.totalChars) * 100) || 0;
    const rawWPM = Math.round((gameState.totalChars / 5) / timeInMinutes);
    
    // Update user profile
    userProfile.stats.totalTests++;
    if (wpm > userProfile.stats.bestWPM) {
        userProfile.stats.bestWPM = wpm;
        showNewRecord(wpm);
    }
    userProfile.stats.avgWPM = Math.round(
        (userProfile.stats.avgWPM * (userProfile.stats.totalTests - 1) + wpm) / userProfile.stats.totalTests
    );
    userProfile.stats.avgAccuracy = Math.round(
        (userProfile.stats.avgAccuracy * (userProfile.stats.totalTests - 1) + accuracy) / userProfile.stats.totalTests
    );
    
    // Check achievements
    checkAchievements(wpm, accuracy, timeInSeconds);
    
    // Display results
    elements.finalWPM.textContent = wpm;
    elements.finalAccuracy.textContent = accuracy + '%';
    elements.finalTime.textContent = formatTime(timeInSeconds);
    elements.finalCombo.textContent = gameState.maxCombo;
    elements.totalChars.textContent = gameState.totalChars;
    elements.correctCharsCount.textContent = gameState.correctChars;
    elements.totalErrorsCount.textContent = gameState.totalErrors;
    elements.rawWPM.textContent = rawWPM;
    
    elements.resultsPanel.classList.remove('hidden');
    
    saveUserProfile();
    updateUI();
}

// ===== UI UPDATE FUNCTIONS =====
function updateStats() {
    if (!gameState.isTyping && gameState.totalChars === 0) {
        elements.wpm.textContent = '0';
        elements.accuracy.textContent = '100%';
        elements.errors.textContent = '0';
        elements.combo.textContent = '0';
        return;
    }
    
    const timeInSeconds = (Date.now() - gameState.startTime) / 1000;
    const timeInMinutes = timeInSeconds / 60;
    const wpm = Math.round((gameState.correctChars / 5) / timeInMinutes) || 0;
    const accuracy = Math.round((gameState.correctChars / gameState.totalChars) * 100) || 100;
    
    elements.wpm.textContent = wpm;
    elements.accuracy.textContent = accuracy + '%';
    elements.errors.textContent = gameState.totalErrors;
    elements.combo.textContent = gameState.combo;
}

function updateTimer() {
    const mode = gameState.testMode;
    
    if (mode === 'zen') {
        const elapsed = Math.floor((Date.now() - gameState.startTime) / 1000);
        elements.timer.textContent = formatTime(elapsed);
    } else if (mode.endsWith('s')) {
        const totalSeconds = parseInt(mode);
        const elapsed = Math.floor((Date.now() - gameState.startTime) / 1000);
        const remaining = Math.max(0, totalSeconds - elapsed);
        
        elements.timer.textContent = formatTime(remaining);
        
        if (remaining === 0) {
            endGame();
        }
    } else {
        const elapsed = Math.floor((Date.now() - gameState.startTime) / 1000);
        elements.timer.textContent = formatTime(elapsed);
    }
}

function updateProgress() {
    const progress = (gameState.currentCharIndex / gameState.targetText.length) * 100;
    elements.progressBar.style.width = progress + '%';
}

function updateCursor() {
    if (gameState.currentCharIndex < gameState.targetText.length) {
        const charSpan = elements.targetWords.children[gameState.currentCharIndex];
        if (charSpan) {
            const rect = charSpan.getBoundingClientRect();
            const containerRect = elements.gameArea.getBoundingClientRect();
            
            elements.cursor.style.left = (rect.left - containerRect.left) + 'px';
            elements.cursor.style.top = (rect.top - containerRect.top) + 'px';
            
            // Add current-char class
            Array.from(elements.targetWords.children).forEach(span => {
                span.classList.remove('current-char');
            });
            charSpan.classList.add('current-char');
        }
    }
}

function updateUI() {
    elements.bestWPM.textContent = userProfile.stats.bestWPM;
    elements.avgWPM.textContent = userProfile.stats.avgWPM;
    elements.totalTests.textContent = userProfile.stats.totalTests;
    elements.streak.textContent = userProfile.stats.streak;
}

// ===== CHART FUNCTIONS =====
function initializeChart() {
    const canvas = elements.wpmChart;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--primary-color');
    ctx.lineWidth = 2;
}

function updateChart() {
    if (!gameState.isTyping) return;
    
    const timeInMinutes = (Date.now() - gameState.startTime) / 60000;
    const wpm = Math.round((gameState.correctChars / 5) / timeInMinutes) || 0;
    
    gameState.wpmHistory.push(wpm);
    
    const canvas = elements.wpmChart;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const padding = 20;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw grid
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.lineWidth = 0.5;
    
    // Horizontal lines
    for (let i = 0; i <= 5; i++) {
        const y = padding + (height - 2 * padding) * i / 5;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
        ctx.stroke();
    }
    
    // Draw WPM line
    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--primary-color');
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    gameState.wpmHistory.forEach((wpm, index) => {
        const x = padding + (width - 2 * padding) * index / Math.max(gameState.wpmHistory.length - 1, 1);
        const y = height - padding - (wpm / 150) * (height - 2 * padding); // Scale to max 150 WPM
        
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    
    ctx.stroke();
    
    // Draw points
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--primary-color');
    gameState.wpmHistory.forEach((wpm, index) => {
        const x = padding + (width - 2 * padding) * index / Math.max(gameState.wpmHistory.length - 1, 1);
        const y = height - padding - (wpm / 150) * (height - 2 * padding);
        
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
    });
}

// ===== ACHIEVEMENT FUNCTIONS =====
function checkAchievements(wpm, accuracy, timeInSeconds) {
    const achievements = userProfile.achievements;
    
    // Speed Demon
    if (wpm >= achievements.speedDemon.threshold && !achievements.speedDemon.unlocked) {
        unlockAchievement('speedDemon');
    }
    
    // Perfectionist
    if (accuracy === 100 && !achievements.perfectionist.unlocked) {
        unlockAchievement('perfectionist');
    }
    
    // Marathon
    if (gameState.testMode === '300s' && !achievements.marathon.unlocked) {
        unlockAchievement('marathon');
    }
    
    // Combo Master
    if (gameState.maxCombo >= achievements.combo50.threshold && !achievements.combo50.unlocked) {
        unlockAchievement('combo50');
    }
    
    // Persistent
    if (userProfile.stats.totalTests >= achievements.persistent.threshold && !achievements.persistent.unlocked) {
        unlockAchievement('persistent');
    }
}

function unlockAchievement(key) {
    userProfile.achievements[key].unlocked = true;
    showAchievementNotification(userProfile.achievements[key]);
    saveUserProfile();
    updateAchievementsDisplay();
}

function showAchievementNotification(achievement) {
    const notification = document.createElement('div');
    notification.className = 'achievement-notification';
    notification.innerHTML = `
        <div class="achievement-icon">${achievement.icon}</div>
        <div>
            <h3>Achievement Unlocked!</h3>
            <p>${achievement.name}</p>
            <small>${achievement.desc}</small>
        </div>
    `;
    
    document.body.appendChild(notification);
    setTimeout(() => notification.classList.add('show'), 100);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 500);
    }, 3000);
    
    playSound('achievement');
}

function updateAchievementsDisplay() {
    if (!elements.achievementsGrid) return;
    
    elements.achievementsGrid.innerHTML = '';
    
    Object.entries(userProfile.achievements).forEach(([key, achievement]) => {
        const div = document.createElement('div');
        div.className = `achievement-item ${achievement.unlocked ? 'unlocked' : 'achievement-locked'}`;
        div.innerHTML = `
            <div class="achievement-icon">${achievement.icon}</div>
            <div class="achievement-name">${achievement.name}</div>
        `;
        div.title = achievement.desc;
        elements.achievementsGrid.appendChild(div);
    });
    
    elements.achievementsPanel.classList.remove('hidden');
}

function showComboNotification(combo) {
    const notification = document.createElement('div');
    notification.className = 'combo-notification';
    notification.textContent = `${combo}x COMBO!`;
    notification.style.fontSize = `${Math.min(20 + combo / 2, 50)}px`;
    
    elements.gameArea.appendChild(notification);
    setTimeout(() => notification.remove(), 1000);
}

function showNewRecord(wpm) {
    const notification = document.createElement('div');
    notification.className = 'achievement-notification';
    notification.innerHTML = `
        <div class="achievement-icon">🏆</div>
        <div>
            <h3>New Personal Record!</h3>
            <p>${wpm} WPM</p>
        </div>
    `;
    
    document.body.appendChild(notification);
    setTimeout(() => notification.classList.add('show'), 100);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 500);
    }, 4000);
    
    playSound('achievement');
}

// ===== UTILITY FUNCTIONS =====
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

function playSound(soundName) {
    if (!userProfile.preferences.soundEnabled) return;
    
    if (sounds[soundName] && sounds[soundName].audio) {
        sounds[soundName].audio.currentTime = 0;
        sounds[soundName].audio.play().catch(e => {
            console.log('Sound play failed:', e);
        });
    }
}

function handleFocus() {
    elements.focusPrompt.style.opacity = '0';
}

function handleBlur() {
    if (!gameState.isTyping) {
        elements.focusPrompt.style.opacity = '1';
    }
}

// ===== SETTINGS FUNCTIONS =====
function openSettings() {
    elements.settingsModal.classList.remove('hidden');
}

function closeSettings() {
    elements.settingsModal.classList.add('hidden');
}

function exportStatistics() {
    const data = {
        profile: userProfile,
        exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hippotype-stats-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

function resetStatistics() {
    if (confirm('Are you sure you want to reset all your statistics? This cannot be undone.')) {
        userProfile.stats = {
            totalTests: 0,
            bestWPM: 0,
            avgWPM: 0,
            avgAccuracy: 0,
            streak: 0
        };
        
        Object.keys(userProfile.achievements).forEach(key => {
            userProfile.achievements[key].unlocked = false;
        });
        
        saveUserProfile();
        updateUI();
        updateAchievementsDisplay();
        alert('All statistics have been reset.');
    }
}

function shareResults() {
    const text = `I just typed ${elements.finalWPM.textContent} WPM with ${elements.finalAccuracy.textContent} accuracy on HippoType! Can you beat my score?`;
    
    if (navigator.share) {
        navigator.share({
            title: 'HippoType Results',
            text: text,
            url: window.location.href
        }).catch(err => console.log('Share failed:', err));
    } else {
        // Fallback - copy to clipboard
        navigator.clipboard.writeText(text).then(() => {
            alert('Results copied to clipboard!');
        }).catch(err => {
            console.error('Copy failed:', err);
        });
    }
}