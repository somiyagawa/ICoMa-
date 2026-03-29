import React, { useState } from 'react';

interface DownloadButtonsProps {
  containerRef: React.RefObject<HTMLDivElement>;
  filename: string;
}

interface FullscreenButtonProps {
  containerRef: React.RefObject<HTMLDivElement>;
}

interface ChartToolbarProps {
  containerRef: React.RefObject<HTMLDivElement>;
  filename: string;
  className?: string;
}

const DownloadSVGIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 8L2 4h3V1h2v3h3L6 8z" fill="currentColor" />
    <path d="M1 11h10v1H1z" fill="currentColor" />
  </svg>
);

const DownloadPNGIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 8L2 4h3V1h2v3h3L6 8z" fill="currentColor" />
    <path d="M1 11h10v1H1z" fill="currentColor" />
  </svg>
);

const ExpandIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1 1h3v1H2v3H1V1z" fill="currentColor" />
    <path d="M8 1h3v4h-1V2H8V1z" fill="currentColor" />
    <path d="M1 8v3h3v1H1V8z" fill="currentColor" />
    <path d="M8 8h3v4h-4v-1h3V8z" fill="currentColor" />
  </svg>
);

const CollapseIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 2h3v1H3v2H2V2z" fill="currentColor" />
    <path d="M7 2h3v3h-1V3H7V2z" fill="currentColor" />
    <path d="M2 7v3h3v1H2V7z" fill="currentColor" />
    <path d="M7 7h3v3h-1v-2H7V7z" fill="currentColor" />
  </svg>
);

export const DownloadButtons: React.FC<DownloadButtonsProps> = ({ containerRef, filename }) => {
  const downloadSVG = () => {
    if (!containerRef.current) return;

    const svg = containerRef.current.querySelector('svg');
    if (!svg) {
      console.error('No SVG found in container');
      return;
    }

    const svgClone = svg.cloneNode(true) as SVGElement;
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
    if (!svg) {
      console.error('No SVG found in container');
      return;
    }

    const svgClone = svg.cloneNode(true) as SVGElement;
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgClone);

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Could not get canvas context');
      return;
    }

    const img = new Image();
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
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

    img.onerror = () => {
      console.error('Failed to load SVG as image');
      URL.revokeObjectURL(url);
    };

    img.src = url;
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={downloadSVG}
        className="text-[9px] uppercase font-bold text-gray-400 hover:text-academic-blue transition-colors px-1.5 py-1 rounded-sm hover:bg-gray-100"
        title="Download SVG"
        aria-label="Download SVG"
      >
        <DownloadSVGIcon />
      </button>
      <button
        onClick={downloadPNG}
        className="text-[9px] uppercase font-bold text-gray-400 hover:text-academic-blue transition-colors px-1.5 py-1 rounded-sm hover:bg-gray-100"
        title="Download PNG"
        aria-label="Download PNG"
      >
        <DownloadPNGIcon />
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
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  return (
    <button
      onClick={toggleFullscreen}
      className="text-[9px] uppercase font-bold text-gray-400 hover:text-academic-blue transition-colors px-1.5 py-1 rounded-sm hover:bg-gray-100"
      title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
      aria-label={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
    >
      {isFullscreen ? <CollapseIcon /> : <ExpandIcon />}
    </button>
  );
};

const ChartToolbar: React.FC<ChartToolbarProps> = ({ containerRef, filename, className = '' }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <DownloadButtons containerRef={containerRef} filename={filename} />
      <FullscreenButton containerRef={containerRef} />
    </div>
  );
};

export default ChartToolbar;
