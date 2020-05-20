import { GeneratorOptions } from 'ngrx-uml';

export interface OutputConfiguration {
    outDir: string;
    imageFormat: string;
    generateDiagramImages: boolean;
    generateJsonFiles: boolean;
    generateWsdFiles: boolean;
}

export interface InputConfiguration {
    workspaceFolder: string;
    includeFiles: string;
    ignoreFiles: string[];
    tsConfigFile: string;
    baseDir: string;
}

export interface GeneralConfiguration {
    clickableLinks: boolean;
    logLevel: GeneratorOptions;
}

export interface Configuration {
    output: OutputConfiguration;
    input: InputConfiguration;
    general: GeneralConfiguration;

}