import PreloadScene from './scenes/PreloadScene.js';
import GameScene from './scenes/GameScene.js';
import UIScene from './scenes/UIScene.js';
import DevOverlay from './systems/devOverlay.js';

const DEBUG = true;

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'game-container',
  backgroundColor: '#000000',
  scene: [PreloadScene, GameScene, UIScene],
  physics: {
    default: 'arcade',
    arcade: {
      debug: DEBUG,
      gravity: { y: 0 }
    }
  }
};

// global error guard
window.onerror = function (msg, url, lineNo, columnNo, error) {
  console.error('Game Error:', msg, 'at', url, lineNo, columnNo, error);
  return false;
};

DevOverlay.log('Boot: loading Phaser config');

try {
  window.game = new Phaser.Game(config);
  DevOverlay.log('Game created');
  DevOverlay.attach(window.game);
} catch (e) {
  DevOverlay.log(`Error creating game: ${e && e.message ? e.message : e}`, 'error');
  throw e;
}
