import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Calculator, BookOpen, TrendingUp, DollarSign, Eye, Headphones, Library, Users, Mail, Loader2 } from "lucide-react";
import { emailCalculatorResult } from "@/lib/calculator-email.functions";

type ResultRow = { label: string; value: string; accent?: boolean };
type Inputs = Record<string, string | number>;

const usd = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 });
const num = (n: number) => n.toLocaleString("en-US", { maximumFractionDigits: 0 });

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className="text-xs text-muted-foreground mb-1 block">{label}</span>
      {children}
      {hint && <span className="text-[11px] text-muted-foreground mt-1 block">{hint}</span>}
    </label>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full px-3 py-2 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
    />
  );
}

function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className="w-full px-3 py-2 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
    />
  );
}

function Result({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={`p-4 rounded-md border ${accent ? "border-accent/40 bg-accent/10" : "border-border bg-secondary/50"}`}>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className={`font-serif text-2xl ${accent ? "text-accent" : ""}`}>{value}</div>
    </div>
  );
}

function ResultsPanel({
  calculatorName,
  inputs,
  results,
}: {
  calculatorName: string;
  inputs: Inputs;
  results: ResultRow[];
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const sendFn = useServerFn(emailCalculatorResult);

  const onSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("sending");
    try {
      await sendFn({
        data: {
          email,
          calculator: calculatorName,
          inputs,
          results: results.map((r) => ({ label: r.label, value: r.value })),
        },
      });
      setStatus("sent");
      toast.success("Results sent — check your inbox.");
    } catch (err) {
      console.error(err);
      setStatus("idle");
      toast.error("Couldn't send the email. Please try again.");
    }
  };

  return (
    <div className="space-y-3">
      {results.map((r) => (
        <Result key={r.label} label={r.label} value={r.value} accent={r.accent} />
      ))}
      <form onSubmit={onSend} className="pt-4 border-t border-border space-y-2">
        <label className="text-xs text-muted-foreground block">
          <Mail className="inline w-3.5 h-3.5 mr-1" /> Email a copy of these results
        </label>
        <div className="flex gap-2">
          <Input
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === "sending" || status === "sent"}
          />
          <Button type="submit" disabled={status === "sending" || status === "sent"}>
            {status === "sending" ? <Loader2 className="w-4 h-4 animate-spin" /> : status === "sent" ? "Sent" : "Send"}
          </Button>
        </div>
      </form>
    </div>
  );
}

