export class MicroserviceConnectionError extends Error {
    status: number;

    constructor(message: string) {
        super(message);
        this.name = 'MicroserviceConnection';
        this.message = message;
        this.status = 500;
    }
}
