import { Client } from 'xrpl'

export class XRPLClient {
  private static instance: Client | null = null
  private static wss: string | null = null
  private static connectionPromise: Promise<void> | null = null

  private constructor() {}

  static async getInstance(wss: string): Promise<Client> {
    if (this.wss !== wss && this.instance) {
      await this.disconnect()
    }

    if (!this.instance) {
      this.instance = new Client(wss)
      this.wss = wss
      
      this.connectionPromise = this.instance.connect()
      
      try {
        await this.connectionPromise
      } catch (error) {
        console.error('[XRPLClient] Connection error:', error)
        this.instance = null
        this.wss = null
        this.connectionPromise = null
        throw error
      }
    } else if (this.connectionPromise) {
      try {
        await this.connectionPromise
      } catch (error) {
        console.error('[XRPLClient] Connection error:', error)
        throw error
      }
    }

    if (this.instance && !this.instance.isConnected()) {
      console.warn('[XRPLClient] Client not connected, reconnecting...')
      try {
        this.connectionPromise = this.instance.connect()
        await this.connectionPromise
      } catch (error) {
        console.error('[XRPLClient] Reconnection error:', error)
        this.instance = null
        this.wss = null
        this.connectionPromise = null
        throw error
      }
    }

    return this.instance
  }

  static async disconnect(): Promise<void> {
    if (this.instance) {
      try {
        await this.instance.disconnect()
      } catch (error) {
        console.error('[XRPLClient] Disconnect error:', error)
      } finally {
        this.instance = null
        this.wss = null
        this.connectionPromise = null
      }
    }
  }
}
