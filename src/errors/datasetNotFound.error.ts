export class DatasetNotFound extends Error {
    status: number;

    constructor(message: string) {
        super(message);
        this.name = 'DatasetNotFound';
        this.message = message;
        this.status = 404;
    }
}
