export const GLOBAL_Y = 0;
export const PLAYER_Y = 0.5
export const GLOBAL_GROUND_Y = -0.5;

// grid settings used for the dungeon generation
const GRID_HEIGHT = 40; // make sure GRID_HEIGHT and GRID_WIDTH are quadratic!
const GRID_WIDTH = 40; // make sure GRID_HEIGHT and GRID_WIDTH are quadratic!
const MAX_ROOMS = 15;
const ROOM_SIZE_RANGE = [6, 8];
const [ROOM_SIZE_MIN, ROOM_SIZE_MAX] = ROOM_SIZE_RANGE;
export const PROPERTIES = {
  GRID_HEIGHT,
  GRID_WIDTH,
  MAX_ROOMS,
  ROOM_SIZE_RANGE,
  MIN: ROOM_SIZE_MIN,
  MAX: ROOM_SIZE_MAX,
};

// HTML Elements
const app = document.querySelector<HTMLDivElement>("#app");
const highscore = document.querySelector<HTMLDivElement>("#highscore");
const startScreen = document.querySelector<HTMLDivElement>("#start-screen");
const nameInput = document.querySelector<HTMLDivElement>("#name-input");
const element = document.querySelector<HTMLCanvasElement>("#element");
const startButton = document.querySelector<HTMLButtonElement>("#startbutton");
const highscoreButton =
  document.querySelector<HTMLButtonElement>("#highscoreButton");
const highscoreBackButton = document.querySelector<HTMLButtonElement>(
  "#highscore-backbutton"
);
const overlay = document.querySelector<HTMLDivElement>("#overlay");
const continueButton = document.querySelector<HTMLButtonElement>(
  "#exit-overlay-continueButton"
);
const exitButton = document.querySelector<HTMLButtonElement>(
  "#exit-overlay-exitButton"
);
const nameInputBackButton = document.querySelector<HTMLButtonElement>(
  "#name-input-backButton"
);
const nameInputOkButton = document.querySelector<HTMLButtonElement>(
  "#name-input-okButton"
);
const formInput =
  document.querySelector<HTMLInputElement>("#player-name-input");
const storyBox = document.querySelector<HTMLDivElement>("#story-box");
export const HTMLELEMENTS = {
  app,
  highscore,
  startScreen,
  nameInput,
  element,
  startButton,
  highscoreButton,
  highscoreBackButton,
  overlay,
  continueButton,
  exitButton,
  nameInputBackButton,
  nameInputOkButton,
  formInput,
  storyBox,
};

