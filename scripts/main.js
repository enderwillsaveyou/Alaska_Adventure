import PreloadScene from './scenes/PreloadScene.js';
import GameScene    from './scenes/GameScene.js';
import UIScene      from './scenes/UIScene.js';
import MapScene     from './scenes/MapScene.js';
import MiniQuestScene from './scenes/MiniQuestScene.js';

const config = {
  type: Phaser.AUTO,
  width: 800, height: 600,
  parent: 'game-container',
  backgroundColor: '#000000',
  pixelArt: true,
  scene: [PreloadScene, GameScene, UIScene, MapScene, MiniQuestScene],
  physics: { default: 'arcade', arcade: { debug: false, gravity: { y: 0 } } }
};

window.game = new Phaser.Game(config);
