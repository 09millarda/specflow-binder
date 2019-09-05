import * as vscode from "vscode";
import SpecflowBindingsHandler from "./SpecflowBindingsHandler";
import NavigationHandler from "./NavigationHandler";

export default function registerCommands(context: vscode.ExtensionContext, specflowBindingsHandler: SpecflowBindingsHandler) {
  context.subscriptions.push(vscode.commands.registerCommand("extension.specbind.discoverBindings", () => discoverBindings(specflowBindingsHandler)));
  context.subscriptions.push(vscode.commands.registerCommand("extension.specbind.goToStep", () => goToStep(specflowBindingsHandler)));
}

async function discoverBindings(specflowBindingsHandler: SpecflowBindingsHandler) {
  await specflowBindingsHandler.getBindings(true);
}

async function goToStep(specflowBindingsHandler: SpecflowBindingsHandler) {
  vscode.commands.executeCommand("editor.action.revealDefinition");
  const bindings = await specflowBindingsHandler.getBindings();
  await NavigationHandler.goToStep(bindings);
}