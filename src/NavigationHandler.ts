import { IBinding, BindingType } from ".";
import * as vscode from "vscode";
import Logger from "./Logger";
import { getFileExtension, getCurrentStep } from "./helpers";

export default class NavigationHandler {
  private static getActiveEditor(): vscode.TextEditor | undefined {
    return vscode.window.activeTextEditor;
  }

  private static getActiveDocument(): vscode.TextDocument | undefined {
    const activeEditor = this.getActiveEditor();
    if (activeEditor === undefined) { return undefined; }

    return activeEditor.document;
  }

  private static async openBinding(binding: IBinding) {
    let document: vscode.TextDocument | undefined;
    try {
      document = await vscode.workspace.openTextDocument(binding.fileUri);
    } catch (e) {
      Logger.logError("Could not find file at {fsPath}", binding.fileUri.fsPath);
      return;
    }

    const position = new vscode.Position(binding.lineNumber, binding.columnNumber);
    const selection = new vscode.Selection(position, position);

    const editor = await vscode.window.showTextDocument(document, {
      selection: selection,
      viewColumn: 1,
      preserveFocus: false
    });
    
    editor.revealRange(new vscode.Range(position, position), vscode.TextEditorRevealType.InCenter);
  }

  public static async goToStep(bindings: IBinding[]) {
    const document = this.getActiveDocument();
    if (document === undefined || getFileExtension(document.uri) !== "feature") {
      Logger.logDebug("Active document is not a .feature file");
      return;
    }
    
    const step = getCurrentStep(this.getActiveEditor()!, document);
    if (step === undefined) {
      return;
    }

    Logger.logDebug("Attempting to step into binding with type {BindingType} and step '{BindingStep}'", step.type, step.step);

    const binding = bindings.find(b => b.type === step.type && new RegExp(b.step).exec(step.step) !== null);
    if (binding === undefined) {
      Logger.logError("Cannot find binding with verb '{Verb}' and step '{Step}'. Try refreshing your bindings (Refresh Bindings)", step.type, step.step);
      return;
    }

    await this.openBinding(binding);
  }
}