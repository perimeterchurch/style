import{n as e}from"./chunk-zsgVPwQN.js";import{t}from"./jsx-runtime-LHjHBB0E.js";import{i as n,n as r,r as i,t as a}from"./Checkbox-CvUzMClF.js";var o,s,c,l,u,d,f,p;e((()=>{r(),n(),o=t(),s={title:`Components/Primitives/Checkbox`,component:a,argTypes:{size:{control:`select`,options:Object.keys(i)},label:{control:`text`},disabled:{control:`boolean`},error:{control:`boolean`}}},c={args:{label:`Accept terms and conditions`,size:`md`}},l={render:()=>(0,o.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`0.75rem`},children:Object.keys(i).map(e=>(0,o.jsx)(a,{size:e,label:`Size: ${e}`},e))})},u={args:{label:`This field is required`,error:!0}},d={args:{label:`Disabled checkbox`,disabled:!0}},f={args:{size:`md`}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Accept terms and conditions',
    size: 'md'
  }
}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem'
  }}>
            {Object.keys(checkboxSizeClasses).map(size => <Checkbox key={size} size={size as keyof typeof checkboxSizeClasses} label={\`Size: \${size}\`} />)}
        </div>
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'This field is required',
    error: true
  }
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Disabled checkbox',
    disabled: true
  }
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    size: 'md'
  }
}`,...f.parameters?.docs?.source}}},p=[`Default`,`AllSizes`,`WithError`,`Disabled`,`WithoutLabel`]}))();export{l as AllSizes,c as Default,d as Disabled,u as WithError,f as WithoutLabel,p as __namedExportsOrder,s as default};