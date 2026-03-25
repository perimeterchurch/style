import{n as e,o as t}from"./chunk-zsgVPwQN.js";import{t as n}from"./iframe-y60K9PgX.js";import{n as r,t as i}from"./cn-B2z1THJy.js";import{t as a}from"./jsx-runtime-LHjHBB0E.js";var o,s,c,l=e((()=>{o={primary:{base:`bg-[var(--color-primary)]/10 text-[var(--color-primary)] dark:text-[var(--color-primary)]`},secondary:{base:`bg-[var(--color-stone-100)] text-[var(--color-stone-700)] dark:bg-[var(--color-stone-800)] dark:text-[var(--color-stone-300)]`},success:{base:`bg-[var(--color-success)]/10 text-[var(--color-success)] dark:bg-[var(--color-success)]/10 dark:text-[var(--color-success)]`},warning:{base:`bg-[var(--color-warning)]/10 text-[var(--color-warning)] dark:bg-[var(--color-warning)]/10 dark:text-[var(--color-warning)]`},error:{base:`bg-[var(--color-error)]/10 text-[var(--color-error)] dark:bg-[var(--color-error)]/10 dark:text-[var(--color-error)]`},info:{base:`bg-[var(--color-info)]/10 text-[var(--color-info)] dark:bg-[var(--color-info)]/10 dark:text-[var(--color-info)]`},ghost:{base:`bg-transparent text-[var(--color-stone-600)] dark:text-[var(--color-stone-400)] border border-[var(--color-stone-200)] dark:border-[var(--color-stone-700)]`}},s={xs:{padding:`px-1.5 py-0.5 gap-1`,fontSize:`text-xs`},sm:{padding:`px-2 py-0.5 gap-1`,fontSize:`text-xs`},md:{padding:`px-2.5 py-1 gap-1.5`,fontSize:`text-sm`},lg:{padding:`px-3 py-1.5 gap-1.5`,fontSize:`text-sm`},xl:{padding:`px-3.5 py-2 gap-2`,fontSize:`text-base`}},c={xs:`h-3 w-3`,sm:`h-3 w-3`,md:`h-3.5 w-3.5`,lg:`h-4 w-4`,xl:`h-4.5 w-4.5`}}));function u({className:e}){return(0,f.jsxs)(`svg`,{className:e,"aria-hidden":`true`,xmlns:`http://www.w3.org/2000/svg`,fill:`none`,viewBox:`0 0 24 24`,stroke:`currentColor`,strokeWidth:`2`,strokeLinecap:`round`,strokeLinejoin:`round`,children:[(0,f.jsx)(`path`,{d:`M18 6 6 18`}),(0,f.jsx)(`path`,{d:`m6 6 12 12`})]})}var d,f,p,m=e((()=>{d=t(n(),1),r(),l(),f=a(),p=(0,d.forwardRef)(({label:e,onRemove:t,variant:n=`primary`,size:r=`md`,className:a,...l},d)=>{let p=o[n],m=s[r];return(0,f.jsxs)(`span`,{ref:d,className:i(`inline-flex items-center rounded-full font-medium`,`transition-all duration-200`,`hover:shadow-sm`,p.base,m.padding,m.fontSize,a),...l,children:[e,t&&(0,f.jsx)(`button`,{type:`button`,onClick:e=>{e.stopPropagation(),t()},className:i(`inline-flex items-center justify-center shrink-0`,`rounded-full opacity-60 hover:opacity-100 hover:scale-110`,`transition-all duration-150`,`focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-current`),"aria-label":`Remove ${e}`,children:(0,f.jsx)(u,{className:c[r]})})]})}),p.displayName=`FilterChip`,p.__docgenInfo={description:``,methods:[],displayName:`FilterChip`,props:{"data-testid":{required:!1,tsType:{name:`string`},description:`Test identifier`},label:{required:!0,tsType:{name:`string`},description:`Chip label text`},onRemove:{required:!1,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:`Callback when remove button is clicked`},variant:{required:!1,tsType:{name:`union`,raw:`keyof typeof chipVariants`,elements:[{name:`literal`,value:`primary`},{name:`literal`,value:`secondary`},{name:`literal`,value:`success`},{name:`literal`,value:`warning`},{name:`literal`,value:`error`},{name:`literal`,value:`info`},{name:`literal`,value:`ghost`}]},description:`Visual variant`,defaultValue:{value:`'primary'`,computed:!1}},size:{required:!1,tsType:{name:`union`,raw:`keyof typeof chipSizes`,elements:[{name:`literal`,value:`xs`},{name:`literal`,value:`sm`},{name:`literal`,value:`md`},{name:`literal`,value:`lg`},{name:`literal`,value:`xl`}]},description:`Chip size`,defaultValue:{value:`'md'`,computed:!1}}},composes:[`Omit`]}})),h,g,_,v,y,b,x;e((()=>{m(),l(),h=a(),g={title:`Components/Primitives/FilterChip`,component:p,argTypes:{variant:{control:`select`,options:Object.keys(o)},size:{control:`select`,options:Object.keys(s)},label:{control:`text`}}},_={args:{label:`Filter`,variant:`primary`,size:`md`}},v={render:()=>(0,h.jsx)(`div`,{style:{display:`flex`,gap:`0.5rem`,flexWrap:`wrap`},children:Object.keys(o).map(e=>(0,h.jsx)(p,{label:e,variant:e},e))})},y={render:()=>(0,h.jsx)(`div`,{style:{display:`flex`,gap:`0.5rem`,alignItems:`center`},children:Object.keys(s).map(e=>(0,h.jsx)(p,{label:e,size:e},e))})},b={render:()=>(0,h.jsx)(`div`,{style:{display:`flex`,gap:`0.5rem`,flexWrap:`wrap`},children:Object.keys(o).map(e=>(0,h.jsx)(p,{label:e,variant:e,onRemove:()=>{}},e))})},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Filter',
    variant: 'primary',
    size: 'md'
  }
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap'
  }}>
            {Object.keys(chipVariants).map(variant => <FilterChip key={variant} label={variant} variant={variant as keyof typeof chipVariants} />)}
        </div>
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center'
  }}>
            {Object.keys(chipSizes).map(size => <FilterChip key={size} label={size} size={size as keyof typeof chipSizes} />)}
        </div>
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap'
  }}>
            {Object.keys(chipVariants).map(variant => <FilterChip key={variant} label={variant} variant={variant as keyof typeof chipVariants} onRemove={() => {}} />)}
        </div>
}`,...b.parameters?.docs?.source}}},x=[`Default`,`AllVariants`,`AllSizes`,`WithRemove`]}))();export{y as AllSizes,v as AllVariants,_ as Default,b as WithRemove,x as __namedExportsOrder,g as default};