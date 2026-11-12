import { injectable } from "tsyringe"
import { OutboxRepository } from "./outbox.repository.js";
import { CreateOutboxEventInput, OutboxTransactionClient } from "./outbox.types.js";

@injectable()
export class OutboxService {
  constructor(

    private readonly repository: OutboxRepository

  ) { }

  async save(input: CreateOutboxEventInput, tx: OutboxTransactionClient): Promise<void> {
    await this.repository.create(input, tx)
  }
}
