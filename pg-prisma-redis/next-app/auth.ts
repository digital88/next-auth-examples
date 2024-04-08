import NextAuth, { Profile } from "next-auth"
import type { OIDCConfig } from "@auth/core/providers"

export const {
    handlers: { GET, POST },
    auth,
} = NextAuth({
    providers: [
        {
            id: "this-is-unique-id",
            name: "Keycloak",
            type: "oidc",
            clientId: process.env.NEXT_AUTH_CLIENTID as string,
            clientSecret: process.env.NEXT_AUTH_CLIENTSECRET as string,
            issuer: process.env.NEXT_AUTH_ISSUER as string,
        } satisfies OIDCConfig<Profile>
    ],
})
