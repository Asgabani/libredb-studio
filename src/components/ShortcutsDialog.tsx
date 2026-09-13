"use client";

import React, { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SHORTCUT_GROUPS } from "@/lib/shortcuts";

export interface ShortcutsDialogRef {
  open: () => void;
}

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) return true;
  return target.isContentEditable;
}

/**
 * The single place that answers "what shortcuts exist" (#746). Self-contained, following
 * `CommandPalette`'s own Cmd/Ctrl+K effect: it owns its open state and its "?" listener, so
 * mounting it in both `Studio.tsx` and `DataProfiler.tsx` — `DataProfiler` is itself mounted
 * by both the standalone shell and the embedded workspace — is what makes the dialog reachable
 * everywhere without either host threading open state through props.
 *
 * `CommandPalette`'s "Keyboard Shortcuts" entry reaches the standalone shell's instance
 * through the imperative handle below, the same seam `QueryEditorRef` already uses for the
 * editor.
 */
export const ShortcutsDialog = forwardRef<ShortcutsDialogRef>(function ShortcutsDialog(_props, ref) {
  const [open, setOpen] = useState(false);

  useImperativeHandle(ref, () => ({ open: () => setOpen(true) }), []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "?" || isTypingTarget(e.target)) return;
      e.preventDefault();
      setOpen(true);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md bg-surface border-hairline-strong">
        <DialogHeader>
          <DialogTitle>Keyboard Shortcuts</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          {SHORTCUT_GROUPS.map((group) => (
            <div key={group.heading}>
              <h3 className="text-xs font-medium text-fg-muted mb-2">{group.heading}</h3>
              <div className="space-y-1.5">
                {group.shortcuts.map((shortcut) => (
                  <div
                    key={`${group.heading}:${shortcut.keys}:${shortcut.description}`}
                    className="flex items-center justify-between gap-3 text-xs"
                  >
                    <span className="text-fg">{shortcut.description}</span>
                    <kbd className="px-1.5 py-0.5 rounded bg-fill text-fg-secondary font-mono text-[0.7rem] shrink-0">
                      {shortcut.keys}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
});
