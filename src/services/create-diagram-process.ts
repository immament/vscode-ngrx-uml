

import { CreateActionsDiagramService, GeneratorOptions } from 'ngrx-uml';

console.log('In fork');

process.on('message', (msg: any) => {
    // console.log('Message from parent:', msg);
    createActionsDiagramService(msg.filesPattern, msg.options);
    process.exit(0);
});


function createActionsDiagramService(filesPattern: string, options: GeneratorOptions): void {

    console.log('Generate start');
    const createActionsDiagramService = new CreateActionsDiagramService(options);
    createActionsDiagramService.generateDiagram(filesPattern);
}
