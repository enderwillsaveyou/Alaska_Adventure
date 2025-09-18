export default class UIScene extends Phaser.Scene {
  constructor(){ super({ key:'UIScene' }); }

  create(){
    // HUD labels
    this.labels = this.add.text(16, 16, '', { font:'14px Arial', fill:'#fff' }).setDepth(10);
    const p = this.registry.get('player') || { health:100, hunger:0, cold:0 };
    this.updateLabels(p);

    // Message popup
    this.msg = this.add.text(this.scale.width/2, 40, '', {
      font:'16px Arial', fill:'#fff', backgroundColor:'#000', padding:{ x:10, y:6 }
    }).setOrigin(.5).setAlpha(0).setDepth(20);

    // --- Minimap (bottom-left) ---
    const mmX=16, mmY=this.scale.height-110, mmW=120, mmH=90;
    this.mmBg = this.add.rectangle(mmX, mmY, mmW, mmH, 0x111111, 0.8)
      .setOrigin(0,0).setStrokeStyle(2,0xffffff,0.6).setDepth(12).setInteractive();

    // Draw a tiny stylized landscape
    const g = this.add.graphics({ x:mmX, y:mmY }).setDepth(13);
    g.fillStyle(0x2b5d47,1).fillRect(0, 60, mmW, 30);
    g.fillStyle(0x24424b,1).fillTriangle(10,60, 40,25, 70,60);
    g.fillTriangle(50,65, 85,30, 115,65);
    g.fillStyle(0xdadfe6,1).fillTriangle(40,28, 47,36, 33,36);
    g.fillTriangle(85,33, 92,41, 78,41);

    this.add.text(mmX+6, mmY-14, '[M] Map', { font:'12px Arial', fill:'#9ab' }).setDepth(12);
    this.mmBg.on('pointerdown', ()=> this.scene.launch('MapScene'));

    // Inventory hint (if you already had inventory, this keeps the hint)
    this.add.text(this.scale.width - 170, this.scale.height - 20, '[I] Inventory', {
      font:'12px Arial', fill:'#9ab'
    }).setDepth(5).setAlpha(0.85);

    // Events
    this.registry.events.on('changedata', (parent, key, val) => {
      if (key === 'player')    this.updateLabels(val);
      if (key === 'inventory' && this.updateInventory) this.updateInventory(val);
    });
    this.game.events.on('showMessage', (text) => this.showMessage(text));

    // Keys
    this.input.keyboard.on('keydown-I', () => this.toggleInventory && this.toggleInventory());
    this.input.keyboard.on('keydown-M', () => this.scene.launch('MapScene'));
  }

  updateLabels(p){
    this.labels.setText([`Health: ${p.health}`, `Hunger: ${p.hunger}`, `Cold:   ${p.cold}`].join('\n'));
  }

  showMessage(text){
    this.msg.setText(text).setAlpha(1);
    this.tweens.add({ targets:this.msg, alpha:0, delay:900, duration:500, ease:'Power1' });
  }
}
