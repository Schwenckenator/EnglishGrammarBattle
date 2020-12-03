import Phaser from 'phaser'
import GameSelectScreen from './scenes/GameSelectScene'
import GrammarFallsScene from './scenes/GrammarFallsScene'
import MainTitleScreen from './scenes/MainTitleScene'

const config = {
	type: Phaser.AUTO,
	width: 480,
	height: 640,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 200 }
		}
	},
	scene: [MainTitleScreen, GameSelectScreen, GrammarFallsScene]
}

export default new Phaser.Game(config)
