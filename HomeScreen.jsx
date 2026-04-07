import EMOTIONS from '../data/emotions.json'
import OILS from '../data/oils.json'
import { T, ZONES } from '../theme'
import { Card, GoldDivider, DoTerraBadge } from '../components/ui/index.jsx'

export default function HomeScreen({ nav }) {
  const today = new Date()
  const featured = EMOTIONS[today.getDate() % EMOTIONS.length]
  const zone = ZONES.find(z => z.id === featured.zone)

  return (
    <div style={{ padding:'0 0 100px' }}>
      <div className="fu" style={{ textAlign:'center', padding:'58px 24px 0' }}>
        <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, letterSpacing:'0.22em', textTransform:'uppercase', color:T.inkM, marginBottom:8 }}>
          Welcome to
        </p>
        <h1 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:44, fontWeight:300, color:T.gold, letterSpacing:'0.06em', lineHeight:1.0 }}>
          Beautiful<br />Emotions
        </h1>
        <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:T.inkM, marginTop:10, letterSpacing:'0.03em', fontStyle:'italic' }}>
          A journey through scent and feeling
        </p>
      </div>

      <div className="fu1" style={{ display:'flex', justifyContent:'center', marginTop:16 }}>
        <DoTerraBadge />
      </div>

      <GoldDivider style={{ margin:'28px 24px 0' }} />

      <div className="fu2" style={{ padding:'20px 20px 0' }}>
        <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, letterSpacing:'0.18em', textTransform:'uppercase', color:T.inkM, marginBottom:10 }}>
          Today's emotion
        </p>
        <Card hoverable onClick={() => nav('emotion-detail', { id: featured.id })} style={{ padding:24 }}>
          <div style={{ display:'flex', alignItems:'flex-start', gap:16 }}>
            <div style={{ width:48, height:48, borderRadius:14, flexShrink:0, background:`linear-gradient(135deg,${zone.fill},rgba(245,214,214,0.4))`, border:`1px solid ${zone.line}44`, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <div style={{ width:18, height:18, borderRadius:'50%', border:`1.5px solid ${zone.line}`, opacity:0.7 }} />
            </div>
            <div style={{ flex:1 }}>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                <h2 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:26, fontWeight:400, color:T.ink, letterSpacing:'0.02em' }}>{featured.name}</h2>
                <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:10, letterSpacing:'0.1em', textTransform:'uppercase', color:zone.line, padding:'2px 8px', borderRadius:999, background:`${zone.fill}88`, border:`1px solid ${zone.line}44` }}>{featured.zone}</span>
              </div>
              <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13.5, color:T.inkS, lineHeight:1.55, marginBottom:12 }}>{featured.desc}</p>
              <p style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:15, fontStyle:'italic', color:T.inkM, lineHeight:1.5 }}>"{featured.affirmation}"</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="fu3" style={{ padding:'24px 20px 0' }}>
        <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, letterSpacing:'0.18em', textTransform:'uppercase', color:T.inkM, marginBottom:10 }}>Explore</p>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          {[
            { label:'Emotion Wheel', sub:`${EMOTIONS.length} emotional states`, icon:'🌸', screen:'emotions', bg:'rgba(251,221,213,0.5)' },
            { label:'Oil Library',   sub:`${OILS.length} essential oils`,        icon:'💧', screen:'oils',     bg:'rgba(213,232,211,0.5)' },
          ].map(item => (
            <Card key={item.screen} hoverable onClick={() => nav(item.screen)} style={{ padding:'20px 16px', background:item.bg }}>
              <div style={{ fontSize:26, marginBottom:10 }}>{item.icon}</div>
              <p style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:18, fontWeight:400, color:T.ink, marginBottom:3 }}>{item.label}</p>
              <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, color:T.inkM, letterSpacing:'0.04em' }}>{item.sub}</p>
            </Card>
          ))}
        </div>
      </div>

      <div className="fu4" style={{ margin:'24px 20px 0' }}>
        <Card style={{ padding:'20px 24px', background:'rgba(201,169,110,0.08)' }}>
          <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:10, letterSpacing:'0.18em', textTransform:'uppercase', color:T.gold, marginBottom:8 }}>Affirmation</p>
          <p style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:19, fontStyle:'italic', color:T.inkS, lineHeight:1.6 }}>"{featured.affirmation}"</p>
        </Card>
      </div>
    </div>
  )
}
