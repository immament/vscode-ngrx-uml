

import { CreateActionsDiagramService, GeneratorOptions } from 'ngrx-uml';

console.log('In fork');

process.on('message', (msg: any) => {
    // console.log('Message from parent:', msg);
    createActionsDiagramService(msg.options);
    process.exit(0);
});


function createActionsDiagramService(options: GeneratorOptions): void {

    const files = '**/*.ts';
    console.log('Generate start');
    const createActionsDiagramService = new CreateActionsDiagramService(options);
    createActionsDiagramService.generateDiagram(files);
}
