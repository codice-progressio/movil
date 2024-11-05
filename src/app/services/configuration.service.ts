import { effect, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ConfigurationService {
  constructor() {
    effect(() => this.execute_effect());
    this.load();
  }

  serial = signal('');
  consecutive = signal<number>(0);
  user = signal('');

  execute_effect() {
    const serial = this.serial();
    const consecutive = this.consecutive();
    const user = this.user();
    this.save_configuration({
      serial,
      consecutive,
      user,
    });
  }

  load() {
    const configuration = this.load_configuration();
    this.serial.set(configuration.serial);
    this.consecutive.set(configuration.consecutive);
    this.user.set(configuration.user);
  }

  load_configuration(): Configuration {
    const recovery = localStorage.getItem('configuration');
    if (recovery) {
      const configuration = JSON.parse(recovery);
      configuration.consecutive = parseInt(configuration.consecutive);
      return configuration as Configuration;
    }
    const _default = { serial: 'ORDEN', consecutive: 1, user: 'Generic User' };
    return _default;
  }

  save_configuration(configuration: Configuration) {
    localStorage.setItem('configuration', JSON.stringify(configuration));
  }

  update_consecutive() {
    this.consecutive.set(this.consecutive() + 1);
  }
}

export interface Configuration {
  serial: string;
  consecutive: number;
  user: string;
}
