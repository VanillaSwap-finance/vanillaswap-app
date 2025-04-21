'use client'

import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  CircularProgress,
  Typography,
} from '@mui/material'
import SwapTokenListItem from '@/components/features/swap/TokenSearchDialog/SwapTokenListItem'
import { useTokenSearch } from '@/hooks/useTokenSearch'
import { useState, useCallback } from 'react'
import { debounce } from 'lodash'
import { formatNumber, formatTokenPrice } from '@/utils/number'

interface TokenSearchDialogProps {
  open: boolean
  onClose: () => void
  onTokenSelect: (
    symbol: string,
    issuer: string,
    position: 'from' | 'to',
  ) => void
  side: 'from' | 'to'
}

export default function TokenSearchDialog({
  open,
  onClose,
  onTokenSelect,
  side,
}: TokenSearchDialogProps) {
  const [searchKeyword, setSearchKeyword] = useState('')

  const {
    tokens,
    isLoading,
    isError,
    isEmpty,
    loadMore,
    hasMore,
    isLoadingMore,
  } = useTokenSearch(
    {
      name_like: searchKeyword,
      sort_by: 'trustlines',
      trust_level: [1],
    },
    20,
  )

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setSearchKeyword(value)
    }, 300),
    [],
  )

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const { scrollTop, scrollHeight, clientHeight } = e.currentTarget
      if (scrollHeight - scrollTop <= clientHeight * 1.5) {
        if (hasMore && !isLoadingMore) {
          loadMore()
        }
      }
    },
    [hasMore, isLoadingMore, loadMore],
  )

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { height: '80vh', maxHeight: 600 },
      }}
    >
      <DialogTitle>
        <Typography variant="h6" component="div">
          トークンを選択
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ p: 0 }}>
        <Box
          sx={{
            px: 2,
            py: 2,
            position: 'sticky',
            top: 0,
            backgroundColor: 'background.paper',
            zIndex: 2,
            borderBottom: 1,
            borderColor: 'divider',
          }}
        >
          <TextField
            placeholder="トークン名で検索..."
            onChange={(e) => debouncedSearch(e.target.value)}
            fullWidth
            size="small"
            autoFocus
          />
        </Box>

        <Box
          sx={{
            height: 'calc(100% - 80px)',
            overflow: 'auto',
            py: 1,
          }}
          onScroll={handleScroll}
        >
          {/* XRP */}
          <SwapTokenListItem
            symbol="XRP"
            name="XRP"
            issuer="XRP"
            onTokenSelect={onTokenSelect}
            side={side}
            icon="/images/xrp.png"
            metrics={{
              holders: '-',
              price: '-',
            }}
            description="XRPLのネイティブ通貨"
          />

          {/* 検索結果 */}
          {tokens.map((token) => (
            <SwapTokenListItem
              key={`${token.currency}-${token.issuer}`}
              symbol={token.currency}
              name={token.meta.token.name}
              issuer={token.issuer}
              onTokenSelect={onTokenSelect}
              side={side}
              icon={token.meta.token.icon}
              metrics={{
                holders: formatNumber(token.metrics.holders),
                price: formatTokenPrice(Number(token.metrics.price)),
              }}
              description={token.meta.token.description}
            />
          ))}

          {/* ローディング状態 */}
          {(isLoading || isLoadingMore) && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
              <CircularProgress size={24} />
            </Box>
          )}

          {/* エラー状態 */}
          {isError && (
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Typography color="error">
                トークンの検索中にエラーが発生しました
              </Typography>
            </Box>
          )}

          {/* 検索結果なし */}
          {isEmpty && !isLoading && (
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Typography color="text.secondary">
                該当するトークンが見つかりませんでした
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  )
}
