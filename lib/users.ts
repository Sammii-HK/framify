import { prisma } from '@/lib/prisma'
import { encrypt, decrypt } from '@/lib/encryption'

/**
 * Find or create a user from Auth0 session data.
 * PII (email, name) is encrypted at rest in the database.
 */
export async function findOrCreateUser(auth0User: {
  sub: string
  email?: string | null
  name?: string | null
}) {
  const auth0Id = auth0User.sub

  // Look up by Auth0 ID first (stored as the user ID)
  let user = await prisma.user.findFirst({
    where: { id: auth0Id },
  })

  if (user) {
    return {
      ...user,
      email: decrypt(user.email),
      name: user.name ? decrypt(user.name) : null,
      stripeCustomerId: user.stripeCustomerId ? decrypt(user.stripeCustomerId) : null,
    }
  }

  // New user — encrypt PII and create
  user = await prisma.user.create({
    data: {
      id: auth0Id,
      email: encrypt(auth0User.email || ''),
      name: auth0User.name ? encrypt(auth0User.name) : null,
    },
  })

  return {
    ...user,
    email: decrypt(user.email),
    name: user.name ? decrypt(user.name) : null,
    stripeCustomerId: null,
  }
}

/**
 * Get a decrypted user by ID
 */
export async function getDecryptedUser(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) return null

  return {
    ...user,
    email: decrypt(user.email),
    name: user.name ? decrypt(user.name) : null,
    stripeCustomerId: user.stripeCustomerId ? decrypt(user.stripeCustomerId) : null,
  }
}

/**
 * Update encrypted Stripe customer ID
 */
export async function setStripeCustomerId(userId: string, stripeCustomerId: string) {
  return prisma.user.update({
    where: { id: userId },
    data: { stripeCustomerId: encrypt(stripeCustomerId) },
  })
}
