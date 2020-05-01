import { CreateActionsDiagramService, GeneratorOptions } from 'ngrx-uml';

/* eslint-disable no-console */
export function useCreateActionsDiagramService(baseDir: string): void {
    
    console.log('#####################################################################');
    console.log('## Use CreateActionsDiagramService #################');
    const options: GeneratorOptions = {
        outDir: baseDir + '/out',
        imageFormat: 'off',
        baseDir: baseDir + '/',
        saveConvertResultToJson: false,
        saveWsd: true,
        logLevel: 'DEBUG'
    };
    const files = 'src/**/*.ts';
    const createActionsDiagramService = new CreateActionsDiagramService(options);
    createActionsDiagramService.generateDiagram(files);
}