function CalcShell({
  name,
  inputsNode,
  compute,
}: {
  name: string;
  inputsNode: React.ReactNode;
  compute: () => { inputs: Inputs; results: ResultRow[] };
}) {
  const [state, setState] = useState<{ inputs: Inputs; results: ResultRow[] } | null>(null);

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="space-y-3">
        {inputsNode}
        <Button type="button" onClick={() => setState(compute())} className="w-full mt-2">
          <Calculator className="w-4 h-4 mr-1.5" /> Calculate
        </Button>
      </div>
      <div>
        {state ? (
          <ResultsPanel calculatorName={name} inputs={state.inputs} results={state.results} />
        ) : (
          <div className="h-full min-h-[200px] flex items-center justify-center rounded-md border border-dashed border-border text-sm text-muted-foreground text-center p-6">
            Enter your numbers and press <span className="mx-1 font-medium">Calculate</span> to see results.
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- Amazon KDP Royalties ---------- */
function AmazonRoyalty() {
  const [price, setPrice] = useState(4.99);
  const [format, setFormat] = useState<"ebook" | "paperback">("ebook");
  const [fileMb, setFileMb] = useState(2);
  const [pages, setPages] = useState(250);
  const [printColor, setPrintColor] = useState<"bw" | "color">("bw");
  const [copies, setCopies] = useState(100);

  const compute = () => {
    let per: number; let total: number; let rate: string; const inputs: Inputs = {
      Format: format === "ebook" ? "Kindle eBook" : "Paperback",
      "List price": usd(price),
      "Copies sold": copies,
    };
    if (format === "ebook") {
      const eligible70 = price >= 2.99 && price <= 9.99;
      const delivery = eligible70 ? fileMb * 0.15 : 0;
      const r = eligible70 ? 0.7 : 0.35;
      per = Math.max(0, (price - delivery) * r);
      total = per * copies;
      rate = `${r * 100}%`;
      inputs["File size (MB)"] = fileMb;
    } else {
      const printCost = printColor === "bw" ? 0.85 + 0.012 * pages : 1.0 + 0.07 * pages;
      per = Math.max(0, price * 0.6 - printCost);
      total = per * copies;
      rate = "60%";
      inputs["Pages"] = pages;
      inputs["Interior"] = printColor === "bw" ? "Black & white" : "Color";
    }
    return {
      inputs,
      results: [
        { label: "Royalty rate", value: rate },
        { label: "Royalty per copy", value: usd(per) },
        { label: "Estimated total earnings", value: usd(total), accent: true },
      ],
    };
  };

  return (
    <CalcShell
      name="Amazon Royalties"
      compute={compute}
      inputsNode={
        <>
          <Field label="Format">
          <Select value={format} onChange={(e) => setFormat(e.target.value as "ebook" | "paperback")}>
            <option value="ebook">Kindle eBook</option>
            <option value="paperback">Paperback</option>
          </Select>
        </Field>
        <Field label="List price (USD)">
          <Input type="number" min={0} step={0.01} value={price} onChange={(e) => setPrice(+e.target.value)} />
        </Field>
        {format === "ebook" ? (
          <Field label="File size (MB)" hint="Used for delivery fee at the 70% royalty tier">
            <Input type="number" min={0} step={0.1} value={fileMb} onChange={(e) => setFileMb(+e.target.value)} />
          </Field>
        ) : (
          <>
            <Field label="Page count">
              <Input type="number" min={24} value={pages} onChange={(e) => setPages(+e.target.value)} />
            </Field>
            <Field label="Interior">
              <Select value={printColor} onChange={(e) => setPrintColor(e.target.value as "bw" | "color")}>
                <option value="bw">Black &amp; white</option>
                <option value="color">Color</option>
              </Select>
            </Field>
          </>
        )}
        <Field label="Copies sold">
          <Input type="number" min={0} value={copies} onChange={(e) => setCopies(+e.target.value)} />
        </Field>
        </>
      }
    />
  );
}

/* ---------- Goodreads Ranking → Reach ---------- */
function GoodreadsRanking() {
  const [rank, setRank] = useState(50);
  const [listSize, setListSize] = useState(2000);
  const [monthlyVisitors, setMonthlyVisitors] = useState(15000);

  const compute = () => {
    const c = rank <= 10 ? 0.06 : rank <= 25 ? 0.018 : rank <= 50 ? 0.0065 : rank <= 100 ? 0.0025 : 0.0006;
    const imp = monthlyVisitors * Math.min(1, 200 / Math.max(listSize, 50));
    return {
      inputs: { "Book rank": rank, "List size": listSize, "Monthly visitors": monthlyVisitors },
      results: [
        { label: "Estimated CTR at this rank", value: `${(c * 100).toFixed(2)}%` },
        { label: "Monthly impressions", value: num(imp) },
        { label: "Monthly reader clicks", value: num(imp * c), accent: true },
      ],
    };
  };

  return (
    <CalcShell
      name="Goodreads Ranking"
      compute={compute}
      inputsNode={
        <>
          <Field label="Your book's rank on the list">
            <Input type="number" min={1} value={rank} onChange={(e) => setRank(+e.target.value)} />
          </Field>
          <Field label="Total books on the list">
            <Input type="number" min={1} value={listSize} onChange={(e) => setListSize(+e.target.value)} />
          </Field>
          <Field label="Estimated monthly list visitors" hint="Use 5k for niche lists, 50k+ for popular ones">
            <Input type="number" min={0} value={monthlyVisitors} onChange={(e) => setMonthlyVisitors(+e.target.value)} />
          </Field>
        </>
      }
    />
  );
}

/* ---------- ROI Calculator ---------- */
function ROICalc() {
  const [spend, setSpend] = useState(500);
  const [extraSales, setExtraSales] = useState(120);
  const [royaltyPerSale, setRoyaltyPerSale] = useState(2.05);

  const compute = () => {
    const revenue = extraSales * royaltyPerSale;
    const profit = revenue - spend;
    const roi = spend > 0 ? (profit / spend) * 100 : 0;
    return {
      inputs: { "Campaign spend": usd(spend), "Extra sales": extraSales, "Royalty per sale": usd(royaltyPerSale) },
      results: [
        { label: "Added revenue", value: usd(revenue) },
        { label: "Net profit", value: usd(profit) },
        { label: "ROI", value: `${roi.toFixed(1)}%`, accent: true },
      ],
    };
  };

  return (
    <CalcShell
      name="Campaign ROI"
      compute={compute}
      inputsNode={
        <>
          <Field label="Campaign spend (USD)">
            <Input type="number" min={0} value={spend} onChange={(e) => setSpend(+e.target.value)} />
          </Field>
          <Field label="Additional sales attributed">
            <Input type="number" min={0} value={extraSales} onChange={(e) => setExtraSales(+e.target.value)} />
          </Field>
          <Field label="Royalty per sale (USD)">
            <Input type="number" min={0} step={0.01} value={royaltyPerSale} onChange={(e) => setRoyaltyPerSale(+e.target.value)} />
          </Field>
        </>
      }
    />
  );
}

/* ---------- Visibility Score ---------- */
function VisibilityScore() {
  const [lists, setLists] = useState(5);
  const [avgRank, setAvgRank] = useState(120);
  const [reviews, setReviews] = useState(40);
  const [rating, setRating] = useState(4.3);

  const compute = () => {
    const listScore = Math.min(40, lists * 4);
    const rankScore = Math.max(0, 30 - Math.log10(Math.max(avgRank, 1)) * 10);
    const reviewScore = Math.min(15, Math.log10(reviews + 1) * 8);
    const ratingScore = Math.max(0, ((rating - 3) / 2) * 15);
    const score = Math.round(listScore + rankScore + reviewScore + ratingScore);
    const tier = score >= 80 ? "Excellent" : score >= 60 ? "Strong" : score >= 40 ? "Growing" : "Emerging";
    return {
      inputs: { Lists: lists, "Avg rank": avgRank, Reviews: reviews, Rating: rating },
      results: [
        { label: "Visibility score (0–100)", value: `${score}`, accent: true },
        { label: "Tier", value: tier },
      ],
    };
  };

  return (
    <CalcShell
      name="Visibility Score"
      compute={compute}
      inputsNode={
        <>
          <Field label="Listopia lists you appear on">
            <Input type="number" min={0} value={lists} onChange={(e) => setLists(+e.target.value)} />
          </Field>
          <Field label="Average rank across lists">
            <Input type="number" min={1} value={avgRank} onChange={(e) => setAvgRank(+e.target.value)} />
          </Field>
          <Field label="Goodreads review count">
            <Input type="number" min={0} value={reviews} onChange={(e) => setReviews(+e.target.value)} />
          </Field>
          <Field label="Average star rating">
            <Input type="number" min={1} max={5} step={0.1} value={rating} onChange={(e) => setRating(+e.target.value)} />
          </Field>
        </>
      }
    />
  );
}

/* ---------- Kindle Unlimited Pages ---------- */
function KUCalc() {
  const [pagesRead, setPagesRead] = useState(100000);
  const [rate, setRate] = useState(0.0045);

  const compute = () => ({
    inputs: { "Pages read": pagesRead, "Rate per page": usd(rate) },
    results: [
      { label: "Estimated KU earnings", value: usd(pagesRead * rate), accent: true },
      { label: "Effective per 1,000 pages", value: usd(rate * 1000) },
    ],
  });

  return (
    <CalcShell
      name="KU Pages"
      compute={compute}
      inputsNode={
        <>
          <Field label="KENP pages read">
            <Input type="number" min={0} value={pagesRead} onChange={(e) => setPagesRead(+e.target.value)} />
          </Field>
          <Field label="KENP rate (USD per page)" hint="Recent KDP Select Global Fund rate is ~$0.0045">
            <Input type="number" min={0} step={0.0001} value={rate} onChange={(e) => setRate(+e.target.value)} />
          </Field>
        </>
      }
    />
  );
}

/* ---------- Reach Calculator ---------- */
function ReachCalc() {
  const [lists, setLists] = useState(8);
  const [avgVisitors, setAvgVisitors] = useState(12000);
  const [avgCTR, setAvgCTR] = useState(1.2);

  const compute = () => {
    const monthlyReach = lists * avgVisitors;
    const clicks = (monthlyReach * avgCTR) / 100;
    return {
      inputs: { Lists: lists, "Avg visitors / list": avgVisitors, "Avg CTR (%)": avgCTR },
      results: [
        { label: "Monthly impressions", value: num(monthlyReach) },
        { label: "Estimated reader clicks", value: num(clicks), accent: true },
        { label: "Annual reach", value: num(monthlyReach * 12) },
      ],
    };
  };

  return (
    <CalcShell
      name="Reach"
      compute={compute}
      inputsNode={
        <>
          <Field label="Number of lists featured on">
            <Input type="number" min={0} value={lists} onChange={(e) => setLists(+e.target.value)} />
          </Field>
          <Field label="Average monthly visitors per list">
            <Input type="number" min={0} value={avgVisitors} onChange={(e) => setAvgVisitors(+e.target.value)} />
          </Field>
          <Field label="Average CTR (%)">
            <Input type="number" min={0} step={0.1} value={avgCTR} onChange={(e) => setAvgCTR(+e.target.value)} />
          </Field>
        </>
      }
    />
  );
}

/* ---------- ACX Audiobook Royalties ---------- */
function ACXCalc() {
  const [price, setPrice] = useState(14.95);
  const [exclusivity, setExclusivity] = useState<"exclusive" | "nonexclusive">("exclusive");
  const [sales, setSales] = useState(200);
  const [split, setSplit] = useState<"100" | "50">("100");

  const compute = () => {
    const rate = exclusivity === "exclusive" ? 0.4 : 0.25;
    const authorShare = split === "100" ? 1 : 0.5;
    const per = price * rate * authorShare;
    return {
      inputs: {
        "List price": usd(price),
        Distribution: exclusivity === "exclusive" ? "Exclusive (40%)" : "Non-exclusive (25%)",
        Split: split === "100" ? "100% (PFP)" : "50/50 royalty share",
        Units: sales,
      },
      results: [
        { label: "Royalty per unit", value: usd(per) },
        { label: "Total earnings", value: usd(per * sales), accent: true },
      ],
    };
  };

  return (
    <CalcShell
      name="ACX Audiobook"
      compute={compute}
      inputsNode={
        <>
          <Field label="Audiobook list price (USD)">
            <Input type="number" min={0} step={0.01} value={price} onChange={(e) => setPrice(+e.target.value)} />
          </Field>
          <Field label="Distribution">
            <Select value={exclusivity} onChange={(e) => setExclusivity(e.target.value as "exclusive" | "nonexclusive")}>
              <option value="exclusive">Exclusive (40%)</option>
              <option value="nonexclusive">Non-exclusive (25%)</option>
            </Select>
          </Field>
          <Field label="Producer split">
            <Select value={split} onChange={(e) => setSplit(e.target.value as "100" | "50")}>
              <option value="100">Pay-for-production (you keep 100%)</option>
              <option value="50">Royalty share (50/50 with narrator)</option>
            </Select>
          </Field>
          <Field label="Units sold">
            <Input type="number" min={0} value={sales} onChange={(e) => setSales(+e.target.value)} />
          </Field>
        </>
      }
    />
  );
}

const TABS = [
  { id: "amazon", label: "Amazon Royalties", icon: DollarSign, Comp: AmazonRoyalty, desc: "Kindle eBook and paperback royalties on KDP." },
  { id: "goodreads", label: "Goodreads Ranking", icon: BookOpen, Comp: GoodreadsRanking, desc: "Translate a Listopia rank into impressions and reader clicks." },
  { id: "roi", label: "Campaign ROI", icon: TrendingUp, Comp: ROICalc, desc: "Measure return on a promo or ranking campaign." },
  { id: "visibility", label: "Visibility Score", icon: Eye, Comp: VisibilityScore, desc: "Composite score of list presence, ranking, and social proof." },
  { id: "ku", label: "KU Pages", icon: Library, Comp: KUCalc, desc: "Estimate Kindle Unlimited earnings from KENP pages." },
  { id: "reach", label: "Reach", icon: Users, Comp: ReachCalc, desc: "Cross-list reader reach across the lists you appear on." },
  { id: "acx", label: "ACX Audiobook", icon: Headphones, Comp: ACXCalc, desc: "Audible / ACX exclusive vs non-exclusive royalty payouts." },
] as const;

export function CalculatorsSection() {
  return (
    <section id="calculators" className="py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="max-w-2xl mb-12">
          <p className="text-sm uppercase tracking-widest text-accent font-medium mb-3">Author Toolkit</p>
          <h2 className="font-serif text-4xl md:text-5xl tracking-tight mb-4 flex items-center gap-3">
            <Calculator className="w-9 h-9 text-accent" /> Free author calculators.
          </h2>
          <p className="text-muted-foreground">
            Quick estimates for royalties, rankings, reach, and ROI — built from the same models I use to plan Listopia campaigns.
          </p>
        </div>

        <Card className="p-6 md:p-8 border-border">
          <Tabs defaultValue="amazon">
            <TabsList className="flex flex-wrap h-auto gap-1 bg-secondary/60 p-1">
              {TABS.map((t) => (
                <TabsTrigger key={t.id} value={t.id} className="text-xs md:text-sm">
                  <t.icon className="w-3.5 h-3.5 mr-1.5" /> {t.label}
                </TabsTrigger>
              ))}
            </TabsList>
            {TABS.map((t) => (
              <TabsContent key={t.id} value={t.id} className="mt-6">
                <p className="text-sm text-muted-foreground mb-4">{t.desc}</p>
                <t.Comp />
              </TabsContent>
            ))}
          </Tabs>
        </Card>
      </div>
    </section>
  );
}