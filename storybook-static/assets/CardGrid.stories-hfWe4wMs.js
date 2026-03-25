import{n as e}from"./chunk-zsgVPwQN.js";import{t}from"./jsx-runtime-LHjHBB0E.js";import{n,t as r}from"./Button-8bzbBR94.js";import{n as i,t as a}from"./Badge-7bwH_5d_.js";import{n as o,t as s}from"./Card-LMx7u6Yg.js";var c,l,u,d,f,p;e((()=>{o(),i(),n(),c=t(),l={title:`Patterns/CardGrid`},u=[{title:`Sunday Worship`,badge:`Upcoming`,description:`Join us for worship this Sunday at 9:00 AM and 11:00 AM.`},{title:`Youth Group`,badge:`Weekly`,description:`Wednesday evenings from 6:30 PM to 8:00 PM for grades 6-12.`},{title:`Small Groups`,badge:`Ongoing`,description:`Connect with others in a small group near you throughout the week.`},{title:`Volunteer Training`,badge:`New`,description:`Learn how to serve in our various ministry areas.`},{title:`Prayer Meeting`,badge:`Weekly`,description:`Tuesday mornings at 7:00 AM in the chapel.`},{title:`Community Outreach`,badge:`Monthly`,description:`Serve our local community the first Saturday of each month.`}],d={render:()=>(0,c.jsx)(`div`,{style:{display:`grid`,gridTemplateColumns:`repeat(auto-fill, minmax(280px, 1fr))`,gap:`1rem`},children:u.map(e=>(0,c.jsxs)(s,{hoverable:!0,children:[(0,c.jsx)(s.Header,{children:(0,c.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`},children:[(0,c.jsx)(`h3`,{style:{fontSize:`1rem`,fontWeight:600},children:e.title}),(0,c.jsx)(a,{variant:`primary`,size:`sm`,children:e.badge})]})}),(0,c.jsx)(s.Body,{children:(0,c.jsx)(`p`,{style:{fontSize:`0.875rem`,color:`var(--color-text-secondary)`},children:e.description})}),(0,c.jsx)(s.Footer,{children:(0,c.jsx)(r,{variant:`primary`,size:`sm`,children:`Learn More`})})]},e.title))})},f={render:()=>(0,c.jsx)(`div`,{style:{display:`grid`,gridTemplateColumns:`repeat(2, 1fr)`,gap:`1rem`},children:u.slice(0,4).map(e=>(0,c.jsx)(s,{children:(0,c.jsxs)(s.Body,{children:[(0,c.jsx)(`h3`,{style:{fontSize:`1rem`,fontWeight:600,marginBottom:`0.5rem`},children:e.title}),(0,c.jsx)(`p`,{style:{fontSize:`0.875rem`,color:`var(--color-text-secondary)`},children:e.description})]})},e.title))})},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '1rem'
  }}>
            {sampleCards.map(card => <Card key={card.title} hoverable>
                    <Card.Header>
                        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
                            <h3 style={{
            fontSize: '1rem',
            fontWeight: 600
          }}>{card.title}</h3>
                            <Badge variant="primary" size="sm">
                                {card.badge}
                            </Badge>
                        </div>
                    </Card.Header>
                    <Card.Body>
                        <p style={{
          fontSize: '0.875rem',
          color: 'var(--color-text-secondary)'
        }}>
                            {card.description}
                        </p>
                    </Card.Body>
                    <Card.Footer>
                        <Button variant="primary" size="sm">
                            Learn More
                        </Button>
                    </Card.Footer>
                </Card>)}
        </div>
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '1rem'
  }}>
            {sampleCards.slice(0, 4).map(card => <Card key={card.title}>
                    <Card.Body>
                        <h3 style={{
          fontSize: '1rem',
          fontWeight: 600,
          marginBottom: '0.5rem'
        }}>
                            {card.title}
                        </h3>
                        <p style={{
          fontSize: '0.875rem',
          color: 'var(--color-text-secondary)'
        }}>
                            {card.description}
                        </p>
                    </Card.Body>
                </Card>)}
        </div>
}`,...f.parameters?.docs?.source}}},p=[`ResponsiveGrid`,`TwoColumnGrid`]}))();export{d as ResponsiveGrid,f as TwoColumnGrid,p as __namedExportsOrder,l as default};