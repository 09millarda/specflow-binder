// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import registerCommands, { onFileDidSave } from './commands';
import SpecflowBindingsHandler from './SpecflowBindingsHandler';
import Logger from './Logger';

const specflowBindingsHandler = new SpecflowBindingsHandler();

export function activate(context: vscode.ExtensionContext) {
	Logger.logDebug("Activated the SpecBind extension");

	registerCommands(context, specflowBindingsHandler);

	vscode.workspace.onDidSaveTextDocument(doc => onFileDidSave(doc, specflowBindingsHandler));

	vscode.commands.executeCommand("extension.specbind.discoverBindings");
}

// this method is called when your extension is deactivated
export const deactivate = () => {};
