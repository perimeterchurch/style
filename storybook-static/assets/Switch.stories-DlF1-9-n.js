import{n as e,o as t}from"./chunk-zsgVPwQN.js";import{t as n}from"./iframe-y60K9PgX.js";import{n as r,t as i}from"./cn-B2z1THJy.js";import{t as a}from"./jsx-runtime-LHjHBB0E.js";var o,s,c=e((()=>{o={xs:{track:`h-4 w-7`,knob:`before:h-3 before:w-3`,translate:`checked:before:translate-x-3`},sm:{track:`h-5 w-9`,knob:`before:h-4 before:w-4`,translate:`checked:before:translate-x-4`},md:{track:`h-6 w-11`,knob:`before:h-5 before:w-5`,translate:`checked:before:translate-x-5`},lg:{track:`h-7 w-13`,knob:`before:h-6 before:w-6`,translate:`checked:before:translate-x-6`},xl:{track:`h-8 w-15`,knob:`before:h-7 before:w-7`,translate:`checked:before:translate-x-7`}},s={xs:`text-xs`,sm:`text-sm`,md:`text-sm`,lg:`text-base`,xl:`text-lg`}})),l,u,d,f=e((()=>{l=t(n(),1),r(),c(),u=a(),d=(0,l.forwardRef)(({className:e,label:t,size:n=`md`,disabled:r,id:a,...c},l)=>{let d=a||(t?`switch-${t.replace(/\s+/g,`-`).toLowerCase()}`:void 0),f=o[n],p=(0,u.jsx)(`input`,{ref:l,type:`checkbox`,role:`switch`,id:d,disabled:r,className:i(`relative shrink-0 appearance-none rounded-full`,`transition-colors duration-200 cursor-pointer`,`active:scale-95`,f.track,`bg-[var(--color-stone-300)] checked:bg-[var(--color-primary)]`,`dark:bg-[var(--color-stone-600)]`,`focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/50 focus-visible:ring-offset-2`,`disabled:cursor-not-allowed disabled:opacity-50`,`before:content-[""] before:absolute before:top-[2px] before:left-[2px]`,`before:rounded-full before:bg-[var(--color-background)]`,`before:transition-transform before:duration-200`,`before:shadow-sm`,f.knob,f.translate,!t&&e),...c});return t?(0,u.jsxs)(`div`,{className:i(`inline-flex items-center gap-2`,e),children:[p,(0,u.jsx)(`label`,{htmlFor:d,className:i(`cursor-pointer select-none`,`text-[var(--color-stone-700)] dark:text-[var(--color-stone-300)]`,s[n],r&&`cursor-not-allowed opacity-50`),children:t})]}):p}),d.displayName=`Switch`,d.__docgenInfo={description:``,methods:[],displayName:`Switch`,props:{"data-testid":{required:!1,tsType:{name:`string`},description:`Test identifier`},label:{required:!1,tsType:{name:`string`},description:`Associated label text`},size:{required:!1,tsType:{name:`union`,raw:`keyof typeof switchSizes`,elements:[{name:`literal`,value:`xs`},{name:`literal`,value:`sm`},{name:`literal`,value:`md`},{name:`literal`,value:`lg`},{name:`literal`,value:`xl`}]},description:`Switch size`,defaultValue:{value:`'md'`,computed:!1}}},composes:[`Omit`]}})),p,m,h,g,_,v,y;e((()=>{f(),c(),p=a(),m={title:`Components/Primitives/Switch`,component:d,argTypes:{size:{control:`select`,options:Object.keys(o)},label:{control:`text`},disabled:{control:`boolean`}}},h={args:{label:`Enable notifications`,size:`md`}},g={render:()=>(0,p.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`0.75rem`},children:Object.keys(o).map(e=>(0,p.jsx)(d,{size:e,label:`Size: ${e}`},e))})},_={args:{label:`Disabled switch`,disabled:!0}},v={args:{size:`md`}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Enable notifications',
    size: 'md'
  }
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem'
  }}>
            {Object.keys(switchSizeClasses).map(size => <Switch key={size} size={size as keyof typeof switchSizeClasses} label={\`Size: \${size}\`} />)}
        </div>
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Disabled switch',
    disabled: true
  }
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  args: {
    size: 'md'
  }
}`,...v.parameters?.docs?.source}}},y=[`Default`,`AllSizes`,`Disabled`,`WithoutLabel`]}))();export{g as AllSizes,h as Default,_ as Disabled,v as WithoutLabel,y as __namedExportsOrder,m as default};