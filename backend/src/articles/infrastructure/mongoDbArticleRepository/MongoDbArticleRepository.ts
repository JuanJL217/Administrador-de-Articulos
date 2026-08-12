import { inject, injectable } from "tsyringe";
import { MongoDbRepository } from "../../../infrastructure/database/MongoDbRepository";
import { Article } from "../../domain/Article";
import type { ArticleFilters, ArticleRepository, PaginatedArticlesResult, PaginationOptions } from "../../domain/interfaces/ArticleRepository";
import type { DATA_BASE_TOKEN_INJECTION } from "../../../infrastructure/container/AppContainer";
import type { Db } from "mongodb";

@injectable()
export class MongoDbArticleRepository extends MongoDbRepository<Article> implements ArticleRepository {

    constructor(
        @inject("Db")
        db: Db
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
            doc.title,
            doc.content,
            doc.urlImage,
            new Date(doc.createdAt)
        );
    }

    protected toPersistence(article: Article): any {
        return {
            _id: article.getId(),
            authorId: article.getAuthorId(),
            title: article.getTitle(),
            content: article.getContent(),
            urlImage: article.getUrlImage(),
            createdAt: article.getCreatedAt().toISOString()
        }
    }

    public async getArticlesFiltered(filters: ArticleFilters): Promise<PaginatedArticlesResult> {
        const { options: { page, limit }, author, title, content } = filters;
        const skip = (page - 1) * limit;
        const query: any = {};

        if (author) {

            const matchingUsers = await this.db.collection('user').find(
                { name: { $regex: author, $options: 'i' } },
                { projection: { _id: 1 } } 
            ).toArray();

            const authorIds = matchingUsers.map(user => user._id);
            
            query.authorId = { $in: authorIds };
        }

        if (title) query.title = { $regex: title, $options: 'i' };
        if (content) query.content = { $regex: content, $options: 'i' };

        const [docs, total] = await Promise.all([
            this.collection()
                .find(query)
                .skip(skip)
                .limit(limit)
                .toArray(),
            this.collection().countDocuments(query)
        ]);

        return {
            data: docs.map(doc => this.toDomain(doc)),
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        };
    }

    public async findById(id: string): Promise<Article | null> {
        const doc = await this.collection().findOne({ _id: id as any });
        if (!doc) return null;
        return this.toDomain(doc);
    }

    public async findTitleByAuthor(authorId: string, title: string): Promise<Article | null> {
        const doc = await this.collection().findOne({ authorId: authorId as any, title: title });
        if (!doc) return null;
        return this.toDomain(doc);
    }

    public async getArticlesByUserId(authorId: string, options: PaginationOptions): Promise<PaginatedArticlesResult> {
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