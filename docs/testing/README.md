# 🧪 テストガイドライン

## テストの配置ルール

### 1. ライブラリ的な機能 → `src/libs/` 配下
独立性が高く、再利用可能なコードのテスト

```
src/libs/xrplmeta/
├── api.ts
├── tokens.ts
├── __tests__/          # テストファイル
│   └── tokens.test.ts
└── __fixtures__/       # テストデータ
    └── tokens.ts
```

**対象:**
- 外部APIクライアント
- ユーティリティ関数
- 再利用可能なロジック

### 2. アプリケーション機能 → `tests/` 配下
アプリケーション固有の機能のテスト

```
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
import { TokensApi } from '../tokens';
import { mockToken } from '../__fixtures__/tokens';

describe('TokensApi', () => {
  let api: TokensApi;

  beforeEach(() => {
    api = new TokensApi();
  });

  it('should fetch tokens with correct parameters', async () => {
    const params = { name_like: 'XRP' };
    const result = await api.listTokens(params);
    expect(result.tokens).toBeDefined();
  });

  it('should handle errors', async () => {
    // エラーケースのテスト
  });
});
```

### 2. Reactコンポーネントのテスト
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

### 3. カスタムフックのテスト
```typescript
// tests/hooks/useTokenSearch.test.ts
import { renderHook, act } from '@testing-library/react-hooks';
import { useTokenSearch } from '@/hooks/useTokenSearch';

describe('useTokenSearch', () => {
  it('should search tokens', async () => {
    const { result } = renderHook(() => useTokenSearch());
    
    await act(async () => {
      await result.current.searchTokens('XRP');
    });

    expect(result.current.tokens).toHaveLength(1);
  });
});
```

## テストコマンド

```bash
# 全テストの実行
yarn test

# 特定のテストの実行
yarn test src/libs/xrplmeta

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
vi.mock('@/libs/xrplmeta/api', () => ({
  fetchTokens: vi.fn().mockResolvedValue({ tokens: [] })
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
