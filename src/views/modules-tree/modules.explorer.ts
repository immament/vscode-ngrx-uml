import { NamedConvertedItem } from 'ngrx-uml/dist/lib/core/converters/models';
import vscode from 'vscode';

import { WorkspaceFolderNode2 } from '../tree-view/workspace-folder-node.model';
import { WorkspaceJsonProvider } from '../tree-view/workspace-json.provider';

import { ModulesTreeProvider } from './modules-tree.provider';
import { NamedConvertedItemFactory } from './named-converted-item.factory';

export class ModulesExplorer {

	private modulesViewer: vscode.TreeView<WorkspaceFolderNode2<NamedConvertedItem> | NamedConvertedItem>;

	constructor(_context: vscode.ExtensionContext) {
		const treeDataProvider = new ModulesTreeProvider<NamedConvertedItem>(
			new NamedConvertedItemFactory(new WorkspaceJsonProvider<NamedConvertedItem>('sandbox_NgModule.json'))
		);

		this.modulesViewer = vscode.window.createTreeView('modulesExplorer', { treeDataProvider });

		// vscode.commands.registerCommand('ftpExplorer.refresh', () => treeDataProvider.refresh());
		// vscode.commands.registerCommand('ftpExplorer.openFtpResource', resource => this.openResource(resource));
		// vscode.commands.registerCommand('ftpExplorer.revealResource', () => this.reveal());
	}

}