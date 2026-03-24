import { TERMINAL_EMULATORS, TerminalEmulatorId } from "@t3tools/contracts";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { useMemo } from "react";

const LAST_TERMINAL_EMULATOR_KEY = "t3code:last-terminal-emulator";

export function usePreferredTerminalEmulator(
  availableTerminalEmulators: ReadonlyArray<TerminalEmulatorId>,
) {
  const [lastEmulator, setLastEmulator] = useLocalStorage(
    LAST_TERMINAL_EMULATOR_KEY,
    null,
    TerminalEmulatorId,
  );

  const effectiveEmulator = useMemo(() => {
    if (lastEmulator && availableTerminalEmulators.includes(lastEmulator)) return lastEmulator;
    return (
      TERMINAL_EMULATORS.find((emulator) => availableTerminalEmulators.includes(emulator.id))
        ?.id ?? null
    );
  }, [lastEmulator, availableTerminalEmulators]);

  return [effectiveEmulator, setLastEmulator] as const;
}
