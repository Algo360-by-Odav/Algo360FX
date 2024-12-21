import { Howl } from 'howler';

export type NotificationSoundType =
  | 'default'
  | 'trade'
  | 'alert'
  | 'news'
  | 'account'
  | 'system';

export type NotificationPriority = 'high' | 'medium' | 'low';

class NotificationSoundService {
  private sounds: { [key: string]: Howl } = {};
  private enabled: boolean = true;
  private volume: number = 0.5;

  constructor() {
    this.initializeSounds();
    this.loadSettings();
  }

  private initializeSounds() {
    this.sounds = {
      default: new Howl({
        src: ['/sounds/notification-default.mp3'],
        volume: this.volume,
      }),
      trade: new Howl({
        src: ['/sounds/notification-trade.mp3'],
        volume: this.volume,
      }),
      alert: new Howl({
        src: ['/sounds/notification-alert.mp3'],
        volume: this.volume,
      }),
      news: new Howl({
        src: ['/sounds/notification-news.mp3'],
        volume: this.volume,
      }),
      account: new Howl({
        src: ['/sounds/notification-account.mp3'],
        volume: this.volume,
      }),
      system: new Howl({
        src: ['/sounds/notification-system.mp3'],
        volume: this.volume,
      }),
      high: new Howl({
        src: ['/sounds/notification-high.mp3'],
        volume: this.volume,
      }),
      medium: new Howl({
        src: ['/sounds/notification-medium.mp3'],
        volume: this.volume,
      }),
      low: new Howl({
        src: ['/sounds/notification-low.mp3'],
        volume: this.volume,
      }),
    };
  }

  private loadSettings() {
    try {
      const settings = localStorage.getItem('notificationSoundSettings');
      if (settings) {
        const { enabled, volume } = JSON.parse(settings);
        this.enabled = enabled;
        this.volume = volume;
        this.updateVolume(volume);
      }
    } catch (error) {
      console.error('Error loading notification sound settings:', error);
    }
  }

  private saveSettings() {
    try {
      localStorage.setItem(
        'notificationSoundSettings',
        JSON.stringify({
          enabled: this.enabled,
          volume: this.volume,
        })
      );
    } catch (error) {
      console.error('Error saving notification sound settings:', error);
    }
  }

  public play(
    type: NotificationSoundType = 'default',
    priority: NotificationPriority = 'medium'
  ) {
    if (!this.enabled) return;

    // Play type-specific sound
    const typeSound = this.sounds[type];
    if (typeSound) {
      typeSound.play();
    }

    // For high priority notifications, also play the priority sound
    if (priority === 'high') {
      setTimeout(() => {
        const prioritySound = this.sounds[priority];
        if (prioritySound) {
          prioritySound.play();
        }
      }, 500); // Delay to avoid sound overlap
    }
  }

  public previewSound(
    type: NotificationSoundType = 'default',
    priority: NotificationPriority = 'medium'
  ) {
    const sound = this.sounds[type] || this.sounds.default;
    if (sound) {
      sound.play();
    }
  }

  public setEnabled(enabled: boolean) {
    this.enabled = enabled;
    this.saveSettings();
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume));
    this.updateVolume(this.volume);
    this.saveSettings();
  }

  public getVolume(): number {
    return this.volume;
  }

  private updateVolume(volume: number) {
    Object.values(this.sounds).forEach((sound) => {
      sound.volume(volume);
    });
  }

  public async loadSounds(): Promise<void> {
    const soundPromises = Object.values(this.sounds).map(
      (sound) =>
        new Promise<void>((resolve) => {
          sound.once('load', () => resolve());
        })
    );

    try {
      await Promise.all(soundPromises);
      console.log('All notification sounds loaded successfully');
    } catch (error) {
      console.error('Error loading notification sounds:', error);
      throw error;
    }
  }
}

export const notificationSoundService = new NotificationSoundService();
