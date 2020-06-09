import vscode from 'vscode';

import { CreateDiagramService } from './services/create-diagram.service';
import logger from './utils/logger';
import { resetStatusBar } from './utils/status-bar';
import { openResource, openResourceWithOffset } from './utils/utils';
import { getWorkspaceFolder } from './utils/workspace';
import { ActionMapper } from './views/action.mapper';
import { ActionsTreeProvider } from './views/actions-tree.provider';
import { ModulesExplorer } from './views/modules-tree/modules.explorer';

export enum NgrxUmlCommands {
	refreshTreeView = 'ngrx-uml.refreshTreeView',
	openFile = 'ngrx-uml.openFile',
	openFileWithOffset = 'ngrx-uml.openFileWithOffset',
	generateActionsDiagram = 'ngrx-uml.generateActionsDiagram'
}
let statusBar: vscode.StatusBarItem | undefined;

export function activate(context: vscode.ExtensionContext) {
	logger.log('Extension "ngrx-uml" is now active!');

	createStatusBarItem(context);

	registerCommands(context);

	new ModulesExplorer(context);

}


function createStatusBarItem(context: vscode.ExtensionContext) {
	statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
	statusBar.command = NgrxUmlCommands.generateActionsDiagram;
	resetStatusBar(statusBar);
	context.subscriptions.push(statusBar);
}

function registerCommands(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		vscode.commands.registerCommand(NgrxUmlCommands.generateActionsDiagram, async () => {
			const workspaceFolder = await getWorkspaceFolder();

			if (workspaceFolder) {
				new CreateDiagramService(workspaceFolder, statusBar).generateWithProgress();
			}
		}));

	if (vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0) {
		const actionsTreeProvider = new ActionsTreeProvider(new ActionMapper);
		context.subscriptions.push(
			vscode.window.registerTreeDataProvider('actionsTree', actionsTreeProvider),
			vscode.commands.registerCommand(NgrxUmlCommands.refreshTreeView, () => actionsTreeProvider.refresh())
		);;

	}

	context.subscriptions.push(
		vscode.commands.registerCommand(NgrxUmlCommands.openFile, (resource, options) => openResource(resource, options)),
		vscode.commands.registerCommand(NgrxUmlCommands.openFileWithOffset, (resource, options) => openResourceWithOffset(resource, options))
	);

}




// this method is called when your extension is deactivated
export function deactivate() {
	logger.log('Extension deactivate');
}
