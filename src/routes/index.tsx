import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { BookOpen, TrendingUp, Star, Mail, MapPin, Check, ArrowRight, Trophy, Users, Target, Calendar as CalendarIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import danielImg from "@/assets/daniel-brown.png";
import caseAlbert from "@/assets/case-albert-loftus.png";
import caseLaurie from "@/assets/case-robert-laurie.png";
import casePuche from "@/assets/case-puche-fernandez.png";
import powerOfFaithCover from "@/assets/power-of-faith-brandon-huffman.png";
import { bookAuditCall } from "@/lib/booking.functions";
import { CalculatorsSection } from "@/components/CalculatorsSection";
import { ExitIntentDialog } from "@/components/ExitIntentDialog";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Goodreads Listopia Rankings & Book Visibility — Dan Brown" },
      { name: "description", content: "Boost your book's discoverability with expert Goodreads Listopia listing and ranking services by Dan Brown." },
      { property: "og:title", content: "Goodreads Listopia Rankings — Dan Brown" },
      { property: "og:description", content: "Get your book on top Goodreads Listopia lists and reach thousands of readers." },
    ],
    links: [
      { rel: "canonical", href: "https://danbrown.lovable.app/" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ProfessionalService",
          name: "Dan Brown — Goodreads Listopia Ranking Specialist",
          description:
            "Expert Goodreads Listopia listing and ranking services that boost book visibility and reach the right readers.",
          areaServed: "Worldwide",
          provider: {
            "@type": "Person",
            name: "Dan Brown",
            jobTitle: "Goodreads Listopia Ranking Specialist",
            email: "mailto:dannabrownq@gmail.com",
            address: { "@type": "PostalAddress", addressCountry: "GB" },
          },
          url: "https://danbrown.lovable.app/",
        }),
      },
    ],
  }),
  component: Index,
});

