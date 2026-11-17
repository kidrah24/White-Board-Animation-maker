import React from "react";
import { X } from "lucide-react";

interface PublishingSpecsModalProps {
  open: boolean;
  onClose: () => void;
}

export const PublishingSpecsModal: React.FC<PublishingSpecsModalProps> = ({ open, onClose }) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="publishing-specs-title"
    >
      <div className="bg-[#1B1B1B] border border-[#2D2D2D] rounded-xl max-w-lg w-full overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#2D2D2D]">
          <h2 id="publishing-specs-title" className="text-base font-semibold text-[#F0F0F0]">
            Reels, Shorts & TikTok Export Guide
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close publishing guide"
            className="p-1.5 text-[#9F9FAA] hover:text-[#F0F0F0] hover:bg-[#262626] rounded-lg cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4 text-sm text-[#D4D4DC]">
          <p className="text-xs text-[#9F9FAA] leading-relaxed">
            Every video generated in Whiteboard Quiz Studio is rendered natively in 9:16 vertical
            aspect ratio with timed pauses and a countdown reveal engineered for high viewer
            retention.
          </p>

          <div className="border border-[#2D2D2D] rounded-lg divide-y divide-[#2D2D2D] text-xs bg-[#111111]">
            <div className="flex items-center justify-between px-3.5 py-2.5">
              <span className="font-medium text-[#F0F0F0]">Aspect Ratio & Resolution</span>
              <span className="font-mono-tabular text-[#FFB41F]">9:16 (720×1280)</span>
            </div>
            <div className="flex items-center justify-between px-3.5 py-2.5">
              <span className="font-medium text-[#F0F0F0]">Frame Rate</span>
              <span className="font-mono-tabular text-[#9F9FAA]">30 fps</span>
            </div>
            <div className="flex items-center justify-between px-3.5 py-2.5">
              <span className="font-medium text-[#F0F0F0]">Recommended Duration</span>
              <span className="font-mono-tabular text-[#9F9FAA]">15s – 45s</span>
            </div>
            <div className="flex items-center justify-between px-3.5 py-2.5">
              <span className="font-medium text-[#F0F0F0]">Audio Track</span>
              <span className="text-[#9F9FAA]">Synchronized Marker SFX & Chimes</span>
            </div>
          </div>

          <div className="space-y-1.5 text-xs text-[#9F9FAA]">
            <p className="font-medium text-[#F0F0F0]">Platform Safe-Zone Tips</p>
            <p className="leading-relaxed">
              Toggle the <strong className="text-[#F0F0F0]">Safe Zones</strong> overlay in the
              preview bar before exporting to confirm your edited captions stay clear of the bottom
              description bar and right-side engagement buttons on TikTok, Reels, and Shorts.
            </p>
          </div>
        </div>

        <div className="px-5 py-3.5 bg-[#161616] border-t border-[#2D2D2D] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-[#111111] bg-[#F96921] hover:bg-[#FF7B38] rounded-lg cursor-pointer"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
