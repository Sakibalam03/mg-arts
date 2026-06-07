// Stub for @better-auth/kysely-adapter — we use Payload's Drizzle adapter, not Kysely.
// This prevents Turbopack from bundling the SQLite dialects which import
// constants removed from kysely@0.29.x.
export {}
