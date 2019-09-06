import * as vscode from "vscode";
import SpecflowBindingsHandler from "./SpecflowBindingsHandler";
import NavigationHandler from "./NavigationHandler";
import FeatureHandler from "./FeatureHandler";
import { getActiveEditor, getActiveDocument } from "./helpers";

export default function registerCommands(context: vscode.ExtensionContext, specflowBindingsHandler: SpecflowBindingsHandler) {
  context.subscriptions.push(vscode.commands.registerCommand("extension.specbind.discoverBindings", () => discoverBindings(specflowBindingsHandler)));
  context.subscriptions.push(vscode.commands.registerCommand("extension.specbind.goToStep", () => goToStep(specflowBindingsHandler)));
}
5
async function discoverBindings(specflowBindingsHandler: SpecflowBindingsHandler) {
  const bindings = await specflowBindingsHandler.getBindings(true);
  FeatureHandler.validateActiveDocument(bindings);
}

async function goToStep(specflowBindingsHandler: SpecflowBindingsHandler) {
  vscode.commands.executeCommand("editor.action.revealDefinition");
  const bindings = await specflowBindingsHandler.getBindings();
  await NavigationHandler.goToStep(bindings);
}