import DevOverlay from '../systems/devOverlay.js';

export default class UIScene extends Phaser.Scene {
  constructor() {
    super('UIScene');
    this.isInventoryOpen = false;
  }

  create() {
    DevOverlay.attach(this);
    DevOverlay.log('UIScene: create');
    this.setDepth(100);

    this.createStatusPanel();
    this.createInventorySystem();
    this.createMessageSystem();

    this.setupEventListeners();
    this.initializeState();
  }

  // ===== UI blocks =====
  createStatusPanel() {
    const panel = this.add.graphics();
    panel.fillStyle(0x000000, 0.92);          // slightly more opaque for readability
    panel.fillRoundedRect(10, 10, 250, 120, 10);
    panel.lineStyle(2, 0x444444);
    panel.strokeRoundedRect(10, 10, 250, 120, 10);

    const labelStyle = {
      font: 'bold 16px Arial',
      fill: '#ffffff',
      shadow: { offsetX: 1, offsetY: 1, color: '#000000', blur: 2, fill: true }
    };

    this.bars = {
      health: this.createBar('Health', 25, 25, '#00ff00', labelStyle),
      hunger: this.createBar('Hunger', 25, 60, '#ffa500', labelStyle),
      cold:   this.createBar('Cold',   25, 95, '#00ffff', labelStyle),
    };
  }

  createBar(label, x, y, color, style) {
    this.add.text(x, y, label, style);

    const background = this.add.rectangle(x + 85, y + 8, 150, 15, 0x444444)
      .setOrigin(0, 0.5);

    const bar = this.add.rectangle(
      x + 85, y + 8, 150, 15,
      Phaser.Display.Color.HexStringToColor(color).color
    ).setOrigin(0, 0.5);

    const border = this.add.graphics();
    border.lineStyle(1, 0x666666);
    border.strokeRect(x + 85, y + 1, 150, 15);

    return { background, bar, border };
  }

  createInventorySystem() {
    this.inventoryPanel = this.add.container(this.scale.width / 2, this.scale.height / 2);

    const bg = this.add.rectangle(0, 0, 400, 300, 0x000000, 0.9);
    const border = this.add.graphics();
    border.lineStyle(2, 0x444444);
    border.strokeRect(-200, -150, 400, 300);

    const titleBg = this.add.rectangle(0, -130, 400, 40, 0x333333);
    const title = this.add.text(0, -130, 'INVENTORY', { font: 'bold 24px Arial', fill: '#ffffff' })
      .setOrigin(0.5);

    const closeBtn = this.add.text(180, -130, 'X', {
      font: 'bold 24px Arial',
      fill: '#ff5555'
    }).setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerover', () => closeBtn.setAlpha(0.85))
      .on('pointerout',  () => closeBtn.setAlpha(1))
      .on('pointerdown', () => this.toggleInventory());

    this.createQuickSlots();
    this.inventoryPanel.add([bg, border, titleBg, title, closeBtn]);
    this.inventoryPanel.setVisible(false);
  }

  createQuickSlots() {
    const slotPanel = this.add.graphics();
    slotPanel.fillStyle(0x000000, 0.85);
    slotPanel.fillRoundedRect(10, this.scale.height - 70, 300, 60, 8);
    slotPanel.lineStyle(2, 0x444444);
    slotPanel.strokeRoundedRect(10, this.scale.height - 70, 300, 60, 8);

    for (let i = 0; i < 5; i++) {
      this.add.rectangle(25 + i * 60, this.scale.height - 40, 50, 50, 0x333333)
        .setStrokeStyle(1, 0x666666);
      this.add.text(10 + i * 60, this.scale.height - 60, String(i + 1), {
        font: '14px Arial', fill: '#bbbbbb'
      });
    }
  }

  createMessageSystem() {
    this.messageText = this.add.text(
      this.scale.width / 2, 50, '', {
        font: '18px Arial',
        fill: '#ffffff',
        backgroundColor: '#000000',
        padding: { x: 15, y: 10 }
      }
    ).setOrigin(0.5).setAlpha(0);
  }

  // ===== wiring =====
  setupEventListeners() {
    this.registry.events.on('changedata', this.handleStateChange, this);
    this.input.keyboard.on('keydown-I', () => this.toggleInventory());
    this.game.events.on('showMessage', this.showMessage, this);
  }

  initializeState() {
    const player = this.registry.get('player');
    if (player) this.updateBars(player.health, player.hunger, player.cold);
  }

  toggleInventory() {
    this.isInventoryOpen = !this.isInventoryOpen;
    this.inventoryPanel.setVisible(this.isInventoryOpen);
    DevOverlay.log(`UIScene: inventory ${this.isInventoryOpen ? 'opened' : 'closed'}`);
  }

  showMessage(text) {
    this.messageText.setText(text);
    this.messageText.setAlpha(1);
    DevOverlay.log(`UIScene: message -> ${text}`);
    this.tweens.add({
      targets: this.messageText,
      alpha: 0,
      duration: 2000,
      delay: 1000,
      ease: 'Power2'
    });
  }

  handleStateChange(parent, key, value) {
    if (key === 'player') {
      this.updateBars(value.health, value.hunger, value.cold);
    }
  }

  updateBars(health, hunger, cold) {
    this.updateBar(this.bars.health.bar, health);
    this.updateBar(this.bars.hunger.bar, hunger);
    this.updateBar(this.bars.cold.bar, cold);
  }

  updateBar(bar, value) {
    this.tweens.add({
      targets: bar,
      width: (value / 100) * 150,
      duration: 200,
      ease: 'Power1'
    });
  }

  setDepth(depth) { this.depth = depth; }
}
