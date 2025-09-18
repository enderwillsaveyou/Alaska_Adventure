export default class MapScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MapScene' });
  }

  preload() {
    this.load.image('map', 'assets/images/map.png');
    this.load.image('highlight', 'assets/images/ui_panel.png');
  }

  create() {
    this.add.image(400, 300, 'map');
    const highlight = this.add.image(200, 200, 'highlight').setInteractive();
    highlight.on('pointerdown', () => this.scene.start('MiniGameScene'));
  }
}
