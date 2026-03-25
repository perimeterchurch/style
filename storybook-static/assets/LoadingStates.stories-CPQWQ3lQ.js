import{n as e}from"./chunk-zsgVPwQN.js";import{t}from"./jsx-runtime-LHjHBB0E.js";import{n,t as r}from"./Card-LMx7u6Yg.js";import{n as i,t as a}from"./IndeterminateProgress-xZBrMKeT.js";import{n as o,t as s}from"./LoadingSpinner-w3CDkhbS.js";import{n as c,t as l}from"./Skeleton-VecOSFNn.js";var u,d,f,p,m,h,g;e((()=>{c(),o(),i(),n(),u=t(),d={title:`Patterns/LoadingStates`},f={render:()=>(0,u.jsx)(r,{children:(0,u.jsx)(r.Body,{children:(0,u.jsxs)(`div`,{style:{display:`flex`,gap:`1rem`,alignItems:`flex-start`},children:[(0,u.jsx)(l,{variant:`circle`,width:48,height:48}),(0,u.jsxs)(`div`,{style:{flex:1,display:`flex`,flexDirection:`column`,gap:`0.5rem`},children:[(0,u.jsx)(l,{variant:`line`,width:`60%`,height:16}),(0,u.jsx)(l,{variant:`line`,width:`80%`,height:12}),(0,u.jsx)(l,{variant:`line`,width:`40%`,height:12})]})]})})})},p={render:()=>(0,u.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`1rem`,maxWidth:400},children:Array.from({length:4}).map((e,t)=>(0,u.jsxs)(`div`,{style:{display:`flex`,gap:`0.75rem`,alignItems:`center`},children:[(0,u.jsx)(l,{variant:`circle`,width:40,height:40}),(0,u.jsxs)(`div`,{style:{flex:1,display:`flex`,flexDirection:`column`,gap:`0.375rem`},children:[(0,u.jsx)(l,{variant:`line`,width:`70%`,height:14}),(0,u.jsx)(l,{variant:`line`,width:`50%`,height:10})]})]},t))})},m={render:()=>(0,u.jsx)(`div`,{style:{display:`grid`,gridTemplateColumns:`repeat(3, 1fr)`,gap:`1rem`},children:Array.from({length:6}).map((e,t)=>(0,u.jsxs)(`div`,{children:[(0,u.jsx)(l,{variant:`card`,width:`100%`,height:120}),(0,u.jsxs)(`div`,{style:{padding:`0.75rem`,display:`flex`,flexDirection:`column`,gap:`0.5rem`},children:[(0,u.jsx)(l,{variant:`line`,width:`80%`,height:14}),(0,u.jsx)(l,{variant:`line`,width:`60%`,height:10})]})]},t))})},h={render:()=>(0,u.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`2rem`},children:[(0,u.jsxs)(`div`,{children:[(0,u.jsx)(`p`,{style:{fontSize:`0.875rem`,fontWeight:600,marginBottom:`0.75rem`},children:`Centered Spinner`}),(0,u.jsx)(`div`,{style:{display:`flex`,justifyContent:`center`,alignItems:`center`,height:100,border:`1px solid var(--color-border)`,borderRadius:8},children:(0,u.jsx)(s,{size:`lg`})})]}),(0,u.jsxs)(`div`,{children:[(0,u.jsx)(`p`,{style:{fontSize:`0.875rem`,fontWeight:600,marginBottom:`0.75rem`},children:`Progress Bar`}),(0,u.jsx)(`div`,{style:{position:`relative`,height:4,borderRadius:4,overflow:`hidden`},children:(0,u.jsx)(a,{visible:!0})})]})]})},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: () => <Card>
            <Card.Body>
                <div style={{
        display: 'flex',
        gap: '1rem',
        alignItems: 'flex-start'
      }}>
                    <Skeleton variant="circle" width={48} height={48} />
                    <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem'
        }}>
                        <Skeleton variant="line" width="60%" height={16} />
                        <Skeleton variant="line" width="80%" height={12} />
                        <Skeleton variant="line" width="40%" height={12} />
                    </div>
                </div>
            </Card.Body>
        </Card>
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    maxWidth: 400
  }}>
            {Array.from({
      length: 4
    }).map((_, i) => <div key={i} style={{
      display: 'flex',
      gap: '0.75rem',
      alignItems: 'center'
    }}>
                    <Skeleton variant="circle" width={40} height={40} />
                    <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.375rem'
      }}>
                        <Skeleton variant="line" width="70%" height={14} />
                        <Skeleton variant="line" width="50%" height={10} />
                    </div>
                </div>)}
        </div>
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '1rem'
  }}>
            {Array.from({
      length: 6
    }).map((_, i) => <div key={i}>
                    <Skeleton variant="card" width="100%" height={120} />
                    <div style={{
        padding: '0.75rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem'
      }}>
                        <Skeleton variant="line" width="80%" height={14} />
                        <Skeleton variant="line" width="60%" height={10} />
                    </div>
                </div>)}
        </div>
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem'
  }}>
            <div>
                <p style={{
        fontSize: '0.875rem',
        fontWeight: 600,
        marginBottom: '0.75rem'
      }}>
                    Centered Spinner
                </p>
                <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: 100,
        border: '1px solid var(--color-border)',
        borderRadius: 8
      }}>
                    <LoadingSpinner size="lg" />
                </div>
            </div>
            <div>
                <p style={{
        fontSize: '0.875rem',
        fontWeight: 600,
        marginBottom: '0.75rem'
      }}>
                    Progress Bar
                </p>
                <div style={{
        position: 'relative',
        height: 4,
        borderRadius: 4,
        overflow: 'hidden'
      }}>
                    <IndeterminateProgress visible />
                </div>
            </div>
        </div>
}`,...h.parameters?.docs?.source}}},g=[`SkeletonCard`,`SkeletonList`,`SkeletonGrid`,`SpinnerStates`]}))();export{f as SkeletonCard,m as SkeletonGrid,p as SkeletonList,h as SpinnerStates,g as __namedExportsOrder,d as default};