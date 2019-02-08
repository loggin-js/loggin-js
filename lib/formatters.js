'use strict';
const strif = require('strif');
const clicolor = require('cli-color');

const padd = (v) => ` ${v} `;

let colors = {
  cl_red: s => clicolor.red(s),
  cl_blue: s => clicolor.blue(s),
  cl_cyan: s => clicolor.cyan(s),
  cl_green: s => clicolor.green(s),
  cl_gray: s => clicolor.blackBright(s),
  cl_yellow: s => clicolor.yellow(s),
  cl_orange: s => clicolor.orange(s),
  cl_purple: s => clicolor.purple(s),
  cl_black: s => clicolor.black(s),
  cl_white: s => clicolor.white(s),
  cl_magenta: s => clicolor.magenta(s),
};

let labels = {
  lbl_red: s => clicolor.bgRed(padd(s)),
  lbl_blue: s => clicolor.bgBlue(padd(s)),
  lbl_cyan: s => clicolor.bgCyan(padd(s)),
  lbl_green: s => clicolor.bgGreen(padd(s)),
  lbl_gray: s => clicolor.bgGray(padd(s)),
  lbl_yellow: s => clicolor.bgYellow(padd(s)),
  lbl_orange: s => clicolor.bgOrange(padd(s)),
  lbl_purple: s => clicolor.bgPurple(padd(s)),
  lbl_black: s => clicolor.bgBlack(padd(s)),
  lbl_white: s => clicolor.bgWhite(padd(s)),
  lbl_magenta: s => clicolor.bgMagenta(padd(s)),
};

let ignored = [
  'lbl_red',
  'lbl_blue',
  'lbl_cyan',
  'lbl_green',
  'lbl_gray',
  'lbl_yellow',
  'lbl_orange',
  'lbl_purple',
  'lbl_black',
  'lbl_white',
  'lbl_magenta',

  'cl_red',
  'cl_blue',
  'cl_cyan',
  'cl_green',
  'cl_gray',
  'cl_yellow',
  'cl_orange',
  'cl_purple',
  'cl_black',
  'cl_white',
  'cl_magenta',
]


const formatter =
  strif.create({
    transformers: {
      json: s => JSON.stringify(s, null, 2),
      upper: s => s.toUpperCase(),
      lower: s => s.toLowerCase(),
      string: s => s.toString(),
      int: s => s.toInt(),
      date: s => s.toLocaleDateString(),
      ...labels,
      ...colors
    }
  });

class Formatter {
  constructor(template) {
    this.template = template;
  }

  /**
   * @arg {Logger} log
   * @return {String}
   */
  static format(log, formatter, color = false) {
    const tmpltType = formatter.template.constructor.name;
    if (tmpltType !== 'StrifTemplate') {
      throw Error('options.formatter should be type: "StrifTemplate", not: "' + tmpltType + '"');
    }

    return formatter.template.compile(log, {
      ignoreTransformers: !color ? ignored : null
    });
  }
}

Formatter.SHORT = new Formatter(
  formatter.template('[{time}] - {level} - {message}', {
    props: {
      time: {
        transformers: ['date']
      },
      level: {
        transformers: ['string']
      },
      message: {

      }
    }
  })
);
Formatter.MEDIUM = new Formatter(
  formatter.template('[{time}] - {level} - {message} {data}', {
    props: {
      time: {
        transformers: ['date']
      },
      level: {
        transformers: ['string']
      },
      message: {},
      data: {
        transformers: ['json', 'cl_gray']
      }
    }
  })
);
Formatter.LONG = new Formatter(
  formatter.template('[{time} {user}] - {level} - {message} {data}', {
    props: {
      time: {
        transformers: ['date', 'cl_blue']
      },
      user: {
        transformers: ['cl_gray']
      },
      level: {
        transformers: ['string']
      },
      message: {},
      data: {
        transformers: ['json', 'cl_gray']
      }
    }
  })
);
Formatter.DETAILED = new Formatter(
  formatter.template('{time} {user} {channel} - {level} - {message} {data}', {
    props: {
      time: {
        transformers: ['date', 'lbl_cyan']
      },
      user: {
        transformers: ['cl_gray']
      },
      level: {
        transformers: ['string']
      },
      data: {
        transformers: ['json', 'cl_gray']
      },
      channel: {},
      message: {},
    }
  })
);
Formatter.MINIMAL =
  new Formatter(
    formatter.template('{channel} - {message}', {
      props: {
        message: {},
        channel: {},
      }
    })
  );


Formatter.get = (template) => {
  if (
    typeof template === 'string' && ['short', 'medium', 'long', 'detailed', 'minimal', 'default'].includes(template)
  ) {
    switch (template) {
      case 'short':
        return Formatter.SHORT;
      case 'medium':
        return Formatter.MEDIUM;
      case 'long':
        return Formatter.LONG;
      case 'detailed':
        return Formatter.DETAILED;
      case 'minimal':
        return Formatter.MINIMAL;
      default:
        return Formatter.MEDIUM;
    }
  } else if (template && template.constructor.name === 'StrifTemplate') {
    return new Formatter(opts);
  } else if (template && template.constructor.name === 'Formatter') {
    return template;
  } else {
    throw new Error('Bad arguments for .formatter, (' + template + ')');
  }
}
module.exports = Formatter;