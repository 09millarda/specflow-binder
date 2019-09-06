import * as vscode from 'vscode';
import registerCommands from './commands';
import SpecflowBindingsHandler from './SpecflowBindingsHandler';
import Logger from './Logger';
import registerListeners from './listeners';

const specflowBindingsHandler = new SpecflowBindingsHandler();

export function activate(context: vscode.ExtensionContext) {
	Logger.logDebug("Activated the SpecBind extension");

	vscode.languages.setLanguageConfiguration("feature", {
		comments: {
			lineComment: "#"
		}
	});

	registerCommands(context, specflowBindingsHandler);
	registerListeners(specflowBindingsHandler);

	vscode.commands.executeCommand("extension.specbind.discoverBindings");
}

export const deactivate = () => {};
