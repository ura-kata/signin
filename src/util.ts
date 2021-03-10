import CryptoJS from 'crypto-js';

export function base64URLEncode(base64: string): string {
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

export function createVerifier() {
  const base64 = CryptoJS.lib.WordArray.random(32).toString(
    CryptoJS.enc.Base64
  );
  return base64URLEncode(base64);
}

export function createChallenge(verifier: string): string {
  const base64 = CryptoJS.SHA256(verifier).toString(CryptoJS.enc.Base64);
  return base64URLEncode(base64);
}

export function checkState(state: string): boolean {
  const savedState = window.sessionStorage.getItem('state');

  return state === savedState;
}

export interface Token {
  access_token: string;
  refresh_token: string;
  id_token: string;
  token_type: string;
  expires_in: number;
}

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
