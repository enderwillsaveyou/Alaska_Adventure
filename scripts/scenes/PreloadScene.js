export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' });
  }

  preload() {
    const cx = this.cameras.main.centerX;
    const cy = this.cameras.main.centerY;
    const txt = this.add.text(cx, cy, 'Loading...', {
      font: '24px Arial',
      fill: '#ffffff'
    }).setOrigin(0.5);

    // helpful logging
    this.load.on('filecomplete', (key) => {
      console.log('Loaded:', key);
      txt.setText('Loaded: ' + key);
    });
    this.load.on('loaderror', (fileObj) => {
      console.warn('Load error:', fileObj.key, fileObj.src);
      txt.setText('Error: ' + fileObj.key);
    });

    // clear any cached textures between reloads
    this.textures.removeAll();

    // --- images to load ---
    // use the SAME keys the scenes expect
    this.load.image('background', './assets/images/wilderness_bg.png');
    this.load.image('player', './assets/images/player.png');
    this.load.image('bush', './assets/images/wilderness_NEWONE.png');
    this.load.image('ui_panel', './assets/images/ui_panel.png');
  }

  create() {
    // verify and generate placeholders if any required asset is missing
    const required = ['background', 'player', 'bush', 'ui_panel'];
    const missing = required.filter(k => !this.textures.exists(k));

    if (missing.length) {
      console.warn('Missing assets, generating placeholders:', missing);
      this.generatePlaceholders(missing);
    } else {
      console.log('All required assets loaded successfully');
    }

    // simple registry defaults used by UIScene
    this.registry.set('player', { health: 100, hunger: 0, cold: 0 });

    this.scene.start('GameScene');
  }

  generatePlaceholders(keys) {
    const makeSolid = (key, w, h, color) => {
      const g = this.make.graphics({ x: 0, y: 0, add: false });
      g.fillStyle(color, 1);
      g.fillRect(0, 0, w, h);
      g.lineStyle(2, 0x222222, 1);
      g.strokeRect(0, 0, w, h);
      g.generateTexture(key, w, h);
      g.destroy();
    };

    keys.forEach((k) => {
      switch (k) {
        case 'background': {
          // simple gradient-like stripes
          const texKey = 'background';
          const rt = this.make.renderTexture({ width: 800, height: 600, add: false });
          const colors = [0x0b2a3a, 0x0d3850, 0x102f4b, 0x0b2340];
          colors.forEach((c, i) => {
            const g = this.make.graphics({ add: false });
            g.fillStyle(c, 1);
            g.fillRect(0, i * 150, 800, 150);
            rt.draw(g);
            g.destroy();
          });
          rt.saveTexture(texKey);
          rt.destroy();
          break;
        }
        case 'player':
          makeSolid('player', 40, 40, 0xff6b6b);
          break;
        case 'bush':
          makeSolid('bush', 48, 48, 0x3fa36a);
          break;
        case 'ui_panel':
          makeSolid('ui_panel', 256, 128, 0x333333);
          break;
        default:
          makeSolid(k, 64, 64, 0x777777);
      }
    });
  }
}
