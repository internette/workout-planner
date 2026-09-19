import React from 'react';

// Small line-icon set used for exercises and workouts: [key, shape, [tag, attrs][]].
export const ICONS: any[] = [
  ['h','line',[['line',{x1:6,y1:12,x2:18,y2:12}],['line',{x1:4,y1:9,x2:4,y2:15}],['line',{x1:20,y1:9,x2:20,y2:15}],['line',{x1:7,y1:9,x2:7,y2:15}],['line',{x1:17,y1:9,x2:17,y2:15}]]],
  ['v','line',[['line',{x1:12,y1:6,x2:12,y2:18}],['line',{x1:9,y1:4,x2:15,y2:4}],['line',{x1:9,y1:20,x2:15,y2:20}],['line',{x1:9,y1:7,x2:15,y2:7}],['line',{x1:9,y1:17,x2:15,y2:17}]]],
  ['d','line',[['line',{x1:9,y1:12,x2:15,y2:12}],['line',{x1:6,y1:9,x2:6,y2:15}],['line',{x1:18,y1:9,x2:18,y2:15}]]],
  ['bike','line',[['circle',{cx:6,cy:17,r:3.4}],['circle',{cx:18,cy:17,r:3.4}],['path',{d:'M6 17l5-8h5l2 8'}],['path',{d:'M10 9h4'}]]],
];

export const iconSvg = (key, color?) => {
  const def = ICONS.find(i => i[0] === key) || ICONS[0];
  return React.createElement('svg', {
    'aria-hidden':'true',
    viewBox:'0 0 24 24', fill:'none', stroke: color || '#E1699C', strokeWidth:2,
    strokeLinecap:'round', strokeLinejoin:'round',
    style:{ width:20, height:20, flex:'none' }
  }, def[2].map((p,i) => React.createElement(p[0], Object.assign({ key:i }, p[1]))));
};

export const moodSvg = m => {
  const eyes = [
    React.createElement('circle', { key:'e1', cx:9, cy:10, r:1.1, fill:'#FBF1F3', stroke:'none' }),
    React.createElement('circle', { key:'e2', cx:15, cy:10, r:1.1, fill:'#FBF1F3', stroke:'none' }),
  ];
  const brows = [
    React.createElement('line', { key:'b1', x1:7.4, y1:8.4, x2:10.6, y2:10.2 }),
    React.createElement('line', { key:'b2', x1:16.6, y1:8.4, x2:13.4, y2:10.2 }),
  ];
  const mouth = m === 'Happy' ? React.createElement('path', { key:'m', d:'M8.5 14.5c1.1 1.7 5.9 1.7 7 0' })
    : m === 'Neutral' ? React.createElement('line', { key:'m', x1:8.5, y1:15, x2:15.5, y2:15 })
    : React.createElement('path', { key:'m', d:'M8.5 16c1.1-1.7 5.9-1.7 7 0' });
  return React.createElement('svg', {
    'aria-hidden':'true',
    viewBox:'0 0 24 24', fill:'none', stroke:'#FBF1F3', strokeWidth:2, strokeLinecap:'round',
    style:{ width:26, height:26 }
  }, (m === 'Mad' ? brows : eyes).concat([mouth]));
};
