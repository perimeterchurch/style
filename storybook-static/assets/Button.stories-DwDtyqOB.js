import{n as e}from"./chunk-zsgVPwQN.js";import{t}from"./jsx-runtime-LHjHBB0E.js";import{a as n,i as r,n as i,r as a,t as o}from"./Button-8bzbBR94.js";var s,c,l,u,d,f,p,m,h,g;e((()=>{i(),n(),s=t(),c={title:`Components/Primitives/Button`,component:o,argTypes:{variant:{control:`select`,options:Object.keys(r)},size:{control:`select`,options:Object.keys(a)},outline:{control:`boolean`},fullWidth:{control:`boolean`},disabled:{control:`boolean`},isLoading:{control:`boolean`}}},l={args:{children:`Button`,variant:`primary`,size:`md`}},u={render:()=>(0,s.jsx)(`div`,{style:{display:`flex`,gap:`0.5rem`,flexWrap:`wrap`},children:Object.keys(r).map(e=>(0,s.jsx)(o,{variant:e,children:e},e))})},d={render:()=>(0,s.jsx)(`div`,{style:{display:`flex`,gap:`0.5rem`,alignItems:`center`},children:Object.keys(a).map(e=>(0,s.jsx)(o,{size:e,children:e},e))})},f={render:()=>(0,s.jsx)(`div`,{style:{display:`flex`,gap:`0.5rem`,flexWrap:`wrap`},children:Object.keys(r).map(e=>(0,s.jsx)(o,{variant:e,outline:!0,children:e},e))})},p={args:{children:`Loading...`,isLoading:!0}},m={args:{children:`Disabled`,disabled:!0}},h={args:{children:`Playground`,variant:`primary`,size:`md`,outline:!1,fullWidth:!1,disabled:!1,isLoading:!1}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'Button',
    variant: 'primary',
    size: 'md'
  }
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap'
  }}>
            {Object.keys(buttonVariants).map(variant => <Button key={variant} variant={variant as keyof typeof buttonVariants}>
                    {variant}
                </Button>)}
        </div>
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center'
  }}>
            {Object.keys(buttonSizes).map(size => <Button key={size} size={size as keyof typeof buttonSizes}>
                    {size}
                </Button>)}
        </div>
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap'
  }}>
            {Object.keys(buttonVariants).map(variant => <Button key={variant} variant={variant as keyof typeof buttonVariants} outline>
                    {variant}
                </Button>)}
        </div>
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'Loading...',
    isLoading: true
  }
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'Disabled',
    disabled: true
  }
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'Playground',
    variant: 'primary',
    size: 'md',
    outline: false,
    fullWidth: false,
    disabled: false,
    isLoading: false
  }
}`,...h.parameters?.docs?.source}}},g=[`Default`,`AllVariants`,`AllSizes`,`Outline`,`Loading`,`Disabled`,`Playground`]}))();export{d as AllSizes,u as AllVariants,l as Default,m as Disabled,p as Loading,f as Outline,h as Playground,g as __namedExportsOrder,c as default};