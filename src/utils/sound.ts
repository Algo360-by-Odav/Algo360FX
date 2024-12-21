class SoundManager {
  private audio: HTMLAudioElement | null = null;
  private enabled: boolean = true;

  constructor() {
    this.audio = new Audio('/notification.mp3');
  }

  playNotification() {
    if (this.enabled && this.audio) {
      this.audio.play().catch(error => {
        console.error('Error playing notification sound:', error);
      });
    }
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  isEnabled() {
    return this.enabled;
  }
}

export default new SoundManager(); 