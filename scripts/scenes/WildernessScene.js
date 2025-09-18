import DevOverlay from '../systems/devOverlay.js';

export default class WildernessScene extends Phaser.Scene {
  constructor() {
    super({ key: 'WildernessScene' });
  }

  create() {
    DevOverlay.attach(this);
    DevOverlay.log('WildernessScene: create');
    console.log('[WildernessScene] create');

    this.renderBackdrop();

    this.add.text(400, 550, 'Press M for Map, G for Game', {
      font: '16px Arial',
      fill: '#ffffff',
      backgroundColor: 'rgba(0,0,0,0.4)',
      padding: { x: 8, y: 6 }
    }).setOrigin(0.5);

    this.input.keyboard.once('keydown-M', () => {
      DevOverlay.log('WildernessScene: switching to MapScene');
      console.log('[WildernessScene] Switching to MapScene');
      this.scene.start('MapScene');
    });

    this.input.keyboard.once('keydown-G', () => {
      DevOverlay.log('WildernessScene: returning to GameScene');
      console.log('[WildernessScene] Returning to GameScene');
      this.scene.start('GameScene');
    });
  }

  renderBackdrop() {
    const backgroundKey = this.textures.exists('wilderness_bg')
      ? 'wilderness_bg'
      : (this.textures.exists('background') ? 'background' : null);

    if (backgroundKey) {
      this.add.image(400, 300, backgroundKey).setOrigin(0.5).setDepth(0);
      DevOverlay.log(`WildernessScene: background rendered using ${backgroundKey}`);
      console.log(`[WildernessScene] Background ready (${backgroundKey})`);
    } else {
      DevOverlay.log('WildernessScene: missing background texture, drawing fallback', 'warn');
      this.add.rectangle(400, 300, 800, 600, 0x0b2a3a).setDepth(0);
      console.warn('[WildernessScene] Background texture missing, using fallback');
    }
  }
}
