type LoggerArgs = string | number;
import * as vscode from "vscode";

interface ILogMessage {
  message: string;
  messageFilled: string;
  args: { [key: string]: LoggerArgs };
}

export default class Logger {
  private static _regex = /{([\w\d_]+)}/g;

  private static resolveLogMessage(message: string, ...messageArgs: LoggerArgs[]): ILogMessage {
    const messageParams: string[] = [];

    let match: RegExpMatchArray | null;
    while ((match = this._regex.exec(message)) !== null) {
      const arg = match[1];

      if (messageParams.indexOf(arg) !== -1) {
        throw Error(`Message "${message}" the Argument "${arg}" more than once. Arguments must be unique.`);
      }

      messageParams.push(match[1]);
    }

    if (messageParams.length !== messageArgs.length) {
      throw Error(`Message "${message}" expects ${messageParams.length} Arguments but only received ${messageArgs.length}.`);
    }

    let messageFilled = message;
    const args: { [key: string]: LoggerArgs } = {};
    for (let i = 0; i < messageParams.length; i++) {
      messageFilled = messageFilled.replace(`{${messageParams[i]}}`, messageArgs[i].toString());
      args[messageParams[i]] = messageArgs[i];
    }

    return {
      message,
      messageFilled,
      args
    };
  }

  public static logDebug(message: string, ...args: LoggerArgs[]) {
    const log = this.resolveLogMessage(message, ...args);

    console.debug(log.messageFilled, log.args);
  }

  public static logInformation(message: string, ...args: LoggerArgs[]) {
    const log = this.resolveLogMessage(message, ...args);

    vscode.window.showInformationMessage(log.messageFilled);
    console.log(log.messageFilled, log.args);
  }

  public static logError(message: string, ...args: LoggerArgs[]) {
    const log = this.resolveLogMessage(message, ...args);

    vscode.window.showErrorMessage(log.messageFilled);
    console.error(log.messageFilled, log.args);
  }
}