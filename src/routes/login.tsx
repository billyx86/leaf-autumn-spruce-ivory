"use client";

import { createFileRoute, Link } from "@tanstack/react-router";
import { GROK_PROVIDERS, authEnabled, signIn } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  return (
    <main className="relative min-h-dvh overflow-auto bg-bg text-fg">
      <img
        src="/og.jpg"
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-35"
      />
      <div className="absolute inset-0 bg-bg/75" />
      <div className="relative mx-auto flex min-h-dvh max-w-sm flex-col justify-center gap-6 p-6">
        <div>
          <p className="font-mono text-[11px] tracking-[0.2em] text-muted uppercase">
            Crew access
          </p>
          <h1 className="font-display mt-2 text-5xl font-bold tracking-tight">BAD ANGLE</h1>
          <p className="mt-3 text-sm text-muted">
            Sign in to save your worst takes — including the tape — to your account.
          </p>
        </div>
        {authEnabled ? (
          <div className="space-y-3">
            {GROK_PROVIDERS.map((p) => (
              <Button
                key={p.providerId}
                type="button"
                variant="secondary"
                className="w-full"
                onClick={() => signIn(p.providerId, { callbackURL: "/" })}
              >
                Continue with {p.label}
              </Button>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted">Sign-in is disabled.</p>
        )}
        <Link to="/" className="text-sm text-muted hover:text-fg">
          Back to the car park
        </Link>
      </div>
    </main>
  );
}
