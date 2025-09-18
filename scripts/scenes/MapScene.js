export default class MapScene extends Phaser.Scene {
  constructor(){ super({ key:'MapScene' }); }

  create(){
    // Backdrop
    this.add.rectangle(0,0,this.scale.width,this.scale.height,0x000000,0.7)
      .setOrigin(0).setDepth(100);

    // Panel
    const w=520, h=380, cx=this.scale.width/2, cy=this.scale.height/2;
    this.add.image(cx, cy, 'ui_panel').setScale(2.7,2.7).setDepth(101);

    // Title + close
    this.add.text(cx, cy - h/2 + 18, 'REGION MAP', { font:'16px Arial', fill:'#fff' })
      .setOrigin(0.5).setDepth(102);
    const close = this.add.text(cx + w/2 - 24, cy - h/2 + 8, '✕', { font:'18px Arial', fill:'#fff' })
      .setOrigin(0.5).setDepth(102).setInteractive();
    close.on('pointerdown', ()=> this.scene.stop());

    // Draw large stylized map
    const g = this.add.graphics({ x: cx - w/2 + 20, y: cy - h/2 + 40 }).setDepth(102);
    const MW=w-40, MH=h-80;
    g.fillStyle(0x2b5d47,1).fillRect(0, MH-60, MW, 60);
    g.fillStyle(0x24424b,1).fillTriangle(30,MH-60, 110,40, 190,MH-60);
    g.fillTriangle(160,MH-50, 260,60, 360,MH-50);
    g.fillTriangle(300,MH-40, 420,90, 520,MH-40);
    g.lineStyle(2,0x98b,0.5).strokeRect(0,0,MW,MH);

    // Hotspot regions
    const regions = [
      { id:'ridge',   x: 110, y: 110, label:'Ridge' },
      { id:'valley',  x: 280, y: 150, label:'Frozen Valley' },
      { id:'cabin',   x: 440, y: 100, label:'Old Cabin' },
    ];
    regions.forEach(r=>{
      const dot = this.add.circle(g.x + r.x, g.y + r.y, 10, 0xffcc66, 1).setDepth(103).setInteractive();
      this.add.text(dot.x+12, dot.y-8, r.label, { font:'12px Arial', fill:'#fff' }).setDepth(103);
      dot.on('pointerdown', ()=> {
        this.scene.launch('MiniQuestScene', { questId: r.id, questName: r.label });
        this.scene.stop();
      });
    });

    // keyboard close
    this.input.keyboard.once('keydown-ESC', ()=> this.scene.stop());
  }
}
