import { HTMLELEMENTS } from './helper/const';
import story from '../public/txt/story.json';
import { storyWriter } from './helper/typewriter';
import { addToHighscore } from './highscore-controller';
import { Game } from './game';
import { KEYBOARDMAP } from './helper/keyboard';

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
  removeFromElements.forEach((e) => e.classList.remove(cssClass));
  addToElements.forEach((e) => e.classList.add(cssClass));
}

function _startGame(): void {
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
  }
}

function _displayExitOverlay(): void {
  //TODO: logic to freeze game
  if (!HTMLELEMENTS.app?.classList.contains('d-none')) {
    if (HTMLELEMENTS.element) {
      HTMLELEMENTS.element.style.opacity = '80%';
      HTMLELEMENTS.overlay?.classList.remove('d-none');
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
  for (const lineNumber in story.intro) {
    await storyWriter(story.intro[lineNumber], 'story-box', 1);
    await new Promise((resolve) => setTimeout(resolve, 1));
    _resetStoryBox();
  }
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
    floor: Math.floor(Math.random() * 100) + 1,
    time: playTime,
  });
  _resetNameInput();
  _resetStoryBox();
}

function _backToStartScreen(): void {
  //TODO: some logic to end the game (i.e. destroy scene, create highscore, etc)
  if (!HTMLELEMENTS.app?.classList.contains('d-none')) {
    _endGame();
    _toggleClass(
      [HTMLELEMENTS.highscore],
      [HTMLELEMENTS.app, HTMLELEMENTS.overlay],
      'd-none'
    );
  } else if (!HTMLELEMENTS.highscore?.classList.contains('d-none')) {
    _toggleClass(
      [HTMLELEMENTS.startScreen],
      [HTMLELEMENTS.highscore],
      'd-none'
    );
  } else if (!HTMLELEMENTS.nameInput?.classList.contains('d-none')) {
    _toggleClass(
      [HTMLELEMENTS.startScreen],
      [HTMLELEMENTS.nameInput],
      'd-none'
    );
  }
}
