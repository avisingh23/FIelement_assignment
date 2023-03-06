export interface IApp {
    bootstrap(): Promise<void>;

    serve(): Promise<void>;
}
