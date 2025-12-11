export const AUTH_DOMAIN = 'rsup.local'

export function formatUsernameToEmail(username: string): string {
  const cleanUsername = username.toLowerCase().trim().replace(/\s+/g, '')
  return `${cleanUsername}@${AUTH_DOMAIN}`
}

export function extractUsernameFromEmail(email: string): string {
  return email.split('@')[0]
} 