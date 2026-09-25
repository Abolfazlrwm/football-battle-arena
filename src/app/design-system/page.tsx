import type { Metadata } from "next";
import { Badge, Button, Card, Container, StatBar } from "@/components/ui";
import { AccentToggleDemo } from "./accent-toggle";

export const metadata: Metadata = {
  title: "Design System",
  robots: { index: false, follow: false },
};

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-arena-line py-14 first:border-t-0 first:pt-0">
      <Container>
        <h2 className="text-display-md">{title}</h2>
        {description && (
          <p className="mt-2 max-w-2xl text-body text-arena-mist">{description}</p>
        )}
        <div className="mt-8">{children}</div>
      </Container>
    </section>
  );
}

function Swatch({ name, className }: { name: string; className: string }) {
  return (
    <div className="flex flex-col gap-2">
      <div className={`h-16 w-full rounded-md border border-arena-line ${className}`} />
      <span className="font-body text-caption text-arena-mist">{name}</span>
    </div>
  );
}

export default function DesignSystemPage() {
  return (
    <main className="pb-24">
      <Container>
        <div className="border-b border-arena-line py-14">
          <p className="font-body text-label text-arena-mist">Internal reference</p>
          <h1 className="mt-2 text-display-xl">Design System</h1>
          <p className="mt-3 max-w-2xl text-body-lg text-arena-mist">
            Tokens and reusable primitives for Football Battle Arena. This
            page is not part of the product surface — it exists so every
            later phase pulls from the same source of truth.
          </p>
        </div>
      </Container>

      <Section
        title="Typography"
        description="Big Shoulders Display for headlines, IBM Plex Sans for everything read at length."
      >
        <div className="flex flex-col gap-5">
          <p className="text-display-2xl">Enter the arena</p>
          <p className="text-display-xl">Real Madrid</p>
          <p className="text-display-lg">Featured teams</p>
          <p className="text-display-md">Captain profile</p>
          <p className="text-display-sm">Recent battles</p>
          <p className="text-body-lg text-arena-fog">
            Body large — used for hero subcopy and lead paragraphs.
          </p>
          <p className="text-body text-arena-fog">
            Body — the default paragraph size across the site.
          </p>
          <p className="text-body-sm text-arena-mist">
            Body small — secondary detail, card metadata.
          </p>
          <p className="text-caption text-arena-mist">Caption — timestamps, fine print.</p>
          <p className="text-label text-arena-mist">Label — stat bars, badges, form labels</p>
        </div>
      </Section>

      <Section
        title="Color"
        description="Three dark surfaces, two text tones, hairline borders, and one swappable accent."
      >
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Swatch name="arena-black" className="bg-arena-black" />
          <Swatch name="arena-charcoal" className="bg-arena-charcoal" />
          <Swatch name="arena-charcoal-raised" className="bg-arena-charcoal-raised" />
          <Swatch name="arena-navy" className="bg-arena-navy" />
          <Swatch name="arena-fog" className="bg-arena-fog" />
          <Swatch name="arena-mist" className="bg-arena-mist" />
          <Swatch name="accent" className="bg-accent" />
          <Swatch name="accent-soft" className="bg-accent-soft" />
        </div>
      </Section>

      <Section
        title="Radius & shadow"
        description="Radius grows with elevation — controls stay tight, panels get roomier. Shadows are dark elevation, not grey drop shadows."
      >
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="flex h-20 items-center justify-center rounded-sm border border-arena-line bg-arena-charcoal text-caption text-arena-mist">
            rounded-sm
          </div>
          <div className="flex h-20 items-center justify-center rounded-md border border-arena-line bg-arena-charcoal text-caption text-arena-mist">
            rounded-md
          </div>
          <div className="flex h-20 items-center justify-center rounded-lg border border-arena-line bg-arena-charcoal text-caption text-arena-mist">
            rounded-lg
          </div>
          <div className="flex h-20 items-center justify-center rounded-xl border border-arena-line bg-arena-charcoal text-caption text-arena-mist">
            rounded-xl
          </div>
          <div className="flex h-20 items-center justify-center rounded-md bg-arena-charcoal text-caption text-arena-mist shadow-card">
            shadow-card
          </div>
          <div className="flex h-20 items-center justify-center rounded-md bg-arena-charcoal text-caption text-arena-mist shadow-elevated">
            shadow-elevated
          </div>
          <div className="flex h-20 items-center justify-center rounded-md bg-arena-charcoal text-caption text-arena-fog shadow-glow-accent">
            shadow-glow-accent
          </div>
        </div>
      </Section>

      <Section
        title="Buttons"
        description="Three variants, three sizes. Hover, active (press), focus-visible, and disabled are all built in — tab through them to see the focus ring."
      >
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="primary">Enter arena</Button>
            <Button variant="secondary">View team</Button>
            <Button variant="ghost">Learn more</Button>
            <Button variant="primary" disabled>
              Disabled
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="primary" size="sm">
              Small
            </Button>
            <Button variant="primary" size="md">
              Medium
            </Button>
            <Button variant="primary" size="lg">
              Large
            </Button>
          </div>
        </div>
      </Section>

      <Section title="Badges" description="Metadata chips — league, position, rating, status.">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="neutral">Premier League</Badge>
          <Badge variant="accent">Captain</Badge>
          <Badge variant="outline">GK</Badge>
          <Badge variant="outline">MF</Badge>
          <Badge variant="neutral">Founded 1902</Badge>
        </div>
      </Section>

      <Section
        title="Cards"
        description="Base surface, plus an interactive variant with hover elevation and keyboard focus."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <p className="text-display-sm">Static card</p>
            <p className="mt-2 text-body-sm text-arena-mist">
              Default elevation, no interaction.
            </p>
          </Card>
          <Card interactive>
            <p className="text-display-sm">Interactive card</p>
            <p className="mt-2 text-body-sm text-arena-mist">
              Hover or tab to it — lifts, brightens its border, deepens its
              shadow.
            </p>
          </Card>
        </div>
      </Section>

      <Section title="Stat bars" description="Labeled progress tracks for ratings and comparisons.">
        <div className="flex max-w-sm flex-col gap-4">
          <StatBar label="Attack" value={88} />
          <StatBar label="Midfield" value={74} />
          <StatBar label="Defense" value={65} accent />
        </div>
      </Section>

      <Section
        title="Containers"
        description="Three max-widths: narrow (720px) for text, content (1200px) as the default, wide (1440px) for cinematic sections."
      >
        <div className="flex flex-col gap-3">
          <div className="arena-container-narrow rounded-sm border border-dashed border-arena-line-strong py-2 text-center text-caption text-arena-mist">
            narrow — 720px
          </div>
          <div className="arena-container rounded-sm border border-dashed border-arena-line-strong py-2 text-center text-caption text-arena-mist">
            content — 1200px
          </div>
          <div className="arena-container-wide rounded-sm border border-dashed border-arena-line-strong py-2 text-center text-caption text-arena-mist">
            wide — 1440px
          </div>
        </div>
      </Section>

      <Section
        title="Team-accent architecture"
        description="Switch the palette below — every primitive re-themes through the cascade, not through props."
      >
        <AccentToggleDemo />
      </Section>
    </main>
  );
}
