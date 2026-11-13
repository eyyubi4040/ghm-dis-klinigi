const r1 = await fetch('http://localhost:3000/');
const t1 = await r1.text();
console.log('Homepage status:', r1.status, '| has gold:', t1.includes('#C59B27'), '| has turkish faq:', t1.includes('Ortodonti (diş teli'));

const r2 = await fetch('http://localhost:3000/kozmetik-dis-hekimligi');
const t2 = await r2.text();
console.log('Kozmetik page status:', r2.status, '| has gold:', t2.includes('#C59B27'), '| no raw literals:', !t2.includes('${cat.'));