function Index() {
  const bookFn = useServerFn(bookAuditCall);
  const [form, setForm] = useState({ name: "", email: "", book: "", date: "", time: "", notes: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [timezone, setTimezone] = useState("UTC");
  const [minDate, setMinDate] = useState("");

  useEffect(() => {
    setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);
    const d = new Date();
    d.setDate(d.getDate() + 1);
    setMinDate(d.toISOString().slice(0, 10));
  }, []);

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
            Dan Brown
          </a>
          <nav className="hidden md:flex gap-8 text-sm text-muted-foreground">
            <a href="#services" className="hover:text-foreground transition">Services</a>
            <a href="#how" className="hover:text-foreground transition">Process</a>
            <a href="#results" className="hover:text-foreground transition">Results</a>
            <a href="#calculators" className="hover:text-foreground transition">Calculators</a>
            <a href="#about" className="hover:text-foreground transition">About</a>
            <a href="#contact" className="hover:text-foreground transition">Contact</a>
          </nav>
          <Button asChild size="sm" className="bg-foreground text-background hover:bg-foreground/90">
            <a href="#contact">Book a Call</a>
          </Button>
        </div>
      </header>

      <main>
      {/* Featured Author Spotlight */}
      <section id="spotlight" className="relative overflow-hidden bg-foreground text-background">
        <div className="max-w-6xl mx-auto px-6 pt-12 pb-16 grid md:grid-cols-2 gap-10 items-center">
          <div className="order-2 md:order-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 text-accent text-xs font-medium mb-5">
              <Star className="w-3 h-3 fill-accent text-accent" />
              Featured Author Spotlight
            </div>
            <h2 className="font-serif text-3xl md:text-5xl leading-[1.05] tracking-tight mb-4">
              Brandon Huffman — <em className="text-accent not-italic">The Power of Faith</em>
            </h2>
            <p className="text-base md:text-lg text-background/75 mb-6 max-w-lg">
              Watch this exclusive author spotlight interview with Brandon Huffman and see how
              Listopia visibility turns a single book into a movement of readers.
            </p>
            <div className="aspect-video w-full rounded-xl overflow-hidden shadow-[var(--shadow-elegant)] border border-background/10 mb-6">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/KTmMkKiQHQ8?autoplay=1&playsinline=1&rel=0"
                title="Author Spotlight Interview — Brandon Huffman, The Power of Faith"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                loading="lazy"
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                <a href="https://www.amazon.com/Power-Faith-Brandon-Huffman/dp/B0DHZZJ14W" target="_blank" rel="noopener noreferrer">
                  Get the Book on Amazon <ArrowRight className="w-4 h-4 ml-1" />
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-transparent border-background/30 text-background hover:bg-background/10 hover:text-background">
                <a href="#contact">Get Ranked Like Brandon</a>
              </Button>
            </div>
          </div>
          <div className="order-1 md:order-2 relative">
            <div className="absolute -inset-6 bg-[var(--gradient-warm)] rounded-3xl blur-3xl opacity-30" />
            <a href="https://www.amazon.com/Power-Faith-Brandon-Huffman/dp/B0DHZZJ14W" target="_blank" rel="noopener noreferrer" className="relative block group">
              <img
                src={powerOfFaithCover}
                alt="The Power of Faith by Brandon Huffman — featured author book cover"
                width={640}
                height={960}
                className="relative rounded-2xl w-full max-w-sm mx-auto object-cover shadow-[var(--shadow-elegant)] transition-transform group-hover:-translate-y-1"
              />
              <div className="mt-4 text-center text-sm text-background/70 group-hover:text-background transition">
                Tap the cover to view on Amazon →
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Testimonials / Social Proof */}
      <section id="testimonials" className="py-16 bg-secondary/40 border-y border-border">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/15 text-accent text-xs font-medium mb-4">
              <Star className="w-3 h-3 fill-accent text-accent" />
              Trusted by Authors Worldwide
            </div>
            <h2 className="font-serif text-3xl md:text-4xl tracking-tight mb-3">What Authors Say</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Real results from real authors who trusted the process.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 border-border bg-card">
              <div className="flex items-center gap-1 mb-4">
                {[1,2,3,4,5].map((n) => (<Star key={n} className="w-4 h-4 fill-accent text-accent" />))}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                "Dan got my book from page 5 to #1 on a major Listopia list in under 3 weeks. My shelf adds tripled and I saw a direct spike in Kindle sales."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent font-serif font-bold text-sm">AL</div>
                <div>
                  <p className="text-sm font-medium">Albert Loftus</p>
                  <p className="text-xs text-muted-foreground">Author, <em>The End of the River</em></p>
                </div>
              </div>
            </Card>
            <Card className="p-6 border-border bg-card">
              <div className="flex items-center gap-1 mb-4">
                {[1,2,3,4,5].map((n) => (<Star key={n} className="w-4 h-4 fill-accent text-accent" />))}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                "I had no idea Listopia was this powerful. After the campaign, my book stayed in the top 100 for months. The ROI was incredible."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent font-serif font-bold text-sm">RL</div>
                <div>
                  <p className="text-sm font-medium">Robert Laurie</p>
                  <p className="text-xs text-muted-foreground">Author, <em>A Night to Forget</em></p>
                </div>
              </div>
            </Card>
            <Card className="p-6 border-border bg-card">
              <div className="flex items-center gap-1 mb-4">
                {[1,2,3,4,5].map((n) => (<Star key={n} className="w-4 h-4 fill-accent text-accent" />))}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                "Professional, transparent, and effective. Dan explained every step and delivered results faster than promised. Highly recommend."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent font-serif font-bold text-sm">FJ</div>
                <div>
                  <p className="text-sm font-medium">Francisco J. Puche</p>
                  <p className="text-xs text-muted-foreground">Author, <em>Más Allá del Ictus</em></p>
                </div>
              </div>
            </Card>
          </div>
          {/* Credibility Signals */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { num: "500+", label: "Books Ranked" },
              { num: "200+", label: "Lists Covered" },
              { num: "98%", label: "Success Rate" },
              { num: "4.9★", label: "Average Rating" },
            ].map((s) => (
              <div key={s.label} className="p-4 rounded-xl bg-background border border-border">
                <div className="font-serif text-2xl md:text-3xl text-foreground mb-1">{s.num}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Awards & Badges */}
      <section id="awards" className="py-20 bg-[#0a0a0f] relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(192,192,192,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(212,175,55,0.06) 0%, transparent 50%)'}} />
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/15 text-accent text-xs font-medium mb-4">
              <Trophy className="w-3 h-3 fill-accent text-accent" />
              Industry Recognition
            </div>
            <h2 className="font-serif text-3xl md:text-4xl tracking-tight mb-3 text-white">Awards & Accolades</h2>
            <p className="text-white/50 max-w-xl mx-auto">Recognized by authors and industry platforms for consistent excellence in book visibility.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-5">
            {/* Platinum */}
            <div className="group flex flex-col items-center text-center">
              <div className="relative w-24 h-24 md:w-28 md:h-28 mb-4">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#e5e7eb] via-[#9ca3af] to-[#4b5563] shadow-[0_8px_30px_rgba(229,231,235,0.25)]" />
                <div className="absolute inset-[3px] rounded-full bg-gradient-to-br from-[#f3f4f6] via-[#d1d5db] to-[#6b7280] flex items-center justify-center">
                  <Trophy className="w-9 h-9 md:w-10 md:h-10 text-[#374151] drop-shadow-sm" />
                </div>
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-[#111827] border border-[#6b7280] text-[10px] font-bold text-[#e5e7eb] uppercase tracking-wider shadow-lg">Platinum</div>
              </div>
              <h3 className="text-sm font-semibold text-white mb-0.5">Listopia Elite Ranker</h3>
              <p className="text-xs text-white/40">2024</p>
            </div>
            {/* Gold */}
            <div className="group flex flex-col items-center text-center">
              <div className="relative w-24 h-24 md:w-28 md:h-28 mb-4">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#fde047] via-[#eab308] to-[#a16207] shadow-[0_8px_30px_rgba(234,179,8,0.3)]" />
                <div className="absolute inset-[3px] rounded-full bg-gradient-to-br from-[#fef08a] via-[#facc15] to-[#ca8a04] flex items-center justify-center">
                  <Star className="w-9 h-9 md:w-10 md:h-10 text-[#713f12] drop-shadow-sm" />
                </div>
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-[#422006] border border-[#ca8a04] text-[10px] font-bold text-[#fde047] uppercase tracking-wider shadow-lg">Gold</div>
              </div>
              <h3 className="text-sm font-semibold text-white mb-0.5">Top 100 Champion</h3>
              <p className="text-xs text-white/40">2023</p>
            </div>
            {/* Silver */}
            <div className="group flex flex-col items-center text-center">
              <div className="relative w-24 h-24 md:w-28 md:h-28 mb-4">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#e5e7eb] via-[#9ca3af] to-[#6b7280] shadow-[0_8px_30px_rgba(156,163,175,0.25)]" />
                <div className="absolute inset-[3px] rounded-full bg-gradient-to-br from-[#f3f4f6] via-[#d1d5db] to-[#9ca3af] flex items-center justify-center">
                  <Target className="w-9 h-9 md:w-10 md:h-10 text-[#4b5563] drop-shadow-sm" />
                </div>
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-[#1f2937] border border-[#9ca3af] text-[10px] font-bold text-[#e5e7eb] uppercase tracking-wider shadow-lg">Silver</div>
              </div>
              <h3 className="text-sm font-semibold text-white mb-0.5">Genre Dominator</h3>
              <p className="text-xs text-white/40">2023</p>
            </div>
            {/* Bronze */}
            <div className="group flex flex-col items-center text-center">
              <div className="relative w-24 h-24 md:w-28 md:h-28 mb-4">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#fdba74] via-[#f97316] to-[#9a3412] shadow-[0_8px_30px_rgba(249,115,22,0.25)]" />
                <div className="absolute inset-[3px] rounded-full bg-gradient-to-br from-[#fed7aa] via-[#fb923c] to-[#c2410c] flex items-center justify-center">
                  <TrendingUp className="w-9 h-9 md:w-10 md:h-10 text-[#7c2d12] drop-shadow-sm" />
                </div>
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-[#431407] border border-[#c2410c] text-[10px] font-bold text-[#fdba74] uppercase tracking-wider shadow-lg">Bronze</div>
              </div>
              <h3 className="text-sm font-semibold text-white mb-0.5">Rising Star Award</h3>
              <p className="text-xs text-white/40">2022</p>
            </div>
            {/* Diamond / Special */}
            <div className="group flex flex-col items-center text-center">
              <div className="relative w-24 h-24 md:w-28 md:h-28 mb-4">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#a78bfa] via-[#7c3aed] to-[#4c1d95] shadow-[0_8px_30px_rgba(124,58,237,0.3)]" />
                <div className="absolute inset-[3px] rounded-full bg-gradient-to-br from-[#c4b5fd] via-[#8b5cf6] to-[#5b21b6] flex items-center justify-center">
                  <Users className="w-9 h-9 md:w-10 md:h-10 text-[#2e1065] drop-shadow-sm" />
                </div>
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-[#2e1065] border border-[#8b5cf6] text-[10px] font-bold text-[#ddd6fe] uppercase tracking-wider shadow-lg">Diamond</div>
              </div>
              <h3 className="text-sm font-semibold text-white mb-0.5">500+ Club Member</h3>
              <p className="text-xs text-white/40">2024</p>
            </div>
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

      {/* Results / Proof of Work */}
      <section id="results" className="py-24 bg-secondary/40">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-2xl mb-14">
            <p className="text-sm uppercase tracking-widest text-accent font-medium mb-3">Proof of Work</p>
            <h2 className="font-serif text-4xl md:text-5xl tracking-tight mb-4">Real books, real rankings.</h2>
            <p className="text-muted-foreground">Before-and-after snapshots from recent Goodreads Listopia campaigns — each book climbed thousands of positions into the front pages readers actually browse.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                img: caseAlbert,
                title: "The End of the River",
                author: "Albert Loftus",
                from: "#5,149",
                to: "#99",
                note: "Climbed into the top 100 of an AAPI Heritage Month list with 50+ supporting votes.",
              },
              {
                img: caseLaurie,
                title: "A Night to Forget",
                author: "Robert Laurie",
                from: "#8,462",
                to: "#96",
                note: "Broke into the top 100 of Big Books of Spring with 70+ reader votes.",
              },
              {
                img: casePuche,
                title: "Más Allá del Ictus",
                author: "Francisco Javier Puche Fernández",
                from: "#2,573",
                to: "#130",
                note: "Surged from page 26 onto page 2 of a biography & memoir list.",
              },
            ].map((c) => (
              <Card key={c.title} className="overflow-hidden border-border bg-card hover:shadow-[var(--shadow-elegant)] transition-shadow">
                <div className="aspect-[16/10] overflow-hidden bg-muted">
                  <img
                    src={c.img}
                    alt={`Before and after Goodreads Listopia ranking for ${c.title} by ${c.author}`}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-serif text-xl mb-1">{c.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">by {c.author}</p>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-xs px-2 py-1 rounded-full bg-secondary text-secondary-foreground">From {c.from}</span>
                    <ArrowRight className="w-3 h-3 text-accent" />
                    <span className="text-xs px-2 py-1 rounded-full bg-accent/15 text-accent font-medium">To {c.to}</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{c.note}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Calculators */}
      <CalculatorsSection />

      {/* About */}
      <section id="about" className="py-24 bg-secondary/40">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-sm uppercase tracking-widest text-accent font-medium mb-3">About</p>
          <h2 className="font-serif text-4xl md:text-5xl tracking-tight mb-6">Hi, I'm Dan Brown.</h2>
          {/* anchor */}
          <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          Based in the United Kingdom, I've spent years helping authors break through the noise of Goodreads. Listopia is one of the most overlooked discovery engines on the platform — and I know exactly how to make it work for your book.
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
                  <input id="booking-name" name="name" aria-label="Your name" required placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-3 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
                  <input id="booking-email" name="email" aria-label="Email address" required type="email" placeholder="Email address" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-3 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <input id="booking-book" name="book" aria-label="Book title and genre (optional)" placeholder="Book title & genre (optional)" value={form.book} onChange={(e) => setForm({ ...form, book: e.target.value })} className="w-full px-4 py-3 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
                <div className="grid md:grid-cols-2 gap-4">
                  <label className="block">
                    <span className="text-xs text-muted-foreground mb-1 block">Preferred date</span>
                    <input id="booking-date" name="date" aria-label="Preferred date" required type="date" min={minDate} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full px-4 py-3 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
                  </label>
                  <label className="block">
                    <span className="text-xs text-muted-foreground mb-1 block">Preferred time ({timezone})</span>
                    <input id="booking-time" name="time" aria-label="Preferred time" required type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} className="w-full px-4 py-3 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
                  </label>
                </div>
                <textarea id="booking-notes" name="notes" aria-label="Notes for the audit (optional)" rows={4} placeholder="Anything you'd like me to prep for the audit? (optional)" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="w-full px-4 py-3 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
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
              <span className="inline-flex items-center gap-2"><Mail className="w-4 h-4 text-accent" /><span>dannabrownq@gmail.com</span></span>
              <span className="inline-flex items-center gap-2"><MapPin className="w-4 h-4 text-accent" /><span>United Kingdom</span></span>
            </div>
          </Card>
        </div>
      </section>
      </main>

      <footer className="py-8 border-t border-border text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Dan Brown · Goodreads Listopia Specialist
      </footer>
      <ExitIntentDialog />
    </div>
  );
}
