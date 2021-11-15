export const GLOBAL_Y = 0;
export const PLAYER_Y = -0.5;
export const GLOBAL_GROUND_Y = -0.5;
export const GLOBAL_ROOF_Y = 2;

export const GAME_NAME = 'DUNGEON CRAWLER';

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
const app = document.querySelector('#app') as HTMLDivElement;
const highscore = document.querySelector('#highscore') as HTMLDivElement;
const startScreen = document.querySelector('#start-screen') as HTMLDivElement;
const nameInput = document.querySelector('#name-input') as HTMLDivElement;
const element = document.querySelector('#element') as HTMLCanvasElement;
const startButton = document.querySelector('#startbutton') as HTMLButtonElement;
const highscoreButton = document.querySelector(
  '#highscoreButton'
) as HTMLButtonElement;
const highscoreBackButton = document.querySelector(
  '#highscore-backbutton'
) as HTMLButtonElement;
const overlay = document.querySelector<HTMLDivElement>(
  '#overlay'
) as HTMLDivElement;
const continueButton = document.querySelector<HTMLButtonElement>(
  '#exit-overlay-continueButton'
) as HTMLButtonElement;
const exitButton = document.querySelector<HTMLButtonElement>(
  '#exit-overlay-exitButton'
) as HTMLButtonElement;
const nameInputBackButton = document.querySelector<HTMLButtonElement>(
  '#name-input-backButton'
) as HTMLButtonElement;
const nameInputOkButton = document.querySelector<HTMLButtonElement>(
  '#name-input-okButton'
) as HTMLButtonElement;
const formInput = document.querySelector<HTMLInputElement>(
  '#player-name-input'
) as HTMLInputElement;
const storyBox = document.querySelector<HTMLDivElement>(
  '#story-box'
) as HTMLDivElement;
const healthBar = document.querySelector<HTMLDivElement>(
  '#health-bar'
) as HTMLDivElement;
const healthBarFill = document.querySelector<HTMLDivElement>(
  '#health-bar-fill'
) as HTMLDivElement;
const healthBarText = document.querySelector<HTMLDivElement>(
  '#health-bar-text'
) as HTMLDivElement;
const experienceBar = document.querySelector<HTMLDivElement>(
  '#experience-bar'
) as HTMLDivElement;
const experienceBarFill = document.querySelector<HTMLDivElement>(
  '#experience-bar-fill'
) as HTMLDivElement;
const experienceBarText = document.querySelector<HTMLDivElement>(
  '#experience-bar-text'
) as HTMLDivElement;
const deathScreen = document.querySelector<HTMLDivElement>(
  '#death-screen'
) as HTMLDivElement;
const loadingScreen = document.querySelector<HTMLDivElement>(
  '#loading-screen'
) as HTMLDivElement;
const hudPlayerName = document.querySelector<HTMLSpanElement>(
  '#hud-player-name'
) as HTMLSpanElement;
const hudPlayerLevel = document.querySelector<HTMLSpanElement>(
  '#hud-player-level'
) as HTMLSpanElement;
const hudDungeonFloor = document.querySelector<HTMLSpanElement>(
  '#hud-dungeon-floor'
) as HTMLSpanElement;
const levelUpMsg = document.querySelector<HTMLDivElement>(
  '#level-up-msg'
) as HTMLDivElement;
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
  healthBar,
  healthBarFill,
  healthBarText,
  experienceBar,
  experienceBarFill,
  experienceBarText,
  deathScreen,
  loadingScreen,
  hudPlayerName,
  hudPlayerLevel,
  hudDungeonFloor,
  levelUpMsg,
};

