import{n as e}from"./chunk-zsgVPwQN.js";import{t}from"./jsx-runtime-LHjHBB0E.js";import{n,t as r}from"./Card-LMx7u6Yg.js";var i,a,o,s,c,l;e((()=>{n(),i=t(),a={title:`Components/Primitives/Card`,component:r,argTypes:{hoverable:{control:`boolean`}}},o={render:()=>(0,i.jsxs)(r,{children:[(0,i.jsx)(r.Header,{children:(0,i.jsx)(`h3`,{style:{fontSize:`1.125rem`,fontWeight:600},children:`Card Title`})}),(0,i.jsx)(r.Body,{children:(0,i.jsx)(`p`,{children:`Card content goes here.`})}),(0,i.jsx)(r.Footer,{children:(0,i.jsx)(`p`,{style:{fontSize:`0.875rem`,color:`var(--color-text-muted)`},children:`Footer`})})]})},s={render:()=>(0,i.jsx)(r,{hoverable:!0,children:(0,i.jsx)(r.Body,{children:(0,i.jsx)(`p`,{children:`Hover over this card`})})})},c={name:`Compound API`,render:()=>(0,i.jsxs)(`div`,{style:{display:`flex`,gap:`1rem`},children:[(0,i.jsxs)(r,{children:[(0,i.jsx)(r.Header,{children:(0,i.jsx)(`h3`,{children:`With Header`})}),(0,i.jsx)(r.Body,{children:`Content`})]}),(0,i.jsx)(r,{children:(0,i.jsx)(r.Body,{children:`Body Only`})}),(0,i.jsxs)(r,{children:[(0,i.jsx)(r.Body,{children:`With Footer`}),(0,i.jsx)(r.Footer,{children:`Action area`})]})]})},o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: () => <Card>
            <Card.Header>
                <h3 style={{
        fontSize: '1.125rem',
        fontWeight: 600
      }}>Card Title</h3>
            </Card.Header>
            <Card.Body>
                <p>Card content goes here.</p>
            </Card.Body>
            <Card.Footer>
                <p style={{
        fontSize: '0.875rem',
        color: 'var(--color-text-muted)'
      }}>Footer</p>
            </Card.Footer>
        </Card>
}`,...o.parameters?.docs?.source}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: () => <Card hoverable>
            <Card.Body>
                <p>Hover over this card</p>
            </Card.Body>
        </Card>
}`,...s.parameters?.docs?.source}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  name: 'Compound API',
  render: () => <div style={{
    display: 'flex',
    gap: '1rem'
  }}>
            <Card>
                <Card.Header>
                    <h3>With Header</h3>
                </Card.Header>
                <Card.Body>Content</Card.Body>
            </Card>
            <Card>
                <Card.Body>Body Only</Card.Body>
            </Card>
            <Card>
                <Card.Body>With Footer</Card.Body>
                <Card.Footer>Action area</Card.Footer>
            </Card>
        </div>
}`,...c.parameters?.docs?.source}}},l=[`Default`,`Hoverable`,`Compound`]}))();export{c as Compound,o as Default,s as Hoverable,l as __namedExportsOrder,a as default};