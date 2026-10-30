import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { TopBar } from "./components/TopBar";
import { Sparkles } from "./components/Illustrations";
import { ANIMATION_SPEED, START_DATE } from "./config";
import { TOTAL_DAYS } from "./data";
import { FavouritesProvider } from "./hooks/FavouritesContext";
import { FavouritesScreen } from "./screens/FavouritesScreen";
import { HugPanel } from "./screens/HugPanel";
import { Home } from "./screens/Home";
import { JarScreen } from "./screens/JarScreen";
import { LetterScreen } from "./screens/LetterScreen";
import { Welcome } from "./screens/Welcome";
import { dayNumberForDate } from "./utils/dates";
import { readStorage, writeStorage } from "./utils/storage";

type Screen =
  | { name: "welcome" }
  | { name: "home" }
  | { name: "letter"; kind: "morning" | "night"; animate: boolean }
  | { name: "jar" }
  | { name: "favourites" };

const clampDay = (day: number) => Math.min(Math.max(1, Math.round(day)), TOTAL_DAYS);

export default function App() {
  return (
    <FavouritesProvider>
      <House />
    </FavouritesProvider>
  );
}

function House() {
  // Which day matches today's date (only if START_DATE is set in src/config.ts).
  const todayDay = useMemo(() => dayNumberForDate(START_DATE, TOTAL_DAYS), []);

  const [screen, setScreen] = useState<Screen>({ name: "welcome" });
  const [hugOpen, setHugOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number>(() => {
    if (todayDay) return clampDay(todayDay);
    return clampDay(readStorage<number>("selectedDay", 1));
  });

  const mainRef = useRef<HTMLElement>(null);
  const firstRender = useRef(true);

  // Remember which day she was reading.
  useEffect(() => {
    writeStorage("selectedDay", selectedDay);
  }, [selectedDay]);

  // Screens are added to the browser history, so the phone's Back button moves between them.
  useEffect(() => {
    window.history.replaceState({ name: "welcome" } satisfies Screen, "");
    const onPop = (event: PopStateEvent) => {
      const state = event.state as Screen | null;
      if (!state || !("name" in state)) {
        setScreen({ name: "welcome" });
      } else if (state.name === "letter") {
        setScreen({ ...state, animate: false });
      } else {
        setScreen(state);
      }
      setHugOpen(false);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const go = useCallback((next: Screen) => {
    window.history.pushState(next, "");
    setScreen(next);
  }, []);

  // When the screen changes, go to the top and move keyboard focus to the new page.
  const screenKey = screen.name === "letter" ? `letter-${screen.kind}` : screen.name;
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    window.scrollTo({ top: 0 });
    mainRef.current?.focus({ preventScroll: true });
  }, [screenKey]);

  const selectDay = useCallback((day: number) => setSelectedDay(clampDay(day)), []);
  const closeHug = useCallback(() => setHugOpen(false), []);
  const goHome = useCallback(() => go({ name: "home" }), [go]);

  return (
    <div
      className={`app app--${screen.name}`}
      data-theme={screen.name === "letter" && screen.kind === "night" ? "night" : "day"}
      style={{ ["--speed" as string]: ANIMATION_SPEED }}
    >
      <Sparkles />

      {screen.name !== "welcome" && (
        <TopBar showHome={screen.name !== "home"} showHug={screen.name !== "home"} onHome={goHome} onHug={() => setHugOpen(true)} />
      )}

      <main ref={mainRef} tabIndex={-1} className="main" id="main">
        <div key={screenKey} className={`screen screen--${screen.name}`}>
          {screen.name === "welcome" && <Welcome onEnter={() => go({ name: "home" })} />}

          {screen.name === "home" && (
            <Home
              selectedDay={selectedDay}
              totalDays={TOTAL_DAYS}
              todayDay={todayDay}
              onSelectDay={selectDay}
              onOpenMorning={() => go({ name: "letter", kind: "morning", animate: true })}
              onOpenNight={() => go({ name: "letter", kind: "night", animate: true })}
              onOpenJar={() => go({ name: "jar" })}
              onHug={() => setHugOpen(true)}
              onOpenFavourites={() => go({ name: "favourites" })}
            />
          )}

          {screen.name === "letter" && (
            <LetterScreen
              kind={screen.kind}
              day={selectedDay}
              totalDays={TOTAL_DAYS}
              todayDay={todayDay}
              animate={screen.animate}
              onSelectDay={selectDay}
              onSwitchKind={(kind) => go({ name: "letter", kind, animate: true })}
              onHome={goHome}
            />
          )}

          {screen.name === "jar" && <JarScreen onHome={goHome} />}

          {screen.name === "favourites" && (
            <FavouritesScreen
              onHome={goHome}
              onOpenLetter={(kind, day) => {
                setSelectedDay(clampDay(day));
                go({ name: "letter", kind, animate: true });
              }}
            />
          )}
        </div>
      </main>

      {hugOpen && <HugPanel onClose={closeHug} />}
    </div>
  );
}
