import Auth0 from "react-native-auth0";
let jwt_decode = require("jwt-decode");

export let auth0 = new Auth0({
  domain: "zordon.auth0.com",
  clientId: "eAIg25s5501ZKgmHJ4vVcgAG6f4KjyhO"
});

export type Auth0AuthToken = {
  // Auth0 identifier as found in our JELLY_USER table.
  sub: string;
};

export type Auth0IdToken = {
  // Email used to sign up.
  email: string;

  // Auth0 identifier as found in our JELLY_USER table.
  sub: string;
};

export function decodeAuthToken(authToken: any): Auth0AuthToken {
  return jwt_decode(authToken) as Auth0AuthToken;
}

export function decodeIdToken(idToken: any): Auth0IdToken {
  return jwt_decode(idToken) as Auth0IdToken;
}
