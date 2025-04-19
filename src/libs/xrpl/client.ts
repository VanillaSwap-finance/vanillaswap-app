import { Client } from 'xrpl'

export class XRPLClient {
  private static instance: Client | null = null
  private static wss: string | null = null

  private constructor() {}

  static async getInstance(wss: string): Promise<Client> {
    if (this.wss !== wss && this.instance) {
      await this.disconnect()
    }

    if (!this.instance) {
      this.instance = new Client(wss)
      this.wss = wss
      await this.instance.connect()
    }

    return this.instance
  }

  static async disconnect(): Promise<void> {
    if (this.instance) {
      await this.instance.disconnect()
      this.instance = null
      this.wss = null
    }
  }
}
