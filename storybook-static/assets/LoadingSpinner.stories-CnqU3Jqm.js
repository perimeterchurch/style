import{n as e}from"./chunk-zsgVPwQN.js";import{t}from"./jsx-runtime-LHjHBB0E.js";import{i as n,n as r,r as i,t as a}from"./LoadingSpinner-w3CDkhbS.js";var o,s,c,l,u;e((()=>{r(),i(),o=t(),s={title:`Components/Primitives/LoadingSpinner`,component:a,argTypes:{size:{control:`select`,options:Object.keys(n)}}},c={args:{size:`md`}},l={render:()=>(0,o.jsx)(`div`,{style:{display:`flex`,gap:`1.5rem`,alignItems:`center`},children:Object.keys(n).map(e=>(0,o.jsxs)(`div`,{style:{textAlign:`center`},children:[(0,o.jsx)(a,{size:e}),(0,o.jsx)(`p`,{style:{fontSize:`0.75rem`,color:`var(--color-text-muted)`,marginTop:`0.5rem`},children:e})]},e))})},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    size: 'md'
  }
}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    gap: '1.5rem',
    alignItems: 'center'
  }}>
            {Object.keys(spinnerSizeClasses).map(size => <div key={size} style={{
      textAlign: 'center'
    }}>
                    <LoadingSpinner size={size as keyof typeof spinnerSizeClasses} />
                    <p style={{
        fontSize: '0.75rem',
        color: 'var(--color-text-muted)',
        marginTop: '0.5rem'
      }}>
                        {size}
                    </p>
                </div>)}
        </div>
}`,...l.parameters?.docs?.source}}},u=[`Default`,`AllSizes`]}))();export{l as AllSizes,c as Default,u as __namedExportsOrder,s as default};