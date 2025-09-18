export default class MiniGameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MiniGameScene' });
  }

  preload() {
    this.load.image('item', 'assets/images/item.png');
  }

  create() {
    this.add.text(10, 10, 'Mini-Game: Click falling items!', { font: '16px Arial', fill: '#fff' });
    this.items = this.physics.add.group();

    this.time.addEvent({
      delay: 1000,
      callback: () => {
        const x = Phaser.Math.Between(50, 750);
        const item = this.items.create(x, 0, 'item');
        item.setVelocityY(100);
        item.setInteractive();
        item.on('pointerdown', () => item.destroy());
      },
      repeat: 4
    });

    this.time.delayedCall(5000, () => this.scene.start('WildernessScene'));
  }
}
