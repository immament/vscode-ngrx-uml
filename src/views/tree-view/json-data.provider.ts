import fs from 'fs';

import logger from '../../utils/logger';
import { pathExists } from '../../utils/utils';

import { DataProvider } from './data-provider';

export class JsonDataProvider<T> implements DataProvider<T> {
    constructor(private readonly dataJsonPath: string) { }

    getData(): T[] {
        if (this.hasData()) {
            return JSON.parse(fs.readFileSync(this.dataJsonPath, 'utf-8'));
        }
        return [];
    }

    hasData() {
        const exists = pathExists(this.dataJsonPath);
        logger.log(`$pathExists ${this.dataJsonPath} [${exists}]`);
        return exists;
    }
}
