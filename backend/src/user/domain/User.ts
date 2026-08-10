
export class User {

    constructor(
        private id: string,
        private name: string,
        private email: string,
    ) {}

    public getId(): string {
        return this.id;
    }

    public getName(): string {
        return this.name;
    }

    public getEmail(): string {
        return this.email;
    }

}