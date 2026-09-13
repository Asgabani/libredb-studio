import { NEW_TAB_SHORTCUT_LABEL } from "@/components/studio/StudioTabBar";

export interface ShortcutEntry {
  keys: string;
  description: string;
}

export interface ShortcutGroup {
  heading: string;
  shortcuts: ShortcutEntry[];
}

/**
 * The one place that answers "what shortcuts exist" (#746). `NEW_TAB_SHORTCUT_LABEL` is
 * imported rather than retyped so this list cannot drift from what `StudioTabBar` actually
 * binds; the rest are display labels for bindings that live as Monaco key codes or bare
 * `e.key` checks with no string constant of their own to import — `CommandPalette` already
 * carries its own "Ctrl+Enter" label the same way, so duplicating a label at this level of
 * stability is the existing convention, not a new one.
 */
export const SHORTCUT_GROUPS: ShortcutGroup[] = [
  {
    heading: "General",
    shortcuts: [
      { keys: "Ctrl+K", description: "Open the command palette" },
      { keys: "?", description: "Show this shortcuts dialog" },
    ],
  },
  {
    heading: "Query editor",
    shortcuts: [
      { keys: "Ctrl+Enter", description: "Run the current query" },
      { keys: "Alt+Shift+F", description: "Format the query" },
    ],
  },
  {
    heading: "Tabs",
    shortcuts: [
      { keys: NEW_TAB_SHORTCUT_LABEL, description: "Open a new query tab" },
      { keys: "Left / Right arrow", description: "Move focus between tabs" },
      { keys: "Home / End", description: "Jump to the first / last tab" },
    ],
  },
  {
    heading: "Data profiler",
    shortcuts: [{ keys: "Escape", description: "Close the data profiler" }],
  },
];
