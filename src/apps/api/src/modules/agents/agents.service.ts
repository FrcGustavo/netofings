import { Injectable } from '@nestjs/common';
import { DbService } from '../../db/db.service';

@Injectable()
export class AgentsService {
  constructor(private readonly dbService: DbService) {}

  async findAgentsByUser(user: { username?: string; admin?: boolean }) {
    const agentService = await this.dbService.getAgentService();

    if (user.admin) {
      return agentService.findConnected();
    }

    return agentService.findByUsername(user.username);
  }

  async findByUuid(uuid: string) {
    const agentService = await this.dbService.getAgentService();
    return agentService.findByUuid(uuid);
  }
}
