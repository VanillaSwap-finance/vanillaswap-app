export class ApiCache {
  private cache: Map<string, { data: any; timestamp: number }>
  private readonly defaultTTL: number

  constructor(defaultTTL: number = 5 * 60 * 1000) {
    this.cache = new Map()
    this.defaultTTL = defaultTTL
  }

  set(key: string, data: any, ttl: number = this.defaultTTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now() + ttl,
    })
  }

  get(key: string): any | null {
    const item = this.cache.get(key)
    if (!item) return null
    if (Date.now() > item.timestamp) {
      this.cache.delete(key)
      return null
    }
    return item.data
  }
}
