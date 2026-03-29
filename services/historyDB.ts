/**
 * History DB Service — IndexedDB-based session persistence for ICoMa.
 * Stores analysis sessions (config, texts, results, AI analysis) for recall and comparison.
 */
import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { AnalysisConfig, AnalysisResult } from '../types';

// ── Schema ──────────────────────────────────────────────────────────
export interface HistorySession {
  id?: number;                     // auto-incremented
  timestamp: number;               // Date.now()
  label: string;                   // user-editable session name
  witnessAlphaName: string;        // custom name for Witness α
  witnessBetaName: string;         // custom name for Witness β
  sourceText: string;
  targetText: string;
  config: AnalysisConfig;
  result: AnalysisResult;
  aiAnalysis?: any;                // AI Intertextuality results (JSON)
}

interface ICoMaDB extends DBSchema {
  sessions: {
    key: number;
    value: HistorySession;
    indexes: {
      'by-timestamp': number;
      'by-label': string;
    };
  };
}

// ── Database ────────────────────────────────────────────────────────
const DB_NAME = 'icoma-history';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<ICoMaDB>> | null = null;

function getDB(): Promise<IDBPDatabase<ICoMaDB>> {
  if (!dbPromise) {
    dbPromise = openDB<ICoMaDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        const store = db.createObjectStore('sessions', {
          keyPath: 'id',
          autoIncrement: true,
        });
        store.createIndex('by-timestamp', 'timestamp');
        store.createIndex('by-label', 'label');
      },
    });
  }
  return dbPromise;
}

// ── CRUD Operations ─────────────────────────────────────────────────

/** Save a new session. Returns the auto-generated ID. */
export async function saveSession(session: Omit<HistorySession, 'id'>): Promise<number> {
  const db = await getDB();
  return db.add('sessions', session as HistorySession);
}

/** Get all sessions, newest first. */
export async function getAllSessions(): Promise<HistorySession[]> {
  const db = await getDB();
  const all = await db.getAllFromIndex('sessions', 'by-timestamp');
  return all.reverse(); // newest first
}

/** Get a single session by ID. */
export async function getSession(id: number): Promise<HistorySession | undefined> {
  const db = await getDB();
  return db.get('sessions', id);
}

/** Update an existing session (e.g. rename label). */
export async function updateSession(session: HistorySession): Promise<void> {
  const db = await getDB();
  await db.put('sessions', session);
}

/** Delete a session by ID. */
export async function deleteSession(id: number): Promise<void> {
  const db = await getDB();
  await db.delete('sessions', id);
}

/** Delete all sessions. */
export async function clearAllSessions(): Promise<void> {
  const db = await getDB();
  await db.clear('sessions');
}

/** Count total sessions. */
export async function countSessions(): Promise<number> {
  const db = await getDB();
  return db.count('sessions');
}
