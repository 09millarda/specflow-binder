import { IBinding } from ".";
import * as vscode from "vscode";
import TestFile from "./TestFileProcessor";
import Logger from "./Logger";

export default class SpecflowBindingsHandler {
  private _bindings: { [fsPath: string]: IBinding[] } = {};

  public resetBindings() {
    this._bindings = {};
  }

  public async discoverFileBindings(doc: vscode.TextDocument) {
    if (this._bindings[doc.uri.fsPath] === undefined) {
      this._bindings[doc.uri.fsPath] = [];
    }

    const testFile = new TestFile(doc.uri);
    this._bindings[doc.uri.fsPath] = await testFile.getBindings();

    Logger.logInformation("Updated Specflow Bindings");
  }

  public async discoverBindings() {
    this.resetBindings();

    const searchGlob = vscode.workspace.getConfiguration().get<string>('specflowtools.stepfilesearchglob');
    const testFileUris = await vscode.workspace.findFiles(searchGlob || '**/*.cs', '**/*.feature.cs');
    const testFiles = testFileUris.map(testFileUri => new TestFile(testFileUri));

    Logger.logInformation("Discovering Specflow Bindings from {TestFileCount} test files", testFiles.length);
    
    const fileBindings = await Promise.all(testFiles.map(testFile => testFile.getBindings(true)));

    for (let bindings of fileBindings) {
      if (bindings.length > 0) {
        const fsPath = bindings[0].fileUri.fsPath;

        if (this._bindings[fsPath] === undefined) {
          this._bindings[fsPath] = [];
        }

        this._bindings[fsPath].push(...bindings);
      }
    }

    const bindings = await this.getBindings();
    Logger.logInformation("Discovered {BindingCount} Specflow Bindings", bindings.length);
  }

  public async getBindings(discoverBindings = false) {
    if (discoverBindings) {
      await this.discoverBindings();
    }

    const bindings: IBinding[] = [];

    for (let fsPath in this._bindings) {
      bindings.push(...this._bindings[fsPath]);
    }

    return bindings;
  }

  public getTrackedBindingFiles() {
    return Object.keys(this._bindings);
  }
}