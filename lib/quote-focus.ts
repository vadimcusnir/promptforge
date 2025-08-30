export type QuoteFocus = { text: string; author?: string; emphasis?: "low"|"mid"|"high" };
export function getQuoteFocus(input?: Partial<QuoteFocus>): QuoteFocus {
  return { text: input?.text ?? "", author: input?.author, emphasis: input?.emphasis ?? "mid" };
}
export default getQuoteFocus;