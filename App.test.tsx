import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";
import { comfortMessages, morningMessages, nightMessages } from "./data";
import { mockReducedMotion } from "./test-utils";

const user = () => userEvent.setup();

async function enterHouse(u: ReturnType<typeof user>) {
  await u.click(screen.getByRole("button", { name: "Come inside ♡" }));
}

beforeEach(() => {
  window.localStorage.clear();
  mockReducedMotion(true); // skip animations so tests are quick and predictable
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe("welcome and home", () => {
  it("shows the requested welcome text and enters the house", async () => {
    const u = user();
    render(<App />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Welcome to Your Little Comfort House, Simran ♡");
    expect(
      screen.getByText("A tiny place for the days that feel heavy, the nights that feel long, and every ordinary moment in between."),
    ).toBeInTheDocument();
    await enterHouse(u);

    expect(screen.getByRole("heading", { name: "Morning Letter ☀️" })).toBeInTheDocument();
    expect(screen.getByText("A little reminder to begin your day.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Open today's morning letter" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Night Letter 🌙" })).toBeInTheDocument();
    expect(screen.getByText("Leave the weight of today here.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Open your night letter" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Comfort Jar 💌" })).toBeInTheDocument();
    expect(screen.getByText("For whenever your heart needs a little comfort.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Pick a note for me" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "My Favourite Notes ♡" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "I need a hug ♡" })).toBeInTheDocument();
  });
});

describe("days and letters", () => {
  it("opens Day 1, moves with Previous/Next, and jumps to any day", async () => {
    const u = user();
    render(<App />);
    await enterHouse(u);
    await u.click(screen.getByRole("button", { name: "Open today's morning letter" }));

    expect(screen.getByRole("heading", { level: 2, name: morningMessages[0].title })).toBeInTheDocument();
    expect(screen.getByText(/Good morning, Simran ♡ You don't need to know/)).toBeInTheDocument();
    expect(screen.getByText("With love, your sister ♡")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Previous day/ })).toBeDisabled();

    await u.click(screen.getByRole("button", { name: /Next day/ }));
    expect(screen.getByRole("heading", { level: 2, name: morningMessages[1].title })).toBeInTheDocument();
    await u.click(screen.getByRole("button", { name: /Previous day/ }));
    expect(screen.getByRole("heading", { level: 2, name: morningMessages[0].title })).toBeInTheDocument();

    await u.click(screen.getByRole("button", { name: "Choose a day" }));
    const grid = screen.getByRole("group", { name: "All days" });
    expect(within(grid).getAllByRole("button")).toHaveLength(30);
    await u.click(within(grid).getByRole("button", { name: "Day 17" }));
    expect(screen.getByRole("heading", { level: 2, name: morningMessages[16].title })).toBeInTheDocument();
    await u.click(within(grid).getByRole("button", { name: "Day 30" }));
    expect(screen.getByRole("button", { name: /Next day/ })).toBeDisabled();
  });

  it("keeps the selected day separate from today's real date", async () => {
    const u = user();
    render(<App />);
    await enterHouse(u);
    expect(screen.getByText(/Today's date: /)).toBeInTheDocument();
    expect(screen.getAllByText("Day 1").length).toBeGreaterThan(0);
    await u.click(screen.getByRole("button", { name: "Choose a day" }));
    await u.click(screen.getByRole("button", { name: "Day 9" }));
    // The real date line doesn't change when a day is chosen.
    expect(screen.getByText(/Today's date: /)).not.toHaveTextContent("Day 9");
    expect(screen.getAllByText("Day 9").length).toBeGreaterThan(0);
  });

  it("opens the night letter for the same day, and every day has both letters", async () => {
    const u = user();
    render(<App />);
    await enterHouse(u);
    await u.click(screen.getByRole("button", { name: "Open your night letter" }));
    expect(screen.getByRole("heading", { level: 2, name: nightMessages[0].title })).toBeInTheDocument();
    expect(screen.getByText(/Hey, you\. Put the weight of today down/)).toBeInTheDocument();

    await u.click(screen.getByRole("button", { name: /Next day/ }));
    expect(screen.getByRole("heading", { level: 2, name: nightMessages[1].title })).toBeInTheDocument();
    await u.click(screen.getByRole("button", { name: /Morning/ }));
    expect(screen.getByRole("heading", { level: 2, name: morningMessages[1].title })).toBeInTheDocument();
  });

  it("plays the envelope animation in order, then shows the letter", () => {
    mockReducedMotion(false);
    vi.useFakeTimers();
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: "Come inside ♡" }));
    act(() => void vi.advanceTimersByTime(800)); // welcome exit animation
    fireEvent.click(screen.getByRole("button", { name: "Open today's morning letter" }));

    const stage = () => document.querySelector(".envelope-stage") as HTMLElement;
    expect(stage().className).toContain("envelope-stage--sealed");
    expect(screen.queryByRole("heading", { level: 2, name: morningMessages[0].title })).toBeNull();

    act(() => void vi.advanceTimersByTime(600));
    expect(stage().className).toContain("envelope-stage--flap");
    act(() => void vi.advanceTimersByTime(900));
    expect(stage().className).toContain("envelope-stage--slide");
    act(() => void vi.advanceTimersByTime(1000));
    expect(stage().className).toContain("envelope-stage--open");
    expect(screen.getByRole("heading", { level: 2, name: morningMessages[0].title })).toBeInTheDocument();
  });
});

describe("favourites", () => {
  it("saves from all three collections, shows them in one place and survives a refresh", async () => {
    const u = user();
    const first = render(<App />);
    await enterHouse(u);

    // morning Day 1
    await u.click(screen.getByRole("button", { name: "Open today's morning letter" }));
    await u.click(screen.getByRole("button", { name: "Save to favourites" }));
    expect(screen.getByRole("button", { name: "Saved to favourites" })).toHaveAttribute("aria-pressed", "true");
    // night Day 1
    await u.click(screen.getByRole("button", { name: /Night/ }));
    await u.click(screen.getByRole("button", { name: "Save to favourites" }));
    // a jar note
    // "Back home" appears twice (small house icon at the top, text button at the bottom); either works.
    await u.click(screen.getAllByRole("button", { name: "Back home" })[0]);
    await u.click(screen.getByRole("button", { name: "Pick a note for me" }));
    await u.click(screen.getByRole("button", { name: "Pick a note for me" }));
    await u.click(screen.getByRole("button", { name: "Save to favourites" }));

    expect(JSON.parse(window.localStorage.getItem("comfort-house:favourites")!)).toEqual(
      expect.arrayContaining(["morning:1", "night:1", expect.stringMatching(/^comfort:\d+$/)]),
    );

    // Simulate refreshing the page: throw the app away and start again.
    first.unmount();
    render(<App />);
    await enterHouse(u);
    expect(screen.getByRole("button", { name: /See all 3 favourite notes/ })).toBeInTheDocument();
    await u.click(screen.getByRole("button", { name: /See all 3 favourite notes/ }));

    const list = screen.getByRole("list");
    expect(within(list).getByText(morningMessages[0].title)).toBeInTheDocument();
    expect(within(list).getByText(nightMessages[0].title)).toBeInTheDocument();
    expect(within(list).getByText("Morning letter, Day 1")).toBeInTheDocument();
    expect(within(list).getByText("Night letter, Day 1")).toBeInTheDocument();
    expect(within(list).getByText("Comfort jar")).toBeInTheDocument();

    // Removing one works too.
    await u.click(within(list).getAllByRole("button", { name: "Saved to favourites" })[0]);
    expect(within(screen.getByRole("list")).getAllByRole("article")).toHaveLength(2);
    expect(JSON.parse(window.localStorage.getItem("comfort-house:favourites")!)).toHaveLength(2);
  });

  it("remembers the chosen day after a refresh", async () => {
    const u = user();
    const first = render(<App />);
    await enterHouse(u);
    await u.click(screen.getByRole("button", { name: "Choose a day" }));
    await u.click(screen.getByRole("button", { name: "Day 12" }));
    first.unmount();
    render(<App />);
    await enterHouse(u);
    expect(screen.getAllByText("Day 12").length).toBeGreaterThan(0);
  });
});

describe("comfort jar and hug button", () => {
  it("draws a note, and never shows the same note twice in a row", async () => {
    const u = user();
    render(<App />);
    await enterHouse(u);
    await u.click(screen.getByRole("button", { name: "Pick a note for me" }));
    expect(screen.getByRole("heading", { level: 1, name: "Comfort Jar 💌" })).toBeInTheDocument();

    await u.click(screen.getByRole("button", { name: "Pick a note for me" }));
    const seen: string[] = [];
    const readTitle = () => screen.getByRole("article").querySelector("h2")!.textContent!;
    seen.push(readTitle());
    expect(comfortMessages.map((c) => c.title)).toContain(seen[0]);
    expect(screen.getByText("Always, your sister ♡")).toBeInTheDocument();

    for (let i = 0; i < 40; i++) {
      await u.click(screen.getByRole("button", { name: "Draw another note" }));
      seen.push(readTitle());
    }
    for (let i = 1; i < seen.length; i++) expect(seen[i]).not.toBe(seen[i - 1]);
    expect(new Set(seen).size).toBeGreaterThan(10); // it really is random
  });

  it("animates the jar: wobble, then a note rises, then it unfolds", () => {
    mockReducedMotion(false);
    vi.useFakeTimers();
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: "Come inside ♡" }));
    act(() => void vi.advanceTimersByTime(800));
    fireEvent.click(screen.getByRole("button", { name: "Pick a note for me" }));
    fireEvent.click(screen.getByRole("button", { name: "Pick a note for me" }));

    const stage = () => document.querySelector(".jar-stage") as HTMLElement;
    expect(stage().className).toContain("jar-stage--shaking");
    act(() => void vi.advanceTimersByTime(900));
    expect(stage().className).toContain("jar-stage--rising");
    expect(document.querySelector(".jar-note")).not.toBeNull();
    act(() => void vi.advanceTimersByTime(1100));
    expect(stage().className).toContain("jar-stage--open");
    expect(screen.getByRole("article")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Draw another note" })).toBeInTheDocument();
  });

  it("hugs: shows a comfort message, another one on request, and closes with Escape", async () => {
    const u = user();
    render(<App />);
    await enterHouse(u);
    await u.click(screen.getByRole("button", { name: "I need a hug ♡" }));

    const dialog = screen.getByRole("dialog");
    expect(within(dialog).getByRole("img", { name: /hugging a big pink heart/ })).toBeInTheDocument();
    const titleOf = () => within(dialog).getByRole("article").querySelector("h3")!.textContent!;
    const first = titleOf();
    expect(comfortMessages.map((c) => c.title)).toContain(first);

    await u.click(within(dialog).getByRole("button", { name: "Show another message" }));
    expect(titleOf()).not.toBe(first);

    await u.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});
