import{n as e}from"./chunk-zsgVPwQN.js";import{t}from"./jsx-runtime-LHjHBB0E.js";import{a as n,i as r,n as i,r as a,t as o}from"./Badge-7bwH_5d_.js";var s,c,l,u,d,f,p,m;e((()=>{i(),n(),s=t(),c={title:`Components/Primitives/Badge`,component:o,argTypes:{variant:{control:`select`,options:Object.keys(r)},size:{control:`select`,options:Object.keys(a)},dot:{control:`boolean`},outline:{control:`boolean`}}},l={args:{children:`Badge`,variant:`secondary`,size:`md`}},u={render:()=>(0,s.jsx)(`div`,{style:{display:`flex`,gap:`0.5rem`,flexWrap:`wrap`},children:Object.keys(r).map(e=>(0,s.jsx)(o,{variant:e,children:e},e))})},d={render:()=>(0,s.jsx)(`div`,{style:{display:`flex`,gap:`0.5rem`,alignItems:`center`},children:Object.keys(a).map(e=>(0,s.jsx)(o,{size:e,children:e},e))})},f={render:()=>(0,s.jsx)(`div`,{style:{display:`flex`,gap:`0.5rem`,flexWrap:`wrap`},children:Object.keys(r).map(e=>(0,s.jsx)(o,{variant:e,dot:!0,children:e},e))})},p={render:()=>(0,s.jsx)(`div`,{style:{display:`flex`,gap:`0.5rem`,flexWrap:`wrap`},children:Object.keys(r).map(e=>(0,s.jsx)(o,{variant:e,outline:!0,children:e},e))})},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'Badge',
    variant: 'secondary',
    size: 'md'
  }
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap'
  }}>
            {Object.keys(badgeVariants).map(variant => <Badge key={variant} variant={variant as keyof typeof badgeVariants}>
                    {variant}
                </Badge>)}
        </div>
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center'
  }}>
            {Object.keys(badgeSizes).map(size => <Badge key={size} size={size as keyof typeof badgeSizes}>
                    {size}
                </Badge>)}
        </div>
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap'
  }}>
            {Object.keys(badgeVariants).map(variant => <Badge key={variant} variant={variant as keyof typeof badgeVariants} dot>
                    {variant}
                </Badge>)}
        </div>
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap'
  }}>
            {Object.keys(badgeVariants).map(variant => <Badge key={variant} variant={variant as keyof typeof badgeVariants} outline>
                    {variant}
                </Badge>)}
        </div>
}`,...p.parameters?.docs?.source}}},m=[`Default`,`AllVariants`,`AllSizes`,`WithDot`,`Outline`]}))();export{d as AllSizes,u as AllVariants,l as Default,p as Outline,f as WithDot,m as __namedExportsOrder,c as default};