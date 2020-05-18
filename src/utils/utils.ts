import fs from 'fs';
import vscode from 'vscode';

import logger from './logger';

export function openTextDocumentCommand(filePath: string, position?: vscode.Position) {

    const options = position ? { selection: new vscode.Range(position, position) } : undefined;

    return {
        command: 'ngrx-uml.openFile',
        title: "Open File",
        arguments: [vscode.Uri.file(filePath), options]
    };
}

export function openResource(resource: vscode.Uri, options?: vscode.TextDocumentShowOptions): void {
	logger.log('openResource: ' + resource);
	vscode.window.showTextDocument(resource, options);
}

export function pathExists(path: string): boolean {
    try {
        fs.accessSync(path);
    } catch (err) {
        return false;
    }
    return true;
}