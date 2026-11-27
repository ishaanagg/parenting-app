/**
 * Shares a short parenting card or script via native mobile share sheet,
 * falling back cleanly to clipboard copy on desktop/unsupported browsers.
 */
export async function shareOrCopy(
  title: string,
  text: string,
): Promise<'shared' | 'copied' | 'failed'> {
  if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
    try {
      await navigator.share({ title, text });
      return 'shared';
    } catch {
      // User cancelled or share failed; fall through to clipboard
    }
  }

  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(`${title}\n\n${text}`);
      return 'copied';
    } catch {
      return 'failed';
    }
  }

  return 'failed';
}
