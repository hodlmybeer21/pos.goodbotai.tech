'use client';

import { useState, useCallback, useRef } from 'react';
import {
  MENU, MENU_CATEGORIES, TABLES, formatPrice,
  type MenuItem, type Table, type WaitlistEntry, type TableSession,
} from '../lib/restaurantData';

const TAX_RATE = 0.065;

// ─── Helpers ────────────────────────────────────────────────────────────────
function greetingVariant(i: number): string {
  const greetings = [
    "Welcome! Happy to have you! 🎉",
    "Hi there! Great to see you! 🌟",
    "Hello! Sit anywhere you like! 😊",
    "Hey! Table for you today? 👋",
    "Good afternoon! How many in your party? ☀️",
  ];
  return greetings[i % greetings.length];
}

function nextWaitId(): number { return Math.floor(Math.random() * 90000) + 10000; }

function makeEmptySession(): TableSession {
  return { tableId: 0, guests: [], orders: [], tabOpen: false, status: 'seated', openedAt: Date.now() };
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function RestaurantHostess({ onBack }: { onBack: () => void }) {
  const [view, setView] = useState<'chart' | 'waitlist' | 'order'>('chart');
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [sessions, setSessions] = useState<Map<number, TableSession>>(new Map());
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>([
    { id: 301, name: 'Martinez', partySize: 4, timeAdded: Date.now() - 4 * 60000 },
    { id: 302, name: 'Chen', partySize: 2, timeAdded: Date.now() - 2 * 60000 },
  ]);
  const [waitName, setWaitName] = useState('');
  const [waitSize, setWaitSize] = useState(2);
  const [orderCategory, setOrderCategory] = useState<string>(MENU_CATEGORIES[0]);
  const [step, setStep] = useState<'welcome' | 'seating' | 'ordering' | 'paying'>('welcome');
  const [seatCount, setSeatCount] = useState(2);
  const [guestName, setGuestName] = useState('');
  const [greetingIdx, setGreetingIdx] = useState(0);
  const [paidTables, setPaidTables] = useState<Set<number>>(new Set());
  const [level, setLevel] = useState(1);

  const getSession = useCallback((tableId: number): TableSession => {
    return sessions.get(tableId) ?? { ...makeEmptySession(), tableId };
  }, [sessions]);

  const openTable = useCallback((table: Table) => {
    const newSession: TableSession = {
      tableId: table.id,
      guests: [],
      orders: [],
      tabOpen: true,
      status: 'seating',
      openedAt: Date.now(),
    };
    setSessions(prev => new Map(prev).set(table.id, newSession));
    setSelectedTable(table);
    setStep('seating');
  }, []);

  const seatGuests = useCallback(() => {
    if (!selectedTable || !guestName.trim()) return;
    const session = getSession(selectedTable.id);
    const guestsArr = Array.from({ length: seatCount }, (_, i) =>
      i === 0 ? { name: guestName.trim() } : { name: `Guest ${i + 1}` }
    );
    const updated: TableSession = {
      ...session,
      guests: guestsArr,
      status: 'ordering',
    };
    setSessions(prev => new Map(prev).set(selectedTable.id, updated));
    setStep('ordering');
  }, [selectedTable, guestName, seatCount, getSession]);

  const addOrder = useCallback((item: MenuItem) => {
    if (!selectedTable) return;
    const session = getSession(selectedTable.id);
    const existing = session.orders.find(o => o.item.id === item.id);
    const updated: TableSession = {
      ...session,
      orders: existing
        ? session.orders.map(o => o.item.id === item.id ? { ...o, qty: o.qty + 1 } : o)
        : [...session.orders, { item, qty: 1 }],
    };
    setSessions(prev => new Map(prev).set(selectedTable.id, updated));
  }, [selectedTable, getSession]);

  const removeOrder = useCallback((itemId: string) => {
    if (!selectedTable) return;
    const session = getSession(selectedTable.id);
    const existing = session.orders.find(o => o.item.id === itemId);
    if (!existing) return;
    const updated: TableSession = {
      ...session,
      orders: existing.qty > 1
        ? session.orders.map(o => o.item.id === itemId ? { ...o, qty: o.qty - 1 } : o)
        : session.orders.filter(o => o.item.id !== itemId),
    };
    setSessions(prev => new Map(prev).set(selectedTable.id, updated));
  }, [selectedTable, getSession]);

  const subtotal = selectedTable
    ? getSession(selectedTable.id).orders.reduce((s, o) => s + o.item.price * o.qty, 0)
    : 0;
  const tax = Math.round(subtotal * TAX_RATE);
  const total = subtotal + tax;

  const processPayment = () => {
    if (!selectedTable) return;
    setPaidTables(prev => new Set(prev).add(selectedTable.id));
    setStep('paying');
    setTimeout(() => {
      setSessions(prev => { const next = new Map(prev); next.delete(selectedTable!.id); return next; });
      setSelectedTable(null);
      setStep('welcome');
      setView('chart');
    }, 2500);
  };

  const tableStatus = (t: Table): 'empty' | 'seated' | 'ordering' | 'paying' | 'paid' => {
    if (paidTables.has(t.id)) return 'paid';
    if (!sessions.has(t.id)) return 'empty';
    return sessions.get(t.id)!.status;
  };

  const seatedCount = [...sessions.values()].filter(s => s.tabOpen).length;

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', minHeight: '100vh', background: '#f8f6ff', display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <div style={{ background: '#6b21a8', color: 'white', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
        <button onClick={onBack} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', borderRadius: 8, padding: '6px 14px', cursor: 'pointer', fontSize: 14 }}>← Back</button>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 20, fontWeight: 800 }}>🍽️ Restaurant Host Training</div>
          <div style={{ fontSize: 12, opacity: 0.8 }}>Learn to seat guests, take orders & process payments</div>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 8, padding: '6px 12px', fontSize: 12 }}>
          Level {level} · {seatedCount} tables open
        </div>
      </div>

      {/* Tab Nav */}
      <div style={{ display: 'flex', borderBottom: '2px solid #e5e7eb', background: 'white' }}>
        {(['chart', 'waitlist'] as const).map(v => (
          <button key={v} onClick={() => setView(v)} style={{
            flex: 1, padding: '10px', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600,
            background: view === v ? '#6b21a8' : 'white', color: view === v ? 'white' : '#6b21a8',
            borderBottom: view === v ? '3px solid #9333ea' : '3px solid transparent',
          }}>
            {v === 'chart' ? '🪑 Seating Chart' : `📋 Waitlist (${waitlist.length})`}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, padding: 16, overflow: 'auto' }}>

        {/* ── WELCOME / GREETING ─────────────────────────────────────── */}
        {step === 'welcome' && (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🍽️</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#1a1a2e', marginBottom: 8 }}>Welcome to Restaurant Training!</div>
            <div style={{ fontSize: 15, color: '#6b7280', marginBottom: 32, maxWidth: 400, margin: '0 auto 32px' }}>
              You're the host today! Seat guests, take their orders, and process payments.
            </div>
            <div style={{ background: 'white', borderRadius: 16, padding: 20, maxWidth: 480, margin: '0 auto', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', textAlign: 'left' }}>
              <div style={{ fontWeight: 700, marginBottom: 12, color: '#1a1a2e' }}>🎯 Your Job Today:</div>
              {['1. Greet guests at the door', '2. Check the waitlist', '3. Seat them at an open table', '4. Take their food order', '5. Process payment'].map((s, i) => (
                <div key={i} style={{ padding: '6px 0', fontSize: 14, color: '#374151', display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span style={{ background: '#6b21a8', color: 'white', borderRadius: '50%', width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, flexShrink: 0 }}>{i + 1}</span>
                  {s.substring(3)}
                </div>
              ))}
            </div>
            <button onClick={() => setStep('welcome')} style={{ marginTop: 24, background: '#6b21a8', color: 'white', border: 'none', borderRadius: 12, padding: '14px 36px', fontSize: 16, fontWeight: 700, cursor: 'pointer' }}>
              I'm Ready! →
            </button>
          </div>
        )}

        {/* ── SEATING CHART ──────────────────────────────────────────── */}
        {(view === 'chart' || step === 'seating') && (
          <div>
            <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>🪑 Seating Chart — Tap an open table</div>

            {/* Seating Chart Grid */}
            <div style={{ position: 'relative', background: '#d1fae5', borderRadius: 20, padding: '20px 10px', marginBottom: 20, minHeight: 280 }}>
              {/* Kitchen area label */}
              <div style={{ position: 'absolute', top: 8, left: '50%', transform: 'translateX(-50%)', fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 1 }}>🍳 Kitchen</div>

              {TABLES.map(t => {
                const status = tableStatus(t);
                const isOpen = status !== 'empty' && status !== 'paid';
                const isSelected = selectedTable?.id === t.id;
                const bg = status === 'paid' ? '#9ca3af' : status === 'ordering' ? '#fbbf24' : status === 'paying' ? '#60a5fa' : isOpen ? '#4ade80' : 'white';
                const border = isSelected ? '3px solid #6b21a8' : '2px solid #d1d5db';

                return (
                  <button key={t.id} onClick={() => { if (status !== 'paid') openTable(t); }} disabled={status === 'paid'}
                    style={{
                      position: 'absolute', left: `${t.x}%`, top: `${t.y}%`,
                      transform: 'translate(-50%,-50%)',
                      width: t.seats >= 6 ? 72 : t.seats >= 4 ? 60 : 52,
                      height: t.seats >= 6 ? 72 : t.seats >= 4 ? 60 : 52,
                      borderRadius: t.seats >= 6 ? 12 : '50%',
                      background: bg, border: border,
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                      cursor: status === 'paid' ? 'default' : 'pointer',
                      boxShadow: isSelected ? '0 4px 16px rgba(107,33,168,0.4)' : '0 2px 6px rgba(0,0,0,0.1)',
                      fontSize: 11, fontWeight: 700, color: status === 'ordering' ? '#1a1a2e' : 'white',
                      padding: 4,
                    }}>
                    <span style={{ fontSize: 16 }}>{t.seats >= 6 ? '🍦' : t.seats >= 4 ? '🥗' : '☕'}</span>
                    <span style={{ fontSize: 10, marginTop: 2 }}>T{t.id}</span>
                    <span style={{ fontSize: 9, opacity: 0.8 }}>{t.seats}p</span>
                    {status === 'ordering' && <span style={{ fontSize: 9, marginTop: 1 }}>🍽️</span>}
                    {status === 'paying' && <span style={{ fontSize: 9, marginTop: 1 }}>💳</span>}
                    {status === 'paid' && <span style={{ fontSize: 9, marginTop: 1 }}>✅</span>}
                  </button>
                );
              })}
            </div>

            {/* Table info */}
            {selectedTable && (
              <div style={{ background: 'white', borderRadius: 16, padding: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', marginBottom: 16 }}>
                <div style={{ fontWeight: 800, color: '#1a1a2e', marginBottom: 12 }}>Table {selectedTable.id} · {selectedTable.seats} seats</div>
                {step === 'seating' ? (
                  <div>
                    <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 8 }}>Who's in your party?</div>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                      <input value={guestName} onChange={e => setGuestName(e.target.value)} placeholder="Guest name"
                        style={{ flex: 1, padding: '8px 12px', border: '2px solid #e5e7eb', borderRadius: 8, fontSize: 14 }} />
                      <select value={seatCount} onChange={e => setSeatCount(Number(e.target.value))}
                        style={{ padding: '8px 12px', border: '2px solid #e5e7eb', borderRadius: 8, fontSize: 14 }}>
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(n => <option key={n} value={n}>{n} guest{n > 1 ? 's' : ''}</option>)}
                      </select>
                    </div>
                    <button onClick={seatGuests} disabled={!guestName.trim()} style={{
                      width: '100%', background: '#6b21a8', color: 'white', border: 'none', borderRadius: 10, padding: '12px',
                      fontSize: 14, fontWeight: 700, cursor: guestName.trim() ? 'pointer' : 'not-allowed', opacity: guestName.trim() ? 1 : 0.5,
                    }}>
                      Seat Party ✓
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => { setStep('ordering'); }} style={{ flex: 1, background: '#6b21a8', color: 'white', border: 'none', borderRadius: 10, padding: '12px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
                      🍽️ Take Order
                    </button>
                    <button onClick={() => { setSelectedTable(null); setStep('welcome'); setSessions(prev => { const n = new Map(prev); n.delete(selectedTable.id); return n; }); }} style={{ flex: 1, background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 10, padding: '12px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
                      Clear Table
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Legend */}
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', fontSize: 11, color: '#6b7280' }}>
              {[['white', 'Empty'], ['#4ade80', 'Seated'], ['#fbbf24', 'Ordering'], ['#60a5fa', 'Paying'], ['#9ca3af', 'Done']].map(([c, l]) => (
                <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <div style={{ width: 12, height: 12, borderRadius: 3, background: c, border: '1px solid #d1d5db' }}></div>{l}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── WAITLIST ──────────────────────────────────────────────── */}
        {view === 'waitlist' && (
          <div>
            <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>📋 Current Waitlist</div>
            <div style={{ background: 'white', borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', marginBottom: 16 }}>
              {waitlist.length === 0 && (
                <div style={{ padding: 32, textAlign: 'center', color: '#9ca3af', fontSize: 14 }}>No one waiting — nice job! 🎉</div>
              )}
              {waitlist.map((entry, i) => (
                <div key={entry.id} style={{ padding: '14px 16px', borderBottom: i < waitlist.length - 1 ? '1px solid #f3f4f6' : 'none', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ background: '#fef3c7', color: '#92400e', borderRadius: 8, padding: '4px 10px', fontSize: 12, fontWeight: 700 }}>
                    #{i + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, color: '#1a1a2e', fontSize: 14 }}>{entry.name}</div>
                    <div style={{ fontSize: 12, color: '#6b7280' }}>{entry.partySize} guests · Added {Math.round((Date.now() - entry.timeAdded) / 60000)}m ago</div>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {(() => {
                      const openTable = TABLES.find(t => !sessions.has(t.id) && !paidTables.has(t.id) && t.seats >= entry.partySize);
                      return openTable ? (
                        <button onClick={() => { openTable(openTable); setWaitlist(prev => prev.filter(w => w.id !== entry.id)); }}
                          style={{ background: '#dcfce7', color: '#15803d', border: 'none', borderRadius: 8, padding: '6px 12px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                          Seat T{openTable.id} ✓
                        </button>
                      ) : (
                        <span style={{ fontSize: 11, color: '#9ca3af', padding: '6px 0' }}>No table available</span>
                      );
                    })()}
                    <button onClick={() => setWaitlist(prev => prev.filter(w => w.id !== entry.id)) style={{ background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 8, padding: '6px 10px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>✕</button>
                  </div>
                </div>
              ))}
            </div>
            {/* Add to waitlist */}
            <div style={{ background: 'white', borderRadius: 16, padding: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: '#1a1a2e', marginBottom: 10 }}>+ Add to Waitlist</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <input value={waitName} onChange={e => setWaitName(e.target.value)} placeholder="Guest name"
                  style={{ flex: 1, padding: '8px 12px', border: '2px solid #e5e7eb', borderRadius: 8, fontSize: 14 }} />
                <select value={waitSize} onChange={e => setWaitSize(Number(e.target.value))}
                  style={{ padding: '8px 12px', border: '2px solid #e5e7eb', borderRadius: 8, fontSize: 14 }}>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(n => <option key={n} value={n}>{n} guest{n > 1 ? 's' : ''}</option>)}
                </select>
                <button onClick={() => { if (!waitName.trim()) return; setWaitlist(prev => [...prev, { id: nextWaitId(), name: waitName.trim(), partySize: waitSize, timeAdded: Date.now() }]); setWaitName(''); }} style={{ background: '#6b21a8', color: 'white', border: 'none', borderRadius: 8, padding: '8px 16px', fontWeight: 700, cursor: 'pointer' }}>Add</button>
              </div>
            </div>
          </div>
        )}

        {/* ── ORDERING ──────────────────────────────────────────────── */}
        {step === 'ordering' && selectedTable && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <button onClick={() => setStep('seating')} style={{ background: '#f3f4f6', border: 'none', borderRadius: 8, padding: '6px 12px', fontSize: 13, cursor: 'pointer' }}>← Back</button>
              <div style={{ fontWeight: 800, color: '#1a1a2e', fontSize: 16 }}>🍽️ Table {selectedTable.id} — {getSession(selectedTable.id).guests[0]?.name ?? 'Guests'}</div>
            </div>

            {/* Current orders */}
            {getSession(selectedTable.id).orders.length > 0 && (
              <div style={{ background: 'white', borderRadius: 12, padding: 12, marginBottom: 14, boxShadow: '0 2px 6px rgba(0,0,0,0.07)' }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: '#6b7280', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>Current Order</div>
                {getSession(selectedTable.id).orders.map(o => (
                  <div key={o.item.id} style={{ display: 'flex', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid #f3f4f6' }}>
                    <span style={{ fontSize: 16, marginRight: 8 }}>{o.item.emoji}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{o.item.name}</div>
                      <div style={{ fontSize: 11, color: '#6b7280' }}>{formatPrice(o.item.price)} × {o.qty}</div>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: 13 }}>{formatPrice(o.item.price * o.qty)}</div>
                    <button onClick={() => removeOrder(o.item.id)} style={{ marginLeft: 8, background: '#fee2e2', border: 'none', borderRadius: 6, width: 24, height: 24, cursor: 'pointer', color: '#dc2626', fontSize: 12 }}>−</button>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 8, fontWeight: 800, fontSize: 14 }}>
                  <span>Subtotal</span><span>{formatPrice(subtotal)}</span>
                </div>
              </div>
            )}

            {/* Category tabs */}
            <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 8, marginBottom: 10 }}>
              {MENU_CATEGORIES.map(cat => (
                <button key={cat} onClick={() => setOrderCategory(cat)} style={{
                  padding: '6px 14px', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600,
                  background: orderCategory === cat ? '#6b21a8' : '#e9d5ff', color: orderCategory === cat ? 'white' : '#6b21a8', whiteSpace: 'nowrap',
                }}>{cat}</button>
              ))}
            </div>

            {/* Menu grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 8, marginBottom: 16 }}>
              {MENU.filter(m => m.category === orderCategory).map(item => (
                <button key={item.id} onClick={() => addOrder(item)}
                  style={{ background: 'white', border: '2px solid #e5e7eb', borderRadius: 12, padding: '10px 8px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.15s' }}>
                  <div style={{ fontSize: 24, marginBottom: 4 }}>{item.emoji}</div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#1a1a2e', lineHeight: 1.3 }}>{item.name}</div>
                  <div style={{ fontSize: 12, fontWeight: 800, color: '#15803d', marginTop: 4 }}>{formatPrice(item.price)}</div>
                </button>
              ))}
            </div>

            {/* Totals + Pay */}
            <div style={{ background: '#1a1a2e', borderRadius: 16, padding: 16, color: 'white', position: 'sticky', bottom: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 13, opacity: 0.7 }}><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 13, opacity: 0.7 }}><span>Tax (6.5%)</span><span>{formatPrice(tax)}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 20, fontWeight: 800, borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: 8, marginBottom: 12 }}><span>Total</span><span>{formatPrice(total)}</span></div>
              <button onClick={processPayment} disabled={subtotal === 0} style={{
                width: '100%', background: subtotal === 0 ? '#374151' : '#4ade80', color: 'white', border: 'none',
                borderRadius: 10, padding: '14px', fontSize: 16, fontWeight: 800, cursor: subtotal === 0 ? 'not-allowed' : 'pointer',
              }}>
                💳 Process Payment — {formatPrice(total)}
              </button>
            </div>
          </div>
        )}

        {/* ── PAYMENT SUCCESS ─────────────────────────────────────────── */}
        {step === 'paying' && (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: 72, marginBottom: 16 }}>🎉</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#1a1a2e', marginBottom: 8 }}>Great job!</div>
            <div style={{ fontSize: 16, color: '#6b7280' }}>Table {selectedTable?.id} has been cleared.<br />Ready for the next guests!</div>
          </div>
        )}

      </div>
    </div>
  );
}
