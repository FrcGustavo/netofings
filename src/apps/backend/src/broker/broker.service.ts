import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { Aedes } from 'aedes';
import { createServer } from 'net';

@Injectable()
export class BrokerService implements OnModuleInit {
  private readonly logger = new Logger(BrokerService.name);
  private aedes!: Aedes;

  async onModuleInit() {
    const port = 1883;
    this.aedes = await Aedes.createBroker();
    const server = createServer(this.aedes.handle);

    server.listen(port, () => {
      this.logger.log(`MQTT broker listening on port ${port}`);
    });

    this.setupBrokerEvents();
  }

  private setupBrokerEvents() {
    this.aedes.on('client', (client) => {
      this.logger.log(`[+] Client Connected: ${client.id}`);
    });

    this.aedes.on('clientDisconnect', (client) => {
      this.logger.log(`[-] Client Disconnected: ${client.id}`);

      this.publishInternalMessage('', {
        agent: { uuid: client.id },
      });
    });
  }

  private publishInternalMessage(topic: string, payload: any) {
    this.aedes.publish(
      {
        topic,
        payload: Buffer.from(JSON.stringify(payload)),
        cmd: 'publish',
        qos: 0,
        dup: false,
        retain: false,
      },
      () => {
        //
      },
    );
  }
}
