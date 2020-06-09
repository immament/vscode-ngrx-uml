import fs from 'fs';
import vscode, { Position } from 'vscode';

import logger from './logger';

export function openTextDocumentCommand(filePath: string, position?: vscode.Position) {

    const options = position ? { selection: new vscode.Range(position, position) } : undefined;

    return {
        command: 'ngrx-uml.openFile',
        title: "Open File",
        arguments: [vscode.Uri.file(filePath), options]
    };
}

export function openTextDocumentWithOffsetCommand(filePath: string, offset?: number, offsetEnd?: number) {

    const options = offset ? { offset, offsetEnd } : undefined;

    return {
        command: 'ngrx-uml.openFileWithOffset',
        title: "Open File",
        arguments: [vscode.Uri.file(filePath), options]

    };
}

export function openResource(resource: vscode.Uri, options?: vscode.TextDocumentShowOptions): void {
    logger.log('openResource: ' + resource);
    vscode.window.showTextDocument(resource, options);
}

export function openResourceWithOffset(
    resource: vscode.Uri,
    options?: vscode.TextDocumentShowOptions & { offset?: number, offsetEnd?: number }
): void {
    logger.log('openResource: ' + resource);
    vscode.window.showTextDocument(resource, options).then(
        (editor) => {
            if (options?.offset) {
                const startPosition = editor.document.positionAt(options.offset);
                const endPosition = options.offsetEnd ? editor.document.positionAt(options.offsetEnd): startPosition;
                editor.selection = new vscode.Selection(startPosition, endPosition);
            }
        }
    );
}

export function pathExists(path: string): boolean {
    try {
        fs.accessSync(path);
    } catch (err) {
        return false;
    }
    return true;
}