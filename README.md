# Dt. Gözde Hilal Morkoyunlu Diş Kliniği - Web Platformu

Kırşehir Merkez'de hizmet veren **Dt. Gözde Hilal Morkoyunlu Diş Kliniği** için özel olarak geliştirilmiş yüksek performanslı, ultra lüks ve modern web platformu.

## 🚀 Teknolojik Altyapı
- **Çalışma Ortamı:** Bun 1.4.4 (Yüksek hızlı TypeScript/JavaScript runtime)
- **Veritabanı:** SQLite (bun:sqlite) - Randevular, iletişim mesajları, hasta yorumları
- **Bulut Depolama:** Google Cloud Storage (`eycodex` bucket'ı altında `ghm-dis-klinigi/` klasörü)
- **Tasarım & Mimari:** Kırşehir Web Design (https://kirsehirwebdesign.com/)

## 🎨 Tasarım & Renk Paleti
- **Logo Rengi:** Metalik Sıcak Altın (`#C59B27` / `#D4AF37`)
- **Arka Plan:** Saf Beyaz & Lüks Açık Gri tonları
- **Koyu Vurgular:** Obsidiyen Gece Mavisi (`#0A0F16`)
- **Tipografi:** Plus Jakarta Sans & Poppins

## 📂 Dizin Yapısı
```
ghm-dis-klinigi/
├── public/                 # Statik web varlıkları
│   ├── css/theme/          # Özel tema ve yerleşim stilleri
│   ├── js/theme/           # Navigasyon, modal ve dinamik bileşenler
│   ├── images/             # Kliniğe ait yüksek çözünürlüklü görseller
│   │   ├── brands/         # İmplant ve ortodonti dünya markaları
│   │   ├── galeri/         # Klinik içi ve ünit fotoğrafları
│   │   ├── gulus/          # Doğal gülüş fotoğrafları
│   │   ├── klinik/         # Klinik tedavi odaları
│   │   ├── social/         # Sosyal medya & Instagram vitrini
│   │   └── tedaviler/      # 9 ana tedavi kategorisi görselleri
│   ├── index.html          # Ana sayfa
│   ├── hakkimizda.html     # Kurumsal sayfa
│   ├── hekimimiz.html      # Hekimimiz
│   ├── ekibimiz.html       # Ekibimiz
│   ├── galeri.html         # Gülüş ve klinik galerisi
│   ├── tedaviler.html      # Tedavilerimiz
│   ├── randevu.html        # Online randevu sayfası
│   ├── iletisim.html       # İletişim & Harita
│   └── admin.html          # Yönetim paneli
├── server/                 # Bun HTTP & SQLite API sunucusu
├── data/                   # SQLite veritabanı (ghm_klinik.sqlite)
└── scripts/                # Senkronizasyon ve bakım araçları
```

## 🏃‍♂️ Çalıştırma
```bash
bun run server/index.ts
```
Veya masaüstünden `BASLAT.bat` dosyasına çift tıklayabilirsiniz.

## 🐳 Dokploy ile Yayınlama

Proje kökündeki `Dockerfile` ile Dokploy üzerinde doğrudan yayınlanır.

1. **Dokploy > Create Application** → Provider: **GitHub**, bu repoyu ve `main` dalını seçin.
2. **Build Type:** `Dockerfile` (Docker File yolu: `Dockerfile`).
3. **Environment** sekmesine `.env.example` içindeki değişkenleri girin:
   - `ADMIN_PASSWORD` → yönetici paneli parolası (**zorunlu**)
   - `SESSION_SECRET` → uzun rastgele bir metin
4. **Advanced > Volumes / Mounts:** Volume Mount ekleyin → Mount Path: `/app/data`
   (randevular ve mesajlar bu klasördeki SQLite dosyasında tutulur; volume olmazsa her deploy'da silinir).
5. **Domains:** alan adınızı ekleyin, Container Port: `3000`, HTTPS: açık (Let's Encrypt).
6. **Deploy**. Sonraki her `git push` için Auto Deploy açılabilir.

> Güvenlik: `gcp-key.json`, `data/` (hasta verileri) ve `.env` dosyaları `.gitignore` ile repoya gönderilmez.
