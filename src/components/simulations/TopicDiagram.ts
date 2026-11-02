import { SubjectId } from '../../types/curriculum';

const LABEL = '#cbd5e1';

function line(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, color = '#38bdf8', width = 3) {
  ctx.strokeStyle = color; ctx.lineWidth = width; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
}

function text(ctx: CanvasRenderingContext2D, value: string, x: number, y: number, color = LABEL, size = 13) {
  ctx.fillStyle = color; ctx.font = `${size}px Inter, sans-serif`; ctx.fillText(value, x, y);
}

function circle(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, fill: string, stroke = fill) {
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fillStyle = fill; ctx.fill(); ctx.strokeStyle = stroke; ctx.stroke();
}

function axes(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, title: string) {
  text(ctx, title, x, y - 12, '#e2e8f0', 15);
  line(ctx, x, y, x, y + h, '#64748b', 1); line(ctx, x, y + h, x + w, y + h, '#64748b', 1);
  for (let i = 1; i < 5; i++) { line(ctx, x + i * w / 5, y, x + i * w / 5, y + h, '#334155', 1); line(ctx, x, y + i * h / 5, x + w, y + i * h / 5, '#334155', 1); }
}

/** Draws a stable subject/topic-specific apparatus or model (no random particles). */
export function drawTopicDiagram(ctx: CanvasRenderingContext2D, subject: SubjectId, model: string, values: Record<string, number>, x: number, y: number, width: number, height: number) {
  const cx = x + width / 2, cy = y + height / 2;
  const a = Object.values(values)[0] ?? 1;
  const b = Object.values(values)[1] ?? 1;
  ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.fillStyle = '#0b1220'; ctx.fillRect(x, y, width, height);
  ctx.strokeStyle = 'rgba(148,163,184,.22)'; ctx.strokeRect(x, y, width, height);

  if (subject === 'physics') {
    if (model === 'circuits' || model === 'electromagnetism') {
      const left = x + 55, right = x + width - 55, top = y + 55, bottom = y + height - 50;
      line(ctx, left, top, right, top); line(ctx, right, top, right, bottom); line(ctx, right, bottom, left, bottom); line(ctx, left, bottom, left, top);
      line(ctx, left - 8, cy - 13, left + 8, cy - 13, '#fbbf24', 3); line(ctx, left - 14, cy, left + 14, cy, '#fbbf24', 2);
      circle(ctx, cx, top, 19, '#0f172a', '#38bdf8'); text(ctx, 'R', cx - 5, top + 5, '#7dd3fc');
      text(ctx, 'V', left - 5, cy + 34, '#fde68a'); text(ctx, `I = ${(a / (b || 1)).toFixed(2)} A`, cx - 45, bottom + 28, '#a7f3d0');
    } else if (model === 'waves') {
      axes(ctx, x + 45, y + 45, width - 85, height - 95, 'Wave displacement');
      ctx.beginPath(); ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 3;
      for (let i = 0; i <= 120; i++) { const px = x + 50 + i * (width - 95) / 120; const py = cy + Math.sin(i / 12 * Math.max(.2, a / 5)) * height * .24; i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } ctx.stroke();
      text(ctx, `f = ${a} Hz`, x + 55, y + height - 22, '#7dd3fc'); text(ctx, `λ = ${b} m`, x + width - 125, y + height - 22, '#a7f3d0');
    } else if (model === 'optics') {
      line(ctx, cx, y + 30, cx, y + height - 30, '#94a3b8', 2); text(ctx, 'normal', cx + 7, y + 43, '#94a3b8', 11);
      line(ctx, x + 55, y + height - 45, cx, cy, '#fbbf24', 3); line(ctx, cx, cy, x + width - 55, y + 85, '#38bdf8', 3);
      line(ctx, cx, cy, x + width - 65, y + height - 38, '#38bdf8', 2); circle(ctx, cx, cy, 5, '#fff'); text(ctx, 'incident ray', x + 55, y + height - 22, '#fde68a'); text(ctx, 'refracted ray', x + width - 160, y + height - 22, '#7dd3fc');
    } else if (model === 'radioactivity') {
      axes(ctx, x + 55, y + 45, width - 100, height - 95, 'Unstable nuclei remaining');
      ctx.beginPath(); ctx.strokeStyle = '#a78bfa'; ctx.lineWidth = 3;
      for (let i = 0; i <= 100; i++) { const px = x + 60 + i * (width - 110) / 100; const py = y + 50 + (height - 100) * (1 - Math.pow(.5, i / 32)); i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } ctx.stroke();
      text(ctx, `half-life ${b} s`, x + 65, y + height - 20, '#c4b5fd');
    } else if (model === 'space') {
      circle(ctx, cx, cy, 32, '#fbbf24'); ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(cx, cy, width * .34, height * .32, -.3, 0, Math.PI * 2); ctx.stroke();
      circle(ctx, cx + width * .28, cy - height * .08, 10, '#7dd3fc'); text(ctx, 'orbit', x + width - 95, y + 35, '#7dd3fc'); text(ctx, `r = ${a.toExponential(1)} m`, x + 24, y + height - 22);
    } else {
      line(ctx, x + 45, y + height - 50, x + width - 55, y + height - 50, '#94a3b8', 3); circle(ctx, x + width * .35, y + height - 68, 22, '#38bdf8'); line(ctx, x + width * .35, y + height - 42, x + width * .75, y + 75, '#fbbf24', 3);
      text(ctx, model === 'energy' ? 'energy transfer' : 'resultant force', x + 50, y + 34, '#7dd3fc', 15); text(ctx, `a = ${a}`, x + 55, y + height - 20);
    }
  } else if (subject === 'chemistry') {
    if (model === 'practical') {
      line(ctx, cx, y + 30, cx, y + height - 25, '#94a3b8', 2); line(ctx, cx - 65, cy, cx + 65, cy, '#34d399', 3); circle(ctx, cx, cy, 5, '#f472b6'); line(ctx, cx - 85, y + height - 35, cx + 85, y + height - 35, '#64748b', 2); text(ctx, 'paper chromatography', x + 24, y + 28, '#6ee7b7', 14); text(ctx, `Rf = ${(a / (b || 1)).toFixed(2)}`, x + width - 105, y + height - 18);
    } else if (model === 'atoms') {
      circle(ctx, cx, cy, 23, '#f97316'); text(ctx, `${Math.round(a)}p`, cx - 12, cy + 4, '#fff', 12);
      for (const r of [55, 88]) { ctx.beginPath(); ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 2; ctx.ellipse(cx, cy, r, r * .62, 0, 0, Math.PI * 2); ctx.stroke(); }
      for (let i = 0; i < Math.min(8, Math.max(1, Math.round(b))); i++) { const angle = i * Math.PI / 4; circle(ctx, cx + 55 * Math.cos(angle), cy + 34 * Math.sin(angle), 4, '#7dd3fc'); }
      text(ctx, 'nucleus + electron shells', x + 20, y + 25, '#7dd3fc', 14);
    } else if (model === 'acidbase') {
      axes(ctx, x + 45, y + 45, width - 80, height - 95, 'Titration curve');
      ctx.beginPath(); ctx.strokeStyle = '#34d399'; ctx.lineWidth = 3;
      for (let i = 0; i <= 100; i++) { const px = x + 50 + i * (width - 90) / 100; const py = cy + (height * .34) * Math.tanh((i - 50) / 5); i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } ctx.stroke(); line(ctx, cx, y + 50, cx, y + height - 50, '#fbbf24', 1); text(ctx, 'equivalence point', cx + 8, y + 65, '#fde68a', 11);
    } else if (model === 'electrochemistry') {
      ctx.strokeStyle = '#34d399'; ctx.lineWidth = 3; ctx.strokeRect(cx - 115, cy - 65, 230, 135); line(ctx, cx - 50, cy - 95, cx - 50, cy + 40, '#f87171', 5); line(ctx, cx + 50, cy - 95, cx + 50, cy + 40, '#60a5fa', 5); line(ctx, cx - 50, cy - 95, cx + 50, cy - 95, '#fbbf24', 2); text(ctx, 'anode (+)', cx - 100, y + 28, '#fca5a5'); text(ctx, 'cathode (−)', cx + 25, y + 28, '#93c5fd'); text(ctx, 'electrolyte', cx - 38, cy + 95, '#6ee7b7');
    } else if (model === 'kinetics') {
      axes(ctx, x + 45, y + 45, width - 80, height - 95, 'Reactant concentration'); ctx.beginPath(); ctx.strokeStyle = '#34d399'; ctx.lineWidth = 3; for (let i = 0; i <= 100; i++) { const px = x + 50 + i * (width - 90) / 100; const py = y + 55 + (height - 110) * (1 - Math.exp(-i / 28 * Math.max(.2, a / 5))); i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } ctx.stroke(); text(ctx, 'reaction progress', x + width - 160, y + height - 18, '#6ee7b7');
    } else {
      for (let i = 0; i < 7; i++) circle(ctx, cx - 90 + i * 30, cy - 12 + Math.sin(i) * 35, 13, i % 2 ? '#60a5fa' : '#34d399');
      text(ctx, model === 'energetics' ? 'energy profile' : model === 'organic' ? 'carbon chain' : model === 'periodic' ? 'periodic trends' : model === 'stoichiometry' ? 'balanced mole ratio' : 'particle model', x + 24, y + 28, '#6ee7b7', 15);
    }
  } else if (subject === 'biology') {
    if (model === 'cells') {
      circle(ctx, cx, cy, 75, 'rgba(132,204,22,.16)', '#a3e635'); circle(ctx, cx - 15, cy + 8, 24, 'rgba(168,85,247,.7)', '#c4b5fd'); circle(ctx, cx + 28, cy - 22, 9, '#fbbf24'); text(ctx, 'cell membrane', cx - 55, cy - 84, '#bef264', 12); text(ctx, 'nucleus', cx - 30, cy + 47, '#ddd6fe', 12);
    } else if (model === 'transport') {
      line(ctx, cx, y + 35, cx, y + height - 35, '#f472b6', 5); for (let i = 0; i < 6; i++) { circle(ctx, x + 70 + i * 26, cy - 40, 5, '#fb7185'); circle(ctx, x + width - 70 - i * 26, cy + 38, 5, '#60a5fa'); } line(ctx, cx - 55, cy, cx + 55, cy, '#fbbf24', 2); text(ctx, 'selectively permeable membrane', x + 25, y + 26, '#f9a8d4', 14);
    } else if (model === 'enzymes') {
      circle(ctx, cx - 60, cy, 48, 'rgba(132,204,22,.25)', '#a3e635'); circle(ctx, cx - 60, cy - 36, 15, '#0b1220', '#a3e635'); circle(ctx, cx + 35, cy, 17, '#f472b6'); text(ctx, 'enzyme active site', x + 26, y + 26, '#bef264', 14); text(ctx, 'substrate', cx + 10, cy + 50, '#f9a8d4', 12);
    } else if (model === 'genetics') {
      ctx.strokeStyle = '#a78bfa'; ctx.strokeRect(cx - 90, cy - 75, 180, 150); line(ctx, cx, cy - 75, cx, cy + 75, '#a78bfa', 2); line(ctx, cx - 90, cy, cx + 90, cy, '#a78bfa', 2); [['A','A'],['A','a'],['A','a'],['a','a']].forEach((v,i)=>text(ctx,v.join(''),cx-60+(i%2)*90,cy-35+Math.floor(i/2)*75,'#ddd6fe',20)); text(ctx, 'Punnett square', x + 25, y + 25, '#c4b5fd', 14);
    } else if (model === 'ecology' || model === 'biotechnology') {
      if (model === 'biotechnology') { ctx.strokeStyle='#a3e635';ctx.lineWidth=3;ctx.strokeRect(cx-70,cy-85,140,170);line(ctx,cx-70,cy-20,cx+70,cy-20,'#38bdf8',3);circle(ctx,cx-35,cy+20,5,'#a3e635');circle(ctx,cx,cy+10,5,'#a3e635');circle(ctx,cx+35,cy+28,5,'#a3e635');text(ctx,'fermenter',cx-30,y+25,'#bef264',14);} else { circle(ctx,cx-75,cy,20,'#84cc16');circle(ctx,cx,cy-45,20,'#38bdf8');circle(ctx,cx+75,cy,20,'#fbbf24');circle(ctx,cx,cy+55,20,'#f472b6'); line(ctx,cx-55,cy-8,cx-15,cy-37);line(ctx,cx+18,cy-36,cx+58,cy-8);line(ctx,cx+58,cy+13,cx+15,cy+49);line(ctx,cx-17,cy+48,cx-59,cy+15);text(ctx,'food-web interactions',x+20,y+25,'#bef264',14); }
    } else {
      axes(ctx, x + 45, y + 45, width - 80, height - 95, model === 'photosynthesis' ? 'Photosynthesis rate vs light' : model === 'humanbiology' ? 'Circulatory / ventilation model' : model === 'respiration' ? 'Respiration rate' : 'Response pathway');
      ctx.beginPath(); ctx.strokeStyle = '#a3e635'; ctx.lineWidth = 3; for (let i=0;i<=100;i++){const px=x+50+i*(width-90)/100;const py=cy+Math.sin(i/25)*height*.2;i?ctx.lineTo(px,py):ctx.moveTo(px,py);}ctx.stroke();
    }
  } else if (subject === 'environmental') {
    if (model === 'population') { line(ctx,cx,y+30,cx,y+height-30,'#2dd4bf',2); for(let i=0;i<5;i++){const w=18+i*12;ctx.fillStyle=i%2?'#14b8a6':'#5eead4';ctx.fillRect(cx-w,y+45+i*43,w*2,36);}text(ctx,'population structure',x+20,y+25,'#99f6e4',14); }
    else if (model === 'water') { ctx.strokeStyle='#2dd4bf';ctx.lineWidth=3;ctx.strokeRect(cx-100,cy-65,200,130);line(ctx,cx-90,cy+20,cx+90,cy+20,'#38bdf8',4);line(ctx,cx-65,cy+15,cx-65,cy-35,'#a3e635',2);line(ctx,cx+60,cy-35,cx+60,cy+15,'#a3e635',2);text(ctx,'recharge',cx-95,cy-78,'#99f6e4');text(ctx,'abstraction',cx+25,cy+50,'#99f6e4'); }
    else if (model === 'hazards') { ctx.strokeStyle='#fb7185';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x+40,y+height-50);ctx.lineTo(cx-70,cy);ctx.lineTo(cx,cy+45);ctx.lineTo(cx+60,cy-40);ctx.lineTo(x+width-35,y+height-60);ctx.stroke();circle(ctx,cx,cy,10,'#fbbf24');text(ctx,'hazard exposure zone',x+20,y+25,'#fda4af',14); }
    else { axes(ctx,x+45,y+45,width-80,height-95,model==='atmosphere'?'Greenhouse-gas forcing':model==='land'?'Soil erosion risk':model==='ecosystems'?'Biodiversity sample':'Resource balance');const vals=[a,b,Math.max(1,a-b),Math.max(1,b/2)];vals.forEach((v,i)=>{const bh=Math.min(height-120,Math.abs(v)/(Math.max(...vals)||1)*(height-115));ctx.fillStyle=['#14b8a6','#2dd4bf','#fbbf24','#a3e635'][i];ctx.fillRect(x+70+i*70,y+height-50-bh,42,bh);});}
  } else if (subject === 'mathematics') {
    if (model === 'geometry' || model === 'trigonometry' || model === 'mensuration') { line(ctx,cx-85,cy+55,cx+85,cy+55,'#818cf8',3);line(ctx,cx-85,cy+55,cx,cy-75,'#818cf8',3);line(ctx,cx,cy-75,cx+85,cy+55,'#818cf8',3);circle(ctx,cx,cy+55,4,'#fbbf24');text(ctx,model==='trigonometry'?'SOH · CAH · TOA':model==='mensuration'?'πr²h':'angle relationships',x+22,y+25,'#c7d2fe',14); }
    else if(model==='statistics'||model==='probability'){axes(ctx,x+45,y+45,width-80,height-95,model==='statistics'?'Frequency distribution':'Probability model');for(let i=0;i<8;i++){const h=30+Math.abs(Math.sin(i*1.3))*height*.55;ctx.fillStyle='#818cf8';ctx.fillRect(x+65+i*42,y+height-50-h,32,h);}text(ctx,model==='probability'?'event outcomes':'data values',x+20,y+height-16,'#c7d2fe',12);}
    else { axes(ctx,x+45,y+45,width-80,height-95,'Coordinate plane');ctx.beginPath();ctx.strokeStyle='#a5b4fc';ctx.lineWidth=3;for(let i=0;i<=100;i++){const xx=-5+i/10;const yy=model==='algebra'?a*xx+b:model==='vectors'?xx*.6+Math.sin(xx):Math.sin(xx);const px=cx+xx*width/14,py=cy-yy*height/12;i?ctx.lineTo(px,py):ctx.moveTo(px,py);}ctx.stroke();text(ctx,model==='vectors'?'vector components':'y = mx + c',x+20,y+25,'#c7d2fe',14);}
  } else if (subject === 'geography') {
    const titles: Record<string, string> = {
      'geo-rivers': 'River long profile and discharge', 'geo-coasts': 'Wave approach and sediment transfer',
      'geo-ecosystems': 'Ecosystem stores and flows', 'geo-hazards': 'Hazard exposure and vulnerability',
      'geo-climate': 'Climate evidence and anomaly', 'geo-population': 'Population structure',
      'geo-urban': 'Urban land use and access', 'geo-development': 'Development indicators',
      'geo-economies': 'Employment by economic sector', 'geo-resources': 'Resource supply and demand',
    };
    axes(ctx, x + 45, y + 45, width - 80, height - 95, titles[model] ?? 'Geographical data investigation');
    const values = [a, b, Math.max(1, a * 0.7), Math.max(1, b * 0.55)];
    values.forEach((v, i) => { const bh = Math.min(height - 115, Math.abs(v) / Math.max(...values, 1) * (height - 115)); ctx.fillStyle = ['#22c55e', '#38bdf8', '#f59e0b', '#a3e635'][i]; ctx.fillRect(x + 70 + i * 75, y + height - 50 - bh, 42, bh); });
    text(ctx, 'Change controls to compare evidence and impacts', x + 20, y + height - 16, '#86efac', 12);
  } else if (subject === 'business') {
    const titles: Record<string, string> = {
      'bus-enterprise': 'Stakeholder value and enterprise', 'bus-people': 'Workforce productivity',
      'bus-marketing': 'Marketing mix and market share', 'bus-operations': 'Production output and efficiency',
      'bus-finance': 'Costs, revenue and break-even', 'bus-external': 'External change and business response',
    };
    axes(ctx, x + 45, y + 45, width - 80, height - 95, titles[model] ?? 'Business decision model');
    const values = [a, b, Math.max(1, a * 0.6), Math.max(1, b * 0.75)];
    values.forEach((v, i) => { const bh = Math.min(height - 115, Math.abs(v) / Math.max(...values, 1) * (height - 115)); ctx.fillStyle = ['#f59e0b', '#38bdf8', '#34d399', '#fb7185'][i]; ctx.fillRect(x + 70 + i * 75, y + height - 50 - bh, 42, bh); });
    text(ctx, 'Change assumptions to compare business outcomes', x + 20, y + height - 16, '#fcd34d', 12);
  } else {
    if(model==='logic'){const gates=['AND','OR','NOT','XOR'];line(ctx,x+25,cy-35,cx-40,cy-35,'#fb7185',2);line(ctx,x+25,cy+35,cx-40,cy+35,'#fb7185',2);ctx.fillStyle='#1e293b';ctx.fillRect(cx-40,cy-55,100,110);ctx.strokeStyle='#fb7185';ctx.strokeRect(cx-40,cy-55,100,110);text(ctx,gates[Math.round(a)%4],cx-22,cy+5,'#fda4af',18);line(ctx,cx+60,cy,cx+width/2,cy,'#fda4af',3);text(ctx,'Q',cx+width/2+8,cy+5,'#fda4af',15);text(ctx,'logic gate circuit',x+20,y+25,'#fda4af',14);}
    else if(model==='binary'){const bits=Math.floor(a).toString(2).padStart(8,'0');text(ctx,'DENARY → BINARY → HEX',x+25,y+35,'#fda4af',14);bits.split('').forEach((bit,i)=>{ctx.fillStyle=bit==='1'?'#be123c':'#1e293b';ctx.fillRect(x+30+i*48,cy-24,38,48);text(ctx,bit,x+44+i*48,cy+7,'#fff',18);});text(ctx,`hex: ${Math.floor(a).toString(16).toUpperCase()}`,x+30,cy+70,'#fda4af',15);}
    else if(model==='network'||model==='transmission'){const points=[[x+60,cy],[cx-35,y+60],[cx+35,y+height-60],[x+width-65,cy]];points.forEach((pt,i)=>{circle(ctx,pt[0],pt[1],18,'#1e293b','#fb7185');text(ctx,['SRC','R1','R2','DST'][i],pt[0]-12,pt[1]+4,'#fda4af',10);if(i)line(ctx,points[i-1][0]+18,points[i-1][1],pt[0]-18,pt[1],'#fb7185',2);});text(ctx,'packet route',x+20,y+25,'#fda4af',14);}
    else { axes(ctx,x+45,y+45,width-80,height-95,model==='algorithms'?'Search comparison count':model==='database'?'Query result set':model==='hardware'?'CPU performance model':model==='automation'?'Sensor → controller → actuator':'Program execution trace');for(let i=0;i<6;i++){const h=25+((i*17+Math.round(a))%7)*18;ctx.fillStyle='#f43f5e';ctx.fillRect(x+65+i*52,y+height-50-h,34,h);}text(ctx,model==='programming'?'trace variables and loop state':'compare system states',x+20,y+height-18,'#fda4af',12);}
  }
  ctx.restore();
}
