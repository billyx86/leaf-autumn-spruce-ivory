import type { PackedTape } from "@/game/recorder";

export type PendingTape = {
  blob: Blob;
  mime: string;
  replay?: PackedTape;
  score: number;
  clips: number;
  grade: string;
  roast: string;
  at: number;
};

const DB_NAME = "bad-angle";
const STORE = "pending";

function openDb() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function stashPendingTape(entry: PendingTape) {
  try {
    const db = await openDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE, "readwrite");
      tx.objectStore(STORE).put(entry, "last");
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
    db.close();
  } catch {
    /* private mode / full */
  }
}

export async function readPendingTape(): Promise<PendingTape | null> {
  try {
    const db = await openDb();
    const row = await new Promise<PendingTape | null>((resolve, reject) => {
      const tx = db.transaction(STORE, "readonly");
      const req = tx.objectStore(STORE).get("last");
      req.onsuccess = () => resolve((req.result as PendingTape | undefined) ?? null);
      req.onerror = () => reject(req.error);
    });
    db.close();
    return row;
  } catch {
    return null;
  }
}

export async function clearPendingTape() {
  try {
    const db = await openDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE, "readwrite");
      tx.objectStore(STORE).delete("last");
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
    db.close();
  } catch {
    /* ignore */
  }
}
