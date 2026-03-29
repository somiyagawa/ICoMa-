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

  // Load sessions when panel opens
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
        setEditingId(null);
        setEditValue('');
      } catch (error) {
        console.error('Failed to rename session:', error);
      }
    } else {
      setEditingId(null);
      setEditValue('');
    }
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
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined });
    }
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Panel */}
      <div
        className={`fixed right-0 top-0 h-screen w-96 bg-academic-paper shadow-2xl border-l border-gray-200 z-50 flex flex-col transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-white">
          <div>
            <h2 className="text-lg font-bold text-academic-blue">Session History</h2>
            <p className="text-xs text-gray-500 uppercase tracking-wider">Past Analyses</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-academic-red transition-colors p-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="inline-block w-8 h-8 border-2 border-academic-blue border-t-transparent rounded-full animate-spin mb-2" />
                <p className="text-xs text-gray-400">Loading...</p>
              </div>
            </div>
          ) : sessions.length === 0 ? (
            <div className="flex items-center justify-center h-full px-6">
              <div className="text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm font-medium text-gray-600 mb-1">No sessions yet</p>
                <p className="text-xs text-gray-400">Run an analysis to save it here</p>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {sessions.map((session) => (
                <div key={session.id} className="px-6 py-4 hover:bg-academic-cream transition-colors group">
                  {/* Header with label and timestamp */}
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      {editingId === session.id ? (
                        <input
                          autoFocus
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={() => handleRenameSave(session)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleRenameSave(session);
                            if (e.key === 'Escape') {
                              setEditingId(null);
                              setEditValue('');
                            }
                          }}
                          className="w-full px-2 py-1 border border-academic-blue rounded text-sm font-medium text-academic-blue focus:outline-none focus:ring-2 focus:ring-academic-blue/50"
                        />
                      ) : (
                        <button
                          onClick={() => handleRenameStart(session)}
                          className="text-sm font-medium text-academic-blue hover:underline text-left truncate"
                        >
                          {session.label}
                        </button>
                      )}
                    </div>
                    <span className="text-[11px] text-gray-500 font-mono ml-2 flex-shrink-0">
                      {formatDate(session.timestamp)}
                    </span>
                  </div>

                  {/* Metadata row 1: Algorithm and Match Count */}
                  <div className="flex items-center justify-between text-xs mb-2">
                    <div className="flex items-center gap-1">
                      <span className="text-gray-500">Algorithm:</span>
                      <span className="font-mono font-semibold text-academic-blue">{session.config.algorithm}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-gray-500">Matches:</span>
                      <span className="font-mono font-semibold text-academic-red">{session.result.matches.length}</span>
                    </div>
                  </div>

                  {/* Metadata row 2: Mean Similarity */}
                  <div className="flex items-center gap-1 mb-3 text-xs">
                    <span className="text-gray-500">Mean Similarity:</span>
                    <span className="font-mono font-semibold" style={{ color: '#8b4513' }}>
                      {session.result.stats.meanSimilarity.toFixed(1)}%
                    </span>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleLoadSession(session)}
                      className="flex-1 px-3 py-2 bg-academic-blue hover:bg-academic-blue/90 text-white text-xs font-medium rounded transition-colors"
                    >
                      Load
                    </button>

                    {confirmDeleteId === session.id ? (
                      <>
                        <button
                          onClick={() => handleDeleteConfirm(session.id!)}
                          className="px-3 py-2 bg-academic-red hover:bg-academic-red/90 text-white text-xs font-medium rounded transition-colors"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(null)}
                          className="px-3 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 text-xs font-medium rounded transition-colors"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setConfirmDeleteId(session.id || null)}
                        className="px-3 py-2 border border-academic-red text-academic-red hover:bg-academic-red/5 text-xs font-medium rounded transition-colors"
                      >
                        Delete
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
          <div className="border-t border-gray-200 px-6 py-4 bg-white">
            {confirmClearAll ? (
              <div className="space-y-3">
                <p className="text-xs text-gray-600 font-medium">Clear all {sessions.length} sessions?</p>
                <div className="flex gap-2">
                  <button
                    onClick={handleClearAllConfirm}
                    className="flex-1 px-3 py-2 bg-academic-red hover:bg-academic-red/90 text-white text-xs font-medium rounded transition-colors"
                  >
                    Clear All
                  </button>
                  <button
                    onClick={() => setConfirmClearAll(false)}
                    className="flex-1 px-3 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-medium rounded transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setConfirmClearAll(true)}
                className="w-full px-3 py-2 border border-gray-300 text-gray-600 hover:bg-gray-50 text-xs font-medium rounded transition-colors"
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
