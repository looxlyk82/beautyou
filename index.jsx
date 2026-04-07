import { useState } from 'react'
import { T } from '../../theme'

// ── Frosted Glass Card ────────────────────────────────────────────────────────
export function Card({ children, style, onClick, hoverable, className }) {
  const [hov, setHov] = useState(false)
  return (
    <div
      className={className}
      onClick={onClick}
      onMouseEnter={() => hoverable && setHov(true)}
      onMouseLeave={() => hoverable && setHov(false)}
      style={{
        background: 'rgba(253,240,239,0.74)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        border: `1px solid rgba(201,169,110,${hov ? 0.38 : 0.22})`,
        borderRadius: 20,
        boxShadow: hov
          ? '0 8px 40px rgba(44,40,37,0.11), 0 2px 8px rgba(44,40,37,0.07)'
          : '0 4px 24px rgba(44,40,37,0.07), 0 1px 4px rgba(44,40,37,0.04)',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'box-shadow .22s ease, border-color .22s ease, transform .22s ease',
        transform: hov ? 'translateY(-2px)' : 'none',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

// ── Chevron Arrow ─────────────────────────────────────────────────────────────
export function Chevron({ size = 14, colour = T.inkM, deg = 0 }) {
  return (
    <svg width={size} height={size} fill="none" viewBox="0 0 24 24"
      style={{ flexShrink:0, transition:'transform .22s ease', transform:`rotate(${deg}deg)` }}>
      <path d="M9 6l6 6-6 6" stroke={colour} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

// ── Back Button ───────────────────────────────────────────────────────────────
export function BackButton({ onClick }) {
  return (
    <button onClick={onClick}
      style={{ display:'flex', alignItems:'center', gap:6, background:'none',
        border:'none', cursor:'pointer', fontFamily:"'DM Sans',sans-serif",
        fontSize:12, color:T.inkM, letterSpacing:'0.06em', padding:0 }}>
      <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
        <path d="M19 12H5M5 12l7-7M5 12l7 7" stroke={T.inkM} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      Back
    </button>
  )
}

// ── Gold Divider ──────────────────────────────────────────────────────────────
export function GoldDivider({ style }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:12, ...style }}>
      <div style={{ flex:1, height:1, background:'linear-gradient(to right, transparent, rgba(201,169,110,0.3))' }} />
      <div style={{ width:5, height:5, transform:'rotate(45deg)', background:T.gold, opacity:0.5 }} />
      <div style={{ flex:1, height:1, background:'linear-gradient(to left, transparent, rgba(201,169,110,0.3))' }} />
    </div>
  )
}

// ── Section Label ─────────────────────────────────────────────────────────────
export function Label({ children, style }) {
  return (
    <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:10,
      letterSpacing:'0.18em', textTransform:'uppercase', color:T.inkM, ...style }}>
      {children}
    </p>
  )
}

// ── doTERRA Badge ─────────────────────────────────────────────────────────────
export function DoTerraBadge() {
  return (
    <div style={{ display:'inline-flex', alignItems:'center', gap:6,
      border:`1px solid rgba(201,169,110,0.4)`, borderRadius:999,
      padding:'6px 16px', background:'rgba(201,169,110,0.06)' }}>
      <div style={{ width:6, height:6, borderRadius:'50%', background:T.gold }} />
      <span style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:13,
        color:T.gold, letterSpacing:'0.06em' }}>
        In partnership with doTERRA®
      </span>
    </div>
  )
}

// ── Oil Colour Dot ────────────────────────────────────────────────────────────
export function OilDot({ colour, size = 36, dotSize = 12, radius = 12 }) {
  return (
    <div style={{ width:size, height:size, borderRadius:radius, flexShrink:0,
      background:`${colour}44`, border:`1.5px solid ${colour}88`,
      display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ width:dotSize, height:dotSize, borderRadius:'50%', background:colour }} />
    </div>
  )
}
