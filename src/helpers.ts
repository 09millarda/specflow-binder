import * as vscode from "vscode";
import { IStep, BindingType, IBinding } from ".";

export function getFileExtension(filePath: vscode.Uri): string | undefined {
  const splitFilePath = filePath.fsPath.split(".");
  if (splitFilePath.length === 0) { return undefined; }

  return splitFilePath[splitFilePath.length - 1];
}

export function convertToBindingType(line: string): BindingType | undefined {
  const lineSplit = line.split(" ");
  if (lineSplit.length === 0) { return undefined; }

  switch (lineSplit[0].trim()) {
    case "Given":
      return "Given";
    case "When":
      return "When";
    case "Then":
      return "Then";
    case "And":
      return "And";
    default:
      return undefined;
  }
}

export function getLine(document: vscode.TextDocument, lineNumber: number): string {
  return document.lineAt(lineNumber).text;
}

export function getStep(line: string): string {
  const splitLine = line.split(" ");
  splitLine.splice(0, 1);

  return splitLine.join(" ");
}

export function getCurrentStep(lineNumber: number, document: vscode.TextDocument): IStep | undefined {
  const line = getLine(document, lineNumber);

  const bindingType = resolveBindingType(lineNumber, document);
  if (bindingType === undefined) { return undefined; }

  return {
    step: getStep(line),
    type: bindingType
  };
}

function keepLooping(bindingType: BindingType | undefined, lineNumber: number, isABinding: boolean) {
  if (lineNumber === -1) { return false; }

  if (bindingType === "And") { return true; }
  if (bindingType === undefined && isABinding) { return true; }
  
  return false;
}

function resolveBindingType(lineNumber: number, document: vscode.TextDocument) {
  let currLine = lineNumber;
  let bindingType: BindingType | undefined;
  let isABinding = false;

  while (keepLooping(bindingType = convertToBindingType(getLine(document, currLine)), currLine, isABinding)) {
    isABinding = true;
    currLine--;
  }

  return bindingType;
}

export function getActiveDocument(): vscode.TextDocument | undefined{
  const editor = getActiveEditor();
  if (editor !== undefined){
    return editor.document;
  }
}

export function getActiveEditor(): vscode.TextEditor | undefined {
  return vscode.window.activeTextEditor;
}

export function findBinding(bindings: IBinding[], step: IStep): IBinding | undefined {
  const binding = bindings.find(b => b.type === step.type && new RegExp(`^${b.step}$`).exec(step.step) !== null);

  return binding;
}

export function resetStyling() {
  const editor = getActiveEditor();
  if (editor === undefined) { return; }

  const range = new vscode.Range(new vscode.Position(15, 0), new vscode.Position(15, 6));
  const decoration = vscode.window.createTextEditorDecorationType({});
  editor.setDecorations(decoration, [range]);
}

export function getLastCharacter(line: string): string | undefined {
  line.trim();

  if (line.length === 0) { return undefined; }

  return line[line.length - 1];
}