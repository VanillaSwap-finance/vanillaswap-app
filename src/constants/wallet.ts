export enum WALLET_TYPES {
  GEM_WALLET = 'Gem Wallet',
  XAMAN = 'Xaman',
  CROSS_MARK = 'CROSS MARK',
}

export const WALLETS = [
  {
    label: WALLET_TYPES.GEM_WALLET,
    disabled: false,
  },
  {
    label: WALLET_TYPES.XAMAN,
    disabled: true,
  },
  {
    label: WALLET_TYPES.CROSS_MARK,
    disabled: true,
  },
]
