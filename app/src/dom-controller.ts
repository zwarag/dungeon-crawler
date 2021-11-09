import story from '../public/txt/story.json';
import { Game } from './game';
import { HTMLELEMENTS } from './helper/const';
import { KEYBOARDMAP } from './helper/keyboard';
import { storyWriter } from './helper/typewriter';
import { addToHighscore } from './highscore-controller';
import { InputController, KeyBoardInputController } from './input-controller';

let _game: Game;

export function initDom(): void {
  addEventListener(HTMLELEMENTS.startButton, 'click', () => {
    _toggleClass(
      [HTMLELEMENTS.nameInput],
      [HTMLELEMENTS.startScreen],
      'd-none'
    );
  });
  addEventListener(HTMLELEMENTS.highscoreButton, 'click', () => {
    _toggleClass(
      [HTMLELEMENTS.highscore],
      [HTMLELEMENTS.startScreen],
      'd-none'
    );
  });
  addEventListener(
    HTMLELEMENTS.highscoreBackButton,
    'click',
    _backToStartScreen
  );
  addEventListener(HTMLELEMENTS.exitButton, 'click', _backToStartScreen);
  addEventListener(HTMLELEMENTS.continueButton, 'click', _continueGame);
  addEventListener(
    HTMLELEMENTS.nameInputBackButton,
    'click',
    _backToStartScreen
  );
  addEventListener(HTMLELEMENTS.nameInputOkButton, 'click', async () => {
    await _displayStoryBox();
    _startGame();
  });
  addEventListener(HTMLELEMENTS.formInput, 'input', _enableButton);
  document.addEventListener('keydown', (event) => {
    if (event.key === KEYBOARDMAP.escape) {
      _displayExitOverlay();
    }
  });
}

function addEventListener(
  element: HTMLElement,
  key: string,
  event: () => void
) {
  element.addEventListener(key, event);
}

function _toggleClass(
  removeFromElements: HTMLElement[],
  addToElements: HTMLElement[],
  cssClass: string
) {
  removeFromElements.forEach((event) => event.classList.remove(cssClass));
  addToElements.forEach((event) => event.classList.add(cssClass));
}

export async function _startGame(): Promise<void> {
  _toggleClass(
    [HTMLELEMENTS.app],
    [
      HTMLELEMENTS.startScreen,
      HTMLELEMENTS.highscore,
      HTMLELEMENTS.nameInput,
      HTMLELEMENTS.storyBox,
    ],
    'd-none'
  );
  if (HTMLELEMENTS.element) {
    _game = new Game(HTMLELEMENTS.element);
    await _game._initGame();
    // new HudAnimation(HTMLELEMENTS.hudAnimation);
  }
}

function _displayExitOverlay(): void {
  //TODO: logic to freeze game
  if (!HTMLELEMENTS.app.classList.contains('d-none')) {
    if (HTMLELEMENTS.element) {
      HTMLELEMENTS.element.style.opacity = '80%';
      HTMLELEMENTS.overlay.classList.remove('d-none');
    }
  }
}

function _continueGame(): void {
  //TODO: logic to "unfreeze" game
  HTMLELEMENTS.overlay?.classList.add('d-none');
  if (HTMLELEMENTS.element) {
    HTMLELEMENTS.element.style.opacity = '100%';
  }
}

function _enableButton(): void {
  if (
    HTMLELEMENTS.nameInputOkButton &&
    HTMLELEMENTS.formInput?.value !== undefined
  ) {
    if (HTMLELEMENTS.formInput?.value.length >= 1) {
      HTMLELEMENTS.nameInputOkButton.disabled = false;
    } else {
      HTMLELEMENTS.nameInputOkButton.disabled = true;
    }
  }
}

async function _displayStoryBox(): Promise<void> {
  _toggleClass([HTMLELEMENTS.storyBox], [HTMLELEMENTS.nameInput], 'd-none');
  await storyWriter(story.story, 'story-box', 1);
  // for (const lineNumber in story.intro) {
  //   await storyWriter(story.intro[lineNumber], 'story-box', 1);
  //   await new Promise((resolve) => setTimeout(resolve, 1));
  //   _resetStoryBox();
  // }
}

function _getPlayerName(): string {
  return HTMLELEMENTS.formInput ? HTMLELEMENTS.formInput.value : 'default';
}

function _resetNameInput(): void {
  HTMLELEMENTS.formInput
    ? (HTMLELEMENTS.formInput.value = HTMLELEMENTS.formInput.defaultValue)
    : false;
}

function _resetStoryBox(): void {
  HTMLELEMENTS.storyBox ? (HTMLELEMENTS.storyBox.innerHTML = '') : false;
}

function _endGame(): void {
  const playTime = _game.stopGame();
  addToHighscore({
    name: _getPlayerName(),
    floor: _game.level,
    time: playTime,
  });
  _resetNameInput();
  _resetStoryBox();
}

export function updateProgressBar(health: number): void {
  if (health < 0) {
    health = 0;
  }
  if (health > 100) {
    health = 100;
  }
  health = Math.round(health);
  HTMLELEMENTS.progressBarFill.style.width = `${health}%`;
  HTMLELEMENTS.progressBarText.textContent = `${health}%`;
}

export function exitOnDeath(): void {
  _endGame();
  _toggleClass([HTMLELEMENTS.deathScreen], [HTMLELEMENTS.app], 'd-none');
  setTimeout(_backToStartScreen, 5000);
}

export function displayLoadingScreen(duration: number) {
  _toggleClass([HTMLELEMENTS.loadingScreen], [HTMLELEMENTS.app], 'd-none');
  setTimeout(() => {
    _toggleClass([HTMLELEMENTS.app], [HTMLELEMENTS.loadingScreen], 'd-none');
  }, duration);
}

function _backToStartScreen(): void {
  //TODO: some logic to end the game (i.e. destroy scene, create highscore, etc)
  if (!HTMLELEMENTS.app.classList.contains('d-none')) {
    _endGame();
    _toggleClass(
      [HTMLELEMENTS.highscore],
      [HTMLELEMENTS.app, HTMLELEMENTS.overlay],
      'd-none'
    );
  } else if (!HTMLELEMENTS.highscore.classList.contains('d-none')) {
    _toggleClass(
      [HTMLELEMENTS.startScreen],
      [HTMLELEMENTS.highscore],
      'd-none'
    );
  } else if (!HTMLELEMENTS.nameInput.classList.contains('d-none')) {
    _toggleClass(
      [HTMLELEMENTS.startScreen],
      [HTMLELEMENTS.nameInput],
      'd-none'
    );
  } else if (!HTMLELEMENTS.deathScreen.classList.contains('d-none')) {
    _toggleClass(
      [HTMLELEMENTS.highscore],
      [HTMLELEMENTS.app, HTMLELEMENTS.deathScreen, HTMLELEMENTS.startScreen],
      'd-none'
    );
  }
}
