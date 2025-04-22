# 🌐 API設計方針

## 基本方針

### 1. エンドポイントの配置
- すべての外部APIリクエストは `app/api` 配下で実装
- Next.jsのAPI Routesを活用し、CORSの問題を回避
- 外部API単位でディレクトリを構成

### 2. ディレクトリ構造

```text
app/
└── api/
    ├── xrplmeta/              # XRPLMeta API関連
    │   ├── tokens/
    │   │   └── route.ts      # トークン一覧取得
    │   ├── market/
    │   │   └── route.ts      # 市場データ取得
    │   └── metadata/
    │       └── route.ts      # メタデータ取得
    │
    ├── xrpl/                  # XRPL API関連
    │   ├── account/
    │   │   └── route.ts      # アカウント情報取得
    │   └── transactions/
    │       └── route.ts      # トランザクション関連
    │
    └── binance/              # Binance API関連
        ├── market/
        │   └── route.ts      # 市場データ取得
        └── trades/
            └── route.ts      # 取引履歴取得
```

### 3. APIルートの実装パターン

```typescript
// app/api/xrplmeta/tokens/route.ts
import { NextResponse } from 'next/server'
import { XRPLMetaClient } from '@/libs/xrplmeta'

export async function GET(request: Request) {
  try {
    const client = new XRPLMetaClient()
    const result = await client.listTokens()
    
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      { error: 'XRPLMetaでエラーが発生しました' },
      { status: 500 }
    )
  }
}
```

## CORS対策

### 1. なぜapp/apiを使用するのか
- フロントエンドとバックエンドが同一オリジンとなり、CORS問題を回避
- 機密情報（APIキーなど）をクライアントに露出させない
- レート制限やキャッシュなどのミドルウェア機能を実装可能

### 2. セキュリティ考慮事項
- 環境変数は外部APIごとに明確に分離
```env
# .env.local
XRPLMETA_API_KEY=xxx
XRPLMETA_API_URL=https://...

BINANCE_API_KEY=xxx
BINANCE_API_SECRET=xxx
BINANCE_API_URL=https://...
```
- APIキーやシークレットは必ずサーバーサイドでのみ使用
- 必要に応じて外部APIごとにレート制限を実装

### 3. エラーハンドリング

```typescript
// app/api/xrplmeta/market/route.ts
import { XRPLMetaError } from '@/libs/errors'

export async function GET(request: Request) {
  try {
    // API処理
  } catch (error) {
    if (error instanceof XRPLMetaError) {
      return NextResponse.json(
        { error: 'XRPLMetaのレート制限を超過しました' },
        { status: 429 }
      )
    }
    
    if (error instanceof ValidationError) {
      return NextResponse.json(
        { error: 'パラメータが不正です' },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: '内部サーバーエラー' },
      { status: 500 }
    )
  }
}
```

## キャッシュ戦略

### 1. 外部APIごとのキャッシュ設定

```typescript
// app/api/xrplmeta/market/route.ts
export async function GET(request: Request) {
  const response = NextResponse.json(data)
  // XRPLMeta市場データ用のキャッシュ設定
  response.headers.set('Cache-Control', 's-maxage=60, stale-while-revalidate')
  return response
}

// app/api/binance/market/route.ts
export async function GET(request: Request) {
  const response = NextResponse.json(data)
  // Binance市場データ用のキャッシュ設定（より短い間隔）
  response.headers.set('Cache-Control', 's-maxage=10, stale-while-revalidate')
  return response
}
```

### 2. キャッシュ期間の設定指針

| API | データタイプ | キャッシュ期間 | 更新戦略 |
|-----|------------|--------------|----------|
| XRPLMeta | 市場データ | 1分 | stale-while-revalidate |
| XRPLMeta | メタデータ | 1時間 | キャッシュ優先 |
| Binance | 市場データ | 10秒 | stale-while-revalidate |
| XRPL | アカウント情報 | 10秒 | stale-while-revalidate |

## パフォーマンス最適化

### 1. レスポンスの最適化
- 必要なデータのみを返す
- 大きなレスポンスは圧縮を検討
- 外部APIごとに適切なページネーション実装

### 2. バッチ処理
- 複数のリクエストを1回のAPIコールにまとめる
- N+1問題の回避
- 外部APIの制限を考慮したバッチサイズの設定

## 今後の展開

### 1. 追加検討事項
- GraphQLの導入検討（複数の外部APIのデータを効率的に統合）
- WebSocketサポート（Binanceのリアルタイムデータなど）
- マイクロサービス化（外部APIごとのサービス分割が容易）

### 2. バージョニング戦略
- URLベースのバージョニング（/api/v1/xrplmeta/...）
- 下位互換性の維持
