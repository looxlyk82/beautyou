import { useState, useMemo, useRef, useEffect, useCallback } from 'react'
import EMOTIONS from '../data/emotions.json'
import OILS from '../data/oils.json'
import { T, ZONES, MOODS, FAMILIES } from '../theme'
import { Card, BackButton, Label, OilDot, Chevron } from '../components/ui/index.jsx'

// ── SVG helpers ───────────────────────────────────────────────────────────────
const CX = 150, CY = 150, OR = 128, IR = 52
function pol(cx, cy, r, deg) {
  const rad = (deg - 90) * Math.PI / 180
  return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)]
}
function arcD(cx, cy, R, ri, s, e) {
  const gap = 1.8
  const [ox1,oy1] = pol(cx,cy,R,  s+gap), [ox2,oy2] = pol(cx,cy,R,  e-gap)
  const [ix1,iy1] = pol(cx,cy,ri, s+gap), [ix2,iy2] = pol(cx,cy,ri, e-gap)
  const lg = (e-s)>180?1:0
  return `M${ox1},${oy1} A${R},${R},0,${lg},1,${ox2},${oy2} L${ix2},${iy2} A${ri},${ri},0,${lg},0,${ix1},${iy1} Z`
}

// ── Emotion Wheel ─────────────────────────────────────────────────────────────
export function EmotionWheelScreen({ nav }) {
  const [active, setActive] = useState(null)
  const zoneEmotions = useMemo(() => active ? EMOTIONS.filter(e => e.zone === active) : [], [active])

  return (
    <div style={{ paddingBottom:100 }}>
      <div style={{ padding:'52px 24px 0', textAlign:'center' }}>
        <h1 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:38, fontWeight:300, color:T.gold, letterSpacing:'0.06em' }}>Emotions</h1>
        <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:T.inkM, marginTop:6, fontStyle:'italic' }}>Tap a zone to explore</p>
      </div>

      <div className="fu1" style={{ margin:'24px auto 0', maxWidth:320, padding:'0 16px' }}>
        <svg viewBox="0 0 300 300" width="100%" height="100%">
          <defs>
            {ZONES.map(z => (
              <radialGradient key={z.id} id={`g-${z.id}`} cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={z.fill} stopOpacity="0.9" />
                <stop offset="100%" stopColor={z.fill} stopOpacity="0.55" />
              </radialGradient>
            ))}
          </defs>
          <circle cx={CX} cy={CY} r={OR+4} fill="none" stroke="rgba(201,169,110,0.28)" strokeWidth="1.5" />
          {ZONES.map(z => {
            const on = active === z.id
            const mid = (z.s+z.e)/2
            const [lx,ly] = pol(CX,CY,(OR+IR)/2,mid)
            return (
              <g key={z.id} onClick={() => setActive(on?null:z.id)} style={{ cursor:'pointer' }} opacity={active&&!on?0.42:1}>
                <path d={arcD(CX,CY,OR,IR,z.s,z.e)} fill={on?`url(#g-${z.id})`:z.fill} stroke={z.line} strokeWidth={on?1.8:1.2}
                  style={{ transition:'all .22s ease', filter:on?'drop-shadow(0 2px 8px rgba(44,40,37,0.14))':'none' }} />
                <text x={lx} y={ly} textAnchor="middle" dominantBaseline="middle"
                  fontFamily="'Cormorant Garamond',Georgia,serif" fontSize={on?12:11} fontWeight={on?500:400}
                  fill={on?T.ink:T.inkS} style={{ pointerEvents:'none', userSelect:'none' }}>
                  {z.label}
                </text>
              </g>
            )
          })}
          <circle cx={CX} cy={CY} r={IR-2} fill="rgba(253,240,239,0.88)" stroke="rgba(201,169,110,0.32)" strokeWidth="1.2" />
          <g transform={`translate(${CX},${CY})`}>
            <circle r="20" fill="none" stroke="rgba(201,169,110,0.5)" strokeWidth="1" />
            {[0,60,120,180,240,300].map(a => {
              const rad=(a-90)*Math.PI/180
              return <ellipse key={a} cx={12*Math.cos(rad)} cy={12*Math.sin(rad)} rx="3.5" ry="5.5"
                transform={`rotate(${a} ${12*Math.cos(rad)} ${12*Math.sin(rad)})`}
                fill="rgba(201,169,110,0.22)" stroke="rgba(201,169,110,0.5)" strokeWidth="0.7" />
            })}
            <circle r="5" fill="rgba(232,213,176,0.7)" stroke="rgba(201,169,110,0.6)" strokeWidth="0.8" />
            <circle r="2" fill="#C9A96E" />
          </g>
          {ZONES.map(z => {
            const [ax,ay]=pol(CX,CY,OR+9,z.s), [bx,by]=pol(CX,CY,OR+14,z.s)
            return <line key={z.id} x1={ax} y1={ay} x2={bx} y2={by} stroke="rgba(201,169,110,0.45)" strokeWidth="1" />
          })}
        </svg>
      </div>

      {active ? (
        <div className="fu" style={{ padding:'0 20px' }}>
          {(() => {
            const z = ZONES.find(x => x.id === active)
            return <>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14 }}>
                <div style={{ width:28, height:3, borderRadius:2, background:z.line }} />
                <p style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:22, color:T.ink }}>{z.label} emotions</p>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {zoneEmotions.map((em,i) => (
                  <Card key={em.id} hoverable onClick={() => nav('emotion-detail',{id:em.id})} style={{ padding:'16px 18px', display:'flex', alignItems:'center', gap:14, animation:`fadeUp .4s ${i*0.05}s cubic-bezier(.22,1,.36,1) both` }}>
                    <div style={{ width:10, height:10, borderRadius:'50%', flexShrink:0, background:z.line, opacity:0.8 }} />
                    <div style={{ flex:1 }}>
                      <p style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:20, color:T.ink, marginBottom:2 }}>{em.name}</p>
                      <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:T.inkM, lineHeight:1.4 }}>{em.desc.substring(0,72)}…</p>
                    </div>
                    <Chevron />
                  </Card>
                ))}
              </div>
            </>
          })()}
        </div>
      ) : (
        <div style={{ padding:'0 20px' }}>
          <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:T.inkM, textAlign:'center', fontStyle:'italic', marginTop:4, marginBottom:16 }}>
            Select a zone above to explore its emotional states
          </p>
          <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
            {EMOTIONS.map(em => {
              const z = ZONES.find(x => x.id === em.zone)
              return (
                <button key={em.id} onClick={() => nav('emotion-detail',{id:em.id})}
                  style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, padding:'6px 14px', borderRadius:999, cursor:'pointer', background:`${z.fill}88`, border:`1px solid ${z.line}55`, color:T.inkS, letterSpacing:'0.03em', transition:'all .18s ease' }}>
                  {em.name}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Emotion Detail ─────────────────────────────────────────────────────────────
export function EmotionDetailScreen({ id, nav }) {
  const em = EMOTIONS.find(e => e.id === id)
  if (!em) return null
  const zone = ZONES.find(z => z.id === em.zone)
  const oils = em.oils.map(oid => OILS.find(o => o.id === oid)).filter(Boolean)

  return (
    <div style={{ paddingBottom:100 }}>
      <div style={{ padding:'50px 20px 0' }}><BackButton onClick={() => nav('emotions')} /></div>
      <div className="fu" style={{ padding:'20px 24px 0' }}>
        <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, letterSpacing:'0.14em', textTransform:'uppercase', color:zone.line }}>{zone.label}</span>
        <h1 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:48, fontWeight:300, color:T.ink, lineHeight:1.0, marginTop:2 }}>{em.name}</h1>
      </div>
      <div style={{ padding:'20px 24px', display:'flex', flexDirection:'column', gap:16 }}>
        <Card className="fu1" style={{ padding:'20px 22px' }}>
          <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:15, color:T.inkS, lineHeight:1.65 }}>{em.desc}</p>
        </Card>
        <Card className="fu2" style={{ padding:'20px 22px', background:'rgba(201,169,110,0.08)' }}>
          <Label style={{ marginBottom:10 }}>Affirmation</Label>
          <p style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:20, fontStyle:'italic', color:T.inkS, lineHeight:1.6 }}>"{em.affirmation}"</p>
        </Card>
        <div className="fu3">
          <Label style={{ marginBottom:10 }}>Recommended oils</Label>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {oils.map(oil => (
              <Card key={oil.id} hoverable onClick={() => nav('oil-detail',{id:oil.id})} style={{ padding:'14px 16px', display:'flex', alignItems:'center', gap:12 }}>
                <OilDot colour={oil.colour} />
                <div style={{ flex:1 }}>
                  <p style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:18, color:T.ink }}>{oil.name}</p>
                  <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, color:T.inkM }}>{oil.tagline}</p>
                </div>
                <Chevron />
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Oil Library ────────────────────────────────────────────────────────────────
export function OilLibraryScreen({ nav }) {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('All')

  const visible = useMemo(() =>
    OILS.filter(o => {
      const q = query.toLowerCase()
      const matchQ = !q || o.name.toLowerCase().includes(q) || o.tagline.toLowerCase().includes(q) || o.props.some(p => p.toLowerCase().includes(q))
      const matchF = filter === 'All' || o.family === filter
      return matchQ && matchF
    }), [query, filter])

  return (
    <div style={{ paddingBottom:100 }}>
      <div style={{ padding:'52px 24px 0', textAlign:'center' }}>
        <h1 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:38, fontWeight:300, color:T.gold, letterSpacing:'0.06em' }}>Oil Library</h1>
        <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:T.inkM, marginTop:6, fontStyle:'italic' }}>{OILS.length} essential oils & blends</p>
      </div>

      <div className="fu1" style={{ padding:'24px 20px 0' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, background:'rgba(253,240,239,0.7)', backdropFilter:'blur(12px)', WebkitBackdropFilter:'blur(12px)', border:'1px solid rgba(201,169,110,0.25)', borderRadius:14, padding:'10px 16px' }}>
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" stroke={T.inkM} strokeWidth="1.8"/><path d="M20 20l-3-3" stroke={T.inkM} strokeWidth="1.8" strokeLinecap="round"/></svg>
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search oils, properties…"
            style={{ flex:1, background:'none', border:'none', outline:'none', fontFamily:"'DM Sans',sans-serif", fontSize:14, color:T.ink }} />
          {query && <button onClick={() => setQuery('')} style={{ background:'none', border:'none', cursor:'pointer', color:T.inkM, fontSize:18, lineHeight:1 }}>×</button>}
        </div>
      </div>

      <div className="fu2" style={{ padding:'12px 20px 0', overflowX:'auto', display:'flex', gap:8, paddingBottom:4, whiteSpace:'nowrap' }}>
        {FAMILIES.map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, letterSpacing:'0.08em', textTransform:'capitalize', padding:'6px 14px', borderRadius:999, cursor:'pointer', flexShrink:0, background:filter===f?T.gold:'rgba(253,240,239,0.7)', border:`1px solid ${filter===f?T.gold:'rgba(201,169,110,0.28)'}`, color:filter===f?'#fff':T.inkS, transition:'all .18s ease' }}>
            {f==='All'?'All oils':f}
          </button>
        ))}
      </div>

      <div style={{ padding:'10px 20px 4px' }}>
        <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, color:T.inkM, letterSpacing:'0.06em' }}>{visible.length} {visible.length===1?'oil':'oils'}</p>
      </div>

      <div style={{ padding:'0 20px', display:'flex', flexDirection:'column', gap:10 }}>
        {visible.map((oil,i) => (
          <Card key={oil.id} hoverable onClick={() => nav('oil-detail',{id:oil.id})}
            style={{ padding:'16px 18px', display:'flex', alignItems:'center', gap:14, animation:`fadeUp .42s ${i*0.02}s cubic-bezier(.22,1,.36,1) both` }}>
            <OilDot colour={oil.colour} />
            <div style={{ flex:1, minWidth:0 }}>
              <p style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:20, color:T.ink, marginBottom:1 }}>{oil.name}</p>
              <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, color:T.inkM, fontStyle:'italic', marginBottom:5 }}>{oil.latin}</p>
              <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:T.inkS }}>{oil.tagline}</p>
              <div style={{ display:'flex', flexWrap:'wrap', gap:5, marginTop:7 }}>
                {oil.props.map(p => (
                  <span key={p} style={{ fontFamily:"'DM Sans',sans-serif", fontSize:10, padding:'2px 8px', borderRadius:999, background:`${oil.colour}25`, border:`1px solid ${oil.colour}50`, color:T.inkS }}>{p}</span>
                ))}
              </div>
            </div>
            <Chevron />
          </Card>
        ))}
        {visible.length === 0 && (
          <div style={{ textAlign:'center', padding:'48px 0' }}>
            <p style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:20, color:T.inkM, fontStyle:'italic' }}>No oils found</p>
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:T.inkM, marginTop:6 }}>Try a different search or filter</p>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Oil Detail ─────────────────────────────────────────────────────────────────
export function OilDetailScreen({ id, nav }) {
  const oil = OILS.find(o => o.id === id)
  if (!oil) return null
  const pairs = oil.pairs.map(pid => OILS.find(o => o.id === pid)).filter(Boolean)
  const relatedEmotions = EMOTIONS.filter(em => em.oils.includes(oil.id))

  return (
    <div style={{ paddingBottom:100 }}>
      <div style={{ padding:'50px 20px 0' }}><BackButton onClick={() => nav('oils')} /></div>
      <div className="fu" style={{ padding:'20px 24px 0' }}>
        <Card style={{ padding:'24px 22px', background:`linear-gradient(140deg,${oil.colour}18,rgba(253,240,239,0.8))` }}>
          <div style={{ display:'flex', alignItems:'flex-start', gap:16 }}>
            <OilDot colour={oil.colour} size={56} dotSize={20} radius={16} />
            <div style={{ flex:1 }}>
              <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:10, letterSpacing:'0.14em', textTransform:'uppercase', color:oil.colour, marginBottom:2 }}>{oil.family} · {oil.size}</p>
              <h1 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:34, fontWeight:300, color:T.ink, lineHeight:1.0 }}>{oil.name}</h1>
              <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:T.inkM, fontStyle:'italic', marginTop:3 }}>{oil.latin}</p>
            </div>
          </div>
          <p style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:17, color:T.inkS, marginTop:14, fontStyle:'italic' }}>{oil.tagline}</p>
        </Card>
      </div>

      <div style={{ padding:'16px 24px', display:'flex', flexDirection:'column', gap:14 }}>
        <Card className="fu1" style={{ padding:'18px 20px' }}>
          <Label style={{ marginBottom:10 }}>Emotional properties</Label>
          <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
            {oil.props.map(p => (
              <span key={p} style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, padding:'6px 14px', borderRadius:999, background:`${oil.colour}22`, border:`1px solid ${oil.colour}55`, color:T.inkS }}>{p}</span>
            ))}
          </div>
        </Card>

        <Card className="fu2" style={{ padding:'18px 20px' }}>
          <Label style={{ marginBottom:10 }}>Application methods</Label>
          <div style={{ display:'flex', gap:10 }}>
            {oil.apps.map(a => (
              <div key={a} style={{ flex:1, textAlign:'center', padding:'10px 8px', borderRadius:12, background:'rgba(201,169,110,0.08)', border:'1px solid rgba(201,169,110,0.2)' }}>
                <p style={{ fontSize:18, marginBottom:4 }}>{a==='Topical'?'🖐':a==='Aromatic'?'🌬':'💧'}</p>
                <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:10, color:T.inkS, letterSpacing:'0.06em' }}>{a}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="fu3" style={{ padding:'18px 20px', background:'rgba(201,169,110,0.08)' }}>
          <Label style={{ marginBottom:10, color:T.gold }}>Affirmation</Label>
          <p style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:19, fontStyle:'italic', color:T.inkS, lineHeight:1.6 }}>"{oil.affirmation}"</p>
        </Card>

        {relatedEmotions.length > 0 && (
          <div className="fu4">
            <Label style={{ marginBottom:10 }}>Supports these emotions</Label>
            <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
              {relatedEmotions.map(em => {
                const z = ZONES.find(x => x.id === em.zone)
                return (
                  <button key={em.id} onClick={() => nav('emotion-detail',{id:em.id})}
                    style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, padding:'6px 14px', borderRadius:999, cursor:'pointer', background:`${z.fill}88`, border:`1px solid ${z.line}55`, color:T.inkS }}>
                    {em.name}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {pairs.length > 0 && (
          <div className="fu5">
            <Label style={{ marginBottom:10 }}>Pairs beautifully with</Label>
            <div style={{ display:'flex', gap:10, overflowX:'auto', paddingBottom:4 }}>
              {pairs.map(p => (
                <Card key={p.id} hoverable onClick={() => nav('oil-detail',{id:p.id})} style={{ padding:'14px 16px', flexShrink:0, minWidth:120, textAlign:'center' }}>
                  <OilDot colour={p.colour} size={28} dotSize={10} radius={10} style={{ margin:'0 auto 8px' }} />
                  <p style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:15, color:T.ink }}>{p.name}</p>
                </Card>
              ))}
            </div>
          </div>
        )}

        {oil.safetyNote && (
          <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, color:T.inkM, textAlign:'center', lineHeight:1.5, padding:'0 8px' }}>
            ⚠️ {oil.safetyNote}
          </p>
        )}
      </div>
    </div>
  )
}

