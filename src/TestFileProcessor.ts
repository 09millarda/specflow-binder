import * as vscode from "vscode";
import { IBinding, BindingType } from ".";
import * as readLine from "readline";
import * as fs from "fs";

interface IStepLine {
  type: BindingType;
  step: string;
  columnNumber: number;
}

export default class TestFile {
  private static _stepRegex = /\[(Given|When|Then)\(@?\"(.*)\"\)\]/;

  private _fileContainsSteps = false;
  private _bindingsDiscovered = false;
  private _bindings: IBinding[] = [];
  private _lineNumber = -1;

  public constructor(private _fileUri: vscode.Uri) { }

  private getLineParts(line: string): IStepLine | null {
    const match = TestFile._stepRegex.exec(line);
    if (match === null || match.length !== 3) { return null; }

    let columnNumber = 0;
    while (line[columnNumber] === " ") {
      columnNumber++;
    }

    return {
      type: match[1] as BindingType,
      step: match[2],
      columnNumber
    };
  }

  private processLine(line: string) {
    this._lineNumber++;

    if (line.includes("[Binding]")) {
      this._fileContainsSteps = true;
    }

    if (!this._fileContainsSteps) {
      return;
    }

    const lineStepParts = this.getLineParts(line);
    if (lineStepParts === null) { return; }

    this._bindings.push({
      fileUri: this._fileUri,
      lineNumber: this._lineNumber,
      columnNumber: lineStepParts.columnNumber,
      step: lineStepParts.step,
      type: lineStepParts.type
    });
  }

  private findBindings() {
    return new Promise((resolve) => {
      const fsPath = this._fileUri.fsPath;

      this._lineNumber = -1;
      readLine.createInterface({
        input: fs.createReadStream(fsPath)
      })
      .on("line", line => this.processLine(line))
      .on("close", resolve);
    });
  }

  public async getBindings(rediscoverBindings = false) {
    if (!this._bindingsDiscovered || rediscoverBindings) {
      try {
        await this.findBindings();
        this._bindingsDiscovered = true;
      } catch (err) {
        throw Error(err);
      }
    }

    return this._bindings;
  }
}