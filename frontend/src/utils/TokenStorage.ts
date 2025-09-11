export default class TokenStorage {
    private static token: string | null = null;

    private static initialize() {
        const storadedToken = sessionStorage.getItem('accessToken');
        if (storadedToken) {
            TokenStorage.token = storadedToken;
        }
    }

    static getToken(): string | null {
        if (TokenStorage.token === null) {
            TokenStorage.initialize();
        }
        return TokenStorage.token;
    }

    static setToken(token: string): void {
        sessionStorage.setItem('accessToken', token);
        TokenStorage.token = token;
    }

    static clearToken() {
        sessionStorage.removeItem('accessToken');
        TokenStorage.token = null;
    }
}
