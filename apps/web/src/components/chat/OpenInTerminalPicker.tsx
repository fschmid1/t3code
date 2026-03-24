import { TerminalEmulatorId } from "@t3tools/contracts";
import { memo, useCallback, useMemo } from "react";
import { usePreferredTerminalEmulator } from "../../terminalEmulatorPreferences";
import { ChevronDownIcon, TerminalSquareIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Group, GroupSeparator } from "../ui/group";
import { Menu, MenuItem, MenuPopup, MenuTrigger } from "../ui/menu";
import { readNativeApi } from "~/nativeApi";

const resolveOptions = (availableTerminalEmulators: ReadonlyArray<TerminalEmulatorId>) => {
  const baseOptions: ReadonlyArray<{ label: string; value: TerminalEmulatorId }> = [
    { label: "iTerm", value: "iterm2" },
    { label: "Terminal", value: "terminal-app" },
    { label: "Warp", value: "warp" },
    { label: "Alacritty", value: "alacritty" },
    { label: "Kitty", value: "kitty" },
    { label: "WezTerm", value: "wezterm" },
    { label: "Windows Terminal", value: "windows-terminal" },
    { label: "Ghostty", value: "ghostty" },
  ];
  return baseOptions.filter((option) => availableTerminalEmulators.includes(option.value));
};

export const OpenInTerminalPicker = memo(function OpenInTerminalPicker({
  availableTerminalEmulators,
  openInCwd,
}: {
  availableTerminalEmulators: ReadonlyArray<TerminalEmulatorId>;
  openInCwd: string | null;
}) {
  const [preferredEmulator, setPreferredEmulator] =
    usePreferredTerminalEmulator(availableTerminalEmulators);
  const options = useMemo(
    () => resolveOptions(availableTerminalEmulators),
    [availableTerminalEmulators],
  );
  const primaryOption = options.find(({ value }) => value === preferredEmulator) ?? null;

  const openInTerminal = useCallback(
    (emulatorId: TerminalEmulatorId | null) => {
      const api = readNativeApi();
      if (!api || !openInCwd) return;
      const emulator = emulatorId ?? preferredEmulator;
      if (!emulator) return;
      void api.shell.openInTerminal(openInCwd, emulator);
      setPreferredEmulator(emulator);
    },
    [preferredEmulator, openInCwd, setPreferredEmulator],
  );

  if (options.length === 0) return null;

  return (
    <Group aria-label="Open in terminal">
      <Button
        size="xs"
        variant="outline"
        disabled={!preferredEmulator || !openInCwd}
        onClick={() => openInTerminal(preferredEmulator)}
        title={primaryOption ? `Open in ${primaryOption.label}` : "Open in terminal"}
      >
        <TerminalSquareIcon aria-hidden="true" className="size-3.5" />
        <span className="sr-only @sm/header-actions:not-sr-only @sm/header-actions:ml-0.5">
          Terminal
        </span>
      </Button>
      {options.length > 1 && (
        <>
          <GroupSeparator className="hidden @sm/header-actions:block" />
          <Menu>
            <MenuTrigger
              render={<Button aria-label="Terminal options" size="icon-xs" variant="outline" />}
            >
              <ChevronDownIcon aria-hidden="true" className="size-4" />
            </MenuTrigger>
            <MenuPopup align="end">
              {options.map(({ label, value }) => (
                <MenuItem key={value} onClick={() => openInTerminal(value)}>
                  <TerminalSquareIcon aria-hidden="true" className="size-4 text-muted-foreground" />
                  {label}
                </MenuItem>
              ))}
            </MenuPopup>
          </Menu>
        </>
      )}
    </Group>
  );
});
