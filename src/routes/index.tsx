"use client";

import { useEffect, useState, type ComponentType } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Overlay } from "@/components/game/Overlay";
import { useTape } from "@/game/store";
import { cn } from "@/lib/utils";

const scenePromise =
  typeof window !== "undefined" ? import("@/game/FightScene") : null;

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const [Scene, setScene] = useState<ComponentType | null>(null);
  const event = useTape((s) => s.event);

  useEffect(() => {
    let live = true;
    void (scenePromise ?? import("@/game/FightScene")).then((m) => {
      if (live) setScene(() => m.FightScene);
    });
    return () => {
      live = false;
    };
  }, []);

  return (
    <main className="relative h-dvh overflow-hidden bg-bg text-fg">
      <div className={cn("absolute inset-0", event === "focus" && "blur-[6px]")}>
        {Scene ? (
          <Scene />
        ) : (
          <div className="grid h-full place-items-center">
            <p className="font-display text-3xl tracking-tight">LOADING TAPE</p>
          </div>
        )}
      </div>
      <Overlay />
    </main>
  );
}
