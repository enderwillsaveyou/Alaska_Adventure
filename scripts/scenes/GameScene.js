export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  create() {
    console.log('Creating GameScene');
    this.createWorld();
    this.createPlayer();
    this.createInteractives();
    this.setupInput();

    // Launch overlay UI
    this.scene.launch('UIScene');
  }

  createWorld() {
    this.cameras.main.setBackgroundColor('#000000');

    if (this.textures.exists('background')) {
      this.background = this.add.image(400, 300, 'background')
        .setOrigin(0.5)
        .setDepth(0);

      // scale-to-fit while keeping aspect
      const scaleX = this.cameras.main.width / this.background.width;
      const scaleY = this.cameras.main.height / this.background.height;
      const scale = Math.min(scaleX, scaleY);
      this.background.setScale(scale);
    } else {
      console.error('Background texture missing');
      // fail-soft: solid rect
      this.add.rectangle(400, 300, 800, 600, 0x0b2a3a).setDepth(0);
    }
  }

  createPlayer() {
    if (this.textures.exists('player')) {
      this.player = this.physics.add.sprite(400, 300, 'player')
        .setScale(0.5)
        .setDepth(1);
    } else {
      console.warn('Player sprite missing, using placeholder');
      this.player = this.add.rectangle(400, 300, 32, 32, 0xff6b6b);
    }
  }

  createInteractives() {
    if (this.textures.exists('bush')) {
      this.bush = this.add.sprite(600, 400, 'bush')
        .setScale(0.3)
        .setDepth(1)
        .setInteractive()
        .on('pointerdown', () => this.collectBerries());
    }
  }

  setupInput() {
    this.input.on('pointerdown', (pointer) => {
      // move only if we didn't click an interactive
      const clicked = this.input.hitTestPointer(pointer);
      if (clicked.length === 0) {
        this.movePlayer(pointer.x, pointer.y);
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
      player.hunger = Math.max(0, player.hunger - 20);
      this.registry.set('player', player);
      this.game.events.emit('showMessage', 'Found some berries!');
    } else {
      this.game.events.emit('showMessage', 'Too far away!');
    }
  }
}
