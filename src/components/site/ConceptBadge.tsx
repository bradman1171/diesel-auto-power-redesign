import { Link } from "@tanstack/react-router";

export function ConceptBadge() {
  return (
    <Link
      to="/implementation-notes"
      className="fixed bottom-3 left-3 z-50 rounded-full border border-ink-border bg-ink/90 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-ink-foreground shadow-lift backdrop-blur hover:border-primary"
    >
      <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-amber" />
      Website Redesign Concept
    </Link>
  );
}
