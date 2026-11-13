import { writeFileSync, existsSync, mkdirSync } from "fs";
import { join, dirname } from "path";

const BASE_DIR = "E:/PROJELER/ghm-dis-klinigi";

const IMAGES = [
  // 1. Treatments
  {
    target: "public/images/tedaviler/genel-dis.jpg",
    mirror: "public/images/pozitif/genel-dis-tedavileri-scaled.jpeg",
    url: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=1200&q=85",
  },
  {
    target: "public/images/tedaviler/invisalign.jpg",
    mirror: "public/images/pozitif/invisalign.jpg",
    url: "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&w=1200&q=85",
  },
  {
    target: "public/images/tedaviler/implant.jpg",
    mirror: "public/images/pozitif/implant-tedavisi.jpg",
    url: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=1200&q=85",
  },
  {
    target: "public/images/tedaviler/pedodonti.jpg",
    mirror: "public/images/pozitif/cocuk-dis-hekimligi.jpg",
    url: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=85",
  },
  {
    target: "public/images/tedaviler/koruyucu.jpg",
    mirror: "public/images/pozitif/koruyucu-dis-tedavileri.jpg",
    url: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=85",
  },
  {
    target: "public/images/tedaviler/kozmetik.jpg",
    mirror: "public/images/pozitif/kozmetik-dis-hekimligi.webp",
    url: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=85",
  },
  {
    target: "public/images/tedaviler/eksik-dis.jpg",
    mirror: "public/images/pozitif/eksik-dis-tedavileri.jpg",
    url: "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&w=1200&q=85",
  },
  {
    target: "public/images/tedaviler/dis-eti.jpg",
    mirror: "public/images/pozitif/dis-eti-tedavileri.jpg",
    url: "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&w=1200&q=85",
  },
  {
    target: "public/images/tedaviler/ozel-tedaviler.jpg",
    mirror: "public/images/pozitif/ozel-dis-tedavileri.jpg",
    url: "https://images.unsplash.com/photo-1629909615184-74f495363b67?auto=format&fit=crop&w=1200&q=85",
  },

  // 2. Doctor & Specialists & Clinic Team
  {
    target: "public/images/doctor-gozde.jpg",
    mirror: "public/images/pozitif/DSC02362-683x1024.jpg",
    url: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=900&q=85",
  },
  {
    target: "public/images/doctor-kivanc.jpg",
    mirror: "public/images/pozitif/DSC02344-683x1024.jpg",
    url: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=900&q=85",
  },
  {
    target: "public/images/doctor-ortodonti.jpg",
    mirror: "public/images/pozitif/gokhan-torun.jpg",
    url: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=900&q=85",
  },
  {
    target: "public/images/ekip-ayse.jpg",
    mirror: "public/images/pozitif/DSC02298-768x1152.jpg",
    url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=85",
  },
  {
    target: "public/images/ekip-sumeyye.jpg",
    mirror: "public/images/pozitif/DSC02303-768x1152.jpg",
    url: "https://images.unsplash.com/photo-1594824813586-45579f1ec591?auto=format&fit=crop&w=800&q=85",
  },
  {
    target: "public/images/ekip-dilara.jpg",
    mirror: "public/images/pozitif/DSC02339-768x1152.jpg",
    url: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=800&q=85",
  },

  // 3. Smile Ticker (make-your-smile)
  {
    target: "public/images/gulus/smile-01.jpg",
    mirror: "public/images/pozitif/make-your-smile-01-1024x1024.png",
    url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&h=800&q=85",
  },
  {
    target: "public/images/gulus/smile-02.jpg",
    mirror: "public/images/pozitif/make-your-smile-02-1024x1024.png",
    url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&h=800&q=85",
  },
  {
    target: "public/images/gulus/smile-03.jpg",
    mirror: "public/images/pozitif/make-your-smile-03-1024x1024.png",
    url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&h=800&q=85",
  },
  {
    target: "public/images/gulus/smile-04.jpg",
    mirror: "public/images/pozitif/make-your-smile-04-1024x1024.png",
    url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&h=800&q=85",
  },
  {
    target: "public/images/gulus/smile-05.jpg",
    mirror: "public/images/pozitif/make-your-smile-05-1024x1024.png",
    url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&h=800&q=85",
  },
  {
    target: "public/images/gulus/smile-06.jpg",
    mirror: "public/images/pozitif/make-your-smile-06-1024x1024.png",
    url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&h=800&q=85",
  },

  // 4. Social & Showcase
  {
    target: "public/images/social/insta-01.jpg",
    url: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=800&h=800&q=85",
  },
  {
    target: "public/images/social/insta-02.jpg",
    url: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&h=800&q=85",
  },
  {
    target: "public/images/social/insta-03.jpg",
    url: "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&w=800&h=800&q=85",
  },
  {
    target: "public/images/social/insta-04.jpg",
    url: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&h=800&q=85",
  },
  {
    target: "public/images/social/insta-05.jpg",
    url: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&h=800&q=85",
  },
  {
    target: "public/images/social/insta-06.jpg",
    url: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&h=800&q=85",
  },
  {
    target: "public/images/social/insta-07.jpg",
    url: "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&w=800&h=800&q=85",
  },
  {
    target: "public/images/social/insta-08.jpg",
    url: "https://images.unsplash.com/photo-1629909615184-74f495363b67?auto=format&fit=crop&w=800&h=800&q=85",
  },
];

async function main() {
  console.log(`Toplam ${IMAGES.length} görsel indirilecek ve eşitlenecek...`);

  for (const item of IMAGES) {
    const targetPath = join(BASE_DIR, item.target);
    const dir = dirname(targetPath);
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }

    try {
      console.log(`İndiriliyor: ${item.target}`);
      const res = await fetch(item.url, {
        headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" },
      });
      if (!res.ok) {
        console.error(`✗ HTTP ${res.status} hatası: ${item.url}`);
        continue;
      }
      const buf = Buffer.from(await res.arrayBuffer());
      writeFileSync(targetPath, buf);
      console.log(`✓ Başarılı: ${item.target} (${buf.byteLength} byte)`);

      if (item.mirror) {
        const mirrorPath = join(BASE_DIR, item.mirror);
        const mDir = dirname(mirrorPath);
        if (!existsSync(mDir)) mkdirSync(mDir, { recursive: true });
        writeFileSync(mirrorPath, buf);
        console.log(`  ↪ Aynalandı: ${item.mirror}`);
      }
    } catch (e: any) {
      console.error(`✗ Hata: ${item.target}`, e.message);
    }
  }

  console.log("\nTüm görseller başarıyla tamamlandı!");
}

main();

