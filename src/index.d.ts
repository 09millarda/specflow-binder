import * as vscode from "vscode";

export interface IBinding {
  type: BindingType;
  fileUri: vscode.Uri;
  lineNumber: number;
  columnNumber: number;
  step: string;
}

export interface IStep {
  type: BindingType;
  step: string;
}

export type BindingType = "Given" | "When" | "Then" | "And";