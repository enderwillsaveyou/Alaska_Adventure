export default class UIScene extends Phaser.Scene {
  constructor(){ super({ key:'UIScene' }); }

  create(){
    // Simple HUD text
    this.labels = this.add.text(16, 16, '', { font:'14px Arial', fill:'#fff' }).setDepth(10);
    this.updateLabels(this.registry.get('player'));

    // Transient message at top-center
    this.msg = this.add.text(this.scale.width/2, 40, '', {
      font:'16px Arial', fill:'#fff', backgroundColor:'#000', padding:{ x:10, y:6 }
    }).setOrigin(.5).setAlpha(0).setDepth(20);

    // Listen for changes + messages
    this.registry.events.on('changedata', (parent, key, val) => {
      if (key === 'player') this.updateLabels(val);
    });
    this.game.events.on('showMessage', (text) => this.showMessage(text));
  }

  updateLabels(p){
    this.labels.setText([
      `Health: ${p.health}`,
      `Hunger: ${p.hunger}`,
      `Cold:   ${p.cold}`
    ].join('\n'));
  }

  showMessage(text){
    this.msg.setText(text).setAlpha(1);
    this.tweens.add({ targets:this.msg, alpha:0, delay:900, duration:500, ease:'Power1' });
  }
}
