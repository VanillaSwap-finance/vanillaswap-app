import { Client } from 'xrpl'

/**
 * XRPLからアカウントのXRP残高を取得する
 * @param address XRPLアドレス
 * @param wss WebSocketサーバーURL
 * @returns XRP残高（文字列）
 */
export const getXRPLBalance = async (
  address: string,
  wss: string,
): Promise<string> => {
  try {
    const client = new Client(wss)
    await client.connect()

    const response = await client.request({
      command: 'account_info',
      account: address,
      ledger_index: 'validated',
    })

    await client.disconnect()

    const balance = response.result.account_data.Balance
    const xrpBalance = (parseInt(balance) / 1000000).toFixed(3)

    return xrpBalance
  } catch (error) {
    console.error('[getXRPLBalance] Error getting balance: ', error)
    return '0.000'
  }
}
