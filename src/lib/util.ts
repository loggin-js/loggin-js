import * as os from 'os';
import * as path from 'path';

export function isFunction(val) {
  return val && val.apply !== undefined;
}

export function isConstructor(obj) {
  if (!obj) return false;
  if (!obj.prototype) return false;
  if (!obj.prototype.constructor) return false;

  return !!obj.prototype.constructor.name;
}

export function getOsUsername(injectedOs?: any) {
  const os_ = injectedOs || os;
  return os_.userInfo ? os_.userInfo().username : null;
}

export function getFileBasename() {
  return path.basename(__filename);
}
