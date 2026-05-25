import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { BookOpen, TrendingUp, Star, Mail, MapPin, Check, ArrowRight, Trophy, Users, Target, Calendar as CalendarIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import danielImg from "@/assets/daniel-brown.png";
import { bookAuditCall } from "@/lib/booking.functions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Goodreads Listopia Rankings & Book Visibility — Daniel Brown" },
      { name: "description", content: "Boost your book's discoverability with expert Goodreads Listopia listing and ranking services by Daniel Brown." },
      { property: "og:title", content: "Goodreads Listopia Rankings — Daniel Brown" },
      { property: "og:description", content: "Get your book on top Goodreads Listopia lists and reach thousands of readers." },
    ],
  }),
  component: Index,
});

function Index() {
  const bookFn = useServerFn(bookAuditCall);
  const [form, setForm] = useState({ name: "", email: "", book: "", date: "", time: "", notes: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const timezone =
    typeof Intl !== "undefined" ? Intl.DateTimeFormat().resolvedOptions().timeZone : "UTC";

  // Minimum date = tomorrow
  const minDate = (() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().slice(0, 10);
  })();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    try {
      await bookFn({ data: { ...form, timezone } });
      setStatus("success");
      setForm({ name: "", email: "", book: "", date: "", time: "", notes: "" });
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="#top" className="flex items-center gap-2 font-serif text-xl font-semibold">
            <BookOpen className="w-5 h-5 text-accent" />
            Daniel Brown
          </a>
          <nav className="hidden md:flex gap-8 text-sm text-muted-foreground">
            <a href="#services" className="hover:text-foreground transition">Services</a>
            <a href="#how" className="hover:text-foreground transition">Process</a>
            <a href="#about" className="hover:text-foreground transition">About</a>
            <a href="#contact" className="hover:text-foreground transition">Contact</a>
          </nav>
          <Button asChild size="sm" className="bg-foreground text-background hover:bg-foreground/90">
            <a href="#contact">Book a Call</a>
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section id="top" className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 pt-20 pb-24 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium mb-6">
              <Star className="w-3 h-3 fill-accent text-accent" />
              Trusted Goodreads Listopia Specialist
            </div>
            <h1 className="font-serif text-5xl md:text-6xl leading-[1.05] tracking-tight mb-6">
              Get Your Book on the Lists Readers <em className="text-accent not-italic">Actually Browse</em>.
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-lg">
              I help authors rank on Goodreads Listopia — the curated lists thousands of readers use every day to discover their next favorite book.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-foreground text-background hover:bg-foreground/90">
                <a href="#contact">Book a Free Audit <ArrowRight className="w-4 h-4 ml-1" /></a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href="#services">View Services</a>
              </Button>
            </div>
            <div className="flex gap-8 mt-12 pt-8 border-t border-border">
              <div><div className="font-serif text-2xl">500+</div><div className="text-xs text-muted-foreground">Books Ranked</div></div>
              <div><div className="font-serif text-2xl">200+</div><div className="text-xs text-muted-foreground">Lists Covered</div></div>
              <div><div className="font-serif text-2xl">5★</div><div className="text-xs text-muted-foreground">Author Rated</div></div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 bg-[var(--gradient-warm)] rounded-3xl blur-2xl opacity-20" />
            <img
              src={danielImg}
              alt="Daniel Brown, Goodreads Listopia ranking specialist"
              className="relative rounded-3xl w-full object-cover shadow-[var(--shadow-elegant)]"
            />
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-24 bg-secondary/40">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-2xl mb-14">
            <p className="text-sm uppercase tracking-widest text-accent font-medium mb-3">Services</p>
            <h2 className="font-serif text-4xl md:text-5xl tracking-tight">Visibility that converts browsers into readers.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: BookOpen, title: "Listopia Listing", desc: "Strategic placement of your book on the most relevant, high-traffic Listopia lists in your genre." },
              { icon: TrendingUp, title: "Ranking Boost", desc: "Authentic vote-driven campaigns that push your book to the top of curated reader lists." },
              { icon: Target, title: "Genre Targeting", desc: "We identify lists where your ideal readers are already browsing — no wasted reach." },
              { icon: Trophy, title: "Top 10 Placement", desc: "Get your title featured in the first page of results, where 80% of discoveries happen." },
              { icon: Users, title: "Reader Engagement", desc: "Lasting visibility that translates into shelf adds, reviews, and consistent sales." },
              { icon: Star, title: "Reporting & Insights", desc: "Clear weekly updates so you always know how your book is climbing the lists." },
            ].map((s) => (
              <Card key={s.title} className="p-6 border-border bg-card hover:shadow-[var(--shadow-elegant)] transition-shadow">
                <s.icon className="w-6 h-6 text-accent mb-4" />
                <h3 className="font-serif text-xl mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section id="how" className="py-24">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12">
          <div>
            <p className="text-sm uppercase tracking-widest text-accent font-medium mb-3">How It Works</p>
            <h2 className="font-serif text-4xl md:text-5xl tracking-tight mb-6">A simple path to lasting Goodreads visibility.</h2>
            <p className="text-muted-foreground">From the first conversation to seeing your book on top-ranked Listopia lists, the process is transparent, ethical, and built for the long term.</p>
          </div>
          <ol className="space-y-6">
            {[
              ["Discovery Call", "We discuss your book, genre, and target readers."],
              ["List Research", "I curate the most strategic Listopia lists for your title."],
              ["Listing & Voting", "Your book is added and promoted through genuine engagement."],
              ["Track & Report", "You receive ranking updates and visibility insights weekly."],
            ].map(([t, d], i) => (
              <li key={t} className="flex gap-4">
                <div className="shrink-0 w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center font-serif">{i + 1}</div>
                <div>
                  <h3 className="font-serif text-xl mb-1">{t}</h3>
                  <p className="text-sm text-muted-foreground">{d}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-24 bg-secondary/40">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-sm uppercase tracking-widest text-accent font-medium mb-3">About</p>
          <h2 className="font-serif text-4xl md:text-5xl tracking-tight mb-6">Hi, I'm Daniel Brown.</h2>
          <p className="text-lg text-muted-foreground leading-relaxed mb-6">
            Based in the United States, I've spent years helping authors break through the noise of Goodreads. Listopia is one of the most overlooked discovery engines on the platform — and I know exactly how to make it work for your book.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            {["Ethical methods", "Genre expertise", "Transparent reporting", "Real reader reach"].map((b) => (
              <span key={b} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background border border-border">
                <Check className="w-4 h-4 text-accent" /> {b}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-24">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-sm uppercase tracking-widest text-accent font-medium mb-3">Book a Call</p>
            <h2 className="font-serif text-4xl md:text-5xl tracking-tight mb-4">Book your free Listopia audit call.</h2>
            <p className="text-muted-foreground">Pick a time that works — the call lands straight on my calendar and you'll get a confirmation invite by email.</p>
          </div>
          <Card className="p-8 border-border">
            {status === "success" ? (
              <div className="text-center py-8">
                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-accent/15 flex items-center justify-center">
                  <Check className="w-7 h-7 text-accent" />
                </div>
                <h3 className="font-serif text-2xl mb-2">Your audit call is booked.</h3>
                <p className="text-muted-foreground mb-6">
                  Check your inbox — Google Calendar has sent you the invite. I'll see you on the call.
                </p>
                <Button variant="outline" onClick={() => setStatus("idle")}>Book another time</Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <input required placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-3 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
                  <input required type="email" placeholder="Email address" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-3 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <input placeholder="Book title & genre (optional)" value={form.book} onChange={(e) => setForm({ ...form, book: e.target.value })} className="w-full px-4 py-3 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
                <div className="grid md:grid-cols-2 gap-4">
                  <label className="block">
                    <span className="text-xs text-muted-foreground mb-1 block">Preferred date</span>
                    <input required type="date" min={minDate} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full px-4 py-3 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
                  </label>
                  <label className="block">
                    <span className="text-xs text-muted-foreground mb-1 block">Preferred time ({timezone})</span>
                    <input required type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} className="w-full px-4 py-3 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
                  </label>
                </div>
                <textarea rows={4} placeholder="Anything you'd like me to prep for the audit? (optional)" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="w-full px-4 py-3 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
                {status === "error" && (
                  <p className="text-sm text-destructive">{errorMsg}</p>
                )}
                <Button type="submit" size="lg" disabled={status === "loading"} className="w-full bg-foreground text-background hover:bg-foreground/90">
                  {status === "loading" ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Booking your call…</>
                  ) : (
                    <><CalendarIcon className="w-4 h-4 mr-2" /> Book My Audit Call</>
                  )}
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  30-minute call · You'll receive a Google Calendar invite by email.
                </p>
              </form>
            )}
            <div className="mt-8 pt-8 border-t border-border flex flex-wrap gap-6 text-sm text-muted-foreground justify-center">
              <span className="inline-flex items-center gap-2"><Mail className="w-4 h-4 text-accent" /> dannabrownq@gmail.com</span>
              <span className="inline-flex items-center gap-2"><MapPin className="w-4 h-4 text-accent" /> United States</span>
            </div>
          </Card>
        </div>
      </section>

      <footer className="py-8 border-t border-border text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Daniel Brown · Goodreads Listopia Specialist
      </footer>
    </div>
  );
}
