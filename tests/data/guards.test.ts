import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

/**
 * The datasets fail fast at import time (unknown teamId) and fall back
 * defensively (unmapped country → Europe). Both paths are unreachable
 * with a valid dataset, so they're exercised through mocked imports.
 */

beforeEach(() => {
  vi.resetModules();
});

afterEach(() => {
  vi.doUnmock("@/data/teams");
  vi.restoreAllMocks();
});

describe("dataset guards", () => {
  it("refuses to build the captain roster on an unknown teamId", async () => {
    vi.doMock("@/data/teams", async (importOriginal) => {
      const actual = await importOriginal<typeof import("@/data/teams")>();
      return { ...actual, getTeamById: () => undefined };
    });
    await expect(import("@/data/captains")).rejects.toThrow(/unknown teamId/);
  });

  it("falls back to the Europe region for countries outside the big six", async () => {
    vi.doMock("@/data/teams", async (importOriginal) => {
      const actual = await importOriginal<typeof import("@/data/teams")>();
      const outsider = { ...actual.teams[0], id: "outsider-fc", country: "Brazil" };
      return { ...actual, teams: [...actual.teams, outsider] };
    });
    const { rankings } = await import("@/data/rankings");
    const outsider = rankings.find((r) => r.teamId === "outsider-fc");
    expect(outsider?.region).toBe("Europe");
    // Real entries still resolve to their mapped region.
    const spanish = rankings.filter((r) => r.region === "Spain");
    expect(spanish.length).toBeGreaterThan(0);
  });
});
