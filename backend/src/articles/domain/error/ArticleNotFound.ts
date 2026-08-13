export class ArticlNotFoundError extends Error {
    constructor(title: string) {
        super(`El autor ya tiene un artículo registrado con el título: "${title}"`);        
        this.name = 'ArticleNotFoundError';
        Object.setPrototypeOf(this, ArticlNotFoundError.prototype);
    }
}