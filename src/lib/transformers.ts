import * as colors from 'colors';
import { Severity } from './severity';

/* istanbul ignore next */
const padd = (v: any) => ` ${v} `;

const severityToColorMap = {
  emergency: colors.yellow,
  alert: colors.yellow,
  critical: colors.red,
  error: colors.red,
  warning: colors.yellow,
  notice: colors.red,
  info: colors.blue,
  debug: colors.blue,
  default: colors.blue,
  silly: colors.green,
};
const getColorForSeverity = (s: string) => severityToColorMap[s.toLowerCase()](s.substr(0, 5)) as string;

/* istanbul ignore next */
export default {
  cl_red: (s: string) => colors.red(s),
  cl_blue: (s: string) => colors.blue(s),
  cl_cyan: (s: string) => colors.cyan(s),
  cl_green: (s: string) => colors.green(s),
  cl_gray: (s: string) => colors.gray(s),
  cl_yellow: (s: string) => colors.yellow(s),
  cl_black: (s: string) => colors.black(s),
  cl_white: (s: string) => colors.white(s),
  cl_magenta: (s: string) => colors.magenta(s),

  // Labels
  lbl_red: (s: any) => colors.bgRed(padd(s)),
  lbl_blue: (s: any) => colors.bgBlue(padd(s)),
  lbl_cyan: (s: any) => colors.bgCyan(padd(s)),
  lbl_green: (s: any) => colors.bgGreen(padd(s)),
  lbl_yellow: (s: any) => colors.bgYellow(padd(s)),
  lbl_black: (s: any) => colors.bgBlack(padd(s)),
  lbl_white: (s: any) => colors.bgWhite(padd(s)),
  lbl_magenta: (s: any) => colors.bgMagenta(padd(s)),

  // Utils
  stringify: (s: any) => (s != null ? JSON.stringify(s, null, 2) : ''),
  stringifyNoFormat: (s: any) => (s != null ? JSON.stringify(s) : ''),
  uppercase: (s: string) => (s != null ? s.toUpperCase() : ''),
  lowercase: (s: string) => (s != null ? s.toLowerCase() : ''),
  capitalize: (s: string) => (s != null ? s.charAt(0).toUpperCase() + s.slice(1) : ''),
  toString: (s: { toString: () => any }) => (s != null ? s.toString() : ''),
  toInt: (s: { toInt: () => any }) => (s != null ? s.toInt() : ''),
  toLocaleDate: (s: string | number | Date) => (s != null ? new Date(s).toLocaleDateString() : ''),
  levelToColoredName: (s: string) => getColorForSeverity(s),
};
