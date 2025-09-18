const OVERLAY_ENABLED = true;

const styles = {
  base: {
    position: 'fixed',
    top: '10px',
    left: '10px',
    maxWidth: '320px',
    padding: '6px 8px',
    background: 'rgba(0, 0, 0, 0.75)',
    color: '#d9f1ff',
    fontFamily: '12px/1.4 Consolas, Monaco, monospace',
    border: '1px solid rgba(80, 160, 255, 0.4)',
    borderRadius: '4px',
    pointerEvents: 'none',
    zIndex: 9999,
    whiteSpace: 'pre-line',
  },
  level: {
    info: '#d9f1ff',
    warn: '#ffd37c',
    error: '#ff9a9a',
  },
};

class Overlay {
  constructor() {
    this.enabled = OVERLAY_ENABLED && typeof document !== 'undefined';
    this.maxLines = 10;
    this.logs = [];
    this.container = null;
  }

  ensureContainer() {
    if (!this.enabled) return;
    if (this.container) return;

    const el = document.createElement('div');
    Object.assign(el.style, styles.base);
    el.dataset.devOverlay = 'true';
    document.body.appendChild(el);
    this.container = el;
  }

  attach(sceneOrGame) {
    if (!this.enabled) return;
    this.ensureContainer();
    const label = sceneOrGame && sceneOrGame.scene
      ? `scene:${sceneOrGame.scene.key}`
      : 'game';
    this.log(`DevOverlay attached to ${label}`);
  }

  log(message, level = 'info') {
    const severity = ['info', 'warn', 'error'].includes(level) ? level : 'info';
    const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
    const entry = `[${timestamp}] ${message}`;

    if (severity === 'error') {
      console.error(entry);
    } else if (severity === 'warn') {
      console.warn(entry);
    } else {
      console.log(entry);
    }

    if (!this.enabled) return;

    this.ensureContainer();
    this.logs.push({ text: entry, level: severity });
    if (this.logs.length > this.maxLines) {
      this.logs.splice(0, this.logs.length - this.maxLines);
    }
    this.render();
  }

  render() {
    if (!this.container) return;
    this.container.innerHTML = this.logs
      .map(({ text, level }) => `<span style="color:${styles.level[level] || styles.level.info}">${text}</span>`)
      .join('<br/>');
  }
}

const DevOverlay = new Overlay();

export default DevOverlay;
export { DevOverlay };
