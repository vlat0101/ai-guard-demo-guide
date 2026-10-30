/** Content blocks — shared by both fiction sites. */
export type Block =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: string[] }
  | { type: 'table'; head: string[]; rows: string[][] }
  | { type: 'notice'; tone: 'warn' | 'info' | 'bad'; text: string }
  | { type: 'cards'; items: { title: string; body: string; to: string }[] }
  | { type: 'links'; items: { label: string; to: string }[] }
  | { type: 'quote'; text: string; attribution: string }

export interface ContentPage {
  slug: string
  title: string
  lede?: string
  blocks: Block[]
}
