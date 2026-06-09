"use client";
import { useEffect, useState } from "react";
import { Globe, CheckCircle, XCircle, Loader2, ExternalLink } from "lucide-react";
import type { DomainResult } from "../lib/types";
import { checkDomainsInParallel } from "../lib/rdap";

interface Props {
  names: DomainResult[];
}

export default function DomainGrid({ names }: Props) {
  const [domains, setDomains] = useState<DomainResult[]>(names);

  useEffect(() => {
    const domainList = names.map((n) => n.domain);
    checkDomainsInParallel(domainList, (domain, available) => {
      setDomains((prev) =>
        prev.map((d) => d.domain === domain ? { ...d, available, checking: false } : d)
      );
    });
  }, [names]);

  const available = domains.filter((d) => d.available === true);
  const taken = domains.filter((d) => d.available === false);
  const checking = domains.filter((d) => d.checking);

  return (
    <div className="glow-card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Globe size={18} style={{ color: "var(--accent)" }} />
          <h3 className="font-semibold">Brand Names &amp; Domains</h3>
        </div>
        <div className="flex gap-3 text-xs" style={{ color: "var(--muted)" }}>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
            {available.length} available
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
            {taken.length} taken
          </span>
          {checking.length > 0 && (
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500 inline-block pulse-dot" />
              {checking.length} checking
            </span>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {domains.map((d) => (
          <div
            key={d.domain}
            className="flex items-center justify-between px-3 py-2 rounded-lg"
            style={{ background: "var(--surface2)", border: "1px solid var(--border)" }}
          >
            <div>
              <div className="font-medium text-sm">{d.name}</div>
              <div className="text-xs" style={{ color: "var(--muted)" }}>{d.domain}</div>
            </div>
            <div className="flex items-center gap-2">
              {d.checking ? (
                <Loader2 size={16} className="animate-spin" style={{ color: "var(--amber)" }} />
              ) : d.available ? (
                <>
                  <CheckCircle size={16} style={{ color: "var(--green)" }} />
                  <a
                    href={`https://www.name.com/domain/search/${d.domain}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs px-2 py-1 rounded-md font-medium badge-available flex items-center gap-1"
                  >
                    Register <ExternalLink size={10} />
                  </a>
                </>
              ) : (
                <XCircle size={16} style={{ color: "var(--red)" }} />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
