export default class GameScene extends Phaser.Scene {
  constructor(){ super({ key:'GameScene' }); }

  create(){
    // Background (scaled to cover)
    const bg = this.add.image(400, 300, 'background').setDepth(0);
    const scaleX = this.cameras.main.width / bg.width;
    const scaleY = this.cameras.main.height / bg.height;
    const scale = Math.max(scaleX, scaleY);
    bg.setScale(scale).setScrollFactor(0);

    // Day/night tint overlay (animates in update)
    this.dayTint = this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x061634, 1)
      .setOrigin(0).setScrollFactor(0).setDepth(0.5).setAlpha(0.15)
      .setBlendMode(Phaser.BlendModes.MULTIPLY);

    this.dayCycleDuration = 90000; // ms for full 24h loop
    const startHour = 6;
    this.cycleStart = this.time.now - (startHour / 24) * this.dayCycleDuration;
    this.lastClockValue = null;
    this.updateTimeOfDay(true);
    this.time.addEvent({ delay: 1000, loop: true, callback: () => this.updateTimeOfDay() });

    // Player sprite
    this.player = this.physics.add.sprite(400, 300, 'player')
      .setDepth(1).setCollideWorldBounds(true);

    // Single hotspot (the bush)
    this.bush = this.add.image(600, 420, 'bush')
      .setDepth(1).setScale(0.5).setInteractive();

    // Click bush -> interact if close enough
    this.bush.on('pointerdown', () => {
      const d = Phaser.Math.Distance.Between(
        this.player.x, this.player.y, this.bush.x, this.bush.y
      );
      if (d < 110) {
        const p = this.registry.get('player');
        p.hunger = Math.max(0, p.hunger - 20);
        this.registry.set('player', p);
        this.game.events.emit('showMessage', 'You found berries.');
      } else {
        this.game.events.emit('showMessage', 'Too far away.');
      }
    });

    // Click elsewhere to move the player
    this.input.on('pointerdown', (pointer) => {
      const hits = this.input.hitTestPointer(pointer);
      const clickedInteractive = hits.some(obj => obj === this.bush);
      if (!clickedInteractive) this.movePlayer(pointer.x, pointer.y);
    });

    // Launch UI overlay
    this.scene.launch('UIScene');
  }

  update(time){
    if (!this.dayTint) return;
    const elapsed = (time - this.cycleStart) % this.dayCycleDuration;
    const progress = elapsed / this.dayCycleDuration; // 0..1
    const nightPhase = progress <= 0.5 ? progress * 2 : (1 - progress) * 2;
    const eased = Phaser.Math.Easing.Sine.InOut(nightPhase);
    const minAlpha = 0.05;
    const maxAlpha = 0.6;
    this.dayTint.setAlpha(Phaser.Math.Linear(minAlpha, maxAlpha, eased));
  }

  movePlayer(x, y){
    this.tweens.add({ targets:this.player, x, y, duration:600, ease:'Power2' });
  }

  updateTimeOfDay(force = false){
    const now = this.time.now;
    const elapsed = (now - this.cycleStart) % this.dayCycleDuration;
    const totalMinutes = Math.floor((elapsed / this.dayCycleDuration) * 24 * 60);
    const hours = Math.floor(totalMinutes / 60) % 24;
    const minutes = totalMinutes % 60;
    const label = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    if (force || label !== this.lastClockValue){
      this.lastClockValue = label;
      this.registry.set('timeOfDay', label);
    }
  }
}
