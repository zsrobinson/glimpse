"use client";

import { IconLoader2 } from "@tabler/icons-react";
import { useIsFetching, useIsMutating } from "@tanstack/react-query";
import { useCallback, useEffect } from "react";

export function GlobalLoadingIndicator() {
  const isFetching = useIsFetching() > 0;
  const isMutating = useIsMutating() > 0;

  const beforeUnload = useCallback((e: BeforeUnloadEvent) => {
    e.preventDefault();
    e.returnValue = "";
  }, []);

  useEffect(() => {
    if (isMutating) {
      window.addEventListener("beforeunload", beforeUnload);
    } else {
      window.removeEventListener("beforeunload", beforeUnload);
    }
  }, [isFetching, isMutating, beforeUnload]);

  return (
    <div className="flex items-center gap-2">
      {(isFetching || isMutating) && (
        <IconLoader2 className="animate-spin text-muted-foreground" />
      )}

      {isMutating ? (
        <span className="italic text-muted-foreground">Syncing Changes</span>
      ) : isFetching ? (
        <span className="italic text-muted-foreground">Loading Tasks</span>
      ) : null}
    </div>
  );
}
