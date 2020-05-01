import * as vscode from 'vscode';

import { useCreateActionsDiagramService } from './services/create-diagram.service';

export function activate(context: vscode.ExtensionContext) {

	console.log('Extension "ngrx-uml" is now active!');

	let disposable = vscode.commands.registerCommand('ngrx-uml.diagram', async () => {
		if (vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0) {

			const workspaceFolder = vscode.workspace.workspaceFolders.length === 1 ? vscode.workspace.workspaceFolders[0] : await vscode.window.showWorkspaceFolderPick();
			if (workspaceFolder) {
				useCreateActionsDiagramService(workspaceFolder.uri.fsPath);
			}
		}


	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() { }
