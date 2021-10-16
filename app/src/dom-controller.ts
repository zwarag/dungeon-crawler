import { HTMLELEMENTS } from "./helper/const";
import { HIGHSCOREELEMENTS } from "./helper/const";
import { Game } from "./game";

export class DomController {
  constructor() {
    HTMLELEMENTS.startButton?.addEventListener("click", this.displayNameInput);
    HTMLELEMENTS.highscoreButton?.addEventListener(
      "click",
      this.displayHighscore
    );
    HTMLELEMENTS.highscoreBackButton?.addEventListener(
      "click",
      this.backToStartScreen
    );
    HTMLELEMENTS.exitButton?.addEventListener("click", this.backToStartScreen);
    HTMLELEMENTS.continueButton?.addEventListener("click", this.continueGame);
    HTMLELEMENTS.nameInputBackButton?.addEventListener(
      "click",
      this.backToStartScreen
    );
    HTMLELEMENTS.nameInputOkButton?.addEventListener("click", this.startGame);
    HTMLELEMENTS.formInput?.addEventListener("input", this.enableButton);
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        this.displayExitOverlay();
      }
    });
  }

  private startGame(): void {
    HTMLELEMENTS.app?.classList.remove("d-none");
    HTMLELEMENTS.startScreen?.classList.add("d-none");
    HTMLELEMENTS.highscore?.classList.add("d-none");
    HTMLELEMENTS.nameInput?.classList.add("d-none");
    if (HTMLELEMENTS.element) {
      new Game(HTMLELEMENTS.element);
    }
  }

  private displayNameInput(): void {
    HTMLELEMENTS.startScreen?.classList.add("d-none");
    HTMLELEMENTS.highscore?.classList.add("d-none");
    HTMLELEMENTS.nameInput?.classList.remove("d-none");
  }

  private displayHighscore(): void {
    HTMLELEMENTS.startScreen?.classList.add("d-none");
    HTMLELEMENTS.highscore?.classList.remove("d-none");
    // HTMLELEMENTS.highscoreBackButton?.classList.remove("d-none");
  }

  private displayExitOverlay(): void {
    //TODO: logic to freeze game
    if (!HTMLELEMENTS.app?.classList.contains("d-none")) {
      if (HTMLELEMENTS.element) {
        HTMLELEMENTS.element.style.opacity = "80%";
        HTMLELEMENTS.overlay?.classList.remove("d-none");
      }
    }
  }

  private continueGame(): void {
    //TODO: logic to "unfreeze" game
    HTMLELEMENTS.overlay?.classList.add("d-none");
    if (HTMLELEMENTS.element) {
      HTMLELEMENTS.element.style.opacity = "100%";
    }
  }

  private enableButton(): void {
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

  private backToStartScreen(): void {
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
}
