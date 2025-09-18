export default class PreloadScene extends Phaser.Scene {
  constructor(){ super({ key:'PreloadScene' }); }

  preload(){
    const cx = this.cameras.main.centerX, cy = this.cameras.main.centerY;
    this.add.text(cx, cy, 'Loading...', { font:'16px Arial', fill:'#fff' }).setOrigin(.5);

    // Try loading images (fine if they 404)
    this.load.image('background', 'assets/images/wilderness_bg.png');
    this.load.image('player',     'assets/images/player.png');
    this.load.image('bush',       'assets/images/wilderness_NEWONE.png');
    this.load.image('ui_panel',   'assets/images/ui_panel.png');

    this.load.on('loaderror', (f)=>console.warn('Missing asset -> using placeholder:', f.key));
  }

  create(){
    // Generate placeholders for any missing textures
    const ensure = (key, drawFn) => {
      if (!this.textures.exists(key)) {
        const g = this.add.graphics();
        drawFn(g);
        // Size from the last draw; provide explicit sizes
        const b = g.getBounds();
        const w = Math.max(1, Math.ceil(b.width));
        const h = Math.max(1, Math.ceil(b.height));
        g.generateTexture(key, w, h);
        g.destroy();
      }
    };

    ensure('background', (g)=>{
      g.fillStyle(0x1f3b2d, 1); g.fillRect(0,0,800,600);
      g.lineStyle(2,0x0e2219,1);
      for(let x=0;x<=800;x+=40){ g.lineBetween(x,0,x,600); }
      for(let y=0;y<=600;y+=40){ g.lineBetween(0,y,800,y); }
    });

    ensure('player', (g)=>{
      g.fillStyle(0xffe17a,1); g.fillCircle(12,12,12);
      g.lineStyle(3,0x333333,1); g.strokeCircle(12,12,12);
    });

    ensure('bush', (g)=>{
      g.fillStyle(0x2fa872,1); g.fillCircle(30,24,24);
      g.fillStyle(0x1e7a53,1); g.fillCircle(18,28,16);
      g.fillStyle(0x3ac084,1); g.fillCircle(42,28,16);
    });

    ensure('ui_panel', (g)=>{
      g.fillStyle(0x000000,0.7); g.fillRoundedRect(0,0,200,80,8);
      g.lineStyle(2,0xffffff,0.8); g.strokeRoundedRect(0,0,200,80,8);
    });

    this.registry.set('player', { health:100, hunger:0, cold:0 });
    this.scene.start('GameScene');
  }
}
