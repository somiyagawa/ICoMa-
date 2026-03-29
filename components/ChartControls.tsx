import React, { useState } from 'react';

interface DownloadButtonsProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  filename: string;
}

interface FullscreenButtonProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
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

export const DownloadButtons: React.FC<DownloadButtonsProps> = ({ containerRef, filename }) => {
  const downloadSVG = () => {
    if (!containerRef.current) return;
    const svg = containerRef.current.querySelector('svg');
    if (!svg) return;

    const svgClone = svg.cloneNode(true) as SVGElement;
    // Ensure width/height attributes are set for proper export
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

    // Get actual rendered size
    const bbox = svg.getBoundingClientRect();
    const scale = 2; // 2x resolution for crisp export
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

  React.useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  return (
    <button
      onClick={toggleFullscreen}
      className="text-[8px] uppercase font-bold text-gray-400 hover:text-academic-blue transition-colors px-1.5 py-0.5 rounded-sm hover:bg-gray-100 flex items-center gap-1"
      title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
    >
      {isFullscreen ? <CollapseIcon /> : <ExpandIcon />}
      {isFullscreen ? 'Exit' : 'Full'}
    </button>
  );
};

const ChartToolbar: React.FC<ChartToolbarProps> = ({ containerRef, filename, className = '' }) => {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <DownloadButtons containerRef={containerRef} filename={filename} />
      <div className="w-px h-3 bg-gray-200"></div>
      <FullscreenButton containerRef={containerRef} />
    </div>
  );
};

export default ChartToolbar;
