import React, { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import { LABS, LABS_BY_SUBJECT, SUBJECTS } from './simulation-library/catalog';
import './index.css';

const modules = import.meta.glob('./simulations/**/*.tsx');
const simulationComponents = Object.fromEntries(Object.entries(modules).map(([path, loader]) => {
  const match=path.match(/\/([a-z]+)\/[^/]+(\d{3})\.tsx$/);
  const id=match?`${match[1]}-${match[2]}`:'';
  return [id,lazy(loader)];
}));

export default function App(){
  const [view,setView]=useState('home');
  const [subjectId,setSubjectId]=useState('physics');
  const [simulationId,setSimulationId]=useState('');
  const [query,setQuery]=useState('');
  const [topicFilter,setTopicFilter]=useState('all');
  const [page,setPage]=useState(0);

  const syncHash=()=>{
    const parts=window.location.hash.replace(/^#\/?/,'').split('/');
    if(parts[0]==='sim'&&LABS.some(l=>l.id===parts[1])){setSimulationId(parts[1]);setView('simulation');return;}
    if(parts[0]==='subject'&&SUBJECTS.some(s=>s.id===parts[1])){setSubjectId(parts[1]);setView('subject');return;}
    setView('home');
  };
  useEffect(()=>{syncHash();window.addEventListener('hashchange',syncHash);return()=>window.removeEventListener('hashchange',syncHash);},[]);
  const openSubject=(id)=>{setSubjectId(id);setQuery('');setTopicFilter('all');setPage(0);window.location.hash=`#/subject/${id}`;setView('subject');window.scrollTo(0,0);};
  const openSimulation=(id)=>{setSimulationId(id);window.location.hash=`#/sim/${id}`;setView('simulation');window.scrollTo(0,0);};
  const activeSubject=SUBJECTS.find(s=>s.id===subjectId) ?? SUBJECTS[0];
  const activeLab=LABS.find(l=>l.id===simulationId);
  const filtered=useMemo(()=>LABS_BY_SUBJECT[subjectId].filter(l=>(topicFilter==='all'||l.chapterCode===topicFilter)&&`${l.title} ${l.chapter} ${l.objective} ${l.lens}`.toLowerCase().includes(query.toLowerCase())),[subjectId,topicFilter,query]);
  const visible=filtered.slice(page*12,page*12+12);
  const ActiveSimulation=simulationComponents[simulationId];

  return <div className="app-shell"><header className="topbar"><button className="brand" onClick={()=>{window.location.hash='/';setView('home')}}><span className="brand-mark">IL</span><span>IGCSE <b>LAB</b><small>Learn by experimenting</small></span></button><nav><button onClick={()=>{window.location.hash='/';setView('home')}}>Subjects</button><span className="nav-count">{LABS.length} interactive labs</span></nav></header>
    {view==='home'&&<main className="home-page"><section className="hero"><div className="eyebrow">CAMBRIDGE IGCSE · VIRTUAL LABORATORY</div><h1>Learn by <em>experimenting.</em><br/>Understand by doing.</h1><p>Choose a subject and investigate its syllabus topics using interactive models, live measurements, and recorded trials.</p><div className="hero-stats"><span><b>6</b> subjects</span><span><b>600</b> simulations</span><span><b>100</b> per subject</span></div></section><section className="subject-section"><div className="section-head"><div><span className="eyebrow">Syllabus libraries</span><h2>Choose your subject</h2></div><p>Open a subject to browse chapter-wise simulations.</p></div><div className="subject-grid">{SUBJECTS.map(s=><button className="subject-card" key={s.id} style={{'--subject-color':s.color}} onClick={()=>openSubject(s.id)}><span className="subject-icon">{s.icon}</span><span className="subject-code">{s.code} · {s.period}</span><h3>{s.name}</h3><span className="subject-topics">{s.topics.length} syllabus topics</span><strong>100 simulations <i>→</i></strong></button>)}</div></section><footer>Cambridge syllabus versions shown on each subject card. Models are idealised and their assumptions are displayed inside each lab.</footer></main>}
    {view==='subject'&&<main className="library-page"><div className="library-head" style={{'--subject-color':activeSubject.color}}><button className="back-link" onClick={()=>{window.location.hash='/';setView('home')}}>← All subjects</button><div className="subject-code">{activeSubject.code} · Syllabus for exams {activeSubject.period}</div><h1>{activeSubject.icon} {activeSubject.name}</h1><p>{activeSubject.topics.length} syllabus topics · 100 simulations · one file per simulation module</p></div><section className="library-tools"><label className="search-box"><span>⌕</span><input value={query} onChange={e=>{setQuery(e.target.value);setPage(0)}} placeholder="Search simulations, chapters, or objectives"/></label><label className="topic-select"><span>Chapter</span><select value={topicFilter} onChange={e=>{setTopicFilter(e.target.value);setPage(0)}}><option value="all">All chapters ({LABS_BY_SUBJECT[subjectId].length})</option>{activeSubject.topics.map(t=><option key={t.code} value={t.code}>{t.code} · {t.title}</option>)}</select></label></section><section className="lab-list-head"><h2>Available simulations <small>{filtered.length} results</small></h2><span>{filtered.length?`${page*12+1}-${Math.min((page+1)*12,filtered.length)} of ${filtered.length}`:'No matching simulations'}</span></section><div className="lab-card-grid">{visible.map(l=><article className="lab-card" key={l.id}><div className="lab-card-top"><span>{l.chapterCode}</span><span>{l.id.toUpperCase()}</span></div><h3>{l.title}</h3><p>{l.objective}</p><div className="lab-lens">INVESTIGATION · {l.lens}</div><button onClick={()=>openSimulation(l.id)}>Open simulation <span>→</span></button></article>)}</div><div className="pagination"><button disabled={page===0} onClick={()=>setPage(p=>Math.max(0,p-1))}>← Previous</button><span>Page {page+1} of {Math.max(1,Math.ceil(filtered.length/12))}</span><button disabled={(page+1)*12>=filtered.length} onClick={()=>setPage(p=>p+1)}>Next →</button></div></main>}
    {view==='simulation'&&activeLab&&<Suspense fallback={<div className="loading">Loading simulation module…</div>}>{ActiveSimulation?<ActiveSimulation/>:<div className="loading error">Simulation module is missing: {simulationId}</div>}</Suspense>}
  </div>;
}
