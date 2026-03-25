import{n as e}from"./chunk-zsgVPwQN.js";import{t}from"./jsx-runtime-LHjHBB0E.js";import{i as n,n as r,r as i,t as a}from"./Input-DQf7FcqP.js";var o,s,c,l,u,d,f,p;e((()=>{r(),i(),o=t(),s={title:`Components/Primitives/Input`,component:a,argTypes:{size:{control:`select`,options:Object.keys(n)},fullWidth:{control:`boolean`},disabled:{control:`boolean`}}},c={args:{placeholder:`Enter text...`,size:`md`}},l={render:()=>(0,o.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`0.75rem`,maxWidth:300},children:Object.keys(n).map(e=>(0,o.jsx)(a,{size:e,placeholder:`Size: ${e}`},e))})},u={args:{placeholder:`Invalid input`,error:`This field is required`}},d={name:`Compound API`,render:()=>(0,o.jsxs)(a.Root,{error:`Email is required`,fullWidth:!0,children:[(0,o.jsx)(a.Field,{placeholder:`Enter email...`}),(0,o.jsx)(a.Error,{})]})},f={args:{placeholder:`Disabled input`,disabled:!0}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    placeholder: 'Enter text...',
    size: 'md'
  }
}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    maxWidth: 300
  }}>
            {Object.keys(inputSizeClasses).map(size => <Input key={size} size={size as keyof typeof inputSizeClasses} placeholder={\`Size: \${size}\`} />)}
        </div>
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    placeholder: 'Invalid input',
    error: 'This field is required'
  }
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  name: 'Compound API',
  render: () => <Input.Root error="Email is required" fullWidth>
            <Input.Field placeholder="Enter email..." />
            <Input.Error />
        </Input.Root>
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    placeholder: 'Disabled input',
    disabled: true
  }
}`,...f.parameters?.docs?.source}}},p=[`Default`,`AllSizes`,`WithError`,`CompoundAPI`,`Disabled`]}))();export{l as AllSizes,d as CompoundAPI,c as Default,f as Disabled,u as WithError,p as __namedExportsOrder,s as default};