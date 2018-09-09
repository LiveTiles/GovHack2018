import * as moment from 'moment';
import { UserAgentApplication } from 'msal';

import config from 'config';

import { getUrlParameterByName, setHashParameters, timeout } from '../../util';

export type Token = string;

export const enum ValueStorageKeys {
    BotId = 'botId'
}

export interface StoredValueMap {
    [key: string]: string;
}

export interface User {
    id: string;
    name: string;
}

const enum TokenStorageKeys {
    BotValueKeys = 'BOT_VALUE_KEYS',
    TokenKey = 'BOTS_TOKEN',
    TokenExpiryKey = 'BOTS_TOKEN_EXPIRY_TIME'
}

interface JwtToken {
    name: string;
    preferred_username: string;
    exp: number;
    nbf: number;
    iat: number;

    aio: string;
    aud: string;
    iss: string;
    nonce: string;
    oid: string;
    sub: string;
    tid: string;
    ver: string;
}

export class AuthService {
    // tslint:disable-next-line:variable-name
    private static _api: UserAgentApplication;
    private static get api(): UserAgentApplication {
        let api = AuthService._api;
        if (!api) {
            api = new UserAgentApplication(
                config.clientId,
                '',
                (errorDes, token, error, tokenType) => { return; },
                {
                    navigateToLoginRequestUrl: false,
                    redirectUri: config.redirectUrl
                }
            );
            // Hack because I could not work out how specify the redirectUri on the constructor
            // tslint:disable-next-line:no-string-literal
            // api['_cacheStorage']['setItem']('msal.login.request', `//${location.host}/#`);
            AuthService._api = api;
        }

        return api;
    }

    static handleCallback(): boolean {
        const token = getUrlParameterByName('id_token');
        if (token) {
            AuthService.api.isCallback(window.location.hash);

            if (window.top) {
                AuthService.storeToken(token);

                const storedValues = AuthService.retrieveStoredValues();
                if (storedValues) {
                    setHashParameters(storedValues);
                }
            }

            return true;
        }

        return false;
    }

    static isValidAuthToken(token: string): boolean {
        const decodedToken = AuthService.parseJwt(token);
        if (!decodedToken) {
            return false;
        }

        const expiry = moment(decodedToken.exp);

        return !moment().isAfter(expiry);
    }

    static getUserFromAuthToken(token: string): User | null {
        const decodedToken = AuthService.parseJwt(token);

        return decodedToken
            ? {
                id: decodedToken.preferred_username,
                name: decodedToken.name
            }
            : null;
    }

    static async fetchToken(): Promise<Token | null> {
        try {
            let token = AuthService.retrieveToken();
            if (token) {
                return token;
            }

            AuthService.api.getUser();
            token = await AuthService.api.acquireTokenSilent([config.clientId]);

            AuthService.storeToken(token);

            return token;
        } catch {
            return null;
        }
    }

    static async fetchTokenLocal(): Promise<Token | null> {
        const token = AuthService.retrieveToken()!;
        return token;
    }

    static async login(valuesToStore?: StoredValueMap, embeded?: boolean): Promise<Token> {
        // tslint:disable-next-line:no-string-literal
        // AuthService.api['_redirectUri'] = config.redirectUrl;

        let token = '';
        if (window.top && embeded === false) {
            AuthService.storeValues(valuesToStore);

            AuthService.api.loginRedirect(config.scopes, 'botId=4b7010ae-bf75-4316-91bd-61ade22473eb');

            /* Redirecting, so code below logically shouldn't run. However, wait here
            so as to prevent null pointer exceptions when the function actually doesn't
            return a value */
            await timeout(10000);
        } else {
            token = await AuthService.api.loginPopup(config.scopes);
        }

        AuthService.storeToken(token);

        return token;
    }

    private static storeToken(token: string): void {
        localStorage.setItem(TokenStorageKeys.TokenKey, token);

        const { exp } = AuthService.parseJwt(token)!;
        const adjustedExpiry = moment(exp).subtract(5, 'minutes').utc().valueOf().toString();
        localStorage.setItem(TokenStorageKeys.TokenExpiryKey, adjustedExpiry);
    }

    private static retrieveToken(): string | null {
        let token: string | null;
        let expiryData: string | null;
        token = localStorage.getItem(TokenStorageKeys.TokenKey);
        if (token) {
            expiryData = localStorage.getItem(TokenStorageKeys.TokenExpiryKey);
            if (expiryData) {
                const expiry = moment(+expiryData);
                if (!moment().isAfter(expiry)) {
                    return token;
                }
            }
        }

        return null;
    }

    private static storeValues(values?: StoredValueMap): void {
        if (!values) {
            return;
        }

        const keys = Object.getOwnPropertyNames(values);
        for (let key of keys) {
            localStorage.setItem(key, values[key]);
        }
        localStorage.setItem(TokenStorageKeys.BotValueKeys, keys.join(','));
    }

    private static retrieveStoredValues(): StoredValueMap | null {
        const keyData = localStorage.getItem(TokenStorageKeys.BotValueKeys);
        if (!keyData) {
            return null;
        }

        const keyValueMap = {} as StoredValueMap;
        const keys = keyData.split(',');
        for (let key of keys) {
            const value = localStorage.getItem(key);
            if (value) {
                keyValueMap[key] = value;
                localStorage.removeItem(key);
            }
        }
        localStorage.removeItem(TokenStorageKeys.BotValueKeys);

        return keyValueMap;
    }

    private static parseJwt(token: string): JwtToken | null {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace('-', '+').replace('_', '/');
            const decodedToken = JSON.parse(atob(base64)) as JwtToken;
            decodedToken.exp *= 1000; // The expiry times seem to be stored in seconds
            decodedToken.nbf *= 1000;
            decodedToken.iat *= 1000;

            return decodedToken;
        } catch (error) {
            return null;
        }
    }

    private constructor() {}
}

export default AuthService;