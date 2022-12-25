import * as log from "logger";

// https://zenn.dev/kawarimidoll/articles/b1d9bc15aaa99c
const simpleFormatter = (logRecord: log.LogRecord) => {
  const { datetime, levelName, msg } = logRecord;

  const d = new Date(datetime.getTime() - datetime.getTimezoneOffset() * 6e4);
  const logTime =
    d.toISOString().slice(0, -5) +
    d.toString().replace(/^.*GMT([-+]\d{2})(\d{2}).*$/, "$1:$2");

  return `${logTime} ${levelName.padEnd(7)} ${msg}`;
};

log.setup({
  handlers: {
    // console出力形式の定義
    console: new log.handlers.ConsoleHandler("DEBUG", {
      formatter: simpleFormatter,
    }),
  },
  loggers: {
    default: {
      level: "DEBUG",
      handlers: ["console"],
    },
  },
});

export const Logger = log.getLogger();
