import { CONFIG } from './config.js';

class Game extends Phaser.Scene {
  constructor() { super('Game'); }
  create() {
    const g = this.make.graphics({ add: false });
    g.fillStyle(CONFIG.colors.player).fillRect(0, 0, 24, 32).generateTexture('player', 24, 32).clear();
    g.fillStyle(CONFIG.colors.ground).fillRect(0, 0, 64, 16).generateTexture('ground', 64, 16).clear();
    g.fillStyle(CONFIG.colors.coin).fillCircle(8, 8, 8).generateTexture('coin', 16, 16).destroy();
    this.cameras.main.setBackgroundColor(CONFIG.colors.bg);

    const ground = this.physics.add.staticGroup();
    for (let x = 32; x < CONFIG.width; x += 64) ground.create(x, CONFIG.height - 8, 'ground');
    [[200, 330], [400, 260], [620, 200], [120, 190]].forEach(([x, y]) => ground.create(x, y, 'ground'));

    this.player = this.physics.add.sprite(60, 300, 'player').setCollideWorldBounds(true);
    this.physics.add.collider(this.player, ground);

    this.coins = this.physics.add.group({ allowGravity: false });
    for (let i = 0; i < CONFIG.coins; i++) this.coins.create(Phaser.Math.Between(30, CONFIG.width - 30), Phaser.Math.Between(60, 300), 'coin');
    this.score = 0;
    this.best = Number(localStorage.getItem('vibe-best') || 0);
    this.label = this.add.text(12, 10, '', { fontFamily: 'monospace', fontSize: 18, color: '#fff' });
    this.updateLabel();
    this.physics.add.overlap(this.player, this.coins, (p, c) => this.collect(c));

    this.keys = this.input.keyboard.addKeys('LEFT,RIGHT,UP,SPACE,A,D,W,R');
    this.lastGrounded = 0; this.jumpPressedAt = -Infinity;
    this.input.on('pointerdown', () => { this.jumpPressedAt = this.time.now; });
  }
  collect(coin) {
    coin.disableBody(true, true);
    this.score++;
    if (CONFIG.juice.enabled) {
      this.cameras.main.shake(CONFIG.juice.shakeMs, CONFIG.juice.shakeIntensity);
      this.tweens.add({ targets: this.player, scaleX: 1.25, scaleY: 0.8, yoyo: true, duration: 80 });
    }
    if (this.score > this.best) { this.best = this.score; localStorage.setItem('vibe-best', this.best); }
    this.updateLabel();
    if (this.coins.countActive() === 0) this.time.delayedCall(600, () => this.scene.restart());
  }
  updateLabel() { this.label.setText(`Coins ${this.score}/${CONFIG.coins}  Best ${this.best}  [R]estart`); }
  update(time) {
    const k = this.keys, p = this.player, c = CONFIG.player;
    const left = k.LEFT.isDown || k.A.isDown, right = k.RIGHT.isDown || k.D.isDown;
    p.setVelocityX(left ? -c.speed : right ? c.speed : 0);
    if (p.body.blocked.down) this.lastGrounded = time;
    if (Phaser.Input.Keyboard.JustDown(k.UP) || Phaser.Input.Keyboard.JustDown(k.SPACE) || Phaser.Input.Keyboard.JustDown(k.W)) this.jumpPressedAt = time;
    const canJump = time - this.lastGrounded <= c.coyoteMs;
    const buffered = time - this.jumpPressedAt <= c.bufferMs;
    if (canJump && buffered) { p.setVelocityY(-c.jump); this.lastGrounded = -Infinity; this.jumpPressedAt = -Infinity; }
    const jumpHeld = k.UP.isDown || k.SPACE.isDown || k.W.isDown;
    if (!jumpHeld && p.body.velocity.y < 0) p.setVelocityY(p.body.velocity.y * 0.9); // variable jump height
    if (Phaser.Input.Keyboard.JustDown(k.R)) this.scene.restart();
  }
}

new Phaser.Game({
  type: Phaser.AUTO, parent: 'game', width: CONFIG.width, height: CONFIG.height,
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  physics: { default: 'arcade', arcade: { gravity: { y: CONFIG.gravity } } },
  scene: [Game],
});
