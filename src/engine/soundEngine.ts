export class WhiteboardSoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private streamDest: MediaStreamAudioDestinationNode | null = null;
  private noiseBuffer: AudioBuffer | null = null;
  private activeMarkerSource: AudioBufferSourceNode | null = null;
  private activeMarkerGain: GainNode | null = null;
  private muted = false;

  private ensureContext() {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return null;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.muted ? 0 : 0.6;
      this.masterGain.connect(this.ctx.destination);

      this.streamDest = this.ctx.createMediaStreamDestination();
      this.masterGain.connect(this.streamDest);

      // Pre-generate 2 seconds of soft filtered noise for realistic dry-erase marker texture
      const sampleRate = this.ctx.sampleRate;
      const length = sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, length, sampleRate);
      const data = buffer.getChannelData(0);
      let lastOut = 0;
      for (let i = 0; i < length; i++) {
        const white = Math.random() * 2 - 1;
        // Soft brown/pinkish noise
        data[i] = (lastOut + 0.04 * white) / 1.04;
        lastOut = data[i];
        data[i] *= 2.5;
      }
      this.noiseBuffer = buffer;
    }

    if (this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.muted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(muted ? 0 : 0.6, this.ctx.currentTime, 0.03);
    }
  }

  public isMuted(): boolean {
    return this.muted;
  }

  public getExportAudioStream(): MediaStream | null {
    this.ensureContext();
    return this.streamDest ? this.streamDest.stream : null;
  }

  public setDrawingActive(active: boolean) {
    const ctx = this.ensureContext();
    if (!ctx || !this.masterGain || !this.noiseBuffer) return;

    if (active && !this.activeMarkerSource) {
      const src = ctx.createBufferSource();
      src.buffer = this.noiseBuffer;
      src.loop = true;

      const bandpass = ctx.createBiquadFilter();
      bandpass.type = "bandpass";
      bandpass.frequency.value = 1850;
      bandpass.Q.value = 2.4;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.045, ctx.currentTime + 0.06);

      src.connect(bandpass);
      bandpass.connect(gain);
      gain.connect(this.masterGain);
      src.start();

      this.activeMarkerSource = src;
      this.activeMarkerGain = gain;
    } else if (!active && this.activeMarkerSource && this.activeMarkerGain) {
      const src = this.activeMarkerSource;
      const gain = this.activeMarkerGain;
      this.activeMarkerSource = null;
      this.activeMarkerGain = null;
      try {
        gain.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.03);
        setTimeout(() => {
          try {
            src.stop();
            src.disconnect();
          } catch {
            // ignore already stopped
          }
        }, 90);
      } catch {
        // ignore
      }
    }
  }

  public playTone(kind: "intro" | "clue" | "tick" | "reveal") {
    const ctx = this.ensureContext();
    if (!ctx || !this.masterGain) return;

    const now = ctx.currentTime;

    const triggerNote = (freq: number, startOffset: number, dur: number, vol = 0.14) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = kind === "tick" ? "triangle" : "sine";
      osc.frequency.setValueAtTime(freq, now + startOffset);
      g.gain.setValueAtTime(0.0001, now + startOffset);
      g.gain.exponentialRampToValueAtTime(vol, now + startOffset + 0.015);
      g.gain.exponentialRampToValueAtTime(0.0001, now + startOffset + dur);
      osc.connect(g);
      g.connect(this.masterGain!);
      osc.start(now + startOffset);
      osc.stop(now + startOffset + dur + 0.02);
    };

    if (kind === "intro") {
      triggerNote(523.25, 0, 0.18, 0.11);
      triggerNote(659.25, 0.08, 0.24, 0.11);
    } else if (kind === "clue") {
      triggerNote(587.33, 0, 0.16, 0.1);
      triggerNote(783.99, 0.07, 0.22, 0.1);
    } else if (kind === "tick") {
      triggerNote(880, 0, 0.09, 0.09);
    } else if (kind === "reveal") {
      triggerNote(523.25, 0, 0.35, 0.12);
      triggerNote(659.25, 0.07, 0.35, 0.12);
      triggerNote(783.99, 0.14, 0.45, 0.12);
      triggerNote(1046.5, 0.21, 0.65, 0.13);
    }
  }

  public stopAll() {
    this.setDrawingActive(false);
  }
}
