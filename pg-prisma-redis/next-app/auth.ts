import NextAuth, { Profile } from "next-auth"
import type { OIDCConfig } from "@auth/core/providers"
import { JWT } from "next-auth/jwt"

const KeycloakProviderId = "this-is-unique-id"

declare module 'next-auth/jwt' {
    interface JWT {
        id_token?: string
        provider?: string
    }
}

export const {
    handlers: { GET, POST },
    auth,
} = NextAuth({
    providers: [
        {
            id: KeycloakProviderId,
            name: "Keycloak", // any friendly name
            type: "oidc",
            // create new client (or use existing) in Keycloak, and copy its clientId and clientSecret to .env file
            clientId: process.env.NEXT_AUTH_CLIENTID as string,
            clientSecret: process.env.NEXT_AUTH_CLIENTSECRET as string,
            issuer: process.env.NEXT_AUTH_ISSUER as string, // by default this is master realm in Keycloak, something like this: https://localhost:8443/realms/master
            // don't forget to add this redirect uri to client settings in keycloak: http://localhost:3000/api/auth/callback/this-is-unique-id
        } satisfies OIDCConfig<Profile>
    ],
    callbacks: {
        jwt({ token, account }) {
            // Save id_token and provider values here. We need them to close user session in keycloak when user logs out from our app.
            // Otherwise keycloak will keep user session and will auto login user next time they will do signin in our app.
            // You may find this "feature" useful for your app. If you want to keep this behavior then comment out signOut event below.
            // See also: https://stackoverflow.com/questions/71872587/logout-from-next-auth-with-keycloak-provider-not-works
            if (account) {
                token.id_token = account.id_token // "eyJhbGc..."
                token.provider = account.provider // "this-is-unique-id"
            }
            return token;
        }
    },
    events: {
        async signOut(message) {
            // this code will close user session in Keycloak when they log out of our app.
            const msg = message as { token: JWT };
            const token = msg && msg.token
            if (token) {
                // You may have more than one auth provider defined. We have to check explicitly that user is logging out using Keycloak provider.
                // See also: https://stackoverflow.com/questions/71872587/logout-from-next-auth-with-keycloak-provider-not-works
                if (token.provider === KeycloakProviderId && token.id_token) {
                    const logOutUrl = new URL(`${process.env.NEXT_AUTH_ISSUER}/protocol/openid-connect/logout`)
                    logOutUrl.searchParams.set("id_token_hint", token.id_token)
                    await fetch(logOutUrl)
                }
            }
        }
    },
    session: {
        strategy: "jwt",
        maxAge: 60 * 30 // 30 min. This is default session timeout in keycloak. If session age in Keycloak and NextAuth are different, either of may happen:
        // 1. User are logged out of keycloak but their session in your app remains active.
        // 2. User are logged out of your app, but their session in keycloak remains active.
        // You must deside how you will be handling such cases. Look at implementing token rotation: https://authjs.dev/guides/refresh-token-rotation
    },
})
