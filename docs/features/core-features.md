# 🔧 コア機能

## ウォレット連携 (GemWallet)
- ウォレット接続と状態管理
- アドレスとネットワーク情報の取得
- トランザクション署名と送信
- NFT管理機能

例:
```typescript
import { getAddress, getNetwork } from "@gemwallet/api";

// ユーザーのウォレットアドレスを取得
const addressResponse = await getAddress();
const address = addressResponse.result?.address;

// 現在のネットワーク情報を取得
const networkResponse = await getNetwork();
const network = networkResponse.result?.network;
```

## XRPL連携
- XRPレジャーとの直接連携
- トランザクションの送信と監視
- アカウント情報の取得
- ペイメントチャネル操作

例:
```typescript
import { Client } from "xrpl";

const client = new Client("wss://s.altnet.rippletest.net:51233");
await client.connect();

// アカウント情報を取得
const response = await client.request({
  command: "account_info",
  account: address,
  ledger_index: "validated",
});
```

## 取引インターフェース
- トークンペア選択
- 価格と数量入力
- スリッページ許容度設定
- トランザクション確認

## トランザクション管理
- トランザクションステータス追跡
- 過去のトランザクション表示
- エラーハンドリングと通知
