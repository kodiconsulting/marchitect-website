// TODO: Replace this placeholder auth with real JWT verification (NextAuth/Clerk).
// Currently accepts `Authorization: Bearer <base64url-encoded-json>` where the
// JSON payload is { userId: string, role: string, workspaceIds: string[] }.
// This is NOT secure for production — it performs NO signature verification.

import { db as defaultDb, type DB } from './db'
import { workspaceApiKeys, workspaceMemberships } from './db/schema'
import { eq, and } from 'drizzle-orm'
import { createHash } from 'crypto'

export interface AuthPayload {
  userId: string
  role: string
  workspaceIds: string[]
}

/** Decode a base64url string to UTF-8 */
function base64urlDecode(str: string): string {
  // Pad to multiple of 4
  const padded = str.padEnd(str.length + ((4 - (str.length % 4)) % 4), '=')
  const base64 = padded.replace(/-/g, '+').replace(/_/g, '/')
  return Buffer.from(base64, 'base64').toString('utf8')
}

/** Hash an API key for lookup against the stored key_hash */
function hashApiKey(key: string): string {
  return createHash('sha256').update(key).digest('hex')
}

/**
 * Verify the incoming request.
 *
 * Auth order:
 * 1. x-api-key header → look up in workspace_api_keys, return scoped payload
 * 2. Authorization: Bearer <token> → decode base64url JSON payload
 *
 * Returns null if no valid auth is found.
 */
export async function verifyRequest(
  request: Request,
  db: DB = defaultDb
): Promise<AuthPayload | null> {
  // --- API key auth ---
  const apiKey = request.headers.get('x-api-key')
  if (apiKey) {
    const keyHash = hashApiKey(apiKey)
    const [keyRow] = await db
      .select()
      .from(workspaceApiKeys)
      .where(eq(workspaceApiKeys.keyHash, keyHash))
      .limit(1)
    if (keyRow) {
      // Update last_used_at in the background (fire-and-forget)
      db.update(workspaceApiKeys)
        .set({ lastUsedAt: new Date() })
        .where(eq(workspaceApiKeys.id, keyRow.id))
        .catch(() => {})
      return {
        userId: `api-key:${keyRow.id}`,
        role: 'api',
        workspaceIds: [keyRow.workspaceId],
      }
    }
    return null
  }

  // --- Bearer token auth ---
  const authHeader = request.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return null
  }
  const token = authHeader.slice(7)
  try {
    const decoded = base64urlDecode(token)
    const payload = JSON.parse(decoded) as unknown
    if (
      typeof payload !== 'object' ||
      payload === null ||
      typeof (payload as Record<string, unknown>).userId !== 'string' ||
      typeof (payload as Record<string, unknown>).role !== 'string' ||
      !Array.isArray((payload as Record<string, unknown>).workspaceIds)
    ) {
      return null
    }
    const p = payload as { userId: string; role: string; workspaceIds: unknown[] }
    return {
      userId: p.userId,
      role: p.role,
      workspaceIds: p.workspaceIds.filter((id): id is string => typeof id === 'string'),
    }
  } catch {
    return null
  }
}

/**
 * Like verifyRequest but throws a Response (401) if not authenticated.
 */
export async function requireAuth(
  request: Request,
  db: DB = defaultDb
): Promise<AuthPayload> {
  const payload = await verifyRequest(request, db)
  if (!payload) {
    throw Response.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return payload
}

/**
 * Verify that a user has membership in a workspace.
 * For API-key auth (userId starts with "api-key:"), the workspaceIds list
 * already carries the scope — callers should check that instead.
 * Throws a Response (403) if access is denied.
 */
export async function requireWorkspaceAccess(
  userId: string,
  workspaceId: string,
  db: DB = defaultDb
): Promise<void> {
  // API key users are already scoped by workspaceIds — skip membership table
  if (userId.startsWith('api-key:')) return

  const [membership] = await db
    .select()
    .from(workspaceMemberships)
    .where(
      and(
        eq(workspaceMemberships.userId, userId),
        eq(workspaceMemberships.workspaceId, workspaceId)
      )
    )
    .limit(1)

  if (!membership) {
    throw Response.json({ error: 'Forbidden' }, { status: 403 })
  }
}
