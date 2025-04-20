# 🧪 テストガイドライン

## テストの配置ルール

### 1. ライブラリ的な機能 → `src/libs/` 配下
独立性が高く、再利用可能なコードのテスト

```text
src/libs/
├── xrplmeta/
│   ├── api.ts
│   ├── tokens.ts
│   ├── __tests__/          # テストファイル
│   │   └── tokens.test.ts
│   └── __fixtures__/       # テストデータ
│       └── tokens.ts
│
├── binance/
│   ├── api.ts
│   ├── market.ts
│   ├── __tests__/
│   │   └── market.test.ts
│   └── __fixtures__/
│       └── market.ts
│
└── xrpl/
    ├── api.ts
    ├── account.ts
    ├── __tests__/
    │   └── account.test.ts
    └── __fixtures__/
        └── account.ts
```

**対象:**
- 外部APIクライアント
- ユーティリティ関数
- 再利用可能なロジック

### 2. APIルート → `__tests__/api/` 配下
Next.jsのAPIルートのテスト

```text
__tests__/api/
├── xrplmeta/
│   ├── tokens.test.ts
│   └── market.test.ts
├── binance/
│   └── market.test.ts
└── xrpl/
    └── account.test.ts
```

**対象:**
- APIルートのハンドラ
- エラーハンドリング
- キャッシュ制御

### 3. アプリケーション機能 → `tests/` 配下
アプリケーション固有の機能のテスト

```text
tests/
├── components/        # UIコンポーネント
├── hooks/            # カスタムフック
└── e2e/             # E2Eテスト
```

**対象:**
- Reactコンポーネント
- カスタムフック
- 統合テスト

## テストの実装例

### 1. APIクライアントのテスト
```typescript
// src/libs/xrplmeta/__tests__/tokens.test.ts
import { XRPLMetaClient } from '../api';
import { mockToken } from '../__fixtures__/tokens';

describe('XRPLMetaClient', () => {
  let client: XRPLMetaClient;

  beforeEach(() => {
    client = new XRPLMetaClient();
  });

  it('should fetch tokens with correct parameters', async () => {
    const params = { name_like: 'XRP' };
    const result = await client.listTokens(params);
    expect(result.tokens).toBeDefined();
  });

  it('should handle rate limit errors', async () => {
    // レート制限エラーのテスト
  });
});
```

### 2. APIルートのテスト
```typescript
// __tests__/api/xrplmeta/tokens.test.ts
import { GET } from '@/app/api/xrplmeta/tokens/route';

describe('XRPLMeta Tokens API Route', () => {
  it('should return tokens data', async () => {
    const request = new Request('http://localhost/api/xrplmeta/tokens');
    const response = await GET(request);
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data.tokens).toBeDefined();
  });

  it('should handle API errors', async () => {
    // APIエラーのテスト
  });

  it('should set correct cache headers', async () => {
    const request = new Request('http://localhost/api/xrplmeta/tokens');
    const response = await GET(request);
    
    expect(response.headers.get('Cache-Control')).toBe(
      's-maxage=60, stale-while-revalidate'
    );
  });
});
```

### 3. コンポーネントのテスト
```typescript
// tests/components/TokenCard.test.tsx
import { render, screen } from '@testing-library/react';
import { TokenCard } from '@/components/TokenCard';

describe('TokenCard', () => {
  it('should render token details', () => {
    render(<TokenCard token={mockToken} />);
    expect(screen.getByText(mockToken.name)).toBeInTheDocument();
  });
});
```

## テストコマンド

```bash
# 全テストの実行
yarn test

# 特定のAPIのテストを実行
yarn test api/xrplmeta
yarn test api/binance

# カバレッジレポートの生成
yarn test:coverage
```

## ベストプラクティス

1. **テストの構造**
```typescript
describe('機能名', () => {
  it('期待される動作', () => {
    // Arrange（準備）
    const input = 'test';

    // Act（実行）
    const result = someFunction(input);

    // Assert（検証）
    expect(result).toBe('expected');
  });
});
```

2. **モックの使用**
```typescript
// 外部APIクライアントのモック
vi.mock('@/libs/xrplmeta/api', () => ({
  XRPLMetaClient: vi.fn().mockImplementation(() => ({
    listTokens: vi.fn().mockResolvedValue({ tokens: [] })
  }))
}));
```

3. **フィクスチャの活用**
```typescript
// src/libs/xrplmeta/__fixtures__/tokens.ts
export const mockToken = {
  currency: 'XRP',
  issuer: 'address',
  // ... 必要なデータ
};
```
```

主な更新ポイント：

1. 🏗 **ディレクトリ構造**
   - 外部API単位でのテストディレクトリ構成
   - APIルートテスト用の専用ディレクトリ追加

2. 📝 **テスト例**
   - APIクライアントのテストを外部API単位に更新
   - APIルートのテスト例を追加
   - キャッシュヘッダーのテスト例を追加

3. 🔧 **テストコマンド**
   - 外部API単位でのテスト実行コマンドを追加

4. 🎯 **モック例**
   - 外部APIクライアントのモック例を更新

これらの変更により、新しいAPI設計方針に合わせたテスト構造と実装例を提供できます！✨
