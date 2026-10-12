import React, { useState } from 'react';
import { Calculator, MessageCircle, HelpCircle, ArrowRight, RotateCcw } from 'lucide-react';
import { BusinessSettings } from '../types/index.js';

interface WallpaperCalculatorProps {
  settings: BusinessSettings;
  onRequestQuote: (calcSummary: string) => void;
}

export const WallpaperCalculator: React.FC<WallpaperCalculatorProps> = ({
  settings,
  onRequestQuote,
}) => {
  const [unit, setUnit] = useState<'feet' | 'meters'>('feet');
  const [wallWidth, setWallWidth] = useState<number>(14);
  const [wallHeight, setWallHeight] = useState<number>(10);
  const [doorsWindowsDeductionSqFt, setDoorsWindowsDeductionSqFt] = useState<number>(0);
  
  // Roll specifications (from settings or customized)
  const [rollWidthM, setRollWidthM] = useState<number>(settings.wallpaperCalculator?.standardRollWidthM || 0.53);
  const [rollLengthM, setRollLengthM] = useState<number>(settings.wallpaperCalculator?.standardRollLengthM || 10.05);
  const [wastagePct, setWastagePct] = useState<number>(settings.wallpaperCalculator?.defaultWastagePct || 15);

  // Conversion math
  const widthInMeters = unit === 'feet' ? wallWidth * 0.3048 : wallWidth;
  const heightInMeters = unit === 'feet' ? wallHeight * 0.3048 : wallHeight;
  const grossAreaSqM = widthInMeters * heightInMeters;
  const grossAreaSqFt = grossAreaSqM * 10.7639;

  const netAreaSqFt = Math.max(0, grossAreaSqFt - (unit === 'feet' ? doorsWindowsDeductionSqFt : doorsWindowsDeductionSqFt * 10.7639));
  
  // Roll area: 0.53m * 10.05m = 5.3265 sq.m = 57.33 sq.ft gross
  const rollGrossAreaSqFt = (rollWidthM * rollLengthM) * 10.7639;
  
  // Strips calculation
  const rollWidthFt = rollWidthM * 3.28084;
  const stripsPerWall = Math.ceil((unit === 'feet' ? wallWidth : wallWidth * 3.28084) / rollWidthFt);
  const stripsPerRoll = Math.floor((rollLengthM * 3.28084) / (unit === 'feet' ? wallHeight : wallHeight * 3.28084)) || 1;
  
  // Rolls needed including wastage
  const rawRollsByArea = (netAreaSqFt / rollGrossAreaSqFt) * (1 + wastagePct / 100);
  const rawRollsByStrips = (stripsPerWall / stripsPerRoll) * (1 + (wastagePct > 15 ? 0.1 : 0.05));
  const estimatedRolls = Math.max(1, Math.ceil(Math.max(rawRollsByArea, rawRollsByStrips)));

  const cleanPhone = settings.whatsappNumber.replace(/[^0-9]/g, '');

  const summaryText = `Wallpaper Estimate: Wall ${wallWidth}x${wallHeight} ${unit}. Estimated rolls: ${estimatedRolls} (Standard 0.53m x 10m rolls with ${wastagePct}% buffer).`;

  const handleWhatsAppShare = () => {
    const text = `Hi ${settings.businessName},\nI calculated wallpaper for my wall:\n- Wall dimensions: ${wallWidth} x ${wallHeight} ${unit}\n- Estimated rolls: ${estimatedRolls} rolls\nCould you please suggest popular designs and installation charges?`;
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  };

  const handleReset = () => {
    setWallWidth(14);
    setWallHeight(10);
    setDoorsWindowsDeductionSqFt(0);
    setWastagePct(15);
  };

  return (
    <div className="max-w-4xl mx-auto bg-stone-900 border border-stone-800 rounded-lg p-6 sm:p-8 text-stone-100 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-800 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-amber-400" />
            <h3 className="font-serif-luxury text-2xl text-amber-100">
              Wallpaper Roll Calculator
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-stone-400 mt-1">
            Estimate European standard (0.53m x 10.05m) wallpaper rolls required for your wall elevation.
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
            <div className="flex items-center justify-between text-xs text-stone-300 mb-1">
              <span>Doors & Windows Deductions (approx. {unit === 'feet' ? 'sq.ft' : 'sq.m'})</span>
              <span className="font-mono text-stone-400">{doorsWindowsDeductionSqFt} {unit === 'feet' ? 'sq.ft' : 'sq.m'}</span>
            </div>
            <input
              type="number"
              min="0"
              step="5"
              value={doorsWindowsDeductionSqFt}
              onChange={(e) => setDoorsWindowsDeductionSqFt(Math.max(0, Number(e.target.value)))}
              placeholder="e.g. 20 (for door) or 0"
              className="w-full bg-stone-950 border border-stone-800 rounded px-3 py-2 text-sm text-stone-100 font-mono focus:outline-hidden focus:border-amber-400"
            />
          </div>

          <div>
            <div className="flex items-center justify-between text-xs text-stone-300 mb-1">
              <span>Pattern Repeat & Cutting Wastage Buffer</span>
              <span className="font-mono text-amber-300 font-bold">{wastagePct}%</span>
            </div>
            <input
              type="range"
              min="5"
              max="30"
              step="5"
              value={wastagePct}
              onChange={(e) => setWastagePct(Number(e.target.value))}
              className="w-full accent-amber-400 bg-stone-800 h-2 rounded cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-stone-500 mt-1">
              <span>5% (Plain/Textured)</span>
              <span>15% (Standard Damask)</span>
              <span>25% (Large Drop Match)</span>
            </div>
          </div>

          <div className="p-3 bg-stone-950/70 border border-stone-800 rounded text-xs text-stone-400 space-y-1">
            <span className="text-amber-200/90 font-medium block">Standard Roll Specifications:</span>
            <p>Roll Size: {rollWidthM}m width × {rollLengthM}m length (covers ~57 sq.ft gross / ~50 sq.ft net with match cuts).</p>
          </div>
        </div>

        {/* Calculation Results Card */}
        <div className="lg:col-span-5 flex flex-col justify-between bg-stone-950 border border-stone-800 p-6 rounded-lg">
          <div>
            <span className="text-xs uppercase tracking-widest text-stone-400 block mb-1">
              Estimated Requirement
            </span>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="font-serif-luxury text-5xl text-amber-400 font-bold tabular-nums">
                {estimatedRolls}
              </span>
              <span className="text-stone-300 font-medium text-lg">Rolls</span>
            </div>

            <div className="space-y-2.5 text-xs border-t border-stone-800/80 pt-4 mb-4">
              <div className="flex justify-between text-stone-400">
                <span>Gross Wall Area:</span>
                <span className="font-mono text-stone-200 tabular-nums">
                  {grossAreaSqFt.toFixed(1)} sq.ft ({grossAreaSqM.toFixed(1)} m²)
                </span>
              </div>
              <div className="flex justify-between text-stone-400">
                <span>Net Wall Surface:</span>
                <span className="font-mono text-stone-200 tabular-nums">
                  {netAreaSqFt.toFixed(1)} sq.ft
                </span>
              </div>
              <div className="flex justify-between text-stone-400">
                <span>Estimated Vertical Strips:</span>
                <span className="font-mono text-stone-200 tabular-nums">
                  {stripsPerWall} strips
                </span>
              </div>
              <div className="flex justify-between text-stone-400">
                <span>Included Buffer:</span>
                <span className="font-mono text-amber-300 tabular-nums">
                  +{wastagePct}% wastage
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <button
              onClick={() => onRequestQuote(summaryText)}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-semibold transition-colors cursor-pointer"
            >
              <span>Get Precise Quotation</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={handleWhatsAppShare}
              className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded bg-stone-900 hover:bg-stone-800 text-emerald-400 text-xs font-medium border border-stone-800 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp This Calculation</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mandatory Disclaimer */}
      <div className="mt-6 pt-4 border-t border-stone-800 flex items-start gap-2.5 text-xs text-stone-400 leading-relaxed">
        <HelpCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <p>
          <strong className="text-stone-300">Important Disclaimer:</strong> This calculation is an estimate. Actual requirements depend on pattern repeats (straight vs. offset drop), room doors, windows, skirting offsets, wall plumbness, and cutting conditions. {settings.businessName} recommends confirming with a site measurement before final ordering.
        </p>
      </div>
    </div>
  );
};
