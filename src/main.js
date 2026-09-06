import './style.css';
import levels, { generateRhythm } from './levels.js';
import { Game } from './game.js';
import { ensureAudioResumed } from './audio.js';
import { renderLegend } from './legend.js';

// ─── State ──────────────────────────────────────────
const STORAGE_KEY = 'rythm-progress';
const TUTORIAL_KEY = 'rythm-tutorial-seen';
const LISTEN_KEY = 'rythm-listen-first';

function loadProgress() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return data || { unlocked: 1, stars: {} };
  } catch {
    return { unlocked: 1, stars: {} };
  }
}

function saveProgress(progress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

let progress = loadProgress();
let currentGame = null;
let currentLevelId = null;
let currentPreview = null;

// ─── Screen management ─────────────────────────────
function showScreen(id) {
  document.querySelectorAll('.screen').forEach((el) => el.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

// ─── Level Select ───────────────────────────────────
function renderLevelList() {
  const list = document.getElementById('level-list');
  list.innerHTML = '';

  for (const level of levels) {
    const unlocked = level.id <= progress.unlocked;
    const starCount = progress.stars[level.id] || 0;
    const completed = starCount > 0;

    const card = document.createElement('button');
    card.className = 'level-card' + (unlocked ? '' : ' locked') + (completed ? ' completed' : '');

    card.innerHTML = `
      <div class="level-number">${level.id}</div>
      <div class="level-info">
        <div class="level-name">${level.name}</div>
        <div class="level-desc">${level.description}</div>
      </div>
      ${completed
        ? `<div class="level-stars">${starString(starCount)}</div>`
        : !unlocked
          ? `<div class="level-lock">&#x1f512;</div>`
          : ''
      }
    `;

    if (unlocked) {
      card.addEventListener('click', () => startLevel(level.id));
    }

    list.appendChild(card);
  }
}

function starString(count) {
  return '\u2605'.repeat(count) + '\u2606'.repeat(3 - count);
}

// ─── Game ───────────────────────────────────────────
function stopPreview() {
  if (currentPreview) {
    currentPreview.destroy();
    currentPreview = null;
  }
  const btnListen = document.getElementById('btn-listen');
  btnListen.textContent = 'Listen';
  btnListen.classList.remove('listening');

  // Hide the demo tap button, restore pre-start buttons
  const btnTap = document.getElementById('btn-tap');
  btnTap.classList.add('hidden');
  btnTap.classList.remove('flash-good', 'preview-tap');
  document.getElementById('pre-start-buttons').classList.remove('hidden');
}

let currentLevel = null;

function startLevel(levelId) {
  currentLevelId = levelId;
  const levelTemplate = levels.find((l) => l.id === levelId);
  if (!levelTemplate) return;

  // Generate a fresh random rhythm from the level's allowed values
  currentLevel = { ...levelTemplate, rhythm: generateRhythm(levelTemplate) };
  const level = currentLevel;

  stopPreview();
  showScreen('screen-game');

  document.getElementById('game-level-name').textContent = level.name;
  document.getElementById('bpm-display').textContent = level.bpm + ' BPM';

  const container = document.getElementById('notation-container');
  const preStartBtns = document.getElementById('pre-start-buttons');
  const btnStart = document.getElementById('btn-start');
  const btnListen = document.getElementById('btn-listen');
  const btnTap = document.getElementById('btn-tap');
  const feedbackEl = document.getElementById('feedback-text');
  const hintEl = document.getElementById('game-hint');

  preStartBtns.classList.add('hidden');
  btnTap.classList.add('hidden');
  feedbackEl.textContent = '';
  feedbackEl.className = 'feedback-text';
  hintEl.classList.remove('hidden');
  hintEl.textContent = 'Listen first, then it\u2019s your turn.';
  btnListen.textContent = 'Listen again';
  btnListen.classList.remove('listening');

  // Clean up previous game
  if (currentGame) {
    currentGame.destroy();
    currentGame = null;
  }

  currentGame = new Game({
    container,
    level,
    onFinish: (results) => showResults(results, levelId),
  });

  currentGame.prepare();

  const listenFirst = document.getElementById('toggle-listen').checked;

  if (listenFirst) {
    // Auto-play the preview immediately
    ensureAudioResumed();
    playPreview(level, container, btnTap, preStartBtns, hintEl);
  } else {
    // Skip preview, show start + listen buttons right away
    preStartBtns.classList.remove('hidden');
    hintEl.textContent = 'Press "Your turn!" to play, or listen first.';
    btnListen.textContent = 'Listen';
  }

  // Listen again button
  btnListen.onclick = () => {
    ensureAudioResumed();
    if (currentPreview) {
      stopPreview();
      currentGame.prepare();
      preStartBtns.classList.remove('hidden');
      return;
    }
    preStartBtns.classList.add('hidden');
    playPreview(level, container, btnTap, preStartBtns, hintEl);
  };

  // Start button
  btnStart.onclick = () => {
    stopPreview();
    ensureAudioResumed();
    preStartBtns.classList.add('hidden');
    btnTap.classList.remove('hidden');
    btnTap.classList.remove('preview-tap');
    hintEl.classList.add('hidden');
    currentGame.prepare();
    currentGame.start();
  };
}

function playPreview(level, container, btnTap, preStartBtns, hintEl) {
  btnTap.classList.remove('hidden');
  btnTap.classList.add('preview-tap');

  currentPreview = new Game({ container, level, onFinish: () => {} });
  currentPreview.prepare();
  currentPreview.onPreviewDone = () => {
    stopPreview();
    // Show start + listen again buttons
    preStartBtns.classList.remove('hidden');
    hintEl.textContent = 'Ready? Press "Your turn!" to play.';
    // Re-render the real game notation
    currentGame.prepare();
  };
  currentPreview.startPreview(btnTap);
}

// ─── Tap handling ───────────────────────────────────
function handleTap() {
  if (!currentGame || !currentGame.playing) return;
  currentGame.tap();

  // Visual flash on tap button
  const btn = document.getElementById('btn-tap');
  btn.classList.add('tapped');
  setTimeout(() => btn.classList.remove('tapped'), 80);
}

// Tap button (touch + click)
document.getElementById('btn-tap').addEventListener('touchstart', (e) => {
  e.preventDefault();
  handleTap();
});

document.getElementById('btn-tap').addEventListener('mousedown', (e) => {
  // Only handle if not a touch device (to avoid double-fire)
  if (e.sourceCapabilities && e.sourceCapabilities.firesTouchEvents) return;
  handleTap();
});

// Keyboard (spacebar)
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space' && currentGame && currentGame.playing) {
    e.preventDefault();
    handleTap();
  }
});

// ─── Results ────────────────────────────────────────
function showResults(results, levelId) {
  showScreen('screen-results');

  // Update progress
  const level = levels.find((l) => l.id === levelId);
  if (results.passed) {
    const nextId = levelId + 1;
    if (nextId > progress.unlocked && nextId <= levels.length) {
      progress.unlocked = nextId;
    }
  }
  if (results.stars > (progress.stars[levelId] || 0)) {
    progress.stars[levelId] = results.stars;
  }
  saveProgress(progress);

  // Render results
  document.getElementById('results-stars').textContent = starString(results.stars);
  document.getElementById('results-score').textContent = results.score + '%';

  const bd = results.breakdown;
  document.getElementById('results-breakdown').innerHTML = `
    <div class="breakdown-item">
      <span class="breakdown-count c-perfect">${bd.perfect}</span>
      <span>Perfect</span>
    </div>
    <div class="breakdown-item">
      <span class="breakdown-count c-great">${bd.great}</span>
      <span>Great</span>
    </div>
    <div class="breakdown-item">
      <span class="breakdown-count c-good">${bd.good}</span>
      <span>Good</span>
    </div>
    <div class="breakdown-item">
      <span class="breakdown-count c-miss">${bd.miss}</span>
      <span>Miss</span>
    </div>
  `;

  // Next button
  const btnNext = document.getElementById('btn-next');
  btnNext.textContent = 'Next Level';
  btnNext.classList.remove('disabled', 'hidden');
  const hasNext = levelId < levels.length;
  if (hasNext && results.passed) {
    btnNext.onclick = () => startLevel(levelId + 1);
  } else if (!results.passed) {
    btnNext.textContent = 'Need 70% to unlock next';
    btnNext.classList.add('disabled');
    btnNext.onclick = null;
  } else {
    btnNext.classList.add('hidden');
  }

  // Retry button
  document.getElementById('btn-retry').onclick = () => startLevel(levelId);
}

// ─── Back button ────────────────────────────────────
document.getElementById('btn-back').addEventListener('click', () => {
  stopPreview();
  if (currentGame) {
    currentGame.destroy();
    currentGame = null;
  }
  renderLevelList();
  showScreen('screen-levels');
});

// ─── Tutorial ───────────────────────────────────────
function showTutorial() {
  showScreen('screen-tutorial');
  renderLegend(
    document.getElementById('tutorial-legend'),
    document.getElementById('tutorial-rest-legend')
  );
}

document.getElementById('btn-tutorial-start').addEventListener('click', () => {
  localStorage.setItem(TUTORIAL_KEY, '1');
  renderLevelList();
  showScreen('screen-levels');
});

document.getElementById('btn-help').addEventListener('click', () => {
  showTutorial();
});

// ─── Listen toggle ──────────────────────────────────
const toggleListen = document.getElementById('toggle-listen');
toggleListen.checked = localStorage.getItem(LISTEN_KEY) !== '0';
toggleListen.addEventListener('change', () => {
  localStorage.setItem(LISTEN_KEY, toggleListen.checked ? '1' : '0');
});

// ─── Init ───────────────────────────────────────────
const tutorialSeen = localStorage.getItem(TUTORIAL_KEY);
if (!tutorialSeen) {
  showTutorial();
} else {
  renderLevelList();
  showScreen('screen-levels');
}
