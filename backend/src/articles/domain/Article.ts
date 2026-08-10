export interface DTOArticle {
    id: string;
    authorId: string;
    tittle: string;
    content: string;
    urlImage: string | undefined;
    createdAt: string
}

export class Article {

    constructor(
        private id : string,
        private authorId: string,
        private tittle: string,
        private content: string,
        private urlImage: string | undefined,
        private createdAt: Date
    ){}

    public static createArticle(data :{
        id: string,
        authorId: string,
        tittle: string,
        content: string,
        urlImage: string | undefined
    }): Article {

        return new Article(
            data.id,
            data.authorId,
            data.tittle,
            data.content,
            data.urlImage,
            new Date()
        )
    }

    public getId(): string {
        return this.id;
    }

    public getAuthorId(): string {
        return this.authorId;
    }

    public getTittle(): string {
        return this.tittle;
    }

    public getContent(): string {
        return this.content;
    }

    public getUrlImage(): string | undefined {
        return this.urlImage;
    }

    public belongsTo(authorId: string): boolean {
        return this.authorId === authorId;
    }

    getCreatedAt(): Date {
        return this.createdAt;
    }

    public update(data : {
        tittle: string,
        content: string,
        urlImage: string | undefined
    }): void {
        this.tittle = data.tittle;
        this.content = data.content;
        this.urlImage = data.urlImage;
    }


    public toPrimitives() : DTOArticle{
        return {
            id: this.id,
            authorId: this.authorId,
            tittle: this.tittle,
            content: this.content,
            urlImage: this.urlImage,
            createdAt: this.createdAt.toLocaleDateString()
        }
    }
}