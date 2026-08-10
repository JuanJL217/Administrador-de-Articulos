import { inject, injectable } from "tsyringe";
import { MongoDbRepository } from "../../../infrastructure/database/MongoDbRepository";
import { Article } from "../../domain/Article";
import type { ArticleRepository, PaginatedArticlesResult, PaginationOptions } from "../../domain/interfaces/ArticleRepository";
import type { DATA_BASE_TOKEN_INJECTION } from "../../../infrastructure/container/AppContainer";
import type { Db } from "mongodb";

@injectable()
export class MongoDbArticleRepository extends MongoDbRepository<Article> implements ArticleRepository {

    constructor(
        @inject("Db") db: Db
    ) {
        super(db); 
    }

    protected collectionName(): string {
        return 'article';
    }

    protected toDomain(doc: any): Article {
        return new Article(
            doc._id.toString(),
            doc.authorId.toString(),
            doc.tittle,
            doc.content,
            doc.urlImage,
            new Date(doc.createdAt)
        );
    }

    protected toPersistence(article: Article): any {
        return {
            _id: article.getId(),
            authorId: article.getAuthorId(),
            tittle: article.getTittle(),
            content: article.getContent(),
            urlImage: article.getUrlImage(),
            createdAt: article.getCreatedAt().toISOString()
        }
    }

    public async findById(id: string): Promise<Article | null> {
        const doc = await this.collection().findOne({ _id: id as any });
        if (!doc) return null;
        return this.toDomain(doc);
    }

    public async findByAuthorAndTitle(authorId: string, title: string): Promise<Article | null> {
        const doc = await this.collection().findOne({ authorId: authorId as any, tittle: title });
        if (!doc) return null;
        return this.toDomain(doc);
    }

    public async getAllArticles({ page, limit }: PaginationOptions): Promise<PaginatedArticlesResult> {
        const skip = (page - 1) * limit;

        const [docs, total] = await Promise.all([
            this.collection()
                .find({})
                .skip(skip)
                .limit(limit)
                .toArray(),
            this.collection().countDocuments({})
        ]);
        console.log(docs)
        return {
            data: docs.map(doc => this.toDomain(doc)),
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        };
    }

    public async findArticlesWithAuthorId(authorId: string, options: PaginationOptions): Promise<PaginatedArticlesResult> {
        const { page, limit } = options;
        const skip = (page - 1) * limit;
            const filter = { authorId };

            const [docs, total] = await Promise.all([
                this.collection()
                    .find(filter)
                    .skip(skip)
                    .limit(limit)
                    .toArray(),
                this.collection().countDocuments(filter)
            ]);

            return {
                data: docs.map(doc => this.toDomain(doc)),
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            };
    }

    public async delete(article: Article): Promise<void> {
        await this.collection().deleteOne({ _id: article.getId() as any });
    }

    public async save(article: Article): Promise<void> {
        const persistenceData = this.toPersistence(article);
        await this.collection().updateOne(
            { _id: article.getId() as any },
            { $set: persistenceData },
            { upsert: true }
        );
    }
}