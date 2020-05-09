import { CreateActionsDiagramService, GeneratorOptions } from 'ngrx-uml';

process.on('message', (msg: any) => {
    console.log('Message from parent:', msg);
    createActionsDiagramService(msg.filesPattern, msg.options);
    console.log('END Message from parent --------------------');

   // process.exit(0);
});

async function createActionsDiagramService(filesPattern: string, options: GeneratorOptions): Promise<void> {
    const createActionsDiagramService = new CreateActionsDiagramService(options);
    return createActionsDiagramService.generateDiagram(filesPattern);
}
