import SpecflowBindingsHandler from "./SpecflowBindingsHandler";
import * as vscode from "vscode";
import { getFileExtension } from "./helpers";
import FeatureHandler from "./FeatureHandler";

export default function registerListeners(specflowBindingsHandler: SpecflowBindingsHandler) {
  vscode.workspace.onDidSaveTextDocument(doc => onFileDidSave(doc, specflowBindingsHandler));
}

async function onFileDidSave(doc: vscode.TextDocument, specflowBindingsHandler: SpecflowBindingsHandler) {
  await FeatureHandler.validateSteps(doc, await specflowBindingsHandler.getBindings());
  const bindingFiles = specflowBindingsHandler.getTrackedBindingFiles();
  if (bindingFiles.indexOf(doc.uri.fsPath) === -1) { return; }

  await specflowBindingsHandler.discoverFileBindings(doc);
}