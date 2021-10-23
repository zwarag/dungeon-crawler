import { HTMLELEMENTS } from "./helper/const";
import story from "../public/txt/story.json";
import { storyWriter } from "./helper/typewriter";
import { addToHighscore } from "./highscore-controller";
import highscoreData from "../public/highscore/highscore.json";
import { Game } from "./game";

let _game: Game;

export function initDom(): void {
  HTMLELEMENTS.startButton?.addEventListener("click", _displayNameInput);
  HTMLELEMENTS.highscoreButton?.addEventListener("click", _displayHighscore);
  HTMLELEMENTS.highscoreBackButton?.addEventListener(
    "click",
    _backToStartScreen
  );
  HTMLELEMENTS.exitButton?.addEventListener("click", _backToStartScreen);
  HTMLELEMENTS.continueButton?.addEventListener("click", _continueGame);
  HTMLELEMENTS.nameInputBackButton?.addEventListener(
    "click",
    _backToStartScreen
  );
  HTMLELEMENTS.nameInputOkButton?.addEventListener("click", async () => {
    await _displayStoryBox();
    _startGame();
  });
  HTMLELEMENTS.formInput?.addEventListener("input", _enableButton);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      _displayExitOverlay();
    }
  });
}

function _startGame(): void {
  HTMLELEMENTS.app?.classList.remove("d-none");
  HTMLELEMENTS.startScreen?.classList.add("d-none");
  HTMLELEMENTS.highscore?.classList.add("d-none");
  HTMLELEMENTS.nameInput?.classList.add("d-none");
  HTMLELEMENTS.storyBox?.classList.add("d-none");
  if (HTMLELEMENTS.element) {
    _game = new Game(HTMLELEMENTS.element);
  }
}

function _displayNameInput(): void {
  HTMLELEMENTS.startScreen?.classList.add("d-none");
  HTMLELEMENTS.highscore?.classList.add("d-none");
  HTMLELEMENTS.nameInput?.classList.remove("d-none");
}

function _displayHighscore(): void {
  HTMLELEMENTS.startScreen?.classList.add("d-none");
  HTMLELEMENTS.highscore?.classList.remove("d-none");
}

function _displayExitOverlay(): void {
  //TODO: logic to freeze game
  if (!HTMLELEMENTS.app?.classList.contains("d-none")) {
    if (HTMLELEMENTS.element) {
      HTMLELEMENTS.element.style.opacity = "80%";
      HTMLELEMENTS.overlay?.classList.remove("d-none");
    }
  }
}

function _continueGame(): void {
  //TODO: logic to "unfreeze" game
  HTMLELEMENTS.overlay?.classList.add("d-none");
  if (HTMLELEMENTS.element) {
    HTMLELEMENTS.element.style.opacity = "100%";
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
  HTMLELEMENTS.storyBox?.classList.remove("d-none");
  HTMLELEMENTS.nameInput?.classList.add("d-none");
  return await storyWriter(story.story, "story-box", 2);
}

function _getPlayerName(): string {
  if (HTMLELEMENTS.formInput) {
    return HTMLELEMENTS.formInput.value;
  }
  return "default";
}

function _resetNameInput(): string | boolean {
  return HTMLELEMENTS.formInput
    ? (HTMLELEMENTS.formInput.value = HTMLELEMENTS.formInput.defaultValue)
    : false;
}

function _resetStoryBox(): string | boolean {
  return HTMLELEMENTS.storyBox ? (HTMLELEMENTS.storyBox.innerHTML = "") : false;
}

function _endGame(): void {
  const playTime = _game.stopGame();
  addToHighscore(
    {
      name: _getPlayerName(),
      floor: Math.floor(Math.random() * 100) + 1,
      time: playTime,
    },
    highscoreData
  );
  _resetNameInput();
  _resetStoryBox();
}

function _hideDomExitingGame(): void {
  HTMLELEMENTS.overlay?.classList.add("d-none");
  HTMLELEMENTS.app?.classList.add("d-none");
  HTMLELEMENTS.highscore?.classList.remove("d-none");
}

function _goToStartScreenFromHighscore(): void {
  HTMLELEMENTS.highscore?.classList.add("d-none");
  HTMLELEMENTS.startScreen?.classList.remove("d-none");
}

function _goToStartScreenFromNameInput(): void {
  HTMLELEMENTS.nameInput?.classList.add("d-none");
  HTMLELEMENTS.startScreen?.classList.remove("d-none");
}

function _backToStartScreen(): void {
  //TODO: some logic to end the game (i.e. destroy scene, create highscore, etc)
  if (!HTMLELEMENTS.app?.classList.contains("d-none")) {
    _endGame();
    _hideDomExitingGame();
  } else if (!HTMLELEMENTS.highscore?.classList.contains("d-none")) {
    _goToStartScreenFromHighscore();
  } else if (!HTMLELEMENTS.nameInput?.classList.contains("d-none")) {
    _goToStartScreenFromNameInput();
  }
}