// Highscore Div Elements
const highscoreNameFirstPlace = document.querySelector<HTMLDivElement>(
  "#highscore-first-place-player-name"
);
const highscoreFloorFirstPlace = document.querySelector<HTMLDivElement>(
  "#highscore-first-place-floor-number"
);
const highscoreTimeFirstPlace = document.querySelector<HTMLDivElement>(
  "#highscore-first-place-play-time"
);
const highscoreNameSecondPlace = document.querySelector<HTMLDivElement>(
  "#highscore-second-place-player-name"
);
const highscoreFloorSecondPlace = document.querySelector<HTMLDivElement>(
  "#highscore-second-place-floor-number"
);
const highscoreTimeSecondPlace = document.querySelector<HTMLDivElement>(
  "#highscore-second-place-play-time"
);
const highscoreNameThirdPlace = document.querySelector<HTMLDivElement>(
  "#highscore-third-place-player-name"
);
const highscoreFloorThirdPlace = document.querySelector<HTMLDivElement>(
  "#highscore-third-place-floor-number"
);
const highscoreTimeThirdPlace = document.querySelector<HTMLDivElement>(
  "#highscore-third-place-play-time"
);
const highscoreNameFourthPlace = document.querySelector<HTMLDivElement>(
  "#highscore-fourth-place-player-name"
);
const highscoreFloorFourthPlace = document.querySelector<HTMLDivElement>(
  "#highscore-fourth-place-floor-number"
);
const highscoreTimeFourthPlace = document.querySelector<HTMLDivElement>(
  "#highscore-fourth-place-play-time"
);
const highscoreNameFifthPlace = document.querySelector<HTMLDivElement>(
  "#highscore-fifth-place-player-name"
);
const highscoreFloorFifthPlace = document.querySelector<HTMLDivElement>(
  "#highscore-fifth-place-floor-number"
);
const highscoreTimeFifthPlace = document.querySelector<HTMLDivElement>(
  "#highscore-fifth-place-play-time"
);
const highscoreNameSixthPlace = document.querySelector<HTMLDivElement>(
  "#highscore-sixth-place-player-name"
);
const highscoreFloorSixthPlace = document.querySelector<HTMLDivElement>(
  "#highscore-sixth-place-floor-number"
);
const highscoreTimeSixthPlace = document.querySelector<HTMLDivElement>(
  "#highscore-sixth-place-play-time"
);
const highscoreNameSeventhPlace = document.querySelector<HTMLDivElement>(
  "#highscore-seventh-place-player-name"
);
const highscoreFloorSeventhPlace = document.querySelector<HTMLDivElement>(
  "#highscore-seventh-place-floor-number"
);
const highscoreTimeSeventhPlace = document.querySelector<HTMLDivElement>(
  "#highscore-seventh-place-play-time"
);
const highscoreNameEighthPlace = document.querySelector<HTMLDivElement>(
  "#highscore-eighth-place-player-name"
);
const highscoreFloorEighthPlace = document.querySelector<HTMLDivElement>(
  "#highscore-eighth-place-floor-number"
);
const highscoreTimeEighthPlace = document.querySelector<HTMLDivElement>(
  "#highscore-eighth-place-play-time"
);
const highscoreNameNinthPlace = document.querySelector<HTMLDivElement>(
  "#highscore-ninth-place-player-name"
);
const highscoreFloorNinthPlace = document.querySelector<HTMLDivElement>(
  "#highscore-ninth-place-floor-number"
);
const highscoreTimeNinthPlace = document.querySelector<HTMLDivElement>(
  "#highscore-ninth-place-play-time"
);
const highscoreNameTenthPlace = document.querySelector<HTMLDivElement>(
  "#highscore-tenth-place-player-name"
);
const highscoreFloorTenthPlace = document.querySelector<HTMLDivElement>(
  "#highscore-tenth-place-floor-number"
);
const highscoreTimeTenthPlace = document.querySelector<HTMLDivElement>(
  "#highscore-tenth-place-play-time"
);
export const HIGHSCOREELEMENTS = [
  highscoreNameFirstPlace,
  highscoreFloorFirstPlace,
  highscoreTimeFirstPlace,
  highscoreNameSecondPlace,
  highscoreFloorSecondPlace,
  highscoreTimeSecondPlace,
  highscoreNameThirdPlace,
  highscoreFloorThirdPlace,
  highscoreTimeThirdPlace,
  highscoreNameFourthPlace,
  highscoreFloorFourthPlace,
  highscoreTimeFourthPlace,
  highscoreNameFifthPlace,
  highscoreFloorFifthPlace,
  highscoreTimeFifthPlace,
  highscoreNameSixthPlace,
  highscoreFloorSixthPlace,
  highscoreTimeSixthPlace,
  highscoreNameSeventhPlace,
  highscoreFloorSeventhPlace,
  highscoreTimeSeventhPlace,
  highscoreNameEighthPlace,
  highscoreFloorEighthPlace,
  highscoreTimeEighthPlace,
  highscoreNameNinthPlace,
  highscoreFloorNinthPlace,
  highscoreTimeNinthPlace,
  highscoreNameTenthPlace,
  highscoreFloorTenthPlace,
  highscoreTimeTenthPlace,
];
export const highscoreElementNames = [
  highscoreNameFirstPlace,
  highscoreNameSecondPlace,
  highscoreNameThirdPlace,
  highscoreNameFourthPlace,
  highscoreNameFifthPlace,
  highscoreNameSixthPlace,
  highscoreNameSeventhPlace,
  highscoreNameEighthPlace,
  highscoreNameNinthPlace,
  highscoreNameTenthPlace,
];
export const highscoreElementFloors = [
  highscoreFloorFirstPlace,
  highscoreFloorSecondPlace,
  highscoreFloorThirdPlace,
  highscoreFloorFourthPlace,
  highscoreFloorFifthPlace,
  highscoreFloorSixthPlace,
  highscoreFloorSeventhPlace,
  highscoreFloorEighthPlace,
  highscoreFloorNinthPlace,
  highscoreFloorTenthPlace,
];
export const highscoreElementTimes = [
  highscoreTimeFirstPlace,
  highscoreTimeSecondPlace,
  highscoreTimeThirdPlace,
  highscoreTimeFourthPlace,
  highscoreTimeFifthPlace,
  highscoreTimeSixthPlace,
  highscoreTimeSeventhPlace,
  highscoreTimeEighthPlace,
  highscoreTimeNinthPlace,
  highscoreTimeTenthPlace,
];
