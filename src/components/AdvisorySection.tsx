import React, { useState, useEffect } from 'react';
import { ShieldCheck, AlertCircle, FileText, PhoneCall, Check, ExternalLink } from 'lucide-react';
import { TravelAdvisory } from '../types/travel.js';

interface AdvisorySectionProps {
  destinationId: string;
  destinationName: string;
}

export const AdvisorySection: React.FC<AdvisorySectionProps> = ({
  destinationId,
  destinationName
}) => {
  const [advisory, setAdvisory] = useState<TravelAdvisory | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAdvisory() {
      setLoading(true);
      try {
        const res = await fetch(`/api/advisories?destinationId=${destinationId}`);
        const data = await res.json();
        if (data.success && data.advisory) {
          setAdvisory(data.advisory);
        }
      } catch (err) {
        console.error('Failed to load travel advisory:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAdvisory();
  }, [destinationId]);

  if (!advisory) return null;

  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-5 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-neutral-800 pb-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-emerald-400" />
          <h4 className="text-base font-bold text-neutral-100">
            Singapore Traveller Entry & Visa Requirements
          </h4>
        </div>
        <div className="text-[11px] text-neutral-500 font-mono">
          Last checked: {new Date(advisory.lastChecked).toLocaleDateString()}
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded-lg border border-neutral-800 bg-neutral-950 p-3">
          <span className="text-xs text-neutral-500 block">Singapore Passport Status</span>
          <div className="text-sm font-bold text-emerald-400 mt-1 flex items-center gap-1">
            <Check className="h-4 w-4" />
            <span>{advisory.singaporePassportVisaStatus}</span>
          </div>
          <span className="text-xs text-neutral-400 block mt-0.5 font-mono">
            Max stay: {advisory.maxStayDays} days
          </span>
        </div>

        <div className="rounded-lg border border-neutral-800 bg-neutral-950 p-3">
          <span className="text-xs text-neutral-500 block">Passport Validity</span>
          <div className="text-sm font-bold text-neutral-200 mt-1">
            {advisory.passportValidityRequiredMonths} Months Minimum
          </div>
          <span className="text-xs text-neutral-400 block mt-0.5">
            Strictly enforced at Changi check-in
          </span>
        </div>

        <div className="rounded-lg border border-neutral-800 bg-neutral-950 p-3">
          <span className="text-xs text-neutral-500 block">Electronic Entry Card</span>
          <div className="text-sm font-bold text-neutral-200 mt-1">
            {advisory.electronicArrivalCardRequired ? (
              <span className="text-amber-400">Required Before Flight</span>
            ) : (
              <span className="text-neutral-400">Not Required</span>
            )}
          </div>
          <span className="text-xs text-neutral-400 block mt-0.5 truncate">
            {advisory.arrivalCardName || 'Standard customs'}
          </span>
        </div>
      </div>

      {/* Advisory Notes */}
      <div className="space-y-1.5 text-xs text-neutral-300">
        <span className="font-semibold text-neutral-200 block">Important Guidelines:</span>
        <ul className="list-disc list-inside space-y-1 text-neutral-400">
          {advisory.keyNotes.map((note, i) => (
            <li key={i}>{note}</li>
          ))}
        </ul>
      </div>

      {/* Emergency Contact */}
      <div className="border-t border-neutral-800 pt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-neutral-400 gap-2">
        <div className="flex items-center gap-1.5 text-neutral-300">
          <PhoneCall className="h-3.5 w-3.5 text-amber-400" />
          <span>Consular Assistance: {advisory.emergencyContactMFA}</span>
        </div>
        <div className="text-[11px] text-neutral-500">
          Source: {advisory.source}
        </div>
      </div>
    </div>
  );
};
