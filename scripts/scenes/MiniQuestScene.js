export default class MiniQuestScene extends Phaser.Scene {
  constructor(){ super({ key:'MiniQuestScene' }); }
  init(data){ this.dataIn = data || {}; }

  create(){
    const { questId='unknown', questName='Unknown Region' } = this.dataIn;

    // Backdrop + panel
    this.add.rectangle(0,0,this.scale.width,this.scale.height,0x000000,0.7).setOrigin(0).setDepth(200);
    const cx=this.scale.width/2, cy=this.scale.height/2;
    this.add.image(cx, cy, 'ui_panel').setScale(2.4, 1.8).setDepth(201);

    // Body text
    const body = [
      `Mini-Quest: ${questName}`,
      '',
      'You spot signs of activity. Do you want to scout the area?',
      '(Completing this stub grants a token item.)'
    ].join('\n');
    this.add.text(cx, cy-40, body, { font:'14px Arial', fill:'#fff', align:'center', wordWrap: { width: 520 }})
      .setOrigin(0.5).setDepth(202);

    // Complete button
    const btn = this.add.text(cx, cy+60, '[ Complete Quest ]', { font:'16px Arial', fill:'#ffcc66', backgroundColor:'#222', padding:{x:8,y:6} })
      .setOrigin(0.5).setDepth(202).setInteractive();
    btn.on('pointerdown', ()=> {
      const inv = this.registry.get('inventory') || [];
      const reward = `Token: ${questName}`;
      if (!inv.includes(reward)) this.registry.set('inventory', [...inv, reward]);
      this.game.events.emit('showMessage', `${reward} added to inventory.`);
      this.scene.stop();
    });

    this.input.keyboard.once('keydown-ESC', ()=> this.scene.stop());
  }
}
