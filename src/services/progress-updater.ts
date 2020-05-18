import vscode from 'vscode';

export class ProgressUpdater implements vscode.Disposable {
    private progressInterval?: NodeJS.Timeout;
    private readonly updateProgressInterval = 500;
    private progressText: string;
    constructor(progress: vscode.Progress<{
        message?: string | undefined;
        increment?: number | undefined;
    }>) {
        this.progressText = 'Starting up...';
        this.progressInterval = this.createProgressInterval(progress);
    }
    update(text: string) {
        this.progressText = text;
    }
    dispose() {
        if (this.progressInterval) {
            clearInterval(this.progressInterval);
            this.progressInterval = undefined;
        }
    }
    private createProgressInterval(progress: vscode.Progress<{
        message?: string | undefined;
        increment?: number | undefined;
    }>) {
        return setInterval(() => progress.report({ message: this.progressText }), this.updateProgressInterval);
    }
}
