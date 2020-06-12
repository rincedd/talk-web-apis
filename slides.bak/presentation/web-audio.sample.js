const ctx = new AudioContext();

const oscillator = ctx.createOscillator();
oscillator.type = 'sine';
oscillator.frequency.value = 440;

const gainNode = ctx.createGain();
gainNode.gain.value = 2;

oscillator.connect(gainNode);
gainNode.connect(ctx.destination);

oscillator.start();