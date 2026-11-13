import { writeFileSync } from 'fs';
import { join } from 'path';

// High quality dental & clinic images from Unsplash (direct royalty-free CDN URLs)
const imagesToFetch = [
  {
    name: 'hero-banner.jpg',
    url: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1920&q=80',
    folder: 'public/images'
  },
  {
    name: 'doctor-gozde.jpg',
    url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=800&q=80', // professional female dentist portrait
    folder: 'public/images'
  },
  {
    name: 'clinic-unit.jpg',
    url: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=1200&q=80',
    folder: 'public/images/galeri'
  },
  {
    name: 'sterilization.jpg',
    url: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=80',
    folder: 'public/images/galeri'
  },
  {
    name: 'waiting-lounge.jpg',
    url: 'https://images.unsplash.com/photo-1629909615184-74f495363b67?auto=format&fit=crop&w=1200&q=80',
    folder: 'public/images/galeri'
  },
  {
    name: 'xray-tomography.jpg',
    url: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80',
    folder: 'public/images/galeri'
  },
  {
    name: 'smile-transformation.jpg',
    url: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=1200&q=80',
    folder: 'public/images/galeri'
  }
];

async function downloadImages() {
  const baseDir = 'E:/PROJELER/ghm-dis-klinigi';
  for (const item of imagesToFetch) {
    const dest = join(baseDir, item.folder, item.name);
    try {
      console.log(`Downloading ${item.name}...`);
      const res = await fetch(item.url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      if (res.ok) {
        const buffer = await res.arrayBuffer();
        writeFileSync(dest, Buffer.from(buffer));
        console.log(`Saved: ${dest} (${buffer.byteLength} bytes)`);
      } else {
        console.error(`Failed ${item.name}: ${res.statusText}`);
      }
    } catch (e) {
      console.error(`Error ${item.name}: ${e.message}`);
    }
  }
}

downloadImages();

