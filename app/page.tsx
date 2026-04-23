'use client';

import { useState, useMemo, useCallback } from 'react';
import { PRODUCTS, CATEGORIES, formatPrice, getProductsByCategory, type Product } from '@/lib/products';
import RestaurantHostess from '@/components/RestaurantHostess';

const TAX_RATE = 0.065;

interface CartItem {
  product: Product;
  quantity: number;
}

type Mode = 'retail' | 'restaurant';
type Screen = 'register' | 'payment' | 'complete';
type PaymentMethod = 'cash' | 'card' | 'gift' | 'split' | null;

export default function POSPage() {
  const [mode, setMode] = useState<Mode>('retail');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [screen, setScreen] = useState<Screen>('register');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null);
  const [cashTendered, setCashTendered] = useState(0);
  const [cardTendered, setCardTendered] = useState(0);
  const [giftTendered, setGiftTendered] = useState(0);
  const [discountPct, setDiscountPct] = useState(0);
  const [txNumber] = useState(() => Math.floor(Math.random() * 90000) + 10000);
  const [showDiscount, setShowDiscount] = useState(false);

  const subtotal = useMemo(() => cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0), [cart]);
  const discountAmt = useMemo(() => Math.round(subtotal * discountPct / 100), [subtotal, discountPct]);
  const taxable = subtotal - discountAmt;
  const tax = useMemo(() => Math.round(taxable * TAX_RATE), [taxable]);
  const total = taxable + tax;
  const change = useMemo(() => Math.max(0, cashTendered + cardTendered + giftTendered - total), [cashTendered, cardTendered, giftTendered, total]);
  const totalTendered = cashTendered + cardTendered + giftTendered;
  const needsMore = totalTendered < total;

  const filteredProducts = useMemo(() => {
    let prods = selectedCategory === 'All' ? PRODUCTS : getProductsByCategory(selectedCategory);
    if (search.trim()) {
      const q = search.toLowerCase();
      prods = prods.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q));
    }
    return prods;
  }, [selectedCategory, search]);

  const addItem = useCallback((product: Product) => {
    setCart(prev => {
      const ex = prev.find(x => x.product.id === product.id);
      if (ex) return prev.map(x => x.product.id === product.id ? { ...x, quantity: x.quantity + 1 } : x);
      return [...prev, { product, quantity: 1 }];
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setCart(prev => {
      const ex = prev.find(x => x.product.id === productId);
      if (ex && ex.quantity > 1) return prev.map(x => x.product.id === productId ? { ...x, quantity: x.quantity - 1 } : x);
      return prev.filter(x => x.product.id !== productId);
    });
  }, []);

  const voidItem = (productId: string) => setCart(prev => prev.filter(x => x.product.id !== productId));
  const clearAll = () => { setCart([]); setScreen('register'); setPaymentMethod(null); setCashTendered(0); setCardTendered(0); setGiftTendered(0); setDiscountPct(0); };

  function startPayment(method: PaymentMethod) {
    setPaymentMethod(method);
    setScreen('payment');
    if (method === 'card') setCardTendered(total);
    if (method === 'gift') setGiftTendered(total);
  }

  function completeSale() { setScreen('complete'); }
  function newSale() { clearAll(); }

  const itemCount = cart.reduce((s, i) => s + i.quantity, 0);

  if (mode === 'restaurant') {
    return <RestaurantHostess onBack={() => setMode('retail')} />;
  }

  return (
    <div className="h-screen flex flex-col bg-gray-100" style={{ fontFamily: 'system-ui, sans-serif' }}>

      {/* ─── HEADER ─── */}
      <div className="bg-blue-900 text-white px-6 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-4">
          <span className="text-xl font-bold tracking-wide">🛒 POS Training System</span>
          <span className="text-blue-300 text-sm bg-blue-800 px-2 py-0.5 rounded">Register #{txNumber}</span>
        </div>
        <div className="flex items-center gap-3">
          <div style={{ display: 'flex', gap: 6 }}>
            <button onClick={() => setMode('retail')} style={{ background: '#22c55e', border: 'none', color: 'white', borderRadius: 8, padding: '6px 14px', cursor: 'pointer', fontSize: 13, fontWeight: 700 }}>🛒 Retail POS</button>
            <button onClick={() => setMode('restaurant')} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: 'white', borderRadius: 8, padding: '6px 14px', cursor: 'pointer', fontSize: 13, fontWeight: 700 }}>🍽️ Restaurant Host</button>
          </div>
          {screen !== 'register' && (
            <button onClick={clearAll} className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded text-sm font-semibold transition">← Back to Register</button>
          )}
          <span className="text-blue-200 text-xs">Practice Mode Only</span>
        </div>
      </div>

      {/* ─── MAIN ─── */}
      <div className="flex flex-1 overflow-hidden">

        {/* COLUMN 1 – Products */}
        <div className="w-2/5 flex flex-col bg-white border-r border-gray-300">
          <div className="p-3 border-b border-gray-200 space-y-2 flex-shrink-0">
            <input
              type="text"
              placeholder="🔍 Search by name, brand, or category..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex flex-wrap gap-1">
              {['All', ...CATEGORIES].map(cat => (
                <button key={cat} onClick={() => { setSelectedCategory(cat); setSearch(''); }}
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold transition ${selectedCategory === cat ? 'bg-blue-700 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                  {cat}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-2 grid grid-cols-3 gap-2 auto-rows-max">
            {filteredProducts.map(prod => (
              <button key={prod.id} onClick={() => addItem(prod)}
                className="bg-white border-2 border-gray-200 rounded-xl p-2 text-left hover:border-blue-500 hover:shadow-md active:scale-95 transition">
                <div className="bg-blue-50 border border-blue-100 rounded-lg h-14 mb-2 flex items-center justify-center text-2xl">🛍️</div>
                <div className="text-xs font-bold text-gray-800 leading-tight line-clamp-2">{prod.name}</div>
                <div className="text-xs text-gray-400 mt-0.5">{prod.category}</div>
                <div className="text-sm font-extrabold text-blue-800 mt-1">{formatPrice(prod.price)}</div>
              </button>
            ))}
          </div>
        </div>

        {/* COLUMN 2 – Order Ticket */}
        <div className="w-35/100 flex flex-col bg-white">
          <div className="px-4 py-2 border-b border-gray-200 flex items-center justify-between bg-gray-50 flex-shrink-0">
            <span className="font-bold text-gray-800 text-sm">📋 ORDER #{txNumber}</span>
            <span className="text-xs text-gray-500">{itemCount} item{itemCount !== 1 ? 's' : ''}</span>
          </div>
          <div className="flex-1 overflow-y-auto">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <div className="text-4xl">🛒</div>
                <div className="text-sm mt-2">Tap products to start an order</div>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-xs text-gray-500 uppercase sticky top-0">
                  <tr>
                    <th className="text-left pl-4 pr-2 py-2">Item</th>
                    <th className="text-center px-1 py-2">Qty</th>
                    <th className="text-right px-2 py-2">Total</th>
                    <th className="w-8 pr-2 py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map(item => (
                    <tr key={item.product.id} className="border-t border-gray-100">
                      <td className="pl-4 pr-2 py-1.5">
                        <div className="font-semibold text-xs leading-tight">{item.product.name}</div>
                        <div className="text-xs text-gray-400">{formatPrice(item.product.price)} each</div>
                      </td>
                      <td className="text-center px-1 py-1.5">
                        <div className="flex items-center justify-center gap-1">
                          <button onClick={() => removeItem(item.product.id)}
                            className="w-6 h-6 rounded bg-gray-100 hover:bg-red-100 text-gray-600 hover:text-red-600 font-bold text-sm flex items-center justify-center transition">−</button>
                          <span className="font-bold text-sm w-5 text-center">{item.quantity}</span>
                          <button onClick={() => addItem(item.product)}
                            className="w-6 h-6 rounded bg-gray-100 hover:bg-green-100 text-gray-600 hover:text-green-600 font-bold text-sm flex items-center justify-center transition">+</button>
                        </div>
                      </td>
                      <td className="text-right pr-3 pl-2 py-1.5 font-bold text-xs">{formatPrice(item.product.price * item.quantity)}</td>
                      <td className="pr-2 py-1.5">
                        <button onClick={() => voidItem(item.product.id)}
                          className="w-7 h-7 rounded bg-red-50 hover:bg-red-100 text-red-500 text-xs font-bold flex items-center justify-center transition">✕</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          <div className="px-4 py-2 border-t border-gray-200 flex gap-2 flex-shrink-0">
            <button onClick={() => setShowDiscount(true)} className="bg-orange-100 hover:bg-orange-200 text-orange-700 px-3 py-1.5 rounded text-xs font-bold transition">💡 Discount</button>
            <button onClick={voidItem.bind(null, cart[0]?.product.id || '')} disabled={cart.length === 0} className="bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded text-xs font-bold disabled:opacity-30 transition">Void Last</button>
            <button onClick={clearAll} disabled={cart.length === 0} className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1.5 rounded text-xs font-bold disabled:opacity-30 transition">Clear All</button>
          </div>
          <div className="border-t-2 border-gray-300 bg-gray-50 px-4 py-3 space-y-1.5 flex-shrink-0">
            <div className="flex justify-between text-sm text-gray-600"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
            {discountAmt > 0 && <div className="flex justify-between text-sm text-orange-600"><span>Discount ({discountPct}%)</span><span>−{formatPrice(discountAmt)}</span></div>}
            <div className="flex justify-between text-sm text-gray-600"><span>Tax (6.5%)</span><span>{formatPrice(tax)}</span></div>
            <div className="flex justify-between text-xl font-black text-gray-900 border-t border-gray-300 pt-1.5 mt-1.5">
              <span>TOTAL</span><span>{formatPrice(total)}</span>
            </div>
          </div>
          <div className="p-3 border-t border-gray-200 flex-shrink-0">
            <button onClick={() => total > 0 && setScreen('payment')} disabled={cart.length === 0 || total <= 0}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-black py-5 rounded-xl text-xl shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed transition active:scale-95">
              💳 PAY — {formatPrice(total)}
            </button>
          </div>
        </div>

        {/* COLUMN 3 – Payment / Actions */}
        <div className="w-3/10 flex flex-col bg-gray-50 border-l border-gray-300">
          {screen === 'register' && (
            <div className="flex-1 flex flex-col">
              <div className="px-4 py-3 border-b border-gray-200 bg-gray-100">
                <span className="font-bold text-gray-700 text-sm">💳 PAYMENT OPTIONS</span>
              </div>
              <div className="flex-1 p-4 space-y-3 flex flex-col justify-center">
                <button onClick={() => startPayment('cash')} disabled={cart.length === 0}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-5 rounded-xl text-base shadow-md disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition flex items-center justify-between px-6 active:scale-95">
                  <span>💵 CASH</span><span className="text-sm font-normal">Pay with cash + get change</span>
                </button>
                <button onClick={() => startPayment('card')} disabled={cart.length === 0}
                  className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-5 rounded-xl text-base shadow-md disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition flex items-center justify-between px-6 active:scale-95">
                  <span>💳 CARD</span><span className="text-sm font-normal">Credit / Debit / Tap</span>
                </button>
                <button onClick={() => startPayment('gift')} disabled={cart.length === 0}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-5 rounded-xl text-base shadow-md disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition flex items-center justify-between px-6 active:scale-95">
                  <span>🎁 GIFT CARD</span><span className="text-sm font-normal">Apply gift card balance</span>
                </button>
                <button onClick={() => startPayment('split')} disabled={cart.length === 0}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-5 rounded-xl text-base shadow-md disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition flex items-center justify-between px-6 active:scale-95">
                  <span>⚡ SPLIT</span><span className="text-sm font-normal">Cash + Card combined</span>
                </button>
              </div>
            </div>
          )}

          {screen === 'payment' && (
            <div className="flex flex-col flex-1">
              <div className="px-4 py-3 bg-blue-900 text-white">
                <span className="font-bold text-sm">
                  {paymentMethod === 'cash' && '💵 CASH PAYMENT'}
                  {paymentMethod === 'card' && '💳 CARD PAYMENT'}
                  {paymentMethod === 'gift' && '🎁 GIFT CARD'}
                  {paymentMethod === 'split' && '⚡ SPLIT TENDER'}
                </span>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                <div className="bg-blue-900 text-white rounded-xl p-4 text-center">
                  <div className="text-xs text-blue-200 uppercase font-semibold">Total Due</div>
                  <div className="text-3xl font-black">{formatPrice(total)}</div>
                </div>

                {paymentMethod === 'cash' && (
                  <div className="space-y-3">
                    <div className="text-xs text-gray-500 font-semibold uppercase">Quick Cash Buttons</div>
                    <div className="grid grid-cols-3 gap-2">
                      {[500, 1000, 2000, 5000, 10000, 20000].map(cents => (
                        <button key={cents} onClick={() => setCashTendered(cents)}
                          className="bg-white border-2 border-green-400 text-green-800 font-extrabold py-3 rounded-xl text-sm hover:bg-green-50 active:scale-95 transition shadow-sm">
                          {formatPrice(cents)}
                        </button>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {[50000, 100000].map(cents => (
                        <button key={cents} onClick={() => setCashTendered(cents)}
                          className="bg-white border-2 border-green-400 text-green-800 font-extrabold py-3 rounded-xl text-sm hover:bg-green-50 active:scale-95 transition shadow-sm">
                          {formatPrice(cents)}
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      {[100, 500, 1000, 5000].map(cents => (
                        <button key={cents} onClick={() => setCashTendered(p => p + cents)}
                          className="flex-1 bg-gray-100 border border-gray-300 text-gray-700 font-bold py-2 rounded-lg text-xs hover:bg-gray-200 transition">+{formatPrice(cents)}</button>
                      ))}
                    </div>
                    <button onClick={() => setCashTendered(total)}
                      className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg text-sm hover:bg-blue-700 transition">Exact Amount — {formatPrice(total)}</button>
                    <div className="bg-white border-2 border-gray-300 rounded-xl p-3 text-center">
                      <div className="text-xs text-gray-500 uppercase font-semibold">Cash Tendered</div>
                      <div className="text-2xl font-black text-gray-900">{formatPrice(cashTendered)}</div>
                    </div>
                    {cashTendered >= total && (
                      <div className="bg-green-100 border-2 border-green-500 rounded-xl p-4 text-center">
                        <div className="text-xs text-green-700 uppercase font-bold">Change Due</div>
                        <div className="text-3xl font-black text-green-900">{formatPrice(cashTendered - total)}</div>
                      </div>
                    )}
                    {cashTendered > 0 && cashTendered < total && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-2 text-center text-xs text-red-600 font-semibold">
                        Need {formatPrice(total - cashTendered)} more
                      </div>
                    )}
                  </div>
                )}

                {paymentMethod === 'card' && (
                  <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-6 text-center space-y-3">
                    <div className="text-4xl">💳</div>
                    <div className="text-sm font-semibold text-gray-700">Tap, Insert, or Swipe Card</div>
                    <div className="text-xs text-gray-500">Simulated — no real charge</div>
                    <div className="text-lg font-bold text-blue-800">{formatPrice(total)}</div>
                  </div>
                )}

                {paymentMethod === 'gift' && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      {[1000, 2500, 5000, 10000, 25000, total].map(cents => (
                        <button key={cents} onClick={() => setGiftTendered(Math.min(cents, total))}
                          className="bg-purple-100 border border-purple-300 text-purple-800 font-bold py-3 rounded-xl text-sm hover:bg-purple-50 active:scale-95 transition">
                          {formatPrice(Math.min(cents, total))}
                        </button>
                      ))}
                    </div>
                    <div className="bg-white border-2 border-purple-300 rounded-xl p-3 text-center">
                      <div className="text-xs text-gray-500 uppercase font-semibold">Gift Card Applied</div>
                      <div className="text-2xl font-black text-purple-800">{formatPrice(giftTendered)}</div>
                    </div>
                    {giftTendered > total && (
                      <div className="bg-green-100 border-2 border-green-500 rounded-xl p-3 text-center">
                        <div className="text-xs text-green-700 font-bold uppercase">Remaining Balance</div>
                        <div className="text-xl font-black text-green-900">{formatPrice(giftTendered - total)}</div>
                      </div>
                    )}
                  </div>
                )}

                {paymentMethod === 'split' && (
                  <div className="space-y-3">
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-2 text-center text-xs text-orange-700 font-semibold">
                      Total: {formatPrice(total)} — Enter cash + card portions
                    </div>
                    <div className="bg-white border-2 border-green-400 rounded-xl p-3">
                      <div className="text-xs text-green-700 font-bold uppercase mb-2">💵 Cash Tendered</div>
                      <div className="grid grid-cols-4 gap-1">
                        {[500, 1000, 2000, 5000, 10000, 20000, 50000, 100000].map(cents => (
                          <button key={cents} onClick={() => setCashTendered(cents)}
                            className="bg-green-50 border border-green-300 text-green-800 font-bold py-1.5 rounded text-xs hover:bg-green-100 transition">
                            {formatPrice(cents)}
                          </button>
                        ))}
                      </div>
                      <div className="text-lg font-black text-green-800 mt-2">{formatPrice(cashTendered)}</div>
                    </div>
                    <div className="bg-white border-2 border-blue-400 rounded-xl p-3">
                      <div className="text-xs text-blue-700 font-bold uppercase mb-2">💳 Card Amount</div>
                      <div className="grid grid-cols-4 gap-1">
                        {[500, 1000, 2000, 5000, 10000, 20000, 50000, total].map(cents => (
                          <button key={cents} onClick={() => setCardTendered(Math.min(cents, total - cashTendered))}
                            className="bg-blue-50 border border-blue-300 text-blue-800 font-bold py-1.5 rounded text-xs hover:bg-blue-100 transition">
                            {formatPrice(Math.min(cents, total - cashTendered))}
                          </button>
                        ))}
                      </div>
                      <div className="text-lg font-black text-blue-800 mt-2">{formatPrice(cardTendered)}</div>
                    </div>
                    <div className="bg-gray-100 border border-gray-300 rounded-lg p-2 text-center text-xs text-gray-600">
                      Remaining: {formatPrice(Math.max(0, total - cashTendered - cardTendered))}
                    </div>
                  </div>
                )}
              </div>

              <div className="p-3 border-t border-gray-300 flex-shrink-0 space-y-2">
                {paymentMethod !== 'card' && (
                  <button onClick={completeSale} disabled={needsMore}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-black py-4 rounded-xl text-lg shadow-md disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition active:scale-95">
                    ✅ COMPLETE SALE
                  </button>
                )}
                {paymentMethod === 'card' && (
                  <button onClick={completeSale}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-black py-4 rounded-xl text-lg shadow-md transition active:scale-95">
                    ✅ APPROVE — {formatPrice(total)}
                  </button>
                )}
                <button onClick={() => { setScreen('register'); setPaymentMethod(null); setCashTendered(0); setCardTendered(0); setGiftTendered(0); }}
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 rounded-lg text-sm transition">
                  ← Cancel
                </button>
              </div>
            </div>
          )}

          {screen === 'complete' && (
            <div className="flex flex-col flex-1">
              <div className="bg-green-600 text-white px-4 py-3 font-bold text-center text-sm">✅ SALE COMPLETE — THANK YOU!</div>
              <div className="flex-1 flex flex-col items-center justify-center p-6">
                <div className="text-6xl mb-4">🎉</div>
                {paymentMethod === 'cash' && (
                  <div className="text-center">
                    <div className="text-sm text-gray-500 mb-1">Change Given</div>
                    <div className="text-3xl font-black text-green-700">{formatPrice(cashTendered - total)}</div>
                  </div>
                )}
                {paymentMethod === 'card' && (
                  <div className="text-center">
                    <div className="text-sm text-gray-500 mb-1">Card Charged</div>
                    <div className="text-3xl font-black text-blue-700">{formatPrice(total)}</div>
                  </div>
                )}
                {paymentMethod === 'gift' && (
                  <div className="text-center">
                    <div className="text-sm text-gray-500 mb-1">Gift Card Applied</div>
                    <div className="text-3xl font-black text-purple-700">{formatPrice(total)}</div>
                    {giftTendered > total && <div className="text-sm text-gray-500 mt-1">Remaining: {formatPrice(giftTendered - total)}</div>}
                  </div>
                )}
                {paymentMethod === 'split' && (
                  <div className="text-center text-sm">
                    <div className="text-gray-600">Cash: {formatPrice(cashTendered)} + Card: {formatPrice(cardTendered)}</div>
                    <div className="text-lg font-black text-green-700 mt-2">Total: {formatPrice(total)}</div>
                  </div>
                )}
              </div>
              <div className="p-4 space-y-2 flex-shrink-0">
                <button onClick={newSale}
                  className="w-full bg-blue-700 hover:bg-blue-800 text-white font-black py-4 rounded-xl text-base shadow-md transition active:scale-95">
                  🔄 New Transaction
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ─── DISCOUNT MODAL ─── */}
      {showDiscount && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-80 space-y-4 shadow-2xl">
            <div className="text-lg font-black text-gray-800">💡 Apply Discount</div>
            <div className="grid grid-cols-3 gap-2">
              {[0, 5, 10, 15, 20, 25].map(pct => (
                <button key={pct} onClick={() => { setDiscountPct(pct); setShowDiscount(false); }}
                  className="bg-orange-100 hover:bg-orange-200 text-orange-800 font-bold py-3 rounded-xl text-sm transition">
                  {pct === 0 ? 'None' : `${pct}%`}
                </button>
              ))}
            </div>
            <button onClick={() => setShowDiscount(false)}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold py-2 rounded-lg text-sm transition">Cancel</button>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="bg-gray-200 text-center text-xs text-gray-500 py-1.5 border-t border-gray-300 flex-shrink-0">
        POS Training System — Practice Mode Only — No Real Transactions Processed
      </div>
    </div>
  );
}
