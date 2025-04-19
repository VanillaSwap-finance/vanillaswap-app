import { XRPLClient } from '@/libs/xrpl/client'

export class XRPLBalance {
  static async getXRPBalance(address: string, wss: string): Promise<number> {
    const client = await XRPLClient.getInstance(wss)
    try {
      const response = await client.request({
        command: 'account_info',
        account: address,
        ledger_index: 'validated'
      })
      
      return Number(response.result.account_data.Balance) / 1000000
    } catch (error) {
      console.error('[XRPLBalance] Error getting XRP balance: ', error)
      throw error
    }
  }
}
