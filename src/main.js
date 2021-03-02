import Phaser from 'phaser'
import GameOverScreen from './scenes/GameOverScreen'
import GameSelectScreen from './scenes/GameSelectScene'
import GrammarFallsScene from './scenes/GrammarFallsScene'
import MainTitleScreen from './scenes/MainTitleScene'
import NextLevelScreen from './scenes/NextLevelScreen'
import PauseScreen from './scenes/PauseScreen'
import SpellingSpinScene from './scenes/SpellingSpinScene'
import WordScrambleScene from './scenes/WordScrambleScene'

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
	scene: [MainTitleScreen, GameSelectScreen, GrammarFallsScene, SpellingSpinScene, WordScrambleScene, PauseScreen, GameOverScreen, NextLevelScreen]
}

export default new Phaser.Game(config)
