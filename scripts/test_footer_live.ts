const res = await fetch('http://localhost:3000/');
const html = await res.text();
console.log('Includes logo-white.png:', html.includes('logo-white.png'));
const match = html.match(/<a class="pkf-logo"[\s\S]*?<\/a>/);
if (match) {
  console.log('Footer logo HTML:');
  console.log(match[0]);
}

