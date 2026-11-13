import { Storage } from "@google-cloud/storage";
import { existsSync, readFileSync } from "fs";
import { join } from "path";

const BUCKET_NAME = process.env.GCS_BUCKET_NAME || "eycodex";
const DEFAULT_FOLDER = "ghm-dis-klinigi";

let storageClient: Storage | null = null;

function getStorageClient(): Storage | null {
  if (storageClient) return storageClient;

  // 1. Direct JSON from environment variable
  if (process.env.GCS_KEY_JSON) {
    try {
      const credentials = JSON.parse(process.env.GCS_KEY_JSON);
      storageClient = new Storage({
        projectId: credentials.project_id,
        credentials: {
          client_email: credentials.client_email,
          private_key: credentials.private_key,
        },
      });
      return storageClient;
    } catch (e) {
      console.error("GCS_KEY_JSON ayrıştırma hatası:", e);
    }
  }

  // 2. Local key file
  const candidatePaths = [
    join(__dirname, "../gcp-key.json"),
    join(process.cwd(), "gcp-key.json"),
    "E:/PROJELER/eycodex-dis-klinigi/gcp-key.json"
  ];

  for (const p of candidatePaths) {
    if (existsSync(p)) {
      try {
        storageClient = new Storage({ keyFilename: p });
        return storageClient;
      } catch (e) {
        console.error(`GCS key dosya okuma hatası (${p}):`, e);
      }
    }
  }

  return null;
}

export function isGcsConfigured(): boolean {
  return getStorageClient() !== null;
}

export async function listGcsMedia(prefix = DEFAULT_FOLDER) {
  const client = getStorageClient();
  if (!client) return [];

  try {
    const bucket = client.bucket(BUCKET_NAME);
    const [files] = await bucket.getFiles({ prefix, maxResults: 100 });
    return files.map(f => ({
      name: f.name.replace(`${prefix}/`, ""),
      path: f.name,
      url: `https://storage.googleapis.com/${BUCKET_NAME}/${f.name}`,
      size: Number(f.metadata.size || 0),
      updated: f.metadata.updated,
      contentType: f.metadata.contentType,
    }));
  } catch (err: any) {
    console.error("GCS listeleme hatası:", err.message);
    return [];
  }
}

export async function uploadToGcs(
  buffer: ArrayBuffer | Uint8Array | Buffer,
  originalFilename: string,
  mimeType?: string,
  subFolder = DEFAULT_FOLDER
): Promise<{ success: boolean; url: string; filename: string; source: "gcs" | "local" }> {
  const client = getStorageClient();
  const ext = ("." + (originalFilename.split(".").pop() || "jpg")).toLowerCase();
  const safeBase = originalFilename
    .replace(/\.[^/.]+$/, "")
    .replace(/[^a-zA-Z0-9-_]/g, "_")
    .substring(0, 30);
  const cleanName = `${Date.now()}_${safeBase}${ext}`;

  if (client) {
    try {
      const objectPath = `${subFolder}/${cleanName}`;
      const bucket = client.bucket(BUCKET_NAME);
      const file = bucket.file(objectPath);
      const nodeBuffer = Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer as ArrayBuffer);

      await file.save(nodeBuffer, {
        resumable: false,
        contentType: mimeType || "image/jpeg",
        metadata: {
          cacheControl: "public, max-age=31536000",
        },
      });

      try {
        await file.makePublic();
      } catch {}

      const publicUrl = `https://storage.googleapis.com/${BUCKET_NAME}/${objectPath}`;
      return { success: true, url: publicUrl, filename: cleanName, source: "gcs" };
    } catch (e: any) {
      console.error("GCS upload hatası, yerel diske aktarılıyor:", e.message);
    }
  }

  // Fallback to local save
  const localDir = join(__dirname, "../public/uploads");
  if (!existsSync(localDir)) {
    const { mkdirSync } = await import("fs");
    mkdirSync(localDir, { recursive: true });
  }
  const { writeFileSync } = await import("fs");
  const localPath = join(localDir, cleanName);
  const nodeBuffer = Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer as ArrayBuffer);
  writeFileSync(localPath, nodeBuffer);

  return {
    success: true,
    url: `/uploads/${cleanName}`,
    filename: cleanName,
    source: "local",
  };
}

