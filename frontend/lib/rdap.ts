export async function checkDomainAvailability(domain: string): Promise<boolean> {
  try {
    const res = await fetch(`https://rdap.org/domain/${domain}`, {
      signal: AbortSignal.timeout(5000),
    });
    // 200 = domain is registered (not available)
    // 404 = domain not found = available
    return res.status === 404;
  } catch {
    // Network error or timeout — treat as unknown
    return false;
  }
}

export async function checkDomainsInParallel(
  domains: string[],
  onResult: (domain: string, available: boolean) => void
): Promise<void> {
  const checks = domains.map(async (domain) => {
    const available = await checkDomainAvailability(domain);
    onResult(domain, available);
  });
  await Promise.allSettled(checks);
}
