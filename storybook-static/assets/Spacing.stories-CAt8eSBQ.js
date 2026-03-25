import{n as e}from"./chunk-zsgVPwQN.js";import{t}from"./jsx-runtime-LHjHBB0E.js";var n,r,i,a,o;e((()=>{n=t(),r={title:`Foundation/Spacing`},i=[{name:`xs`,value:`0.5rem`,px:`8px`},{name:`sm`,value:`0.75rem`,px:`12px`},{name:`md`,value:`1rem`,px:`16px`},{name:`lg`,value:`1.5rem`,px:`24px`},{name:`xl`,value:`2rem`,px:`32px`},{name:`2xl`,value:`3rem`,px:`48px`},{name:`3xl`,value:`4rem`,px:`64px`}],a={render:()=>(0,n.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`1rem`},children:i.map(e=>(0,n.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`1rem`},children:[(0,n.jsxs)(`div`,{style:{width:80,textAlign:`right`,flexShrink:0},children:[(0,n.jsx)(`div`,{style:{fontWeight:600,fontSize:`0.875rem`},children:e.name}),(0,n.jsxs)(`div`,{style:{fontSize:`0.75rem`,color:`var(--color-text-muted)`},children:[e.value,` / `,e.px]})]}),(0,n.jsx)(`div`,{style:{width:e.value,height:32,backgroundColor:`var(--color-primary)`,borderRadius:4,opacity:.8}}),(0,n.jsxs)(`div`,{style:{fontSize:`0.75rem`,fontFamily:`var(--font-mono)`,color:`var(--color-text-secondary)`},children:[`--spacing-`,e.name]})]},e.name))})},a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  }}>
            {spacingTokens.map(token => <div key={token.name} style={{
      display: 'flex',
      alignItems: 'center',
      gap: '1rem'
    }}>
                    <div style={{
        width: 80,
        textAlign: 'right',
        flexShrink: 0
      }}>
                        <div style={{
          fontWeight: 600,
          fontSize: '0.875rem'
        }}>{token.name}</div>
                        <div style={{
          fontSize: '0.75rem',
          color: 'var(--color-text-muted)'
        }}>
                            {token.value} / {token.px}
                        </div>
                    </div>
                    <div style={{
        width: token.value,
        height: 32,
        backgroundColor: 'var(--color-primary)',
        borderRadius: 4,
        opacity: 0.8
      }} />
                    <div style={{
        fontSize: '0.75rem',
        fontFamily: 'var(--font-mono)',
        color: 'var(--color-text-secondary)'
      }}>
                        --spacing-{token.name}
                    </div>
                </div>)}
        </div>
}`,...a.parameters?.docs?.source}}},o=[`AllSpacing`]}))();export{a as AllSpacing,o as __namedExportsOrder,r as default};