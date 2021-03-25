'use strict';
import { Severity } from './severity';

export class LogOptions {
  message: any;
  data: any;
  level: any;
  channel: string;
  time: Date;
  user: any;
}

export class Log implements LogOptions {
  public message: any;
  public data: any;
  public level: any;
  public channel: string;
  public time: Date;
  public user: any;
  public levelStr: any;

  constructor(message, data, level, channel = '', time = new Date(), user) {
    if (!(level instanceof Severity)) {
      throw new Error(`'level' must be an instance of Severity`);
    }

    this.message = message;
    this.data = data;
    this.level = level;
    this.channel = channel;
    this.time = time;
    this.user = user;
    this.levelStr = level.toString();
  }

  static fromObject(obj: LogOptions) {
    return new Log(obj.message, obj.data, obj.level, obj.channel, obj.time, obj.user);
  }
}
