export class CreateAgentDto {
  uuid!: string;
  username!: string;
  name!: string;
  hostname!: string;
  pid!: number;
  connected?: boolean;
}
