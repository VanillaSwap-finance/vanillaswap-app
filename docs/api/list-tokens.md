# XRPLMeta API仕様 - List Tokens

トークンのリストと、それらの市場データとメタデータの概要を取得します。

> 📘 公式ドキュメント: [List Tokens - XRPL META](https://xrplmeta.org/docs/rest/list-tokens)

## エンドポイント

```typescript
GET https://s1.xrplmeta.org/tokens
```

## クエリパラメータ

| パラメータ | 型 | 説明 | デフォルト値 |
|------------|-----|------|--------------|
| `name_like` | `string` | トークンをフィルタリングするための検索語 | - |
| `expand_meta` | `boolean` | ソースを含む完全なメタデータセットを返すかどうか | `false` |
| `include_changes` | `boolean` | 時間経過による指標の変化を含めるかどうか | `false` |
| `sort_by` | `string` | トークンリストのソート基準となる指標 | `"trustlines"` |
| `trust_level` | `Array<0 \| 1 \| 2 \| 3>` | 指定された信頼レベルを持つトークンのみを返す | `[0,1,2,3]` |
| `limit` | `number` | 返されるトークンの数を制限 | `100` |
| `offset` | `number` | ページネーション用のオフセット | `0` |

### `sort_by`で使用可能な値
- `trustlines`
- `holders`
- `supply`
- `marketcap`
- `[metric]_delta_24h`
- `[metric]_percent_24h`
- `[metric]_delta_7d`
- `[metric]_percent_7d`

## 使用例

### cURLでの例

```bash
# 基本的な検索
curl "https://s1.xrplmeta.org/tokens?name_like=Mimimi"

# 信頼レベルとソートの指定
curl "https://s1.xrplmeta.org/tokens?trust_level=2,3&sort_by=marketcap"

# ページネーション
curl "https://s1.xrplmeta.org/tokens?limit=20&offset=40"
```

### TypeScriptでの例

```typescript
// 基本的な使用例
const response = await tokensApi.listTokens({
  name_like: 'USD',
  sort_by: 'marketcap',
  limit: 20
});

// 信頼レベルでフィルタリング
const response = await tokensApi.listTokens({
  trust_level: [2, 3] as Array<0 | 1 | 2 | 3>,
  include_changes: true
});

// ページネーション
const response = await tokensApi.listTokens({
  limit: 50,
  offset: 100  // 3ページ目を取得
});
```

## レスポンス

### 成功時のレスポンス例

```json
{
  "count": 1,
  "tokens": [
    {
      "currency": "4D494D494D490000000000000000000000000000",
      "issuer": "rMTnMGHk7k7brMC3vUNn7uP9t7WtLEdZUw",
      "meta": {
        "token": {
          "description": "The money-attracting cat has arrived. Greedy cats rule the meme world.",
          "icon": "https://s1.xrplmeta.org/icon/EF36484F71.png",
          "name": "MimimiCoin",
          "weblinks": [
            {
              "url": "https://mimimi-meme.vercel.app/",
              "title": "Official Website"
            }
          ]
        },
        "issuer": {
          "kyc": false,
          "name": "MimimiCoin",
          "domain": "6d696d696d692d636f696e2e73332e61702d6e6f727468656173742d312e616d617a6f6e6177732e636f6d"
        }
      },
      "metrics": {
        "trustlines": 4,
        "holders": 2,
        "supply": "91666666.6207598",
        "marketcap": "90.6721267086412",
        "price": "0.000000989150473680544",
        "volume_24h": "0",
        "volume_7d": "0",
        "exchanges_24h": "0",
        "exchanges_7d": "0",
        "takers_24h": "0",
        "takers_7d": "0"
      }
    }
  ]
}
```

### エラーレスポンス

| ステータスコード | 説明 |
|-----------------|------|
| 400 | 不正なリクエストパラメータ |
| 404 | リソースが見つからない |
| 500 | サーバーエラー |

## 注意事項

1. **`sort_by`パラメータ**
   - `[metric]`には以下のいずれかを指定可能：
     - `trustlines`
     - `holders`
     - `supply`
     - `marketcap`

2. **`trust_level`の値**
   - 0: 未検証
   - 1: 低信頼
   - 2: 中信頼
   - 3: 高信頼

3. **ページネーションのベストプラクティス**
   - 適切な`limit`値の設定（推奨: 20-50）
   - `offset`の段階的な増加
   - レスポンスの`count`を使用した総ページ数の計算
   