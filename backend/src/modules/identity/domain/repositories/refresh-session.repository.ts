import { RefreshSession } from "../entities/index.js";

export interface RefreshSessionRepository {
  create(session: RefreshSession): Promise<RefreshSession>

  findById(id: string): Promise<RefreshSession | null>

  findByTokenHash(tokenHash: string): Promise<RefreshSession | null>

  findByUserId(userId: string): Promise<RefreshSession | null>

  update(session: RefreshSession): Promise<RefreshSession>

  revoke(id: string, revokedAt: Date): Promise<void>
}
