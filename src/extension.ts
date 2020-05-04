import * as vscode from 'vscode';

import { generateWithProgress } from './services/create-diagram.service';
import logger from './utils/logger';
import { resetStatusBar } from './utils/status-bar';
import { getWorkspaceFolder } from './utils/workspace';

export function activate(context: vscode.ExtensionContext) {
	logger.log('Extension "ngrx-uml" is now active!');


	const generateCommandId = 'ngrx-uml.diagram';

	const statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
	statusBar.command = generateCommandId;
	resetStatusBar(statusBar);
 
	context.subscriptions.push(statusBar);

	let disposable = vscode.commands.registerCommand(generateCommandId, async () => {
		const workspaceFolder = await getWorkspaceFolder();

		if (workspaceFolder) {
			generateWithProgress(workspaceFolder.uri.fsPath, statusBar);
		}
	});

	context.subscriptions.push(disposable);
}


// this method is called when your extension is deactivated
export function deactivate() {
	console.log('deactivate');
}
