export default class TokenStorage {
    private static token: string | null = null;

    static setToken(token: string) {
        TokenStorage.token = token;
    }

    static getToken() {
        return TokenStorage.token;
    }

    static clearToken() {
        TokenStorage.token = null;
    }

    static hasToken() {
        return TokenStorage.token === null ? false : true;
    }
}
