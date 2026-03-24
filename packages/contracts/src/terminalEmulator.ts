import { Schema } from "effect";
import { TrimmedNonEmptyString } from "./baseSchemas";

export const TERMINAL_EMULATORS = [
  { id: "iterm2", label: "iTerm", command: "open", args: ["-a", "iTerm"], platform: "darwin" },
  { id: "terminal-app", label: "Terminal", command: "open", args: ["-a", "Terminal"], platform: "darwin" },
  { id: "warp", label: "Warp", command: "open", args: ["-a", "Warp"], platform: "darwin" },
  { id: "alacritty", label: "Alacritty", command: "alacritty", args: [], platform: null },
  { id: "kitty", label: "Kitty", command: "kitty", args: [], platform: null },
  { id: "wezterm", label: "WezTerm", command: "wezterm", args: ["start", "--cwd"], platform: null },
  { id: "windows-terminal", label: "Windows Terminal", command: "wt", args: ["-d"], platform: "win32" },
  { id: "ghostty", label: "Ghostty", command: "ghostty", args: [], platform: null },
] as const;

export const TerminalEmulatorId = Schema.Literals(TERMINAL_EMULATORS.map((t) => t.id));
export type TerminalEmulatorId = typeof TerminalEmulatorId.Type;

export const OpenInTerminalInput = Schema.Struct({
  cwd: TrimmedNonEmptyString,
  terminalEmulator: TerminalEmulatorId,
});
export type OpenInTerminalInput = typeof OpenInTerminalInput.Type;
