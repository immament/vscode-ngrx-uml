export interface DataProvider<T> {
    getData(): T[];
    hasData(): boolean;
}
