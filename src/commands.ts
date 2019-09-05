import * as vscode from "vscode";
import SpecflowBindingsHandler from "./SpecflowBindingsHandler";
import Logger from "./Logger";
import NavigationHandler from "./NavigationHandler";

export default function registerCommands(context: vscode.ExtensionContext, specflowBindingsHandler: SpecflowBindingsHandler) {
  context.subscriptions.push(vscode.commands.registerCommand("extension.specbind.discoverBindings", () => discoverBindings(specflowBindingsHandler)));
  context.subscriptions.push(vscode.commands.registerCommand("extension.specbind.goToStep", () => goToStep(specflowBindingsHandler)));
}

async function discoverBindings(specflowBindingsHandler: SpecflowBindingsHandler) {
  await specflowBindingsHandler.getBindings(true);
}

async function goToStep(specflowBindingsHandler: SpecflowBindingsHandler) {
  const bindings = await specflowBindingsHandler.getBindings();
  await NavigationHandler.goToStep(bindings);
}

export async function onFileDidSave(doc: vscode.TextDocument, specflowBindingsHandler: SpecflowBindingsHandler) {
  const bindingFiles = specflowBindingsHandler.getTrackedBindingFiles();
  if (bindingFiles.indexOf(doc.uri.fsPath) === -1) { return; }

  await specflowBindingsHandler.discoverFileBindings(doc);
}