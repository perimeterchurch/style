import{n as e}from"./chunk-zsgVPwQN.js";import{t}from"./jsx-runtime-LHjHBB0E.js";import{i as n,n as r,r as i,t as a}from"./Select-BJq8dYtd.js";var o,s,c,l,u,d,f,p;e((()=>{r(),i(),o=t(),s=[{value:``,label:`Select an option...`},{value:`option1`,label:`Option 1`},{value:`option2`,label:`Option 2`},{value:`option3`,label:`Option 3`}],c={title:`Components/Primitives/Select`,component:a,argTypes:{size:{control:`select`,options:Object.keys(n)},fullWidth:{control:`boolean`},disabled:{control:`boolean`},error:{control:`boolean`}}},l={args:{options:s,size:`md`}},u={render:()=>(0,o.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`0.75rem`,maxWidth:300},children:Object.keys(n).map(e=>(0,o.jsx)(a,{size:e,options:[{value:``,label:`Size: ${e}`},...s.slice(1)]},e))})},d={args:{options:s,error:!0}},f={args:{options:s,disabled:!0}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    options: sampleOptions,
    size: 'md'
  }
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    maxWidth: 300
  }}>
            {Object.keys(selectSizeClasses).map(size => <Select key={size} size={size as keyof typeof selectSizeClasses} options={[{
      value: '',
      label: \`Size: \${size}\`
    }, ...sampleOptions.slice(1)]} />)}
        </div>
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    options: sampleOptions,
    error: true
  }
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    options: sampleOptions,
    disabled: true
  }
}`,...f.parameters?.docs?.source}}},p=[`Default`,`AllSizes`,`WithError`,`Disabled`]}))();export{u as AllSizes,l as Default,f as Disabled,d as WithError,p as __namedExportsOrder,c as default};