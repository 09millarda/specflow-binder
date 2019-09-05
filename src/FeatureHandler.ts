import { IBinding } from ".";
import * as vscode from "vscode";
import { getCurrentStep, getFileExtension, getActiveEditor, findBinding, resetStyling } from "./helpers";

export default class FeatureHandler {
  public static async validateSteps(doc: vscode.TextDocument, bindings: IBinding[]) {
    if (getFileExtension(doc.uri) !== "feature") { return; }
    const lineCount = doc.lineCount;
    
    const ranges: vscode.Range[] = [];
    for (let currLine = 0; currLine < lineCount; currLine++) {
      const step = getCurrentStep(currLine, doc);
      const line = doc.lineAt(currLine);
      if (step === undefined) { continue; }

      if (findBinding(bindings, step) === undefined) {
        ranges.push(new vscode.Range(line.range.start, line.range.end));
      }      
    }

    const editor = getActiveEditor();
    if (editor === undefined) { return; }
    // const style = vscode.window.createTextEditorDecorationType({
    //   color: "red"
    // });
    // editor.setDecorations(style, ranges);
  }
}