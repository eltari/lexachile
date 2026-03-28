/**
 * Cache simple en memoria con TTL (Time To Live)
 * Utilizado por los scrapers para evitar re-fetching innecesario.
 */

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

const DEFAULT_TTL_MS = 5 * 60 * 1000; // 5 minutos

class SimpleCache {
  private store = new Map<string, CacheEntry<unknown>>();

  /**
   * Obtener un valor del cache. Retorna undefined si no existe o expiró.
   */
  get<T>(key: string): T | undefined {
    const entry = this.store.get(key);
    if (!entry) return undefined;

    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return undefined;
    }

    return entry.value as T;
  }

  /**
   * Guardar un valor en el cache con TTL opcional.
   */
  set<T>(key: string, value: T, ttlMs: number = DEFAULT_TTL_MS): void {
    this.store.set(key, {
      value,
      expiresAt: Date.now() + ttlMs,
    });
  }

  /**
   * Verificar si existe una entrada válida (no expirada).
   */
  has(key: string): boolean {
    const entry = this.store.get(key);
    if (!entry) return false;

    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return false;
    }

    return true;
  }

  /**
   * Limpiar todo el cache.
   */
  clear(): void {
    this.store.clear();
  }

  /**
   * Eliminar entradas expiradas (limpieza periódica).
   */
  purgeExpired(): void {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      if (now > entry.expiresAt) {
        this.store.delete(key);
      }
    }
  }

  /**
   * Número de entradas activas en el cache.
   */
  get size(): number {
    return this.store.size;
  }
}

// Singleton global
export const cache = new SimpleCache();
