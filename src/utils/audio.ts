// Audio cues using Web Audio API and Speech Synthesis

class SoundService {
  private ctx: AudioContext | null = null;

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  playBeep(freq = 440, type: OscillatorType = 'sine', duration = 0.15) {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio might fail if user has not interacted yet
    }
  }

  playStartSound() {
    this.playBeep(523.25, 'triangle', 0.1); // C5
    setTimeout(() => this.playBeep(659.25, 'triangle', 0.1), 100); // E5
    setTimeout(() => this.playBeep(783.99, 'triangle', 0.25), 200); // G5
  }

  playPauseSound() {
    this.playBeep(587.33, 'sine', 0.12);
    setTimeout(() => this.playBeep(440, 'sine', 0.2), 120);
  }

  playResumeSound() {
    this.playBeep(440, 'sine', 0.12);
    setTimeout(() => this.playBeep(587.33, 'sine', 0.2), 120);
  }

  playFinishSound() {
    this.playBeep(523.25, 'triangle', 0.12);
    setTimeout(() => this.playBeep(659.25, 'triangle', 0.12), 120);
    setTimeout(() => this.playBeep(783.99, 'triangle', 0.12), 240);
    setTimeout(() => this.playBeep(1046.50, 'triangle', 0.4), 360);
  }

  speakCue(text: string, lang = 'km-KH') {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      // Try to find Khmer voice, fallback to browser default
      const voices = window.speechSynthesis.getVoices();
      const kmVoice = voices.find((v) => v.lang.startsWith('km') || v.lang.includes('KHM'));
      if (kmVoice && lang === 'km-KH') {
        utterance.voice = kmVoice;
      }
      utterance.lang = kmVoice ? 'km-KH' : 'en-US';

      window.speechSynthesis.speak(utterance);
    } catch {
      // Ignore speech synthesis failures
    }
  }
}

export const sound = new SoundService();
