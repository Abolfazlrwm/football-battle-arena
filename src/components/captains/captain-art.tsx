import type { Captain, Team } from "@/types";
import { buildAccentVars } from "@/lib/color";
import { TeamLogo } from "@/components/teams/team-logo";

/**
 * The captain "portrait" when no licensed photograph is available:
 * a cinematic, typographic poster — team-colored light, a giant outlined
 * shirt number, and the club crest as a watermark. It fills its parent
 * (absolute inset-0). Real photos can replace it per captain; see
 * CAPTAIN_PHOTO_SLUGS in /data/images.ts.
 */
export function CaptainArt({ captain, team }: { captain: Captain; team: Team }) {
  const vars = buildAccentVars(team.colors);
  const accent = vars["--accent"];
  const readable = vars["--accent-readable"];
  const digits = String(captain.number);
  const fontSize = digits.length > 1 ? 70 : 82;
  const baseline = digits.length > 1 ? 84 : 88;

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 overflow-hidden"
      style={{
        background: `radial-gradient(85% 60% at 50% 30%, color-mix(in oklab, ${accent} 55%, transparent) 0%, transparent 70%),
          linear-gradient(180deg, color-mix(in oklab, ${accent} 16%, #121218) 0%, #07070a 100%)`,
      }}
    >
      <div
        className="absolute -left-1/4 top-0 h-full w-1/2 -skew-x-12 opacity-[0.07]"
        style={{ background: "linear-gradient(90deg, transparent, #fff, transparent)" }}
      />
      <div className="bg-arena-texture absolute inset-0 opacity-[0.05]" />

      <div className="absolute inset-x-0 top-[8%] flex justify-center opacity-[0.16]">
        <TeamLogo team={team} size={220} className="h-[58%] w-[58%] max-w-[260px]" />
      </div>

      <svg
        viewBox="0 0 100 125"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
      >
        <text
          x="50"
          y={baseline}
          textAnchor="middle"
          style={{ fontFamily: "var(--font-display), ui-sans-serif, sans-serif" }}
          fontWeight="900"
          fontSize={fontSize}
          fill={readable}
          fillOpacity="0.14"
          stroke={readable}
          strokeOpacity="0.85"
          strokeWidth="0.9"
          letterSpacing="-2"
        >
          {digits}
        </text>
      </svg>
    </div>
  );
}
