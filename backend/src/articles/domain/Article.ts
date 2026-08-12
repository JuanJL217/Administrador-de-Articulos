export interface DTOArticle {
    id: string,
    title: string,
    content: string,
    urlImage?: string
}

export class Article {

    constructor(
        private id : string,
        private authorId: string,
        private title: string,
        private content: string,
        private urlImage: string | undefined,
        private createdAt: Date
    ){}

    public static createArticle(data :{
        id: string,
        authorId: string,
        title: string,
        content: string,
        urlImage: string | undefined
    }): Article {

        return new Article(
            data.id,
            data.authorId,
            data.title,
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

    public getTitle(): string {
        return this.title;
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
        title: string,
        content: string,
        urlImage: string | undefined
    }): void {
        this.title = data.title;
        this.content = data.content;
        this.urlImage = data.urlImage;
    }

    public getPublicData() {
        return {
            id: this.id,
            title: this.title,
            content: this.content,
            urlImage: this.urlImage
        }
    }

    public getPrivateData() {
        return {
            authorId: this.authorId,
            createdAt: this.createdAt.toLocaleDateString(),
        }
    }

    public publicData() : DTOArticle {
        return {
            id: this.id,
            title: this.title,
            content: this.content,
            urlImage: this.urlImage
        }
    }

    public getData() {
        return {
            ...this.publicData(),
            authorId: this.authorId,
            createdAt: this.createdAt.toLocaleDateString()
        }
    }
}