import{n as e}from"./chunk-zsgVPwQN.js";import{t}from"./jsx-runtime-LHjHBB0E.js";import{n,t as r}from"./Button-8bzbBR94.js";import{n as i,t as a}from"./Checkbox-CvUzMClF.js";import{n as o,t as s}from"./Input-DQf7FcqP.js";import{n as c,t as l}from"./Label-TnybYTvG.js";import{n as u,t as d}from"./Select-BJq8dYtd.js";import{n as f,t as p}from"./Textarea-DnUJYQQa.js";var m,h,g,_,v;e((()=>{n(),o(),c(),f(),u(),i(),m=t(),h={title:`Patterns/FormLayout`},g={render:()=>(0,m.jsxs)(`form`,{style:{maxWidth:400,display:`flex`,flexDirection:`column`,gap:`1rem`},onSubmit:e=>e.preventDefault(),children:[(0,m.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`0.25rem`},children:[(0,m.jsx)(l,{htmlFor:`name`,required:!0,children:`Full Name`}),(0,m.jsx)(s,{id:`name`,placeholder:`Enter your name`,fullWidth:!0})]}),(0,m.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`0.25rem`},children:[(0,m.jsx)(l,{htmlFor:`email`,required:!0,children:`Email`}),(0,m.jsx)(s,{id:`email`,type:`email`,placeholder:`you@example.com`,fullWidth:!0})]}),(0,m.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`0.25rem`},children:[(0,m.jsx)(l,{htmlFor:`message`,children:`Message`}),(0,m.jsx)(p,{id:`message`,placeholder:`Write your message...`,fullWidth:!0})]}),(0,m.jsx)(r,{variant:`primary`,type:`submit`,fullWidth:!0,children:`Submit`})]})},_={name:`With Error States`,render:()=>(0,m.jsxs)(`form`,{style:{maxWidth:400,display:`flex`,flexDirection:`column`,gap:`1rem`},onSubmit:e=>e.preventDefault(),children:[(0,m.jsxs)(s.Root,{error:`This field is required`,fullWidth:!0,children:[(0,m.jsx)(l,{htmlFor:`username`,required:!0,children:`Username`}),(0,m.jsx)(s.Field,{id:`username`,placeholder:`Choose a username`}),(0,m.jsx)(s.Error,{})]}),(0,m.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`0.25rem`},children:[(0,m.jsx)(l,{htmlFor:`role`,children:`Role`}),(0,m.jsx)(d,{id:`role`,fullWidth:!0,options:[{value:``,label:`Select a role...`},{value:`admin`,label:`Admin`},{value:`editor`,label:`Editor`},{value:`viewer`,label:`Viewer`}]})]}),(0,m.jsx)(a,{label:`I agree to the terms and conditions`}),(0,m.jsx)(r,{variant:`primary`,type:`submit`,fullWidth:!0,children:`Create Account`})]})},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: () => <form style={{
    maxWidth: 400,
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  }} onSubmit={e => e.preventDefault()}>
            <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '0.25rem'
    }}>
                <Label htmlFor="name" required>
                    Full Name
                </Label>
                <Input id="name" placeholder="Enter your name" fullWidth />
            </div>
            <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '0.25rem'
    }}>
                <Label htmlFor="email" required>
                    Email
                </Label>
                <Input id="email" type="email" placeholder="you@example.com" fullWidth />
            </div>
            <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '0.25rem'
    }}>
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" placeholder="Write your message..." fullWidth />
            </div>
            <Button variant="primary" type="submit" fullWidth>
                Submit
            </Button>
        </form>
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  name: 'With Error States',
  render: () => <form style={{
    maxWidth: 400,
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  }} onSubmit={e => e.preventDefault()}>
            <Input.Root error="This field is required" fullWidth>
                <Label htmlFor="username" required>
                    Username
                </Label>
                <Input.Field id="username" placeholder="Choose a username" />
                <Input.Error />
            </Input.Root>
            <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '0.25rem'
    }}>
                <Label htmlFor="role">Role</Label>
                <Select id="role" fullWidth options={[{
        value: '',
        label: 'Select a role...'
      }, {
        value: 'admin',
        label: 'Admin'
      }, {
        value: 'editor',
        label: 'Editor'
      }, {
        value: 'viewer',
        label: 'Viewer'
      }]} />
            </div>
            <Checkbox label="I agree to the terms and conditions" />
            <Button variant="primary" type="submit" fullWidth>
                Create Account
            </Button>
        </form>
}`,..._.parameters?.docs?.source}}},v=[`SimpleForm`,`CompoundInputForm`]}))();export{_ as CompoundInputForm,g as SimpleForm,v as __namedExportsOrder,h as default};