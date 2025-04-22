import { XRPLClient } from '@/libs/xrpl/client'

/**
 * XRPLからアカウントの残高を取得するクラス
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
        ledger_index: 'validated',
      })

      const balance = response.result.account_data.Balance
      const xrpBalance = (Number(balance) / 1000000).toString()

      return xrpBalance
    } catch (error) {
      console.error('[XRPLBalance] Error getting XRP balance: ', error)
      throw error
    }
  }

  /**
   * XRPLからアカウントのトークン残高を取得する
   * @param address XRPLアドレス
   * @param wss WebSocketサーバーURL
   * @param currency トークンの通貨コード
   * @param issuer トークンの発行者アドレス
   * @returns トークン残高（文字列）- 丸め処理なし
   */
  static async getTokenBalance(
    address: string,
    wss: string,
    currency: string,
    issuer: string,
  ): Promise<string> {
    if (currency === 'XRP' && issuer === 'XRP') {
      return this.getXRPBalance(address, wss)
    }

    const client = await XRPLClient.getInstance(wss)
    try {
      const response = await client.request({
        command: 'account_lines',
        account: address,
        ledger_index: 'validated',
        peer: issuer,
        limit: 400,
      })

      const trustline = response.result.lines.find(
        (line: any) => line.currency === currency && line.account === issuer,
      )

      if (trustline) {
        return trustline.balance
      }

      return '0'
    } catch (error) {
      console.error('[XRPLBalance] Error getting token balance: ', error)
      throw error
    }
  }
}
