import { XRPLClient } from '@/libs/xrpl/client'

/**
 * XRPLからアカウントのXRP残高を取得するクラス
 */
export class XRPLBalance {
  /**
   * XRPLからアカウントのXRP残高を取得する
   * @param address XRPLアドレス
   * @param wss WebSocketサーバーURL
   * @returns XRP残高（文字列）- 丸め処理なし
   */
  static async getXRPBalance(address: string, wss: string): Promise<string> {
    const client = await XRPLClient.getInstance(wss)
    try {
      const response = await client.request({
        command: 'account_info',
        account: address,
        ledger_index: 'validated'
      })
      
      const balance = response.result.account_data.Balance
      const xrpBalance = (Number(balance) / 1000000).toString()
      
      return xrpBalance
    } catch (error) {
      console.error('[XRPLBalance] Error getting XRP balance: ', error)
      throw error
    }
  }
}
