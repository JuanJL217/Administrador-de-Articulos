export class ArticleTitleAlreadyExistsError extends Error {
    constructor(title: string) {
        super(`El autor ya tiene un artículo registrado con el título: "${title}"`);        
        this.name = 'ArticleTitleAlreadyExistsError';
        Object.setPrototypeOf(this, ArticleTitleAlreadyExistsError.prototype);
    }
}