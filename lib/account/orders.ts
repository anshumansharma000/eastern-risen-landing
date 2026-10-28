const prefix = 'eastern-risen-account-order:';
export function orderKey(identity: string, customerId: string, bookingId: string) { return `${prefix}${identity}:${customerId}:${bookingId}`; }
export function getOrder(key: string) { try { const value = sessionStorage.getItem(key); return value && /^er_[a-f0-9]{32}$/.test(value) ? value : null; } catch { return null; } }
export function storeOrder(key: string, order: string | null) { try { if (order) sessionStorage.setItem(key, order); else sessionStorage.removeItem(key); } catch { /* optional return context; balances remain authoritative */ } }
export function clearOrders() { try { Object.keys(sessionStorage).filter(key => key.startsWith(prefix)).forEach(key => sessionStorage.removeItem(key)); } catch { /* storage unavailable */ } }
