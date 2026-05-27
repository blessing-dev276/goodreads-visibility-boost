import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Check, Sparkles } from "lucide-react";
import { captureExitLead } from "@/lib/booking.functions";

const STORAGE_KEY = "danbrown:exit-intent:dismissed";

export function ExitIntentDialog() {
  const captureFn = useServerFn(captureExitLead);
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [book, setBook] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(STORAGE_KEY)) return;

    let shown = false;
    const trigger = () => {
      if (shown) return;
      shown = true;
      setOpen(true);
      sessionStorage.setItem(STORAGE_KEY, "1");
    };

    const onMouseOut = (e: MouseEvent) => {
      if (e.clientY <= 0 && !e.relatedTarget) trigger();
    };
    const onVisibility = () => {
      if (document.visibilityState === "hidden") trigger();
    };
    // Mobile fallback: trigger after 45s of inactivity
    const timer = window.setTimeout(trigger, 45000);

    document.addEventListener("mouseout", onMouseOut);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      document.removeEventListener("mouseout", onMouseOut);
      document.removeEventListener("visibilitychange", onVisibility);
      window.clearTimeout(timer);
    };
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    try {
      await captureFn({ data: { email, book } });
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        {status === "success" ? (
          <div className="text-center py-6">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-accent/15 flex items-center justify-center">
              <Check className="w-7 h-7 text-accent" />
            </div>
            <DialogTitle className="font-serif text-2xl mb-2">You're on the list.</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              I'll reach out within 24 hours to schedule your free Listopia audit.
            </DialogDescription>
          </div>
        ) : (
          <>
            <DialogHeader>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/15 text-accent text-xs font-medium mb-2 w-fit">
                <Sparkles className="w-3 h-3" /> Wait — before you go
              </div>
              <DialogTitle className="font-serif text-2xl">Claim your free Listopia audit.</DialogTitle>
              <DialogDescription>
                Drop your email and book title — I'll send you a personalized ranking opportunity report, no strings attached.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={onSubmit} className="space-y-3 pt-2">
              <input
                required
                type="email"
                placeholder="your@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <input
                required
                placeholder="Book title"
                value={book}
                onChange={(e) => setBook(e.target.value)}
                className="w-full px-4 py-3 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
              {status === "error" && <p className="text-sm text-destructive">{errorMsg}</p>}
              <Button type="submit" disabled={status === "loading"} className="w-full bg-foreground text-background hover:bg-foreground/90">
                {status === "loading" ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sending…</>
                ) : (
                  "Send My Free Audit"
                )}
              </Button>
              <p className="text-xs text-muted-foreground text-center">No spam. Unsubscribe anytime.</p>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}