# 🚨 エラーハンドリング

アプリケーションでは `notistack` をエラー通知に使用し、`PageLayout` コンポーネントで設定しています。すべてのエラーハンドリングは次のパターンに従うべきです：

## グローバル設定

```typescript
// src/components/features/layout/PageLayout/index.tsx
<SnackbarProvider
  maxSnack={3}
  autoHideDuration={3000}
  action={(snackbarId) => (
    <button onClick={() => closeSnackbar(snackbarId)}>
      Close
    </button>
  )}
>
  {children}
</SnackbarProvider>
```

## エラーハンドリングパターン

1. **フック/サービス内**: 説明的なメッセージでエラーをスローする
```typescript
// useWallet フックの例
try {
  // ... ウォレット接続ロジック
} catch (error: any) {
  console.error('[useWallet] Error connecting to wallet: ', error)
  throw error
}
```

2. **コンポーネント内**: エラーをキャッチし、notistackで表示する
```typescript
// WalletConnectDialog の例
try {
  await connect(wallet.label as WalletType)
} catch (error: any) {
  enqueueSnackbar(error.message, {
    variant: 'error',
  })
} finally {
  onClose()
}
```

## エラーバリアント

通知の種類に応じて適切なバリアントを使用します：
- `error`: エラーメッセージ
- `warning`: 警告メッセージ
- `info`: 情報メッセージ
- `success`: 成功メッセージ

例:
```typescript
import { enqueueSnackbar } from 'notistack'

// エラー通知
enqueueSnackbar('ウォレット接続に失敗しました', { variant: 'error' })

// 成功通知
enqueueSnackbar('ウォレットに正常に接続されました', { variant: 'success' })

// 警告通知
enqueueSnackbar('ネットワーク接続が不安定です', { variant: 'warning' })

// 情報通知
enqueueSnackbar('ウォレットでトランザクションを確認してください', { variant: 'info' })
```

## 一般的なエラーシナリオ

1. **ウォレット接続エラー**
```typescript
// ウォレットがインストールされていない
throw new Error('GemWallet がインストールされていません')

// ユーザーがリクエストを拒否した
throw new Error('ユーザーがリクエストを拒否しました')

// ネットワークエラー
throw new Error('ネットワークに接続できませんでした')
```

2. **トランザクションエラー**
```typescript
// 残高不足
throw new Error('トランザクションに対する残高が不足しています')

// トランザクション失敗
throw new Error('トランザクションの実行に失敗しました')

// ネットワーク混雑
throw new Error('ネットワークが混雑しています。後でもう一度お試しください')
```

3. **API エラー**
```typescript
// XRPL ノード接続エラー
throw new Error('XRPL ノードに接続できませんでした')

// 無効なレスポンス
throw new Error('サーバーからの無効なレスポンス')
```

## ベストプラクティス

1. **エラーログ記録**
   - スローする前に常にコンソールにエラーをログ記録する
   - ログメッセージにコンテキストを含める
   - フィルタリングしやすいよう一貫したエラープレフィックスを使用する

2. **エラーメッセージ**
   - ユーザーフレンドリーなメッセージを維持する
   - 可能な場合はアクション可能な情報を含める
   - エラーメッセージの形式の一貫性を保つ

3. **エラーリカバリー**
   - finally ブロックでリソースをクリーンアップする
   - 一時的なエラーに対する再試行メカニズムを提供する
   - エラーの後、既知の良好な状態に状態をリセットする
