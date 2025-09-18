export default class GameScene extends Phaser.Scene {
  constructor(){ super({ key:'GameScene' }); }

  create(){
    // Background (scaled to fit)
    const bg = this.add.image(400, 300, 'background').setDepth(0);
    const scaleX = this.cameras.main.width / bg.width;
    const scaleY = this.cameras.main.height / bg.height;
    const scale = Math.max(scaleX, scaleY);
    bg.setScale(scale).setScrollFactor(0);

    // Player
    this.player = this.physics.add.sprite(400, 300, 'player')
      .setDepth(1).setCollideWorldBounds(true);

    // A single interactive (the “bush”)
    this.bush = this.add.image(600, 420, 'bush').setDepth(1).setScale(0.5).setInteractive();

    // Click bush -> if close enough, "collect berries"
    this.bush.on('pointerdown', () => {
      const d = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.bush.x, this.bush.y);
      if (d < 110) {
        const p = this.registry.get('player');
        p.hunger = Math.max(0, p.hunger - 20);
        this.registry.set('player', p);
        this.game.events.emit('showMessage', 'You found berries.');
      } else {
        this.game.events.emit('showMessage', 'Too far away.');
      }
    });

    // Click anywhere else to move
    this.input.on('pointerdown', (pointer) => {
      const hits = this.input.hitTestPointer(pointer);
      const clickedInteractive = hits.some(obj => obj === this.bush);
      if (!clickedInteractive) this.movePlayer(pointer.x, pointer.y);
    });

    // Launch UI overlay
    this.scene.launch('UIScene');
  }

  movePlayer(x, y){
    this.tweens.add({ targets:this.player, x, y, duration:600, ease:'Power2' });
  }
}
