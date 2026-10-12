import React from 'react';

interface VisualPatternProps {
  type: string;
  className?: string;
  badge?: string;
  label?: string;
  aspect?: '16:9' | '4:3' | '1:1' | 'full';
}

export const VisualPattern: React.FC<VisualPatternProps> = ({
  type,
  className = '',
  badge,
  label,
  aspect = '4:3',
}) => {
  const aspectClass =
    aspect === '16:9'
      ? 'aspect-[16/9]'
      : aspect === '4:3'
      ? 'aspect-[4/3]'
      : aspect === '1:1'
      ? 'aspect-square'
      : 'h-full w-full';

  return (
    <div className={`relative overflow-hidden bg-stone-900 select-none ${aspectClass} ${className}`}>
      {/* Pattern Visual Engine */}
      {type === 'hero-living-room' && (
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice" viewBox="0 0 1200 675" fill="none">
          <defs>
            <linearGradient id="heroBg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1c1917" />
              <stop offset="40%" stopColor="#292524" />
              <stop offset="100%" stopColor="#0c0a09" />
            </linearGradient>
            <linearGradient id="goldGlow" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#d97706" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#78350f" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="marbleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f5f5f4" />
              <stop offset="50%" stopColor="#e7e5e4" />
              <stop offset="100%" stopColor="#d6d3d1" />
            </linearGradient>
            <linearGradient id="woodSlat" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#78350f" />
              <stop offset="25%" stopColor="#92400e" />
              <stop offset="70%" stopColor="#b45309" />
              <stop offset="100%" stopColor="#78350f" />
            </linearGradient>
            <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="30" result="blur" />
            </filter>
          </defs>

          {/* Background wall */}
          <rect width="1200" height="675" fill="url(#heroBg)" />

          {/* Ceiling Cove Light */}
          <rect x="0" y="0" width="1200" height="18" fill="#fef08a" opacity="0.6" />
          <circle cx="600" cy="10" r="300" fill="#fef08a" opacity="0.25" filter="url(#softGlow)" />

          {/* Left Wall: WPC Louvers (Vertical Slats) */}
          <g opacity="0.9">
            {Array.from({ length: 24 }).map((_, i) => (
              <g key={`slat-${i}`}>
                <rect x={30 + i * 16} y="0" width="11" height="520" fill="url(#woodSlat)" />
                <rect x={41 + i * 16} y="0" width="5" height="520" fill="#1c1917" opacity="0.7" />
              </g>
            ))}
          </g>

          {/* Center Feature Wall: Bookmatched Calacatta UV Marble */}
          <g>
            <rect x="440" y="40" width="460" height="460" rx="4" fill="url(#marbleGrad)" stroke="#d4af37" strokeWidth="2" strokeOpacity="0.5" />
            {/* Marble Veins */}
            <path d="M470 60 Q520 180 620 220 T780 340 T880 480" stroke="#d97706" strokeWidth="2.5" strokeOpacity="0.5" fill="none" />
            <path d="M480 70 Q530 190 630 230 T790 350 T890 490" stroke="#78716c" strokeWidth="1.5" strokeOpacity="0.4" fill="none" />
            <path d="M720 50 Q660 160 550 290 T450 420" stroke="#b45309" strokeWidth="2" strokeOpacity="0.45" fill="none" />
            <path d="M850 120 Q740 240 680 380 T600 490" stroke="#a8a29e" strokeWidth="3" strokeOpacity="0.3" fill="none" />

            {/* Backlit LED glow under marble edge */}
            <rect x="430" y="30" width="480" height="480" rx="6" stroke="#fbbf24" strokeWidth="1.5" strokeOpacity="0.7" fill="none" filter="url(#softGlow)" />

            {/* Mounted ultra-thin OLED TV */}
            <rect x="510" y="110" width="320" height="190" rx="4" fill="#09090b" stroke="#3f3f46" strokeWidth="2" />
            <rect x="520" y="120" width="300" height="170" fill="#18181b" />
            <path d="M540 250 L630 160 L710 240 L760 190 L810 250" stroke="#a1a1aa" strokeWidth="2" fill="none" opacity="0.3" />

            {/* Floating Minimalist Media Console with Gold Trim */}
            <rect x="410" y="440" width="520" height="60" rx="2" fill="#18181b" stroke="#78350f" strokeWidth="1" />
            <line x1="410" y1="441" x2="930" y2="441" stroke="#fbbf24" strokeWidth="2" strokeOpacity="0.8" />
            {/* Console drawer seams */}
            <line x1="580" y1="440" x2="580" y2="500" stroke="#27272a" strokeWidth="2" />
            <line x1="750" y1="440" x2="750" y2="500" stroke="#27272a" strokeWidth="2" />
          </g>

          {/* Right Wall: Charcoal Vertical Slat Panels */}
          <g opacity="0.85">
            {Array.from({ length: 16 }).map((_, i) => (
              <g key={`right-slat-${i}`}>
                <rect x={940 + i * 15} y="0" width="10" height="520" fill="#262626" />
                <rect x={950 + i * 15} y="0" width="5" height="520" fill="#09090b" />
                {i % 4 === 0 && (
                  <line x1={940 + i * 15} y1="0" x2={940 + i * 15} y2="520" stroke="#d4af37" strokeWidth="1" opacity="0.6" />
                )}
              </g>
            ))}
          </g>

          {/* Luxury Flooring: Polished Warm Travertine Slab */}
          <rect x="0" y="520" width="1200" height="155" fill="#1c1917" />
          <line x1="0" y1="520" x2="1200" y2="520" stroke="#44403c" strokeWidth="2" />
          <line x1="0" y1="595" x2="1200" y2="595" stroke="#292524" strokeWidth="1.5" />
          <line x1="300" y1="520" x2="250" y2="675" stroke="#292524" strokeWidth="1.5" />
          <line x1="650" y1="520" x2="620" y2="675" stroke="#292524" strokeWidth="1.5" />
          <line x1="980" y1="520" x2="960" y2="675" stroke="#292524" strokeWidth="1.5" />

          {/* Architectural Light grazing cone */}
          <polygon points="180,0 20,520 340,520" fill="url(#goldGlow)" />
          <polygon points="670,0 470,520 870,520" fill="url(#goldGlow)" />
        </svg>
      )}

      {/* Fluted Louver Texture */}
      {(type === 'fluted' || type === 'wpc-teak' || type === 'wpc-hero') && (
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 400 300" fill="none">
          <rect width="400" height="300" fill="#3f2314" />
          {Array.from({ length: 22 }).map((_, i) => (
            <g key={i}>
              {/* Slat face with wood gradient */}
              <rect x={i * 18.5} y="0" width="13" height="300" fill="#854d0e" />
              <rect x={i * 18.5} y="0" width="3" height="300" fill="#a16207" opacity="0.8" />
              {/* Shadow groove */}
              <rect x={i * 18.5 + 13} y="0" width="5.5" height="300" fill="#1c1917" />
            </g>
          ))}
          {/* Architectural rim highlight */}
          <rect x="0" y="0" width="400" height="300" fill="url(#flutedGlow)" opacity="0.3" />
        </svg>
      )}

      {/* Charcoal Matte Louvers with Gold Accent */}
      {(type === 'charcoal-gold' || type === 'charcoal-hero' || type === 'wpc-charcoal') && (
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 400 300" fill="none">
          <rect width="400" height="300" fill="#18181b" />
          {Array.from({ length: 24 }).map((_, i) => (
            <g key={i}>
              <rect x={i * 17} y="0" width="12" height="300" fill="#27272a" />
              <rect x={i * 17 + 12} y="0" width="5" height="300" fill="#09090b" />
              {i % 4 === 1 && (
                <rect x={i * 17} y="0" width="2" height="300" fill="#eab308" opacity="0.85" />
              )}
            </g>
          ))}
        </svg>
      )}

      {/* UV Marble Texture (Calacatta) */}
      {(type === 'marble' || type === 'uv-calacatta' || type === 'uv-marble-hero') && (
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" fill="none">
          <rect width="400" height="300" fill="#f5f5f4" />
          <path d="M10 20 Q120 140 220 120 T360 280" stroke="#d97706" strokeWidth="3" strokeOpacity="0.6" />
          <path d="M18 25 Q125 145 225 125 T365 285" stroke="#a8a29e" strokeWidth="1.5" strokeOpacity="0.4" />
          <path d="M280 10 Q210 130 110 180 T10 260" stroke="#b45309" strokeWidth="2.5" strokeOpacity="0.5" />
          <path d="M340 80 Q290 190 260 290" stroke="#78716c" strokeWidth="2" strokeOpacity="0.3" />
          <path d="M90 10 Q140 80 180 160" stroke="#d4af37" strokeWidth="1" strokeOpacity="0.7" />
          {/* Gloss sheen overlay */}
          <linearGradient id="marbleSheen" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.5" />
            <stop offset="60%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="100%" stopColor="#fef3c7" stopOpacity="0.3" />
          </linearGradient>
          <rect width="400" height="300" fill="url(#marbleSheen)" />
        </svg>
      )}

      {/* Nero Portoro UV Marble */}
      {type === 'uv-portoro' && (
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" fill="none">
          <rect width="400" height="300" fill="#09090b" />
          <path d="M20 40 Q140 120 240 180 T390 240" stroke="#f59e0b" strokeWidth="3.5" strokeOpacity="0.8" />
          <path d="M15 35 Q135 115 235 175 T385 235" stroke="#fbbf24" strokeWidth="1.5" strokeOpacity="0.9" />
          <path d="M360 30 Q220 140 120 220 T20 280" stroke="#d97706" strokeWidth="2.5" strokeOpacity="0.7" />
          <path d="M180 10 Q240 160 310 290" stroke="#fef08a" strokeWidth="1" strokeOpacity="0.5" />
          <linearGradient id="darkSheen" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.15" />
            <stop offset="50%" stopColor="#000000" stopOpacity="0" />
          </linearGradient>
          <rect width="400" height="300" fill="url(#darkSheen)" />
        </svg>
      )}

      {/* Designer Wallpaper (Art Deco Damask / Metallic) */}
      {(type === 'wallpaper-artdeco' || type === 'wallpaper-hero') && (
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 300" preserveAspectRatio="none" fill="none">
          <rect width="400" height="300" fill="#292524" />
          {/* Repeating Art Deco Arches */}
          {Array.from({ length: 5 }).map((_, col) =>
            Array.from({ length: 4 }).map((_, row) => (
              <g key={`${col}-${row}`} transform={`translate(${col * 85 - 20}, ${row * 80 - 20})`}>
                <path d="M10 60 A30 30 0 0 1 70 60" stroke="#d4af37" strokeWidth="1.5" strokeOpacity="0.7" fill="none" />
                <path d="M20 60 A20 20 0 0 1 60 60" stroke="#fbbf24" strokeWidth="1" strokeOpacity="0.5" fill="none" />
                <path d="M30 60 A10 10 0 0 1 50 60" stroke="#fef08a" strokeWidth="1" strokeOpacity="0.6" fill="none" />
                <line x1="40" y1="10" x2="40" y2="70" stroke="#eab308" strokeWidth="1" strokeOpacity="0.4" />
              </g>
            ))
          )}
        </svg>
      )}

      {/* Botanical Linen Wallpaper */}
      {(type === 'wallpaper-botanical' || type === 'botanical') && (
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" fill="none">
          <rect width="400" height="300" fill="#262e2b" />
          {/* Stylized Palm Fronds and Monstera Leaves */}
          <path d="M60 280 C80 180 160 120 240 80" stroke="#84a98c" strokeWidth="2.5" fill="none" />
          <path d="M140 160 C200 130 220 80 200 40" stroke="#52796f" strokeWidth="2" fill="none" />
          <path d="M170 140 C240 140 260 100 280 60" stroke="#84a98c" strokeWidth="1.5" fill="none" />
          <path d="M320 290 C300 200 220 160 140 120" stroke="#cad2c5" strokeWidth="2" fill="none" opacity="0.6" />
          <circle cx="280" cy="80" r="40" stroke="#d4af37" strokeWidth="1" strokeOpacity="0.4" fill="none" />
        </svg>
      )}

      {/* 3D Origami Panels */}
      {(type === '3d-origami' || type === '3d-panel-hero' || type === '3d') && (
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 300" preserveAspectRatio="none" fill="none">
          <rect width="400" height="300" fill="#1e293b" />
          {Array.from({ length: 4 }).map((_, col) =>
            Array.from({ length: 3 }).map((_, row) => {
              const cx = col * 100 + 50;
              const cy = row * 100 + 50;
              return (
                <g key={`${col}-${row}`}>
                  {/* Diamond 4 facets */}
                  <polygon points={`${cx},${cy - 48} ${cx + 48},${cy} ${cx},${cy}`} fill="#475569" />
                  <polygon points={`${cx + 48},${cy} ${cx},${cy + 48} ${cx},${cy}`} fill="#334155" />
                  <polygon points={`${cx},${cy + 48} ${cx - 48},${cy} ${cx},${cy}`} fill="#1e293b" />
                  <polygon points={`${cx - 48},${cy} ${cx},${cy - 48} ${cx},${cy}`} fill="#64748b" />
                </g>
              );
            })
          )}
        </svg>
      )}

      {/* Natural Oak Acoustic Wood Panels */}
      {(type === 'wood-acoustic' || type === 'wood-hero') && (
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 300" preserveAspectRatio="none" fill="none">
          {/* Black acoustic felt */}
          <rect width="400" height="300" fill="#09090b" />
          {Array.from({ length: 18 }).map((_, i) => (
            <g key={i}>
              <rect x={i * 22.5 + 4} y="0" width="14" height="300" fill="#d4a373" />
              <rect x={i * 22.5 + 4} y="0" width="2" height="300" fill="#faedcd" opacity="0.6" />
              <rect x={i * 22.5 + 16} y="0" width="2" height="300" fill="#b08968" opacity="0.8" />
            </g>
          ))}
        </svg>
      )}

      {/* PVC Waterproof Panels */}
      {(type === 'pvc-timber' || type === 'pvc-hero') && (
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 300" preserveAspectRatio="none" fill="none">
          <rect width="400" height="300" fill="#2d3748" />
          {Array.from({ length: 8 }).map((_, i) => (
            <g key={i}>
              <rect x={i * 50} y="0" width="48" height="300" fill="#4a5568" />
              <line x1={i * 50 + 49} y1="0" x2={i * 50 + 49} y2="300" stroke="#1a202c" strokeWidth="2" />
              <line x1={i * 50 + 2} y1="0" x2={i * 50 + 2} y2="300" stroke="#718096" strokeWidth="1" opacity="0.4" />
            </g>
          ))}
        </svg>
      )}

      {/* Stone Architectural Cladding */}
      {(type === 'cladding-travertine' || type === 'cladding-hero') && (
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 300" preserveAspectRatio="none" fill="none">
          <rect width="400" height="300" fill="#292524" />
          {Array.from({ length: 10 }).map((_, row) =>
            Array.from({ length: 4 }).map((_, col) => {
              const offset = row % 2 === 0 ? 0 : 50;
              return (
                <rect
                  key={`${row}-${col}`}
                  x={col * 110 - offset}
                  y={row * 30}
                  width="106"
                  height="27"
                  fill={col % 2 === 0 ? '#44403c' : '#57534e'}
                  stroke="#1c1917"
                  strokeWidth="2"
                />
              );
            })
          )}
        </svg>
      )}

      {/* Custom Elevation Showcase */}
      {(type === 'custom-elevation' || type === 'custom-hero' || type === 'tv-unit-luxe') && (
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" fill="none">
          <rect width="400" height="300" fill="#18181b" />
          {/* Louver side */}
          {Array.from({ length: 8 }).map((_, i) => (
            <rect key={i} x={15 + i * 14} y="20" width="9" height="260" fill="#b45309" />
          ))}
          {/* Marble center */}
          <rect x="140" y="30" width="180" height="240" fill="#f5f5f4" stroke="#eab308" strokeWidth="1" />
          <path d="M150 40 Q210 120 280 220" stroke="#d97706" strokeWidth="2" />
          <path d="M290 50 Q230 150 170 250" stroke="#78716c" strokeWidth="1.5" />
          {/* Charcoal slats */}
          {Array.from({ length: 4 }).map((_, i) => (
            <rect key={i} x={335 + i * 14} y="20" width="9" height="260" fill="#27272a" />
          ))}
        </svg>
      )}

      {/* Before Image (Damp / Plain wall) */}
      {(type === 'foyer-before' || type === 'living-before') && (
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 300" preserveAspectRatio="none" fill="none">
          <rect width="400" height="300" fill="#78716c" />
          {/* Damp marks & cracks */}
          <path d="M40 30 Q80 120 50 180 T100 280" stroke="#44403c" strokeWidth="2" />
          <circle cx="120" cy="180" r="50" fill="#57534e" opacity="0.6" />
          <circle cx="280" cy="120" r="70" fill="#44403c" opacity="0.5" />
          <path d="M220 40 L260 90 L240 140 L270 210" stroke="#292524" strokeWidth="1.5" />
          <rect x="0" y="0" width="400" height="300" fill="#000000" opacity="0.2" />
        </svg>
      )}

      {/* After Image (Transformed) */}
      {(type === 'foyer-after' || type === 'living-after' || type === 'bedroom-suite' || type === 'office-acoustic' || type === 'commercial-restaurant') && (
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" fill="none">
          <rect width="400" height="300" fill="#1c1917" />
          {/* Louver wall background */}
          {Array.from({ length: 15 }).map((_, i) => (
            <rect key={i} x={i * 26 + 10} y="0" width="16" height="300" fill="#92400e" />
          ))}
          {/* Ambient cove glow */}
          <circle cx="200" cy="50" r="160" fill="#fbbf24" opacity="0.25" />
          {/* Floating illuminated frame */}
          <rect x="80" y="60" width="240" height="180" rx="3" fill="#292524" stroke="#d4af37" strokeWidth="1.5" />
          <line x1="100" y1="150" x2="300" y2="150" stroke="#fef08a" strokeWidth="1" opacity="0.5" />
        </svg>
      )}

      {/* Decorative label or badge overlay */}
      {(badge || label) && (
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs pointer-events-none">
          {label && (
            <span className="text-stone-300 font-medium tracking-wide drop-shadow-md">
              {label}
            </span>
          )}
          {badge && (
            <span className="text-amber-300 bg-stone-900/80 backdrop-blur-xs px-2 py-0.5 rounded text-[11px] font-medium tracking-wider">
              {badge}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
