import React, { useState, useEffect, useCallback } from 'react';

interface DownloadButtonsProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  filename: string;
}

interface FullscreenButtonProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
}

interface ZoomControlsProps {
  zoom: number;
  onZoomChange: (zoom: number) => void;
}

interface ChartToolbarProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  filename: string;
  className?: string;
}

const DownloadIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 8L2 4h3V1h2v3h3L6 8z" fill="currentColor" />
    <path d="M1 10h10v1H1z" fill="currentColor" />
  </svg>
);

const ExpandIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 3 21 3 21 9" /><polyline points="9 21 3 21 3 15" />
    <line x1="21" y1="3" x2="14" y2="10" /><line x1="3" y1="21" x2="10" y2="14" />
  </svg>
);

const CollapseIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="4 14 10 14 10 20" /><polyline points="20 10 14 10 14 4" />
    <line x1="14" y1="10" x2="21" y2="3" /><line x1="3" y1="21" x2="10" y2="14" />
  </svg>
);

const ZoomInIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    <line x1="11" y1="8" x2="11" y2="14" /><line x1="8" y1="11" x2="14" y2="11" />
  </svg>
);

const ZoomOutIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    <line x1="8" y1="11" x2="14" y2="11" />
  </svg>
);

export const ZoomControls: React.FC<ZoomControlsProps> = ({ zoom, onZoomChange }) => {
  const MIN_ZOOM = 0.5;
  const MAX_ZOOM = 2.0;
  const STEP = 0.1;

  const zoomIn = () => onZoomChange(Math.min(MAX_ZOOM, Math.round((zoom + STEP) * 10) / 10));
  const zoomOut = () => onZoomChange(Math.max(MIN_ZOOM, Math.round((zoom - STEP) * 10) / 10));
  const resetZoom = () => onZoomChange(1.0);

  return (
    <div className="flex items-center gap-0.5">
      <button
        onClick={zoomOut}
        disabled={zoom <= MIN_ZOOM}
        className="text-gray-400 hover:text-academic-blue disabled:opacity-30 disabled:cursor-not-allowed transition-colors p-0.5 rounded-sm hover:bg-gray-100"
        title="Zoom Out"
      >
        <ZoomOutIcon />
      </button>
      <button
        onClick={resetZoom}
        className="text-[8px] font-bold text-gray-400 hover:text-academic-blue transition-colors px-1 py-0.5 rounded-sm hover:bg-gray-100 min-w-[32px] text-center tabular-nums"
        title="Reset Zoom"
      >
        {Math.round(zoom * 100)}%
      </button>
      <button
        onClick={zoomIn}
        disabled={zoom >= MAX_ZOOM}
        className="text-gray-400 hover:text-academic-blue disabled:opacity-30 disabled:cursor-not-allowed transition-colors p-0.5 rounded-sm hover:bg-gray-100"
        title="Zoom In"
      >
        <ZoomInIcon />
      </button>
    </div>
  );
};

