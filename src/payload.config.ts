import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { betterAuthPlugin } from 'payload-auth/better-auth/plugin'
import { emailOTP } from 'better-auth/plugins'
import { Resend } from 'resend'
import { s3Storage } from '@payloadcms/storage-s3'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Projects } from './collections/Projects'
import { Documents } from './collections/Documents'
import { Inquiries } from './collections/Inquiries'
import { Vendors } from './collections/Vendors'
import { VendorFieldSchema } from './collections/VendorFieldSchema'
import { RateItems } from './collections/RateItems'
import { Notices } from './collections/Notices'
import { PortfolioProjects } from './collections/PortfolioProjects'
import { Brands } from './collections/Brands'
import { ArchitectResources } from './collections/ArchitectResources'
import { Services } from './collections/Services'

import { LandingPage } from './globals/LandingPage'
import { AboutPage } from './globals/AboutPage'
import { PmcPage } from './globals/PmcPage'
import { SiteSettings } from './globals/SiteSettings'
import { Navigation } from './globals/Navigation'
import { Footer } from './globals/Footer'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const resend = new Resend(process.env.RESEND_API_KEY)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  routes: {
    admin: '/cms',
  },
  serverURL: process.env.BETTER_AUTH_URL ?? 'http://localhost:3000',
  collections: [
    Users,
    Media,
    Projects,
    Documents,
    Inquiries,
    Vendors,
    VendorFieldSchema,
    RateItems,
    Notices,
    PortfolioProjects,
    Brands,
    ArchitectResources,
    Services,
  ],
  globals: [LandingPage, AboutPage, PmcPage, SiteSettings, Navigation, Footer],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
    push: false,
  }),
  sharp,
  plugins: [
    s3Storage({
      bucket: process.env.S3_BUCKET_NAME!,
      config: {
        region: process.env.S3_REGION!,
        endpoint: process.env.S3_ENDPOINT!,
        forcePathStyle: true,
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID!,
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!
        },
      },
      collections: {
        [Media.slug]: {
          signedDownloads: {
            expiresIn: 60,
          },
        },
      },
    }) as any,
    betterAuthPlugin({
      users: {
        slug: 'users',
        adminRoles: ['admin'],
        defaultRole: 'client',
        defaultAdminRole: 'admin',
        roles: ['client', 'architect', 'admin'] as const,
        allowedFields: ['name', 'firmName', 'phone'],
      },
      adminInvitations: {
        sendInviteEmail: async ({ email, url }) => {
          await resend.emails.send({
            from: process.env.RESEND_FROM ?? 'noreply@mgarts.co.in',
            to: email,
            subject: 'You have been invited to MG Arts admin',
            text: `You have been invited to the MG Arts admin panel.\n\nAccept your invitation: ${url}\n\nThis link expires in 48 hours.`,
          })
          return { success: true }
        },
      },
      betterAuthOptions: {
        secret: process.env.BETTER_AUTH_SECRET!,
        baseURL: process.env.BETTER_AUTH_URL ?? 'http://localhost:3000',
        emailAndPassword: {
          enabled: true,
        },
        socialProviders: {
          google: {
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
          },
        },
        plugins: [
          emailOTP({
            otpLength: 6,
            expiresIn: 600,
            async sendVerificationOTP({ email, otp }) {
              await resend.emails.send({
                from: process.env.RESEND_FROM ?? 'noreply@mgarts.co.in',
                to: email,
                subject: 'Your MG Arts sign-in code',
                text: `Your sign-in code is: ${otp}\n\nThis code expires in 10 minutes.`,
              })
            },
          }),
        ],
        user: {
          additionalFields: {
            firmName: {
              type: 'string',
              required: false,
              input: true,
            },
            phone: {
              type: 'string',
              required: false,
              input: true,
            },
            approved: {
              type: 'boolean',
              defaultValue: false,
              input: false,
            },
          },
        },
      },
    }),
  ],
})
