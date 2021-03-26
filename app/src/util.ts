import CryptoJS from 'crypto-js';
import { v4 as createUuid } from 'uuid';

const stateKey = 'state';
const verifierKey = 'verifier';

/** base64 を URL Encode する */
export function base64URLEncode(base64: string): string {
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

/** Verifier を作成 */
export function createVerifier(): string {
  const base64 = CryptoJS.lib.WordArray.random(32).toString(
    CryptoJS.enc.Base64
  );
  const verifier = base64URLEncode(base64);
  window.sessionStorage.setItem(verifierKey, verifier);
  return verifier;
}

/** Challenge を作成 */
export function createChallenge(verifier: string): string {
  const base64 = CryptoJS.SHA256(verifier).toString(CryptoJS.enc.Base64);
  return base64URLEncode(base64);
}

/** State を作成 */
export function createState(): string {
  const uuid = createUuid();
  window.sessionStorage.setItem(stateKey, uuid);
  return uuid;
}

export interface Token {
  access_token: string;
  refresh_token: string;
  id_token: string;
  token_type: string;
  expires_in: number;
}

/** Token を習得する */
export async function getToken(
  code: string,
  state: string
): Promise<Token | undefined> {
  const savedState = window.sessionStorage.getItem(stateKey);

  if (state !== savedState) {
    console.log('state is invalid.');
    return undefined;
  }

  const verifier = window.sessionStorage.getItem(verifierKey);
  if (!verifier) {
    console.log('verifier is not found.');
    return undefined;
  }

  const url = process.env.REACT_APP_TOKEN_URL as string;
  const clientId = process.env.REACT_APP_COGNITO_CLIENT_ID as string;
  const redirectUri = process.env.REACT_APP_CALLBACK_URL as string;
  const scope = process.env.REACT_APP_SCOPE as string;

  const body = [
    'grant_type=authorization_code',
    'client_id=' + clientId,
    'code=' + code,
    'redirect_uri=' + redirectUri,
    'scope=' + scope,
    'code_verifier=' + verifier,
  ].join('&');
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: body,
    });

    if (!response.ok) {
      console.log(response.status);
      console.log(await response.text());
      return undefined;
    }

    const json = await response.json();

    return json as Token;
  } catch (err) {
    console.log(err);
    return undefined;
  }
}

/** Cookie に Token を設定する */
export async function setTokenToCookie(token: Token): Promise<boolean> {
  const url = process.env.SETTING_COOKIE_URI as string;

  const headers = {
    'Content-Type': 'application/json',
  };

  const body = JSON.stringify({
    accessToken: token.access_token,
    refreshToken: token.refresh_token,
    idToken: token.id_token,
    expiresIn: token.expires_in,
  });

  try {
    // https://stackoverflow.com/questions/42710057/fetch-cannot-set-cookies-received-from-the-server
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: body,
      credentials: 'include',
    });

    if (!response.ok) {
      console.log(response.status);
      console.log(await response.text());
      return false;
    }

    return true;
  } catch (err) {
    console.log(err);
  }

  return false;
}

/** Google の SignIn URL を取得 */
export function getGoogleSignInUrl() {
  const url = process.env.REACT_APP_GOOGLE_SIGNIN_URL as string;
  const clientId = process.env.REACT_APP_COGNITO_CLIENT_ID as string;
  const redirectUri = process.env.REACT_APP_CALLBACK_URL as string;
  const scope = process.env.REACT_APP_SCOPE as string;

  const verifier = createVerifier();
  const challenge = createChallenge(verifier);
  const state = createState();

  return `${url}?${[
    'identity_provider=Google',
    'redirect_uri=' + redirectUri,
    'response_type=CODE',
    'client_id=' + clientId,
    'state=' + state,
    'code_challenge=' + challenge,
    'code_challenge_method=S256',
    'scope=' + scope,
  ].join('&')}`;
}
