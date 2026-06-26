import { ExternalLink } from "lucide-react";

const boldItalicRegex = /\*\*\*(.+?)\*\*\*/g;
const boldRegex = /\*\*(.+?)\*\*/g;
const italicRegex = /(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g;
const inlineCodeRegex = /`([^`]+)`/g;
const urlRegex = /https?:\/\/[^\s)]+/g;
const markdownLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;

function renderInline(text: string, keyPrefix: string) {
  const parts: React.ReactNode[] = [];
  const combined = new RegExp(
    `(${markdownLinkRegex.source})|(${urlRegex.source.replace(/^\//, '').replace(/\/$/, '')})|(${boldItalicRegex.source.replace(/^\//, '').replace(/\/$/, '')})|(${boldRegex.source.replace(/^\//, '').replace(/\/$/, '')})|(${italicRegex.source.replace(/^\//, '').replace(/\/$/, '')})|(${inlineCodeRegex.source.replace(/^\//, '').replace(/\/$/, '')})`,
    'g'
  );
  let last = 0;
  let match: RegExpExecArray | null;
  let idx = 0;

  while ((match = combined.exec(text)) !== null) {
    if (match.index > last) {
      parts.push(<span key={`${keyPrefix}-t-${idx++}`}>{text.slice(last, match.index)}</span>);
    }
    if (match[1] !== undefined) {
      parts.push(
        <a key={`${keyPrefix}-ml-${idx++}`} href={match[3]} target="_blank" rel="noreferrer"
          className="inline-flex items-center gap-1 rounded-md bg-amber-button/10 px-2 py-0.5 text-[10px] font-medium text-amber-button hover:bg-amber-button/20 transition-colors"
        >
          <ExternalLink size={10} />
          {match[2]}
        </a>
      );
    } else if (match[4] !== undefined) {
      parts.push(
        <a key={`${keyPrefix}-u-${idx++}`} href={match[4]} target="_blank" rel="noreferrer"
          className="inline-flex items-center gap-1 rounded-md bg-amber-button/10 px-2 py-0.5 text-[10px] font-medium text-amber-button hover:bg-amber-button/20 transition-colors"
        >
          <ExternalLink size={10} />
          {match[4].replace(/^https?:\/\//, '').replace(/\/$/, '').split('/')[0]}
        </a>
      );
    } else if (match[5] !== undefined) {
      parts.push(<strong key={`${keyPrefix}-bi-${idx++}`} className="font-bold italic">{match[6]}</strong>);
    } else if (match[7] !== undefined) {
      parts.push(<strong key={`${keyPrefix}-b-${idx++}`} className="font-bold">{match[8]}</strong>);
    } else if (match[9] !== undefined) {
      parts.push(<em key={`${keyPrefix}-i-${idx++}`} className="italic">{match[10]}</em>);
    } else if (match[11] !== undefined) {
      parts.push(
        <code key={`${keyPrefix}-c-${idx++}`} className="font-mono text-[10px] bg-black/8 rounded px-1 py-0.5">
          {match[12]}
        </code>
      );
    }
    last = match.index + match[0].length;
  }
  if (last < text.length) {
    parts.push(<span key={`${keyPrefix}-t-${idx++}`}>{text.slice(last)}</span>);
  }
  return parts;
}

function parseBlocks(text: string) {
  const blocks: { type: string; [key: string]: unknown }[] = [];
  const lines = text.split('\n');
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    const codeMatch = line.match(/^```(\w*)/);
    if (codeMatch) {
      const lang = codeMatch[1] || 'bash';
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      i++;
      blocks.push({ type: 'code', lang, value: codeLines.join('\n') });
      continue;
    }

    if (/^#{1,4}\s/.test(line)) {
      const level = line.match(/^#{1,4}/)?.[0].length || 1;
      const title = line.replace(/^#{1,4}\s*/, '');
      blocks.push({ type: 'heading', level, value: title });
      i++;
      continue;
    }

    if (/^[-*]\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*]\s/.test(lines[i])) {
        items.push(lines[i].replace(/^[-*]\s*/, ''));
        i++;
      }
      blocks.push({ type: 'list', items });
      continue;
    }

    if (/^---+\s*$/.test(line)) {
      blocks.push({ type: 'hr' });
      i++;
      continue;
    }

    if (line.trim() === '') {
      i++;
      continue;
    }

    const paraLines: string[] = [];
    while (i < lines.length && lines[i].trim() !== '') {
      paraLines.push(lines[i]);
      i++;
      if (i < lines.length && lines[i].trim() === '') break;
    }
    blocks.push({ type: 'paragraph', value: paraLines.join('\n') });
  }

  return blocks;
}

export function FormattedText({ text }: { text: string }) {
  if (!text) return null;
  const blocks = parseBlocks(text);
  let blockIdx = 0;

  return (
    <div className="space-y-1.5">
      {blocks.map((block) => {
        const key = blockIdx++;
        switch (block.type) {
          case 'heading':
            return (
              <p key={key} className={`font-semibold text-dark-text ${(block.level as number) <= 2 ? 'text-xs' : 'text-[11px]'}`}>
                {block.value as string}
              </p>
            );
          case 'paragraph':
            return (
              <p key={key} className="text-[11px] leading-[1.55] text-dark-text">
                {renderInline(block.value as string, `p-${key}`)}
              </p>
            );
          case 'list':
            return (
              <ul key={key} className="space-y-0.5">
                {(block.items as string[]).map((item, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-[11px] leading-[1.55] text-dark-text">
                    <span className="mt-[4px] h-1 w-1 shrink-0 rounded-full bg-current opacity-40" />
                    <span>{renderInline(item, `l-${key}-${i}`)}</span>
                  </li>
                ))}
              </ul>
            );
          case 'code':
            return (
              <div key={key} className="rounded-lg border border-black/5 bg-black/8 p-2">
                <pre className="overflow-x-auto"><code className="font-mono text-[10px] leading-[1.6] text-dark-text-muted/75">{block.value as string}</code></pre>
              </div>
            );
          case 'hr':
            return <hr key={key} className="border-t border-black/5 my-1" />;
          default:
            return null;
        }
      })}
    </div>
  );
}

export function LoadingDots() {
  return (
    <span className="inline-flex items-center gap-1">
      <span className="h-1.5 w-1.5 rounded-full bg-current animate-bounce" style={{ animationDelay: '0ms' }} />
      <span className="h-1.5 w-1.5 rounded-full bg-current animate-bounce" style={{ animationDelay: '150ms' }} />
      <span className="h-1.5 w-1.5 rounded-full bg-current animate-bounce" style={{ animationDelay: '300ms' }} />
    </span>
  );
}
