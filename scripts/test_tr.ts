const res = await fetch('http://localhost:3000/');
const html = await res.text();
console.log('Hangi Diş Tedavilerini Sunuyoruz?:', html.includes('Hangi <strong>Diş Tedavilerini</strong> Sunuyoruz?'));
console.log('Ağız ve diş sağlığınız için yüksek standartlarda...:', html.includes('Ağız ve diş sağlığınız için yüksek'));
console.log('What Dental Treatments exists?:', html.includes('What Dental Treatments'));
console.log('If you are in need exists?:', html.includes('If you are in need'));