// ── Journal ────────────────────────────────────────────────────────────────────
function fmtLong(iso)  { return new Date(iso).toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long',year:'numeric'}) }
function fmtShort(iso) { return new Date(iso).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'}) }
function todayKey()    { return new Date().toISOString().slice(0,10) }
function loadAll()     { try { return JSON.parse(localStorage.getItem('be_journal')||'{}') } catch { return {} } }

export function JournalScreen() {
  const [entries, setEntries] = useState(loadAll)
  const [text,    setText]    = useState(() => loadAll()[todayKey()]?.text || '')
  const [mood,    setMood]    = useState(() => loadAll()[todayKey()]?.mood || null)
  const [saved,   setSaved]   = useState(false)
  const [expanded,setExpanded]= useState(null)
  const debounceRef  = useRef(null)
  const textareaRef  = useRef(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px'
    }
  }, [text])

  const save = useCallback((t, m) => {
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      const key = todayKey()
      const updated = { ...loadAll(), [key]: { text:t, mood:m, date:key, updatedAt:new Date().toISOString() } }
      localStorage.setItem('be_journal', JSON.stringify(updated))
      setEntries(updated)
      setSaved(true)
      setTimeout(() => setSaved(false), 2200)
    }, 900)
  }, [])

  function handleMood(id) { const next=mood===id?null:id; setMood(next); save(text,next) }

  const past = Object.values(entries).filter(e => e.date!==todayKey()&&e.text?.trim()).sort((a,b)=>b.date.localeCompare(a.date))
  const moodObj = MOODS.find(m => m.id === mood)

  function exportEntry(entry) {
    const content = `Beautiful Emotions Journal\n${fmtLong(entry.date)}\nMood: ${entry.mood||'unset'}\n\n${entry.text}`
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([content],{type:'text/plain'}))
    a.download = `journal-${entry.date}.txt`
    a.click()
  }

  return (
    <div style={{ paddingBottom:120 }}>
      <div className="fu" style={{ padding:'52px 24px 0' }}>
        <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between' }}>
          <div>
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, letterSpacing:'0.2em', textTransform:'uppercase', color:T.inkM, marginBottom:4 }}>Today</p>
            <h1 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:24, fontWeight:300, color:T.gold, letterSpacing:'0.04em', lineHeight:1.1 }}>{fmtLong(todayKey())}</h1>
          </div>
          {saved && (
            <span className="saved-pulse" style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, color:T.sage, display:'flex', alignItems:'center', gap:5 }}>
              <svg width="12" height="12" fill="none" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" stroke={T.sage} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Saved
            </span>
          )}
        </div>
        <div style={{ height:1, marginTop:16, background:'linear-gradient(to right,rgba(201,169,110,0.5),transparent)' }} />
      </div>

      <div className="fu1" style={{ padding:'18px 24px 0' }}>
        <Label style={{ marginBottom:10 }}>How are you feeling?</Label>
        <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
          {MOODS.map(m => {
            const on = mood === m.id
            return (
              <button key={m.id} onClick={() => handleMood(m.id)}
                style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, padding:'7px 16px', borderRadius:999, cursor:'pointer', background:on?m.colour:'rgba(253,240,239,0.7)', border:`1.5px solid ${on?m.colour:'rgba(201,169,110,0.28)'}`, color:on?'#fff':T.inkS, letterSpacing:'0.03em', transition:'all .2s ease', boxShadow:on?`0 4px 14px ${m.colour}55`:'none' }}>
                {m.label}
              </button>
            )
          })}
        </div>
      </div>

      <div className="fu2" style={{ padding:'20px 20px 0' }}>
        <Card style={{ padding:'20px 22px', background:moodObj?`linear-gradient(140deg,${moodObj.colour}0D,rgba(253,240,239,0.78))`:'rgba(253,240,239,0.78)', transition:'background .5s ease' }}>
          <div style={{ position:'relative' }}>
            <div style={{ position:'absolute', top:0, left:0, right:0, bottom:0, pointerEvents:'none', backgroundImage:'repeating-linear-gradient(to bottom,transparent,transparent 31px,rgba(201,169,110,0.1) 31px,rgba(201,169,110,0.1) 32px)', backgroundPositionY:'8px' }} />
            <textarea ref={textareaRef} value={text} onChange={e => { setText(e.target.value); save(e.target.value, mood) }}
              placeholder="Begin writing… let your thoughts flow freely here."
              rows={7}
              style={{ width:'100%', minHeight:180, background:'transparent', border:'none', outline:'none', fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:19, lineHeight:'32px', color:T.ink, letterSpacing:'0.01em', position:'relative', zIndex:1, padding:0 }} />
          </div>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:14, paddingTop:12, borderTop:'1px solid rgba(201,169,110,0.2)' }}>
            <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, color:T.inkM }}>{text.trim().split(/\s+/).filter(Boolean).length} words</span>
            <button onClick={() => exportEntry({date:todayKey(),text,mood})} disabled={!text.trim()}
              style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, letterSpacing:'0.1em', textTransform:'uppercase', padding:'6px 14px', borderRadius:999, cursor:text.trim()?'pointer':'default', background:'none', border:`1px solid ${text.trim()?'rgba(201,169,110,0.5)':'rgba(201,169,110,0.2)'}`, color:text.trim()?T.gold:T.inkM, display:'flex', alignItems:'center', gap:6, opacity:text.trim()?1:0.5 }}>
              <svg width="12" height="12" fill="none" viewBox="0 0 24 24"><path d="M12 3v13M7 11l5 5 5-5M3 21h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Save .txt
            </button>
          </div>
        </Card>
      </div>

      {past.length > 0 && (
        <div className="fu3" style={{ padding:'28px 20px 0' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14 }}>
            <div style={{ width:24, height:1, background:'rgba(201,169,110,0.4)' }} />
            <Label>Past entries</Label>
            <div style={{ flex:1, height:1, background:'rgba(201,169,110,0.2)' }} />
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {past.map((entry, i) => {
              const m = MOODS.find(x => x.id === entry.mood)
              const open = expanded === entry.date
              return (
                <Card key={entry.date} hoverable onClick={() => setExpanded(open?null:entry.date)}
                  style={{ overflow:'hidden', animation:`fadeUp .4s ${i*0.04}s cubic-bezier(.22,1,.36,1) both` }}>
                  <div style={{ padding:'14px 18px', display:'flex', alignItems:'center', gap:12 }}>
                    <div style={{ width:8, height:8, borderRadius:'50%', flexShrink:0, background:m?m.colour:'rgba(201,169,110,0.5)' }} />
                    <div style={{ flex:1, minWidth:0 }}>
                      <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:T.inkM, marginBottom:2 }}>
                        {fmtShort(entry.date)}{m&&<span style={{ marginLeft:8, color:m.colour }}>· {m.label}</span>}
                      </p>
                      <p style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:16, color:T.inkS, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                        {entry.text.slice(0,65)}{entry.text.length>65?'…':''}
                      </p>
                    </div>
                    <Chevron deg={open?90:0} />
                  </div>
                  {open && (
                    <div style={{ padding:'0 18px 18px', borderTop:'1px solid rgba(201,169,110,0.15)' }}>
                      <p style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:17, color:T.inkS, lineHeight:1.7, paddingTop:14, whiteSpace:'pre-wrap' }}>{entry.text}</p>
                      <button onClick={e => { e.stopPropagation(); exportEntry(entry) }}
                        style={{ marginTop:14, fontFamily:"'DM Sans',sans-serif", fontSize:11, letterSpacing:'0.1em', textTransform:'uppercase', padding:'6px 14px', borderRadius:999, cursor:'pointer', background:'none', border:'1px solid rgba(201,169,110,0.4)', color:T.gold, display:'inline-flex', alignItems:'center', gap:6 }}>
                        <svg width="11" height="11" fill="none" viewBox="0 0 24 24"><path d="M12 3v13M7 11l5 5 5-5M3 21h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        Export
                      </button>
                    </div>
                  )}
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {past.length === 0 && !text.trim() && (
        <div style={{ padding:'40px 24px', textAlign:'center' }}>
          <p style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:18, fontStyle:'italic', color:T.inkM, lineHeight:1.6 }}>
            Your journal begins here.<br />Write your first entry above.
          </p>
        </div>
      )}
    </div>
  )
}
