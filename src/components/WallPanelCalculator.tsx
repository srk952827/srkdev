import React, { useState } from 'react';
import { Calculator, MessageCircle, HelpCircle, ArrowRight, RotateCcw } from 'lucide-react';
import { BusinessSettings } from '../types/index.js';

interface WallPanelCalculatorProps {
  settings: BusinessSettings;
  onRequestQuote: (calcSummary: string) => void;
}

export const WallPanelCalculator: React.FC<WallPanelCalculatorProps> = ({
  settings,
  onRequestQuote,
}) => {
  const [unit, setUnit] = useState<'feet' | 'meters'>('feet');
  const [wallWidth, setWallWidth] = useState<number>(12);
  const [wallHeight, setWallHeight] = useState<number>(9.5);
  const [panelWidthMm, setPanelWidthMm] = useState<number>(settings.panelCalculator?.defaultPanelWidthMm || 160);
  const [panelHeightMm, setPanelHeightMm] = useState<number>(settings.panelCalculator?.defaultPanelHeightMm || 2900);
  const [wastagePct, setWastagePct] = useState<number>(settings.panelCalculator?.defaultWastagePct || 10);

  // Conversion math
  const widthInMm = unit === 'feet' ? wallWidth * 304.8 : wallWidth * 1000;
  const heightInMm = unit === 'feet' ? wallHeight * 304.8 : wallHeight * 1000;
  
  const wallAreaSqM = (widthInMm / 1000) * (heightInMm / 1000);
  const wallAreaSqFt = wallAreaSqM * 10.7639;

  // Number of panels required across the width:
  // Each vertical panel covers panelWidthMm
  const panelsAcrossWidth = Math.ceil(widthInMm / panelWidthMm);
  
  // Vertical cuts check: does 1 panel height cover wall height?
  const verticalStackFactor = heightInMm > panelHeightMm ? Math.ceil(heightInMm / panelHeightMm) : 1;
  
  const rawPanels = panelsAcrossWidth * verticalStackFactor;
  const panelsWithWastage = Math.max(1, Math.ceil(rawPanels * (1 + wastagePct / 100)));

  const cleanPhone = settings.whatsappNumber.replace(/[^0-9]/g, '');

  const summaryText = `Wall Panel Estimate: Wall ${wallWidth}x${wallHeight} ${unit}. Panel width: ${panelWidthMm}mm. Estimated panels: ${panelsWithWastage} pcs (includes ${wastagePct}% wastage).`;

  const handleWhatsAppShare = () => {
    const text = `Hi ${settings.businessName},\nI calculated wall panels for my wall:\n- Wall dimensions: ${wallWidth} x ${wallHeight} ${unit}\n- Panel width: ${panelWidthMm}mm\n- Estimated quantity: ${panelsWithWastage} panels\nPlease share available colors, trims, and pricing.`;
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  };

  const handleReset = () => {
    setWallWidth(12);
    setWallHeight(9.5);
    setPanelWidthMm(160);
    setWastagePct(10);
  };

  return (
    <div className="max-w-4xl mx-auto bg-stone-900 border border-stone-800 rounded-lg p-6 sm:p-8 text-stone-100 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-800 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-amber-400" />
            <h3 className="font-serif-luxury text-2xl text-amber-100">
              Wall Panel & Fluted Louver Estimator
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-stone-400 mt-1">
            Calculate exact pieces required for WPC louvers, PVC panels, or charcoal acoustic slats.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="bg-stone-950 p-1 rounded border border-stone-800 flex items-center text-xs">
            <button
              onClick={() => setUnit('feet')}
              className={`px-3 py-1 rounded transition-colors ${
                unit === 'feet' ? 'bg-amber-400 text-stone-950 font-bold' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Feet (ft)
            </button>
            <button
              onClick={() => setUnit('meters')}
              className={`px-3 py-1 rounded transition-colors ${
                unit === 'meters' ? 'bg-amber-400 text-stone-950 font-bold' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Meters (m)
            </button>
          </div>
          <button
            onClick={handleReset}
            title="Reset to defaults"
            className="p-2 text-stone-400 hover:text-stone-200 bg-stone-800 rounded border border-stone-700"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
        {/* Input Parameters */}
        <div className="lg:col-span-7 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">
                Wall Width ({unit})
              </label>
              <input
                type="number"
                min="1"
                step="0.5"
                value={wallWidth}
                onChange={(e) => setWallWidth(Math.max(0.1, Number(e.target.value)))}
                className="w-full bg-stone-950 border border-stone-800 rounded px-3 py-2 text-sm text-stone-100 font-mono focus:outline-hidden focus:border-amber-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">
                Wall Height ({unit})
              </label>
              <input
                type="number"
                min="1"
                step="0.5"
                value={wallHeight}
                onChange={(e) => setWallHeight(Math.max(0.1, Number(e.target.value)))}
                className="w-full bg-stone-950 border border-stone-800 rounded px-3 py-2 text-sm text-stone-100 font-mono focus:outline-hidden focus:border-amber-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-300 mb-1">
              Panel Width (Profile Profile / Louver Slat)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: '120 mm (Charcoal)', val: 120 },
                { label: '160 mm (WPC Louver)', val: 160 },
                { label: '250 mm (PVC Panel)', val: 250 },
              ].map((p) => (
                <button
                  key={p.val}
                  type="button"
                  onClick={() => setPanelWidthMm(p.val)}
                  className={`py-2 px-2.5 rounded text-xs text-center border transition-colors ${
                    panelWidthMm === p.val
                      ? 'border-amber-400 bg-amber-400/10 text-amber-300 font-semibold'
                      : 'border-stone-800 bg-stone-950 text-stone-400 hover:text-stone-200'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xs text-stone-400">Custom width:</span>
              <input
                type="number"
                min="50"
                max="1000"
                value={panelWidthMm}
                onChange={(e) => setPanelWidthMm(Number(e.target.value))}
                className="w-24 bg-stone-950 border border-stone-800 rounded px-2 py-1 text-xs text-stone-100 font-mono"
              />
              <span className="text-xs text-stone-400">mm</span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs text-stone-300 mb-1">
              <span>Wastage & Joint Trimming Margin</span>
              <span className="font-mono text-amber-300 font-bold">{wastagePct}%</span>
            </div>
            <input
              type="range"
              min="5"
              max="25"
              step="5"
              value={wastagePct}
              onChange={(e) => setWastagePct(Number(e.target.value))}
              className="w-full accent-amber-400 bg-stone-800 h-2 rounded cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-stone-500 mt-1">
              <span>5% (Simple rectangular wall)</span>
              <span>10% (Recommended standard)</span>
              <span>20% (Corners & niche columns)</span>
            </div>
          </div>

          <div className="p-3 bg-stone-950/70 border border-stone-800 rounded text-xs text-stone-400">
            <span className="text-stone-300 font-medium">Standard Panel Length:</span> 2900 mm (~9.5 feet). If your wall exceeds 9.5 ft in height, vertical stacking joints or top cornice trims will be required.
          </div>
        </div>

        {/* Results Card */}
        <div className="lg:col-span-5 flex flex-col justify-between bg-stone-950 border border-stone-800 p-6 rounded-lg">
          <div>
            <span className="text-xs uppercase tracking-widest text-stone-400 block mb-1">
              Estimated Panel Requirement
            </span>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="font-serif-luxury text-5xl text-amber-400 font-bold tabular-nums">
                {panelsWithWastage}
              </span>
              <span className="text-stone-300 font-medium text-lg">Panels</span>
            </div>

            <div className="space-y-2.5 text-xs border-t border-stone-800/80 pt-4 mb-4">
              <div className="flex justify-between text-stone-400">
                <span>Total Wall Area:</span>
                <span className="font-mono text-stone-200 tabular-nums">
                  {wallAreaSqFt.toFixed(1)} sq.ft ({wallAreaSqM.toFixed(1)} m²)
                </span>
              </div>
              <div className="flex justify-between text-stone-400">
                <span>Panels Across Width:</span>
                <span className="font-mono text-stone-200 tabular-nums">
                  {panelsAcrossWidth} panels ({panelWidthMm}mm each)
                </span>
              </div>
              <div className="flex justify-between text-stone-400">
                <span>Height Coverage:</span>
                <span className="font-mono text-stone-200 tabular-nums">
                  {verticalStackFactor === 1 ? 'Single length (No joint)' : `${verticalStackFactor} tiers required`}
                </span>
              </div>
              <div className="flex justify-between text-stone-400">
                <span>Wastage Buffer:</span>
                <span className="font-mono text-amber-300 tabular-nums">
                  +{wastagePct}% included
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <button
              onClick={() => onRequestQuote(summaryText)}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-semibold transition-colors cursor-pointer"
            >
              <span>Request Quote for These Panels</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={handleWhatsAppShare}
              className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded bg-stone-900 hover:bg-stone-800 text-emerald-400 text-xs font-medium border border-stone-800 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Panel Estimate</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mandatory Disclaimer */}
      <div className="mt-6 pt-4 border-t border-stone-800 flex items-start gap-2.5 text-xs text-stone-400 leading-relaxed">
        <HelpCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <p>
          <strong className="text-stone-300">Technical Note:</strong> The final requirement depends on actual panel dimensions, installation orientation (vertical vs horizontal), cutting losses around TV back boxes and switches, and edge L-trims/starter clips. {settings.businessName} provides site measurement and sample verification before installation.
        </p>
      </div>
    </div>
  );
};
