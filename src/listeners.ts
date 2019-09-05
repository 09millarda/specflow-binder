import SpecflowBindingsHandler from "./SpecflowBindingsHandler";
import * as vscode from "vscode";
import FeatureHandler from "./FeatureHandler";

export default function registerListeners(specflowBindingsHandler: SpecflowBindingsHandler) {
  vscode.workspace.onDidSaveTextDocument(doc => onFileDidSave(doc, specflowBindingsHandler));
  vscode.workspace.onDidOpenTextDocument(doc => onFileDidOpen(doc, specflowBindingsHandler));
  vscode.workspace.onDidChangeTextDocument(ev => onFileDidChange(ev, specflowBindingsHandler));
}

async function onFileDidChange(ev: vscode.TextDocumentChangeEvent, specflowBindingsHandler: SpecflowBindingsHandler) {
  await FeatureHandler.validateSteps(ev.document, await specflowBindingsHandler.getBindings());

  if (ev.contentChanges.length === 1 && ev.contentChanges[0].text === "|") {
    await FeatureHandler.formatTable(ev.document);
  }
}

async function onFileDidOpen(doc: vscode.TextDocument, specflowBindingsHandler: SpecflowBindingsHandler) {
  await FeatureHandler.validateSteps(doc, await specflowBindingsHandler.getBindings());
}

async function onFileDidSave(doc: vscode.TextDocument, specflowBindingsHandler: SpecflowBindingsHandler) {
  await FeatureHandler.validateSteps(doc, await specflowBindingsHandler.getBindings());
  
  const bindingFiles = specflowBindingsHandler.getTrackedBindingFiles();
  if (bindingFiles.indexOf(doc.uri.fsPath) >= -1) {
    await specflowBindingsHandler.discoverFileBindings(doc);
  }
}