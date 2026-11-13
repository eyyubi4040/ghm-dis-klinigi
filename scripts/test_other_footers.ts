for (const slug of ['kozmetik-dis-hekimligi', 'ekibimiz', 'iletisim', 'anlasmali-kurumlar']) {
  const res = await fetch(`http://localhost:3000/${slug}`);
  const html = await res.text();
  console.log(`${slug} status: ${res.status}, has white logo: ${html.includes('logo-white.png')}`);
}

