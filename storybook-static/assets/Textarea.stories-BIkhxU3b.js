import{n as e}from"./chunk-zsgVPwQN.js";import{t}from"./jsx-runtime-LHjHBB0E.js";import{i as n,n as r,r as i,t as a}from"./Textarea-DnUJYQQa.js";var o,s,c,l,u,d,f;e((()=>{r(),i(),o=t(),s={title:`Components/Primitives/Textarea`,component:a,argTypes:{size:{control:`select`,options:Object.keys(n)},fullWidth:{control:`boolean`},disabled:{control:`boolean`},error:{control:`boolean`}}},c={args:{placeholder:`Enter your message...`,size:`md`}},l={render:()=>(0,o.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`0.75rem`,maxWidth:400},children:Object.keys(n).map(e=>(0,o.jsx)(a,{size:e,placeholder:`Size: ${e}`},e))})},u={args:{placeholder:`This field has an error`,error:!0}},d={args:{placeholder:`Disabled textarea`,disabled:!0}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    placeholder: 'Enter your message...',
    size: 'md'
  }
}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    maxWidth: 400
  }}>
            {Object.keys(textareaTextSizes).map(size => <Textarea key={size} size={size as keyof typeof textareaTextSizes} placeholder={\`Size: \${size}\`} />)}
        </div>
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    placeholder: 'This field has an error',
    error: true
  }
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    placeholder: 'Disabled textarea',
    disabled: true
  }
}`,...d.parameters?.docs?.source}}},f=[`Default`,`AllSizes`,`WithError`,`Disabled`]}))();export{l as AllSizes,c as Default,d as Disabled,u as WithError,f as __namedExportsOrder,s as default};