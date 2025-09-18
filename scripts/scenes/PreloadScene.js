import DevOverlay from '../systems/devOverlay.js';

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' });
  }

  preload() {
    DevOverlay.attach(this);
    DevOverlay.log('PreloadScene: preload start');
    const cx = this.cameras.main.centerX;
    const cy = this.cameras.main.centerY;
    const txt = this.add.text(cx, cy, 'Loading...', {
      font: '24px Arial',
      fill: '#ffffff'
    }).setOrigin(0.5);

    // helpful logging
    this.load.on('filecomplete', (key) => {
      DevOverlay.log(`Loaded asset: ${key}`);
      txt.setText('Loaded: ' + key);
    });
    this.load.on('loaderror', (fileObj) => {
      DevOverlay.log(`Load error: ${fileObj.key} from ${fileObj.src}`, 'warn');
      txt.setText('Error: ' + fileObj.key);
    });

    // clear any cached textures between reloads, but keep Phaser defaults
    Object.keys(this.textures.list)
      .filter((key) => !key.startsWith('__'))
      .forEach((key) => {
        this.textures.remove(key);
      });
    DevOverlay.log('PreloadScene: cleared cached textures');

    // --- images to load ---
    // use the SAME keys the scenes expect
    this.load.image('wilderness_bg', './assets/images/wilderness_bg.png');
    this.load.image('player', './assets/images/player.png');
    this.load.image('bush', './assets/images/wilderness_NEWONE.png');
    this.load.image('ui_panel', './assets/images/ui_panel.png');

    this.load.once('complete', () => {
      DevOverlay.log('PreloadScene: load complete');
      console.log('[PreloadScene] Asset load complete');
      this.verifyAssets();
    });
  }

  create() {
    DevOverlay.log('PreloadScene: create');
    this.verifyAssets();
    // simple registry defaults used by UIScene
    const startingState = { health: 100, hunger: 0, cold: 0 };
    this.registry.set('player', startingState);
    console.log('[PreloadScene] Player state initialised', startingState);

    DevOverlay.log('PreloadScene: starting GameScene');
    console.log('[PreloadScene] Starting GameScene');
    this.scene.start('GameScene');
  }

  verifyAssets() {
    if (this.assetsVerified) return;
    const required = ['wilderness_bg', 'player', 'bush', 'ui_panel'];
    const missing = required.filter((k) => !this.textures.exists(k));

    if (missing.length) {
      DevOverlay.log(`Missing assets detected: ${missing.join(', ')}`, 'warn');
      this.generatePlaceholders(missing);
    } else {
      DevOverlay.log('All required assets loaded successfully');
      console.log('[PreloadScene] Assets ready:', required.join(', '));
    }

    this.ensureBackgroundAlias();

    this.assetsVerified = true;
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
      DevOverlay.log(`Generating placeholder for ${k}`, 'warn');
      switch (k) {
        case 'wilderness_bg': {
          // simple gradient-like stripes
          const texKey = 'wilderness_bg';
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

    if (keys.includes('wilderness_bg')) {
      this.ensureBackgroundAlias();
    }
  }

  ensureBackgroundAlias() {
    if (!this.textures.exists('wilderness_bg') || this.textures.exists('background')) {
      return;
    }

    const wildernessTexture = this.textures.get('wilderness_bg');
    if (!wildernessTexture || typeof wildernessTexture.getSourceImage !== 'function') {
      return;
    }

    const source = wildernessTexture.getSourceImage();
    if (!source) {
      return;
    }

    this.textures.addImage('background', source);
    DevOverlay.log('PreloadScene: aliased wilderness_bg as background for legacy lookups');
    console.log('[PreloadScene] Added legacy background alias');
  }
}