export const DownloadButtons: React.FC<DownloadButtonsProps> = ({ containerRef, filename }) => {
  const downloadSVG = () => {
    if (!containerRef.current) return;
    const svg = containerRef.current.querySelector('svg');
    if (!svg) return;

    const svgClone = svg.cloneNode(true) as SVGElement;
    if (!svgClone.getAttribute('xmlns')) {
      svgClone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    }
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgClone);
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const downloadPNG = () => {
    if (!containerRef.current) return;
    const svg = containerRef.current.querySelector('svg');
    if (!svg) return;

    const svgClone = svg.cloneNode(true) as SVGElement;
    svgClone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

    const bbox = svg.getBoundingClientRect();
    const scale = 2;
    const w = bbox.width * scale;
    const h = bbox.height * scale;

    svgClone.setAttribute('width', String(bbox.width));
    svgClone.setAttribute('height', String(bbox.height));

    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgClone);
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);

    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, w, h);
      ctx.drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(url);
      canvas.toBlob((pngBlob) => {
        if (!pngBlob) return;
        const pngUrl = URL.createObjectURL(pngBlob);
        const link = document.createElement('a');
        link.href = pngUrl;
        link.download = `${filename}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(pngUrl);
      });
    };
    img.onerror = () => URL.revokeObjectURL(url);
    img.src = url;
  };

  return (
    <div className="flex items-center gap-0.5">
      <button
        onClick={downloadSVG}
        className="text-[8px] uppercase font-bold text-gray-400 hover:text-academic-blue transition-colors px-1.5 py-0.5 rounded-sm hover:bg-gray-100 flex items-center gap-1"
        title="Download as SVG"
      >
        <DownloadIcon /> SVG
      </button>
      <button
        onClick={downloadPNG}
        className="text-[8px] uppercase font-bold text-gray-400 hover:text-academic-blue transition-colors px-1.5 py-0.5 rounded-sm hover:bg-gray-100 flex items-center gap-1"
        title="Download as PNG"
      >
        <DownloadIcon /> PNG
      </button>
    </div>
  );
};

export const FullscreenButton: React.FC<FullscreenButtonProps> = ({ containerRef }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = async () => {
    if (!containerRef.current) return;
    try {
      if (!isFullscreen) {
        if (containerRef.current.requestFullscreen) {
          await containerRef.current.requestFullscreen();
          setIsFullscreen(true);
        }
      } else {
        if (document.fullscreenElement) {
          await document.exitFullscreen();
          setIsFullscreen(false);
        }
      }
    } catch (error) {
      console.error('Fullscreen error:', error);
    }
  };

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  // Also handle Escape key in fullscreen
  useEffect(() => {
    if (!isFullscreen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && document.fullscreenElement) {
        document.exitFullscreen();
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isFullscreen]);

  return (
    <>
      <button
        onClick={toggleFullscreen}
        className="text-[8px] uppercase font-bold text-gray-400 hover:text-academic-blue transition-colors px-1.5 py-0.5 rounded-sm hover:bg-gray-100 flex items-center gap-1"
        title={isFullscreen ? 'Exit Fullscreen (Esc)' : 'Fullscreen'}
      >
        {isFullscreen ? <CollapseIcon /> : <ExpandIcon />}
        {isFullscreen ? 'Exit' : 'Full'}
      </button>
      {/* Prominent floating exit bar when in fullscreen */}
      {isFullscreen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 2147483647,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '6px 0',
            background: 'linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.0) 100%)',
            pointerEvents: 'none',
          }}
        >
          <button
            onClick={toggleFullscreen}
            style={{
              pointerEvents: 'auto',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 24px',
              background: '#c9302c',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: 700,
              letterSpacing: '0.05em',
              textTransform: 'uppercase' as const,
              cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
            }}
            title="Exit Fullscreen (Esc)"
          >
            <CollapseIcon /> Exit Fullscreen
            <span style={{ fontSize: '10px', opacity: 0.7, marginLeft: '4px', fontWeight: 400 }}>(Esc)</span>
          </button>
        </div>
      )}
    </>
  );
};

const ChartToolbar: React.FC<ChartToolbarProps> = ({ containerRef, filename, className = '' }) => {
  const [zoom, setZoom] = useState(1.0);

  const applyZoom = useCallback((newZoom: number) => {
    setZoom(newZoom);
    if (!containerRef.current) return;
    // Apply zoom to all children except the first (header/h3)
    const children = containerRef.current.children;
    for (let i = 1; i < children.length; i++) {
      const el = children[i] as HTMLElement;
      el.style.transform = `scale(${newZoom})`;
      el.style.transformOrigin = 'top left';
      // Adjust the wrapper to account for scaled size
      if (newZoom !== 1) {
        el.style.width = `${100 / newZoom}%`;
        el.style.overflow = 'auto';
      } else {
        el.style.width = '';
        el.style.overflow = '';
      }
    }
  }, [containerRef]);

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <ZoomControls zoom={zoom} onZoomChange={applyZoom} />
      <div className="w-px h-3 bg-gray-200"></div>
      <DownloadButtons containerRef={containerRef} filename={filename} />
      <div className="w-px h-3 bg-gray-200"></div>
      <FullscreenButton containerRef={containerRef} />
    </div>
  );
};

export default ChartToolbar;
