export const USER_REPOSITORY_TOKEN_INJECTION = 'UserRepository';

export interface AuthorStats {
    id: string,
    name: string,
    totalArticles: number,
}

export interface UserRepository {

    getAllAuthorsStats(): Promise<AuthorStats[]>;
    // findById(id: string): Promise<User | null>;
    // findByEmail(email: string): Promise<User | null>;

}