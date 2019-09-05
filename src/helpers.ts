import * as vscode from "vscode";
import { IStep, BindingType } from ".";

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

export function getCurrentStep(editor: vscode.TextEditor, document: vscode.TextDocument): IStep | undefined {
  const lineNumber = editor.selection.active.line;
  const line = getLine(document, lineNumber);

  const bindingType = resolveBindingType(editor, document);
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

function resolveBindingType(editor: vscode.TextEditor, document: vscode.TextDocument) {
  let lineNumber = editor.selection.active.line;
  let bindingType: BindingType | undefined;
  let isABinding = false;

  while (keepLooping(bindingType = convertToBindingType(getLine(document, lineNumber)), lineNumber, isABinding)) {
    isABinding = true;
    lineNumber--;
  }

  return bindingType;
}