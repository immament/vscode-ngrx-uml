import * as vscode from 'vscode';

export async function getWorkspaceFolder() {

    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (workspaceFolders && workspaceFolders.length > 0) {

        let workspaceFolder: vscode.WorkspaceFolder | undefined;
        let configWorkspace = vscode.workspace.getConfiguration('ngrxUml').get<string>('input.workspaceFolder');

        if (configWorkspace) {
            workspaceFolder = workspaceFolders.find(wf => wf.name === configWorkspace);
        }
        if (!workspaceFolder) {
            workspaceFolder = await chooseWorkspaceFolder(workspaceFolders);
        }
       
        return workspaceFolder;
    } else {
        vscode.window.showWarningMessage('No folders in workspace.');
    }
}

function chooseWorkspaceFolder(workspaceFolders: readonly vscode.WorkspaceFolder[]) {
	return workspaceFolders.length === 1 ? workspaceFolders[0] : vscode.window.showWorkspaceFolderPick();
}
