import Phaser from 'phaser'
import GameOverScreen from './scenes/GameOverScreen'
import GameSelectScreen from './scenes/GameSelectScene'
import GrammarFallsScene from './scenes/GrammarFallsScene'
import MainTitleScreen from './scenes/MainTitleScene'
import PauseScreen from './scenes/PauseScreen'

const config = {
	type: Phaser.AUTO,
	width: 480,
	height: 640,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 350 }
		}
	},
	scene: [MainTitleScreen, GameSelectScreen, GrammarFallsScene, PauseScreen, GameOverScreen]
}

export default new Phaser.Game(config)
