import "../setup-dom";
import "../helpers/mock-sonner";
import "../helpers/mock-navigation";

import React from "react";
import { describe, test, expect, afterEach } from "bun:test";
import { render, cleanup, fireEvent, act } from "@testing-library/react";

import { ShortcutsDialog, type ShortcutsDialogRef } from "@/components/ShortcutsDialog";
import { SHORTCUT_GROUPS } from "@/lib/shortcuts";

afterEach(() => {
  cleanup();
});

describe("ShortcutsDialog", () => {
  test("is closed on mount", () => {
    const { queryByText } = render(<ShortcutsDialog />);
    expect(queryByText("Keyboard Shortcuts")).toBeNull();
  });

  test("pressing ? opens the dialog", () => {
    const { getByText } = render(<ShortcutsDialog />);

    fireEvent.keyDown(document, { key: "?" });

    expect(getByText("Keyboard Shortcuts")).not.toBeNull();
  });

  test("pressing ? while typing in an input does not open the dialog", () => {
    const { queryByText } = render(
      <>
        <input aria-label="search" />
        <ShortcutsDialog />
      </>,
    );

    const input = document.querySelector('input[aria-label="search"]')!;
    fireEvent.keyDown(input, { key: "?" });

    expect(queryByText("Keyboard Shortcuts")).toBeNull();
  });

  test("pressing ? while typing in a textarea does not open the dialog", () => {
    const { queryByText } = render(
      <>
        <textarea aria-label="notes" />
        <ShortcutsDialog />
      </>,
    );

    const textarea = document.querySelector('textarea[aria-label="notes"]')!;
    fireEvent.keyDown(textarea, { key: "?" });

    expect(queryByText("Keyboard Shortcuts")).toBeNull();
  });

  test("pressing ? in a contentEditable element does not open the dialog", () => {
    const { queryByText } = render(
      <>
        <div contentEditable aria-label="editable" />
        <ShortcutsDialog />
      </>,
    );

    const editable = document.querySelector('[aria-label="editable"]')!;
    fireEvent.keyDown(editable, { key: "?" });

    expect(queryByText("Keyboard Shortcuts")).toBeNull();
  });

  test("a keydown that is not ? is ignored", () => {
    const { queryByText } = render(<ShortcutsDialog />);

    fireEvent.keyDown(document, { key: "Enter" });

    expect(queryByText("Keyboard Shortcuts")).toBeNull();
  });

  test("the imperative ref opens the dialog", () => {
    const ref = React.createRef<ShortcutsDialogRef>();
    const { getByText } = render(<ShortcutsDialog ref={ref} />);

    act(() => ref.current?.open());

    expect(getByText("Keyboard Shortcuts")).not.toBeNull();
  });

  test("lists every group heading and at least one shortcut per group", () => {
    const { getByText } = render(<ShortcutsDialog />);

    fireEvent.keyDown(document, { key: "?" });

    for (const group of SHORTCUT_GROUPS) {
      expect(getByText(group.heading)).not.toBeNull();
      expect(getByText(group.shortcuts[0].description)).not.toBeNull();
      expect(getByText(group.shortcuts[0].keys)).not.toBeNull();
    }
  });

  test("removes its keydown listener on unmount", () => {
    const originalRemove = document.removeEventListener.bind(document);
    let removed = false;
    document.removeEventListener = ((...args: Parameters<typeof document.removeEventListener>) => {
      if (args[0] === "keydown") removed = true;
      return originalRemove(...args);
    }) as typeof document.removeEventListener;

    const { unmount } = render(<ShortcutsDialog />);
    unmount();

    expect(removed).toBe(true);
    document.removeEventListener = originalRemove;
  });
});
