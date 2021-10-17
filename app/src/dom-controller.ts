import { HTMLELEMENTS } from "./helper/const";
import { Game } from "./game";
import story from "../public/txt/story.json";
import { storyWriter } from "./helper/typewriter";


export function initDom(): void {
  HTMLELEMENTS.startButton?.addEventListener("click", _displayNameInput);
  HTMLELEMENTS.highscoreButton?.addEventListener(
    "click",
    _displayHighscore
  );
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
  HTMLELEMENTS.nameInputOkButton?.addEventListener(
    "click",
    async () => {
      await _displayStoryBox(); 
      _startGame();
    }
  );
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
  if (HTMLELEMENTS.element) {
    new Game(HTMLELEMENTS.element);
  }
}

function  _displayNameInput(): void {
  HTMLELEMENTS.startScreen?.classList.add("d-none");
  HTMLELEMENTS.highscore?.classList.add("d-none");
  HTMLELEMENTS.nameInput?.classList.remove("d-none");
}

function  _displayHighscore(): void {
  HTMLELEMENTS.startScreen?.classList.add("d-none");
  HTMLELEMENTS.highscore?.classList.remove("d-none");
}

function  _displayExitOverlay(): void {
  //TODO: logic to freeze game
  if (!HTMLELEMENTS.app?.classList.contains("d-none")) {
    if (HTMLELEMENTS.element) {
      HTMLELEMENTS.element.style.opacity = "80%";
      HTMLELEMENTS.overlay?.classList.remove("d-none");
    }
  }
}

function  _continueGame(): void {
  //TODO: logic to "unfreeze" game
  HTMLELEMENTS.overlay?.classList.add("d-none");
  if (HTMLELEMENTS.element) {
    HTMLELEMENTS.element.style.opacity = "100%";
  }
}

function  _enableButton(): void {
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

 async  function _displayStoryBox(): Promise<void> {
  HTMLELEMENTS.storyBox?.classList.remove("d-none");
  HTMLELEMENTS.nameInput?.classList.add("d-none");
  return await storyWriter(story.story, "story-box", 2);
}

 function _backToStartScreen(): void {
  //TODO: some logic to end the game (i.e. destroy scene, create highscore, etc)
  if (!HTMLELEMENTS.app?.classList.contains("d-none")) {
    //function that inserts player into highscore
    HTMLELEMENTS.overlay?.classList.add("d-none");
    HTMLELEMENTS.app?.classList.add("d-none");
    HTMLELEMENTS.highscore?.classList.remove("d-none");
  } else if (!HTMLELEMENTS.highscore?.classList.contains("d-none")) {
    HTMLELEMENTS.highscore?.classList.add("d-none");
    HTMLELEMENTS.startScreen?.classList.remove("d-none");
  } else if (!HTMLELEMENTS.nameInput?.classList.contains("d-none")) {
    HTMLELEMENTS.nameInput?.classList.add("d-none");
    HTMLELEMENTS.startScreen?.classList.remove("d-none");
  }
}
