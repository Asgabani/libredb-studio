import { describe, test, expect } from "bun:test";
import { SHORTCUT_GROUPS } from "@/lib/shortcuts";
import { NEW_TAB_SHORTCUT_LABEL } from "@/components/studio/StudioTabBar";

describe("SHORTCUT_GROUPS", () => {
  test("every group has a heading and at least one shortcut", () => {
    expect(SHORTCUT_GROUPS.length).toBeGreaterThan(0);
    for (const group of SHORTCUT_GROUPS) {
      expect(group.heading.length).toBeGreaterThan(0);
      expect(group.shortcuts.length).toBeGreaterThan(0);
      for (const shortcut of group.shortcuts) {
        expect(shortcut.keys.length).toBeGreaterThan(0);
        expect(shortcut.description.length).toBeGreaterThan(0);
      }
    }
  });

  test("the new-tab entry uses the label StudioTabBar actually binds, not a copy of it", () => {
    const tabsGroup = SHORTCUT_GROUPS.find((g) => g.heading === "Tabs");
    expect(tabsGroup).toBeDefined();
    const newTabShortcut = tabsGroup!.shortcuts.find((s) => s.description.includes("new query tab"));
    expect(newTabShortcut?.keys).toBe(NEW_TAB_SHORTCUT_LABEL);
  });

  test("Ctrl+K and ? are both listed under General", () => {
    const generalGroup = SHORTCUT_GROUPS.find((g) => g.heading === "General");
    expect(generalGroup?.shortcuts.map((s) => s.keys)).toEqual(expect.arrayContaining(["Ctrl+K", "?"]));
  });
});
