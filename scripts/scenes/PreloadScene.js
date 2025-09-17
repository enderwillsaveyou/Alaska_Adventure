export default class PreloadScene extends Phaser.Scene {
  constructor(){ super({ key:'PreloadScene' }); }

  preload(){
    const cx = this.cameras.main.centerX, cy = this.cameras.main.centerY;
    this.add.text(cx, cy, 'Loading...', { font:'16px Arial', fill:'#fff' }).setOrigin(.5);

    // Load art (matches your assets/images filenames)
    this.load.image('background', 'assets/images/wilderness_bg.png');
    this.load.image('player',     'assets/images/player.png');
    this.load.image('bush',       'assets/images/wilderness_NEWONE.png');
    this.load.image('ui_panel',   'assets/images/ui_panel.png');

    this.load.on('loaderror', (f)=>console.error('Load error:', f.key, f.src));
  }

  create(){
    // Minimal player state (expand later)
    this.registry.set('player', { health:100, hunger:0, cold:0 });
    this.scene.start('GameScene');
  }
}
