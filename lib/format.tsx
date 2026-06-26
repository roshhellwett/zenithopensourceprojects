import { ExternalLink } from "lucide-react";



type InlinePattern = { regex: RegExp; render: (m: RegExpExecArray, idx: number) => React.ReactNode };

const INLINE_PATTERNS: InlinePattern[] = [
  {
    regex: /\[([^\]]+)\]\(([^)]+)\)/g,
    render: (m, idx) => (
      <a key={idx} href={m[2]} target="_blank" rel="noopener noreferrer"
        className="inline-flex items-center gap-1 rounded-md bg-amber-button/10 px-2 py-0.5 text-[10px] font-medium text-amber-button hover:bg-amber-button/20 transition-colors"
      >
        <ExternalLink size={10} />
        {m[1]}
      </a>
    ),
  },
  {
    regex: /https?:\/\/[^\s)]+/g,
    render: (m, idx) => (
      <a key={idx} href={m[0]} target="_blank" rel="noopener noreferrer"
        className="inline-flex items-center gap-1 rounded-md bg-amber-button/10 px-2 py-0.5 text-[10px] font-medium text-amber-button hover:bg-amber-button/20 transition-colors"
      >
        <ExternalLink size={10} />
        {m[0].replace(/^https?:\/\//, '').replace(/\/$/, '').split('/')[0]}
      </a>
    ),
  },
  {
    regex: /\*\*\*(.+?)\*\*\*/g,
    render: (m, idx) => <strong key={idx} className="font-bold italic">{m[1]}</strong>,
  },
  {
    regex: /\*\*(.+?)\*\*/g,
    render: (m, idx) => <strong key={idx} className="font-bold">{m[1]}</strong>,
  },
  {
    regex: /(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g,
    render: (m, idx) => <em key={idx} className="italic">{m[1]}</em>,
  },
  {
    regex: /`([^`]+)`/g,
    render: (m, idx) => (
      <code key={idx} className="font-mono text-[10px] bg-black/8 rounded px-1 py-0.5">
        {m[1]}
      </code>
    ),
  },
];

function renderInline(text: string, keyPrefix: string) {
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let globalIdx = 0;

  while (remaining.length > 0) {
    let earliest: { index: number; match: RegExpExecArray; patternIdx: number } | null = null;

    for (let pi = 0; pi < INLINE_PATTERNS.length; pi++) {
      INLINE_PATTERNS[pi].regex.lastIndex = 0;
      const m = INLINE_PATTERNS[pi].regex.exec(remaining);
      if (m && (earliest === null || m.index < earliest.index)) {
        earliest = { index: m.index, match: m, patternIdx: pi };
      }
    }

    if (earliest === null) {
      parts.push(<span key={`${keyPrefix}-t-${globalIdx++}`}>{remaining}</span>);
      break;
    }

    const { match, patternIdx } = earliest;

    if (match.index > 0) {
      parts.push(<span key={`${keyPrefix}-t-${globalIdx++}`}>{remaining.slice(0, match.index)}</span>);
    }

    parts.push(INLINE_PATTERNS[patternIdx].render(match, globalIdx++));

    remaining = remaining.slice(match.index + match[0].length);
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