// Highscore Div Elements
const highscoreNameFirstPlace = document.querySelector<HTMLDivElement>(
  '#highscore-first-place-player-name'
) as HTMLDivElement;
const highscoreFloorFirstPlace = document.querySelector<HTMLDivElement>(
  '#highscore-first-place-floor-number'
) as HTMLDivElement;
const highscoreTimeFirstPlace = document.querySelector<HTMLDivElement>(
  '#highscore-first-place-play-time'
) as HTMLDivElement;
const highscoreNameSecondPlace = document.querySelector<HTMLDivElement>(
  '#highscore-second-place-player-name'
) as HTMLDivElement;
const highscoreFloorSecondPlace = document.querySelector<HTMLDivElement>(
  '#highscore-second-place-floor-number'
) as HTMLDivElement;
const highscoreTimeSecondPlace = document.querySelector<HTMLDivElement>(
  '#highscore-second-place-play-time'
) as HTMLDivElement;
const highscoreNameThirdPlace = document.querySelector<HTMLDivElement>(
  '#highscore-third-place-player-name'
) as HTMLDivElement;
const highscoreFloorThirdPlace = document.querySelector<HTMLDivElement>(
  '#highscore-third-place-floor-number'
) as HTMLDivElement;
const highscoreTimeThirdPlace = document.querySelector<HTMLDivElement>(
  '#highscore-third-place-play-time'
) as HTMLDivElement;
const highscoreNameFourthPlace = document.querySelector<HTMLDivElement>(
  '#highscore-fourth-place-player-name'
) as HTMLDivElement;
const highscoreFloorFourthPlace = document.querySelector<HTMLDivElement>(
  '#highscore-fourth-place-floor-number'
) as HTMLDivElement;
const highscoreTimeFourthPlace = document.querySelector<HTMLDivElement>(
  '#highscore-fourth-place-play-time'
) as HTMLDivElement;
const highscoreNameFifthPlace = document.querySelector<HTMLDivElement>(
  '#highscore-fifth-place-player-name'
) as HTMLDivElement;
const highscoreFloorFifthPlace = document.querySelector<HTMLDivElement>(
  '#highscore-fifth-place-floor-number'
) as HTMLDivElement;
const highscoreTimeFifthPlace = document.querySelector<HTMLDivElement>(
  '#highscore-fifth-place-play-time'
) as HTMLDivElement;
const highscoreNameSixthPlace = document.querySelector<HTMLDivElement>(
  '#highscore-sixth-place-player-name'
) as HTMLDivElement;
const highscoreFloorSixthPlace = document.querySelector<HTMLDivElement>(
  '#highscore-sixth-place-floor-number'
) as HTMLDivElement;
const highscoreTimeSixthPlace = document.querySelector<HTMLDivElement>(
  '#highscore-sixth-place-play-time'
) as HTMLDivElement;
const highscoreNameSeventhPlace = document.querySelector<HTMLDivElement>(
  '#highscore-seventh-place-player-name'
) as HTMLDivElement;
const highscoreFloorSeventhPlace = document.querySelector<HTMLDivElement>(
  '#highscore-seventh-place-floor-number'
) as HTMLDivElement;
const highscoreTimeSeventhPlace = document.querySelector<HTMLDivElement>(
  '#highscore-seventh-place-play-time'
) as HTMLDivElement;
const highscoreNameEighthPlace = document.querySelector<HTMLDivElement>(
  '#highscore-eighth-place-player-name'
) as HTMLDivElement;
const highscoreFloorEighthPlace = document.querySelector<HTMLDivElement>(
  '#highscore-eighth-place-floor-number'
) as HTMLDivElement;
const highscoreTimeEighthPlace = document.querySelector<HTMLDivElement>(
  '#highscore-eighth-place-play-time'
) as HTMLDivElement;
const highscoreNameNinthPlace = document.querySelector<HTMLDivElement>(
  '#highscore-ninth-place-player-name'
) as HTMLDivElement;
const highscoreFloorNinthPlace = document.querySelector<HTMLDivElement>(
  '#highscore-ninth-place-floor-number'
) as HTMLDivElement;
const highscoreTimeNinthPlace = document.querySelector<HTMLDivElement>(
  '#highscore-ninth-place-play-time'
) as HTMLDivElement;
const highscoreNameTenthPlace = document.querySelector<HTMLDivElement>(
  '#highscore-tenth-place-player-name'
) as HTMLDivElement;
const highscoreFloorTenthPlace = document.querySelector<HTMLDivElement>(
  '#highscore-tenth-place-floor-number'
) as HTMLDivElement;
const highscoreTimeTenthPlace = document.querySelector<HTMLDivElement>(
  '#highscore-tenth-place-play-time'
) as HTMLDivElement;
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
