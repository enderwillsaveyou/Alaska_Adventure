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

// global error guard that surfaces issues in the overlay as well
window.onerror = function (msg, url, lineNo, columnNo, error) {
  const location = `${url || 'inline'}:${lineNo || 0}:${columnNo || 0}`;
  DevOverlay.log(`Unhandled error: ${msg} @ ${location}`, 'error');
  if (error && error.stack) {
    DevOverlay.log(error.stack.split('\n')[0], 'error');
  }
  console.error('Game Error:', msg, 'at', url, lineNo, columnNo, error);
  return false;
};

window.addEventListener('unhandledrejection', (event) => {
  const reason = event && event.reason ? event.reason : 'Unknown promise rejection';
  DevOverlay.log(`Unhandled rejection: ${reason}`, 'error');
  console.error('Unhandled rejection:', reason);
});

DevOverlay.log('Boot: loading Phaser config');

try {
  window.game = new Phaser.Game(config);
  DevOverlay.log('Game created');
  DevOverlay.attach(window.game);
} catch (e) {
  DevOverlay.log(`Error creating game: ${e && e.message ? e.message : e}`, 'error');
  throw e;
}
