import { Storage } from "@google-cloud/storage";
import { readdirSync, statSync, readFileSync, existsSync } from "fs";
import { join, relative } from "path";

const BUCKET_NAME = process.env.GCS_BUCKET_NAME || "eycodex";
const TARGET_FOLDER = "ghm-dis-klinigi"; // Dedicated GCS folder for GHM Diş Kliniği

async function uploadFolder() {
  const keyPath = join(__dirname, "../gcp-key.json");
  if (!existsSync(keyPath)) {
    console.error("gcp-key.json bulunamadı:", keyPath);
    return;
  }

  const storage = new Storage({ keyFilename: keyPath });
  const bucket = storage.bucket(BUCKET_NAME);

  console.log(`Google Cloud Storage'a bağlanılıyor... (Bucket: ${BUCKET_NAME}, Hedef Klasör: ${TARGET_FOLDER})`);

  const imagesDir = join(__dirname, "../public/images");

  function getFiles(dir: string): string[] {
    const subdirs = readdirSync(dir);
    const files: string[] = [];
    for (const file of subdirs) {
      const fullPath = join(dir, file);
      if (statSync(fullPath).isDirectory()) {
        files.push(...getFiles(fullPath));
      } else {
        files.push(fullPath);
      }
    }
    return files;
  }

  const files = getFiles(imagesDir);
  console.log(`Yüklenecek ${files.length} dosya tespit edildi.`);

  const mimeMap: Record<string, string> = {
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".svg": "image/svg+xml",
    ".webp": "image/webp",
  };

  const results: { local: string; gcs: string; url: string }[] = [];

  for (const filePath of files) {
    const rel = relative(imagesDir, filePath).replace(/\\/g, "/");
    const destPath = `${TARGET_FOLDER}/${rel}`;
    const ext = ("." + (rel.split(".").pop() || "")).toLowerCase();
    const contentType = mimeMap[ext] || "application/octet-stream";

    console.log(`Yükleniyor: ${rel} -> gs://${BUCKET_NAME}/${destPath}`);

    try {
      const file = bucket.file(destPath);
      const data = readFileSync(filePath);

      await file.save(data, {
        resumable: false,
        contentType,
        metadata: {
          cacheControl: "public, max-age=31536000",
        },
      });

      // Try making public if bucket allows
      try {
        await file.makePublic();
      } catch (e) {
        // Uniform bucket-level access might prevent makePublic, which is normal
      }

      const publicUrl = `https://storage.googleapis.com/${BUCKET_NAME}/${destPath}`;
      results.push({ local: rel, gcs: destPath, url: publicUrl });
      console.log(`✓ Başarılı: ${publicUrl}`);
    } catch (err: any) {
      console.error(`✗ Hata (${rel}):`, err.message);
    }
  }

  console.log(`\n========================================`);
  console.log(`Google Cloud Storage Yükleme Tamamlandı!`);
  console.log(`Toplam ${results.length} görsel '${TARGET_FOLDER}' klasörüne yüklendi.`);
  console.log(`========================================\n`);
}

uploadFolder().catch(console.error);

