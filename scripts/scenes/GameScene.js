import DevOverlay from '../systems/devOverlay.js';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  create() {
    DevOverlay.attach(this);
    DevOverlay.log('GameScene: create');
    console.log('[GameScene] create');
    this.createWorld();
    this.createPlayer();
    this.createInteractives();
    this.setupInput();

    // Launch overlay UI
    this.scene.launch('UIScene');
  }

  createWorld() {
    this.cameras.main.setBackgroundColor('#000000');

    const backgroundKey = this.textures.exists('wilderness_bg')
      ? 'wilderness_bg'
      : (this.textures.exists('background') ? 'background' : null);

    if (backgroundKey) {
      this.background = this.add.image(400, 300, backgroundKey)
        .setOrigin(0.5)
        .setDepth(0);

      // scale-to-fit while keeping aspect
      const scaleX = this.cameras.main.width / this.background.width;
      const scaleY = this.cameras.main.height / this.background.height;
      const scale = Math.min(scaleX, scaleY);
      this.background.setScale(scale);
      DevOverlay.log(`GameScene: background rendered using ${backgroundKey}`);
      console.log(`[GameScene] Background ready (${backgroundKey})`);
    } else {
      DevOverlay.log('GameScene: missing background texture, drawing fallback', 'warn');
      // fail-soft: solid rect
      this.add.rectangle(400, 300, 800, 600, 0x0b2a3a).setDepth(0);
      console.warn('[GameScene] Background texture missing, using fallback');
    }
  }

  createPlayer() {
    if (this.textures.exists('player')) {
      this.player = this.physics.add.sprite(400, 300, 'player')
        .setScale(0.5)
        .setDepth(1);
      DevOverlay.log('GameScene: player sprite ready');
      console.log('[GameScene] Player ready');
    } else {
      DevOverlay.log('GameScene: player texture missing, using placeholder', 'warn');
      this.player = this.add.rectangle(400, 300, 32, 32, 0xff6b6b);
      console.warn('[GameScene] Player texture missing, using placeholder');
    }
  }

  createInteractives() {
    if (this.textures.exists('bush')) {
      this.bush = this.add.sprite(600, 400, 'bush')
        .setScale(0.3)
        .setDepth(1)
        .setInteractive()
        .on('pointerdown', () => this.collectBerries());
      DevOverlay.log('GameScene: bush interactive ready');
      console.log('[GameScene] Bush ready');
    } else {
      DevOverlay.log('GameScene: bush texture missing, creating placeholder', 'warn');
      this.bush = this.add.rectangle(600, 400, 48, 48, 0x3fa36a)
        .setDepth(1)
        .setInteractive()
        .on('pointerdown', () => this.collectBerries());
      console.warn('[GameScene] Bush texture missing, using placeholder');
    }
  }

  setupInput() {
    DevOverlay.log('GameScene: input setup');
    this.input.on('pointerdown', (pointer) => {
      // move only if we didn't click an interactive
      const clicked = this.input.hitTestPointer(pointer);
      if (clicked.length === 0) {
        this.movePlayer(pointer.x, pointer.y);
        console.log('[GameScene] Move player to', pointer.x, pointer.y);
      }
    });
  }

  movePlayer(x, y) {
    this.tweens.add({
      targets: this.player,
      x, y,
      duration: 500,
      ease: 'Power2'
    });
  }

  collectBerries() {
    const d = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.bush.x, this.bush.y);
    if (d < 100) {
      const player = this.registry.get('player');
      const updated = {
        ...player,
        hunger: Math.max(0, player.hunger - 20)
      };
      this.registry.set('player', updated);
      console.log('[GameScene] Berries collected. Player hunger:', updated.hunger);
      this.game.events.emit('showMessage', 'Found some berries!');
      DevOverlay.log('GameScene: berries collected, hunger reduced');
    } else {
      this.game.events.emit('showMessage', 'Too far away!');
      DevOverlay.log('GameScene: berry bush clicked but player too far', 'warn');
    }
  }
}
