import { RefreshSession } from "../entities/index.js";

export interface IRefreshSessionRepository {
  create(refreshSession: RefreshSession): Promise<RefreshSession>

  findById(id: string): Promise<RefreshSession | null>

  findByTokenHash(tokenHash: string): Promise<RefreshSession | null>

  findByUserId(userId: string): Promise<RefreshSession[]>

  findByFamilyId(familyId: string): Promise<RefreshSession[]>

  update(refreshSession: RefreshSession): Promise<RefreshSession>

  revoke(id: string, revokedAt: Date): Promise<void>

  revokeFamily(familyId: string, revokedAt: Date): Promise<void>;

  revokeByTokenHash(tokenHash: string, revokedAt: Date): Promise<void>;

  revokeAllByUserId(userId: string, revokedAt: Date): Promise<void>;

  rotate(sessionId: string, replacementSessionId: string, usedAt: Date): Promise<boolean>
}
