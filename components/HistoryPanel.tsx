import React, { useState, useEffect } from 'react';
import { HistorySession, getAllSessions, deleteSession, updateSession, clearAllSessions } from '../services/historyDB';

interface HistoryPanelProps {
  onLoadSession: (session: HistorySession) => void;
  isOpen: boolean;
  onClose: () => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ onLoadSession, isOpen, onClose }) => {
  const [sessions, setSessions] = useState<HistorySession[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [confirmClearAll, setConfirmClearAll] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadSessions();
    }
  }, [isOpen]);

  const loadSessions = async () => {
    setLoading(true);
    try {
      const allSessions = await getAllSessions();
      setSessions(allSessions);
    } catch (error) {
      console.error('Failed to load sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadSession = (session: HistorySession) => {
    onLoadSession(session);
    onClose();
  };

  const handleRenameStart = (session: HistorySession) => {
    setEditingId(session.id || null);
    setEditValue(session.label);
  };

  const handleRenameSave = async (session: HistorySession) => {
    if (editValue.trim() && session.id) {
      try {
        const updated = { ...session, label: editValue.trim() };
        await updateSession(updated);
        setSessions(sessions.map(s => s.id === session.id ? updated : s));
      } catch (error) {
        console.error('Failed to rename session:', error);
      }
    }
    setEditingId(null);
    setEditValue('');
  };

  const handleDeleteConfirm = async (id: number) => {
    try {
      await deleteSession(id);
      setSessions(sessions.filter(s => s.id !== id));
      setConfirmDeleteId(null);
    } catch (error) {
      console.error('Failed to delete session:', error);
    }
  };

  const handleClearAllConfirm = async () => {
    try {
      await clearAllSessions();
      setSessions([]);
      setConfirmClearAll(false);
    } catch (error) {
      console.error('Failed to clear all sessions:', error);
    }
  };

  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined });
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-[210] bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className="fixed right-0 top-0 bottom-0 z-[220] flex flex-col"
        style={{ width: '384px', background: '#f8f7f4', boxShadow: '-4px 0 24px rgba(0,0,0,0.15)', borderLeft: '1px solid #e5e7eb' }}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-200 flex justify-between items-center" style={{ background: '#fff' }}>
          <div>
            <h2 className="text-base font-bold" style={{ color: '#2563eb' }}>Session History</h2>
            <p className="text-[10px] text-gray-400 uppercase tracking-wider mt-0.5">Past Analyses</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto" style={{ minHeight: 0 }}>
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="inline-block w-7 h-7 border-2 border-t-transparent rounded-full animate-spin mb-2" style={{ borderColor: '#2563eb', borderTopColor: 'transparent' }} />
                <p className="text-xs text-gray-400">Loading...</p>
              </div>
            </div>
          ) : sessions.length === 0 ? (
            <div className="flex items-center justify-center py-20 px-6">
              <div className="text-center">
                <svg className="h-10 w-10 text-gray-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm font-medium text-gray-500 mb-1">No sessions yet</p>
                <p className="text-xs text-gray-400">Run an analysis and click Save</p>
              </div>
            </div>
          ) : (
            <div>
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className="px-5 py-4 border-b border-gray-100 hover:bg-white/80 transition-colors"
                >
                  {/* Session label + date */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1 min-w-0 overflow-hidden">
                      {editingId === session.id ? (
                        <input
                          autoFocus
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={() => handleRenameSave(session)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleRenameSave(session);
                            if (e.key === 'Escape') { setEditingId(null); setEditValue(''); }
                          }}
                          className="w-full px-2 py-1 border rounded text-sm font-medium focus:outline-none focus:ring-2"
                          style={{ borderColor: '#2563eb', color: '#2563eb' }}
                        />
                      ) : (
                        <button
                          onClick={() => handleRenameStart(session)}
                          className="block w-full text-left text-sm font-medium truncate hover:underline"
                          style={{ color: '#2563eb' }}
                          title={session.label}
                        >
                          {session.label}
                        </button>
                      )}
                    </div>
                    <span className="text-[10px] text-gray-400 font-mono shrink-0 pt-0.5">
                      {formatDate(session.timestamp)}
                    </span>
                  </div>

                  {/* Metadata */}
                  <div className="flex items-center gap-3 text-[11px] mb-3">
                    <span className="px-2 py-0.5 rounded text-white font-mono text-[10px]" style={{ background: '#2563eb' }}>
                      {session.config.algorithm}
                    </span>
                    <span className="text-gray-500">
                      {session.result.matches.length} matches
                    </span>
                    <span className="font-mono font-semibold" style={{ color: '#d97706' }}>
                      {session.result.stats.meanSimilarity.toFixed(1)}%
                    </span>
                  </div>

                  {/* Witness names preview */}
                  <div className="flex gap-2 mb-3 text-[10px] text-gray-400">
                    <span className="truncate" title={session.witnessAlphaName}>
                      <strong style={{ color: '#2563eb' }}>S</strong> {session.witnessAlphaName}
                    </span>
                    <span className="text-gray-300">|</span>
                    <span className="truncate" title={session.witnessBetaName}>
                      <strong style={{ color: '#d97706' }}>T</strong> {session.witnessBetaName}
                    </span>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleLoadSession(session)}
                      className="flex-1 px-3 py-1.5 text-white text-[11px] font-medium rounded transition-colors"
                      style={{ background: '#2563eb' }}
                    >
                      Load
                    </button>
                    <button
                      onClick={() => handleRenameStart(session)}
                      className="px-2 py-1.5 border border-gray-300 text-gray-500 hover:bg-gray-50 text-[11px] rounded transition-colors"
                      title="Rename"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                    </button>

                    {confirmDeleteId === session.id ? (
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleDeleteConfirm(session.id!)}
                          className="px-2 py-1.5 bg-red-600 text-white text-[11px] font-medium rounded transition-colors"
                        >
                          Yes
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(null)}
                          className="px-2 py-1.5 bg-gray-200 text-gray-600 text-[11px] font-medium rounded transition-colors"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmDeleteId(session.id || null)}
                        className="px-2 py-1.5 border border-red-200 text-red-400 hover:bg-red-50 text-[11px] rounded transition-colors"
                        title="Delete"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {sessions.length > 0 && (
          <div className="border-t border-gray-200 px-5 py-3 shrink-0" style={{ background: '#fff' }}>
            {confirmClearAll ? (
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-gray-500 flex-1">Clear all {sessions.length} sessions?</span>
                <button
                  onClick={handleClearAllConfirm}
                  className="px-3 py-1.5 bg-red-600 text-white text-[11px] font-medium rounded"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setConfirmClearAll(false)}
                  className="px-3 py-1.5 bg-gray-200 text-gray-600 text-[11px] font-medium rounded"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmClearAll(true)}
                className="w-full px-3 py-1.5 border border-gray-200 text-gray-500 hover:bg-gray-50 text-[11px] font-medium rounded transition-colors"
              >
                Clear All Sessions
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default HistoryPanel;
