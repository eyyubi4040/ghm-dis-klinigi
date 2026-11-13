import { writeFileSync } from "fs";
import { join } from "path";

const BASE_DIR = "E:/PROJELER/ghm-dis-klinigi";

const targets = [
  // 1. Treatment Category Hero & Cards
  {
    path: "public/images/pozitif/genel-dis-tedavileri-scaled.jpeg",
    url: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=1200&q=85",
  },
  {
    path: "public/images/pozitif/invisalign.jpg",
    url: "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&w=1200&q=85",
  },
  {
    path: "public/images/pozitif/implant-tedavisi.jpg",
    url: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=1200&q=85",
  },
  {
    path: "public/images/pozitif/cocuk-dis-hekimligi.jpg",
    url: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=85",
  },
  {
    path: "public/images/pozitif/koruyucu-dis-tedavileri.jpg",
    url: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=85",
  },
  {
    path: "public/images/pozitif/kozmetik-dis-hekimligi.webp",
    url: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=85",
  },
  {
    path: "public/images/pozitif/eksik-dis-tedavileri.jpg",
    url: "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&w=1200&q=85",
  },
  {
    path: "public/images/pozitif/dis-eti-tedavileri.jpg",
    url: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=1200&q=85",
  },
  {
    path: "public/images/pozitif/ozel-dis-tedavileri.jpg",
    url: "https://images.unsplash.com/photo-1629909615184-74f495363b67?auto=format&fit=crop&w=1200&q=85",
  },

  // 2. Doctor portraits for Dt. Gözde Hilal Morkoyunlu
  {
    path: "public/images/doctor-gozde.jpg",
    url: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=800&q=85",
  },
  {
    path: "public/images/pozitif/DSC02362-683x1024.jpg",
    url: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=800&q=85",
  },
  {
    path: "public/images/pozitif/DSC02344-683x1024.jpg",
    url: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=800&q=85",
  },
  {
    path: "public/images/pozitif/DSC02303-768x1152.jpg",
    url: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=800&q=85",
  },
  {
    path: "public/images/pozitif/DSC02298-768x1152.jpg",
    url: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=800&q=85",
  },
  {
    path: "public/images/pozitif/DSC02339-768x1152.jpg",
    url: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=800&q=85",
  },

  // 3. Natural Beautiful Smiles for the Ticker / Marquee
  {
    path: "public/images/pozitif/make-your-smile-01-1024x1024.png",
    url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&h=800&q=85",
  },
  {
    path: "public/images/pozitif/make-your-smile-02-1024x1024.png",
    url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&h=800&q=85",
  },
  {
    path: "public/images/pozitif/make-your-smile-03-1024x1024.png",
    url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&h=800&q=85",
  },
  {
    path: "public/images/pozitif/make-your-smile-04-1024x1024.png",
    url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&h=800&q=85",
  },
  {
    path: "public/images/pozitif/make-your-smile-05-1024x1024.png",
    url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&h=800&q=85",
  },
  {
    path: "public/images/pozitif/make-your-smile-06-1024x1024.png",
    url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&h=800&q=85",
  },
];

async function downloadAll() {
  console.log(`Toplam ${targets.length} görsel güncelleniyor...`);
  for (const item of targets) {
    const fullPath = join(BASE_DIR, item.path);
    try {
      console.log(`İndiriliyor: ${item.path}...`);
      const res = await fetch(item.url, { headers: { "User-Agent": "Mozilla/5.0" } });
      if (res.ok) {
        const buf = await res.arrayBuffer();
        writeFileSync(fullPath, Buffer.from(buf));
        console.log(`✓ Başarılı: ${item.path} (${buf.byteLength} bytes)`);
      } else {
        console.error(`✗ HTTP ${res.status}: ${item.path}`);
      }
    } catch (e: any) {
      console.error(`✗ Hata (${item.path}):`, e.message);
    }
  }
  console.log("Görsel indirme tamamlandı!");
}

downloadAll();

