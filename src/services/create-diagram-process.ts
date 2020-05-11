import { CreateActionsDiagramService, GeneratorOptions } from 'ngrx-uml';

process.on('message', (msg: any) => {
    console.log('Message from parent:', msg);
    createActionsDiagramService(msg.filesPattern, msg.options);
});

async function createActionsDiagramService(filesPattern: string, options: GeneratorOptions): Promise<void> {
    const createActionsDiagramService = new CreateActionsDiagramService(options);
    try {
        await createActionsDiagramService.generateDiagram(filesPattern);
        console.log('End');
        process.exit(0);
    } catch (error) {
        console.log(error);

        if (process.send) {
            process.send({ error: error.message || error });
        }
    }
}
