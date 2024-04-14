import { KeycloakProviderId } from "@/const"
import prisma from "@/db/prisma"
import { ensureRedisConnected, sessionRepository } from "@/db/redis"
import type { Adapter } from "next-auth/adapters"

const getUserByEmail = async function (email: string) {
    const user = await prisma.user.findUnique({
        where: {
            email
        }
    })
    return user
}

const getUser = async function (id: string) {
    return await prisma.user.findUnique({
        where: {
            id
        }
    })
}

export default {
    getUserByEmail,
    getUser,
    async createUser(user) {
        if (user.email == null || user.email?.trim() === "") throw new Error(`User must have email assigned.`)
        const existingUser = await getUserByEmail(user.email)
        if (existingUser?.email != null) throw new Error(`User with email ${existingUser?.email} already exists in database.`)
        const newUser = await prisma.user.create({
            data: {
                email: user.email,
                emailVerified: null,
                name: user.name,
                image: user.image
            }
        })
        return newUser
    },
    async getUserByAccount({ provider, providerAccountId }) {
        if (provider !== KeycloakProviderId) throw new Error(`Invalid provider id: ${provider}`)
        // We are using Keycloak, our providerAccountId will have this value:
        // oauth/oidc: The OAuth account's id, returned from the profile() callback.
        const account = await prisma.account.findFirst({ // Lets assume that there is only one account with id=providerAccountId
            where: {
                providerAccountId: providerAccountId
            }
        })
        if (account == null) return null
        return await prisma.user.findFirst({
            where: {
                id: account.userId
            }
        })
    },
    async updateUser(user) {
        return await prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                name: user.name,
                image: user.image,
                emailVerified: user.emailVerified,
                // We don't allow to change users email in this example.
            }
        })
    },
    async linkAccount(account) {
        const existing = await prisma.account.findFirst({
            where: {
                userId: account.userId
            }
        })
        if (existing) return
        //throw new Error(`Account already exists. provider=${account.provider}, providerAccountId=${account.providerAccountId}, userId=${account.userId}`)
        await prisma.account.create({
            data: {
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                type: account.type,
                userId: account.userId
            }
        })
    },
    async createSession(session) {
        const { sessionToken, expires, userId } = session
        if (!userId) throw new Error("Can't create new session with empty userId.")
        const user = await getUser(userId)
        if (!user) throw new Error(`Can't create new session. User with id=${userId} not found.`)
        await ensureRedisConnected()
        await sessionRepository.save(sessionToken, {
            sessionToken,
            expires,
            userId,
            userEmail: user.email,
            userEmailVerified: user.emailVerified,
            userName: user.name,
            userImage: user.image
        })
        return session
    },
    async getSessionAndUser(sessionToken) {
        await ensureRedisConnected()
        const session = await sessionRepository.fetch(sessionToken)
        if (!session) return null
        const sessionTokenInCache = session["sessionToken"] as string
        if (!sessionTokenInCache) return null
        return {
            session: {
                sessionToken: sessionTokenInCache,
                userId: session["userId"] as string,
                expires: session["expires"] as Date,
            },
            user: {
                id: session["userId"] as string,
                email: session["userEmail"] as string,
                emailVerified: session["userEmailVerified"] as Date,
                name: session["userName"] as string,
                image: session["userImage"] as string,
            }
        }
    },
    async updateSession({ sessionToken, expires, userId }) {
        await ensureRedisConnected()
        const session = await sessionRepository.fetch(sessionToken)
        if (!session) return null
        if (userId) {
            const user = await getUser(userId)
            if (user) {
                session["userEmail"] = user.email
                session["userEmailVerified"] = user.emailVerified
                session["userName"] = user.name
                session["userImage"] = user.image
            }
        }
        session["expires"] = expires
        session["userId"] = userId
        await sessionRepository.save(session)
    },
    async deleteSession(sessionToken) {
        await ensureRedisConnected()
        const existingSession = await sessionRepository.fetch(sessionToken)
        await sessionRepository.remove(sessionToken)
        return {
            sessionToken: existingSession["sessionToken"] as string,
            userId: existingSession["userId"] as string,
            expires: existingSession["expires"] as Date,
        }
    }
} satisfies Adapter
