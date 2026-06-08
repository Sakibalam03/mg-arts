import type { Access } from 'payload'

/** Works with role as string OR string[] (Payload stores it as array via payload-auth) */
export function hasRole(user: any, ...roles: string[]): boolean {
  const role = user?.role
  if (Array.isArray(role)) return roles.some((r) => role.includes(r))
  return roles.includes(role)
}

export const isAdmin: Access = ({ req }) => hasRole(req.user, 'admin')

export const isAdminOrArchitect: Access = ({ req }) => hasRole(req.user, 'admin', 'architect')
