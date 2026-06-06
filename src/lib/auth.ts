import { getPayloadAuth } from 'payload-auth/better-auth/plugin'
import configPromise from '@payload-config'

const payload = await getPayloadAuth(configPromise)

export const auth = payload.betterAuth

export type Session = typeof auth.$Infer.Session
