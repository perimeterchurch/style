import{n as e,o as t}from"./chunk-zsgVPwQN.js";import{t as n}from"./iframe-y60K9PgX.js";import{n as r,t as i}from"./cn-B2z1THJy.js";import{t as a}from"./jsx-runtime-LHjHBB0E.js";var o,s=e((()=>{o={xs:`h-6 w-6 text-xs`,sm:`h-8 w-8 text-sm`,md:`h-10 w-10 text-base`,lg:`h-12 w-12 text-lg`,xl:`h-16 w-16 text-xl`}})),c,l,u,d=e((()=>{c=t(n(),1),r(),s(),l=a(),u=(0,c.forwardRef)(({src:e,alt:t=``,fallback:n=`?`,size:r=`md`,className:a,...s},u)=>{let[d,f]=(0,c.useState)(!1),p=e&&!d;return(0,l.jsx)(`div`,{ref:u,className:i(`relative inline-flex items-center justify-center`,`rounded-full overflow-hidden`,`bg-[var(--color-stone-200)] text-[var(--color-stone-600)]`,`dark:bg-[var(--color-stone-700)] dark:text-[var(--color-stone-300)]`,`font-medium select-none shrink-0`,`transition-all duration-200`,o[r],a),...s,children:p?(0,l.jsx)(`img`,{src:e,alt:t,onError:()=>f(!0),className:`h-full w-full object-cover`}):typeof n==`string`?(0,l.jsx)(`span`,{className:`uppercase`,children:n}):n})}),u.displayName=`Avatar`,u.__docgenInfo={description:``,methods:[],displayName:`Avatar`,props:{"data-testid":{required:!1,tsType:{name:`string`},description:`Test identifier`},src:{required:!1,tsType:{name:`string`},description:`Image source URL`},alt:{required:!1,tsType:{name:`string`},description:`Alt text for image`,defaultValue:{value:`''`,computed:!1}},fallback:{required:!1,tsType:{name:`ReactNode`},description:`Fallback initials, text, or icon element`,defaultValue:{value:`'?'`,computed:!1}},size:{required:!1,tsType:{name:`union`,raw:`keyof typeof avatarSizes`,elements:[{name:`literal`,value:`xs`},{name:`literal`,value:`sm`},{name:`literal`,value:`md`},{name:`literal`,value:`lg`},{name:`literal`,value:`xl`}]},description:`Avatar size`,defaultValue:{value:`'md'`,computed:!1}}},composes:[`Omit`]}})),f,p,m,h,g,_,v;e((()=>{d(),s(),f=a(),p={title:`Components/Primitives/Avatar`,component:u,argTypes:{size:{control:`select`,options:Object.keys(o)},src:{control:`text`},alt:{control:`text`}}},m={args:{fallback:`PB`,size:`md`}},h={render:()=>(0,f.jsx)(`div`,{style:{display:`flex`,gap:`1rem`,alignItems:`center`},children:Object.keys(o).map(e=>(0,f.jsxs)(`div`,{style:{textAlign:`center`},children:[(0,f.jsx)(u,{size:e,fallback:`PC`}),(0,f.jsx)(`p`,{style:{fontSize:`0.75rem`,color:`var(--color-text-muted)`,marginTop:`0.25rem`},children:e})]},e))})},g={args:{src:`https://api.dicebear.com/9.x/initials/svg?seed=PC`,alt:`Perimeter Church`,size:`lg`}},_={render:()=>(0,f.jsxs)(`div`,{style:{display:`flex`,gap:`0.75rem`},children:[(0,f.jsx)(u,{fallback:`AB`}),(0,f.jsx)(u,{fallback:`CD`}),(0,f.jsx)(u,{fallback:`?`})]})},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    fallback: 'PB',
    size: 'md'
  }
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    gap: '1rem',
    alignItems: 'center'
  }}>
            {Object.keys(avatarSizeClasses).map(size => <div key={size} style={{
      textAlign: 'center'
    }}>
                    <Avatar size={size as keyof typeof avatarSizeClasses} fallback="PC" />
                    <p style={{
        fontSize: '0.75rem',
        color: 'var(--color-text-muted)',
        marginTop: '0.25rem'
      }}>
                        {size}
                    </p>
                </div>)}
        </div>
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    src: 'https://api.dicebear.com/9.x/initials/svg?seed=PC',
    alt: 'Perimeter Church',
    size: 'lg'
  }
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    gap: '0.75rem'
  }}>
            <Avatar fallback="AB" />
            <Avatar fallback="CD" />
            <Avatar fallback="?" />
        </div>
}`,..._.parameters?.docs?.source}}},v=[`Default`,`AllSizes`,`WithImage`,`FallbackInitials`]}))();export{h as AllSizes,m as Default,_ as FallbackInitials,g as WithImage,v as __namedExportsOrder,p as default};