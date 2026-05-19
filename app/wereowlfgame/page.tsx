"use client"

import { useEffect, useRef, useCallback, useState } from "react"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight, CheckCircle2, Target, TrendingUp, AlertTriangle, BarChart3, Calendar, ArrowRight } from "lucide-react"

const subreddits = [
  { name: "r/playmygame", members: 120000, fit: "Perfect", strictness: "Moderate", tier: 1, action: "Priority Post", details: "Requires custom 'Make a Post' button. Post Thursday 9AM EST. Angle: Open playtest, free, no P2W, seeking AI feedback." },
  { name: "r/DestroyMyGame", members: 45000, fit: "Perfect", strictness: "Moderate", tier: 1, action: "Priority Post", details: "Brutally honest feedback. Post Tuesday 11AM EST. Needs 45s raw gameplay video of voting. Angle: 'Please destroy the UI and loop.'" },
  { name: "r/indiegaming", members: 1500000, fit: "High", strictness: "Moderate", tier: 1, action: "Priority Post", details: "Strict 10% self-promo rule. Post Wednesday 8AM EST. High-def gameplay compilation. Angle: How tabletop translated to mobile AI." },
  { name: "r/AndroidGaming", members: 405488, fit: "High", strictness: "Very Strict", tier: 2, action: "Post", details: "Requires 30 day old account, 50 karma. Use [DEV] tag. Angle: Unedited 9-player lobby, focus on ad-free/no P2W." },
  { name: "r/iosgaming", members: 280000, fit: "High", strictness: "Very Strict", tier: 2, action: "Post", details: "Saturday ONLY ('Developer Saturday'). Angle: Premium iOS social deduction, direct App store links in comments." },
  { name: "r/indiegames", members: 250000, fit: "High", strictness: "Moderate", tier: 2, action: "Post", details: "No questions in titles. Purely descriptive. Angle: 'AI Wolves - A free mobile social deduction game'. Links in comments." },
  { name: "r/gaming", members: 46000000, fit: "Low", strictness: "Very Strict", tier: 3, action: "Skip", details: "Instant ban for pre-growth mobile apps." },
  { name: "r/Games", members: 3100000, fit: "Low", strictness: "Very Strict", tier: 3, action: "Skip", details: "Major industry news only." },
  { name: "r/boardgames", members: 4000000, fit: "Medium", strictness: "Very Strict", tier: 3, action: "Skip", details: "Hostile to digital adaptations without massive prior karma." },
  { name: "r/gamedev", members: 2500000, fit: "Low", strictness: "Very Strict", tier: 3, action: "Skip", details: "Strictly for dev post-mortems, not consumer ads." },
  { name: "r/werewolf", members: 15000, fit: "Low", strictness: "Relaxed", tier: 3, action: "Skip", details: "Focuses on lore and fiction, zero alignment with game mechanics." },
  { name: "r/mafia", members: 30000, fit: "Low", strictness: "Very Strict", tier: 3, action: "Skip", details: "Real world crime history. Immediate ban." },
  { name: "r/artificial", members: 400000, fit: "Medium", strictness: "Strict", tier: 3, action: "Skip", details: "Macro AI ethics, views games as clutter." },
]

const timelinePlan = [
  { day: "Monday", sub: "Account Warming", type: "Comment Contributions", hook: "Spend 30m writing valuable comments in r/AndroidGaming. No promo." },
  { day: "Tuesday", sub: "r/DestroyMyGame", type: "45s Video Post", hook: "Please destroy the gameplay loop and chat UI of AI Wolves." },
  { day: "Wednesday", sub: "r/indiegaming", type: "Video Post", hook: "Tabletop adapted for mobile: AI fills empty seats. Free to play." },
  { day: "Thursday", sub: "r/playmygame", type: "Text Post + Links", hook: "Seeking playtesters for a free social deduction game. No P2W." },
  { day: "Friday", sub: "Feedback Care", type: "Comment Engagement", hook: "No new threads. Respond to all bug reports and establish transparency." },
  { day: "Saturday", sub: "r/iosgaming", type: "Image Post", hook: "Developer Saturday. Focus on native iOS debate interface." },
  { day: "Sunday", sub: "r/indiegames", type: "Image Post", hook: "Descriptive title only. Links strictly in comments." },
]

function GlassCard({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-white/20 bg-white/70 backdrop-blur-xl shadow-sm shadow-black/[0.03]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

function Dot({ active }: { active: boolean }) {
  return (
    <span className={cn(
      "block rounded-full transition-all duration-500 ease-out",
      active ? "w-8 h-2 bg-[#0071e3]" : "w-2 h-2 bg-black/20"
    )} />
  )
}

export default function WereowlfGame() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [filterTier, setFilterTier] = useState("all")
  const chartRef = useRef<any>(null)
  const timelineRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const totalSlides = 4

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index)
  }, [])

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides)
  }, [])

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides)
  }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prevSlide()
      if (e.key === "ArrowRight") nextSlide()
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [prevSlide, nextSlide])

  const renderTable = useCallback(() => {
    const tbody = document.getElementById("matrix-body")
    if (!tbody) return

    tbody.innerHTML = ""

    const filteredData =
      filterTier === "all"
        ? subreddits
        : subreddits.filter((sub) => sub.tier === Number(filterTier))

    filteredData.forEach((sub, index) => {
      const badgeClass =
        sub.tier === 1
          ? "bg-[#0071e3]/10 text-[#0071e3]"
          : sub.tier === 2
            ? "bg-orange-50 text-orange-600"
            : "bg-red-50 text-red-500"
      const isClickable = sub.tier !== 3
      const rowId = `row-${index}`

      const tr = document.createElement("tr")
      tr.className = cn(
        "bg-transparent transition-colors",
        isClickable ? "cursor-pointer hover:bg-black/[0.02]" : "opacity-40"
      )
      if (isClickable) {
        tr.onclick = () => {
          const el = document.getElementById(rowId)
          if (el) el.classList.toggle("expanded")
        }
      }

      tr.innerHTML = `
        <td class="px-6 py-4 font-medium text-[#1d1d1f]">${sub.name} ${isClickable ? '<span class="ml-1 text-[10px] text-black/30">▼</span>' : ""}</td>
        <td class="px-6 py-4 text-[#86868b]">${sub.members.toLocaleString()}</td>
        <td class="px-6 py-4 font-medium text-[#1d1d1f]">${sub.fit}</td>
        <td class="px-6 py-4 text-sm text-[#86868b]">${sub.strictness}</td>
        <td class="px-6 py-4"><span class="inline-block px-2.5 py-1 rounded-full text-xs font-medium ${badgeClass}">Tier ${sub.tier}</span></td>
      `
      tbody.appendChild(tr)

      if (isClickable) {
        const trDetails = document.createElement("tr")
        trDetails.id = rowId
        trDetails.className = "bg-transparent border-0"
        trDetails.innerHTML = `
          <td colspan="5" class="p-0">
            <div class="expandable-content px-6 text-sm text-[#86868b]">
              <div class="p-5 bg-white/80 backdrop-blur-sm rounded-2xl border border-black/5 mb-3 shadow-sm">
                <strong class="text-[#0071e3] block mb-1 text-xs uppercase tracking-wider font-semibold">Execution Rule</strong>
                <p class="text-[#1d1d1f] leading-relaxed">${sub.details}</p>
              </div>
            </div>
          </td>
        `
        tbody.appendChild(trDetails)
      }
    })
  }, [filterTier])

  const renderTimeline = useCallback(() => {
    const container = document.getElementById("timeline-container")
    if (!container) return

    container.innerHTML = ""

    timelinePlan.forEach((day) => {
      const item = document.createElement("div")
      item.className = "flex items-center gap-4 p-5 rounded-2xl border border-black/[0.04] bg-white/60 backdrop-blur-sm cursor-pointer transition-all duration-300 hover:bg-white/90 hover:border-black/[0.08]"
      item.innerHTML = `
        <div class="flex-shrink-0 w-12 h-12 rounded-full bg-[#0071e3]/10 flex items-center justify-center text-[#0071e3] font-bold text-sm">${day.day.substring(0, 3)}</div>
        <div class="flex-grow min-w-0">
          <div class="flex items-center gap-2 mb-0.5">
            <h4 class="font-semibold text-[#1d1d1f] truncate">${day.sub}</h4>
            <span class="hidden sm:inline text-xs text-[#86868b] bg-black/[0.04] px-2 py-0.5 rounded-full">${day.type}</span>
          </div>
          <p class="text-sm text-[#86868b] leading-relaxed">${day.hook}</p>
        </div>
        <div class="flex-shrink-0 w-6 h-6 rounded-full border-2 border-black/10 flex items-center justify-center transition-all duration-300 checkmark">
          <svg class="w-3 h-3 text-transparent transition-colors duration-300" viewBox="0 0 12 12" fill="none">
            <path d="M2 6l3 3 5-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      `
      item.onclick = () => {
        const circle = item.querySelector(".checkmark") as HTMLElement
        const svg = circle.querySelector("svg") as unknown as HTMLElement
        const isActive = circle.classList.contains("bg-[#0071e3]/20")
        if (isActive) {
          circle.classList.remove("bg-[#0071e3]/20", "border-[#0071e3]/30")
          svg.classList.remove("text-[#0071e3]")
          circle.classList.add("border-black/10")
          svg.classList.add("text-transparent")
        } else {
          circle.classList.add("bg-[#0071e3]/20", "border-[#0071e3]/30")
          svg.classList.remove("text-transparent")
          svg.classList.add("text-[#0071e3]")
          circle.classList.remove("border-black/10")
        }
      }
      container.appendChild(item)
    })
  }, [])

  const renderChart = useCallback(() => {
    if (!canvasRef.current) return

    if (chartRef.current) {
      chartRef.current.destroy()
    }

    const labels: string[] = []
    const dataCounts: number[] = []
    const bgColors: string[] = []

    ;[1, 2, 3].forEach((tier) => {
      subreddits
        .filter((s) => s.tier === tier)
        .sort((a, b) => b.members - a.members)
        .forEach((sub) => {
          labels.push(sub.name)
          dataCounts.push(sub.members)
          bgColors.push(tier === 1 ? "#0071e3" : tier === 2 ? "#f97316" : "#ef4444")
        })
    })

    const ctx = canvasRef.current.getContext("2d")
    if (!ctx) return

    const Chart = (window as any).Chart
    if (!Chart) return

    chartRef.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            data: dataCounts,
            backgroundColor: bgColors,
            borderRadius: 4,
            borderSkipped: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "rgba(255,255,255,0.9)",
            titleColor: "#1d1d1f",
            bodyColor: "#86868b",
            borderColor: "rgba(0,0,0,0.06)",
            borderWidth: 1,
            cornerRadius: 12,
            padding: 12,
            boxPadding: 4,
          },
        },
        scales: {
          y: {
            type: "logarithmic",
            grid: { color: "rgba(0,0,0,0.04)" },
            title: {
              display: true,
              text: "Members (Log)",
              color: "#86868b",
              font: { size: 12 },
            },
            ticks: {
              color: "#86868b",
              font: { size: 11 },
              callback: (v: any) =>
                v === 10000 || v === 100000 || v === 1000000 || v === 10000000
                  ? (v / 1000).toLocaleString() + "k"
                  : null,
            },
          },
          x: {
            grid: { display: false },
            ticks: {
              color: "#86868b",
              font: { size: 11 },
              maxRotation: 40,
              minRotation: 40,
              callback: function (this: any, v: any) {
                const l = this.getLabelForValue(v)
                return l.length > 12 ? l.substring(0, 10) + ".." : l
              },
            },
          },
        },
      },
    })
  }, [])

  useEffect(() => {
    renderTable()
  }, [renderTable])

  useEffect(() => {
    renderTimeline()
  }, [renderTimeline])

  useEffect(() => {
    if (currentSlide === 2) {
      renderChart()
    }
  }, [currentSlide, renderChart])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        * { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'SF Pro Display', system-ui, sans-serif; }

        body {
          background-color: #f5f5f7;
          color: #1d1d1f;
          overflow-x: hidden;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        .chart-container {
          position: relative;
          width: 100%;
          max-width: 900px;
          margin-left: auto;
          margin-right: auto;
          height: 45vh;
          max-height: 450px;
          min-height: 300px;
        }

        .slide-container {
          display: none;
        }

        .slide-container.active {
          display: block;
          animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .expandable-content {
          transition: max-height 0.4s cubic-bezier(0.16, 1, 0.3, 1), padding 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          max-height: 0;
          opacity: 0;
          overflow: hidden;
          padding-top: 0;
          padding-bottom: 0;
        }
        
        .expanded .expandable-content {
          max-height: 600px;
          opacity: 1;
          padding-top: 0.75rem;
          padding-bottom: 0.75rem;
        }
        
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 2px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(0,0,0,0.2); }

        @media (prefers-reduced-motion: reduce) {
          .slide-container.active { animation: none; }
          * { transition-duration: 0.01ms !important; }
        }
      `}</style>

      <div className="min-h-screen flex flex-col relative pb-28" style={{ backgroundColor: "#f5f5f7" }}>
        <div className="w-full pt-8 pb-4 px-8 sm:px-16 flex justify-between items-center">
          <a href="/wereowlfgame" className="text-xl font-bold tracking-tight text-[#1d1d1f] hover:text-[#0071e3] transition-colors duration-300">
            Game GrowthNet
          </a>
          <span className="text-sm text-[#86868b] bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full border border-black/[0.04]">
            Strategy Deck · {currentSlide + 1} / {totalSlides}
          </span>
        </div>

        <main className="flex-grow flex items-center justify-center w-full max-w-6xl mx-auto px-6 sm:px-10 lg:px-14 pt-6">
          <button
            onClick={prevSlide}
            className="fixed left-4 sm:left-8 top-1/2 -translate-y-1/2 z-50 w-12 h-12 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm border border-black/[0.06] text-[#86868b] hover:text-[#1d1d1f] hover:border-black/[0.15] hover:bg-white/95 transition-all duration-300 shadow-sm"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextSlide}
            className="fixed right-4 sm:right-8 top-1/2 -translate-y-1/2 z-50 w-12 h-12 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm border border-black/[0.06] text-[#86868b] hover:text-[#1d1d1f] hover:border-black/[0.15] hover:bg-white/95 transition-all duration-300 shadow-sm"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Slide 0 - The Acquisition Argument */}
          <section className={`slide-container w-full ${currentSlide === 0 ? "active" : ""}`}>
            <div className="text-center max-w-2xl mx-auto mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0071e3]/10 text-[#0071e3] text-xs font-semibold tracking-wide uppercase mb-5">
                <Target className="w-3.5 h-3.5" /> Strategy · Phase 1
              </div>
              <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-[#1d1d1f] mb-4 leading-[1.08]">
                The Acquisition<br/>Argument
              </h1>
              <p className="text-lg text-[#86868b] leading-relaxed max-w-xl mx-auto">
                Why intent-driven communities are the only viable zero-budget launchpad for <strong className="text-[#1d1d1f] font-semibold">AI Wolves</strong>.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <GlassCard className="p-8 lg:p-10">
                <h2 className="text-xl font-semibold text-[#1d1d1f] mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[#0071e3]" />
                  The Problem with Traditional Social
                </h2>
                <p className="text-[#86868b] leading-relaxed mb-5">
                  Scrolling platforms (TikTok, IG Reels) capture <em className="text-[#1d1d1f] font-medium">passive</em> attention. Users there are not looking to leave the app to download a complex social deduction game. Conversions are abysmal without massive paid ad spend.
                </p>
                <p className="text-sm font-semibold text-[#1d1d1f] mb-3">The Reddit Advantage (High Intent):</p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#0071e3] flex-shrink-0 mt-0.5" />
                    <span className="text-[#86868b] text-sm leading-relaxed">Users in r/playmygame are actively searching for new, unpolished indie mechanics to test.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#0071e3] flex-shrink-0 mt-0.5" />
                    <span className="text-[#86868b] text-sm leading-relaxed">Users in r/AndroidGaming heavily bias towards premium/free-to-play titles with zero P2W.</span>
                  </li>
                </ul>
              </GlassCard>

              <GlassCard className="p-8 lg:p-10">
                <h2 className="text-xl font-semibold text-[#1d1d1f] mb-5 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-[#0071e3]" />
                  Market Pulse: Validated Demand
                </h2>
                <p className="text-sm text-[#86868b] mb-6">We analyzed discussions in target niches. Players are actively requesting the exact solution AI Wolves provides:</p>
                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-white/80 backdrop-blur-sm border border-black/[0.04]">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs text-[#86868b]">r/AndroidGaming User</span>
                      <span className="text-[10px] text-black/20">·</span>
                      <span className="text-xs text-black/30">2 days ago</span>
                    </div>
                    <p className="text-sm text-[#1d1d1f] leading-relaxed italic">&ldquo;I love mafia/werewolf games but I don&apos;t have 8 friends available at all times, and public lobbies are full of trolls. Is there a good single-player version?&rdquo;</p>
                    <div className="mt-2 flex items-center gap-1.5">
                      <ArrowRight className="w-3.5 h-3.5 text-[#0071e3]" />
                      <span className="text-xs font-medium text-[#0071e3]">AI Wolves solves the &apos;empty seat&apos; problem.</span>
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/80 backdrop-blur-sm border border-black/[0.04]">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs text-[#86868b]">r/iosgaming User</span>
                      <span className="text-[10px] text-black/20">·</span>
                      <span className="text-xs text-black/30">1 week ago</span>
                    </div>
                    <p className="text-sm text-[#1d1d1f] leading-relaxed italic">&ldquo;Looking for a deduction game that isn&apos;t ruined by pay-to-win microtransactions. Don&apos;t mind raw graphics if the mechanics are good.&rdquo;</p>
                    <div className="mt-2 flex items-center gap-1.5">
                      <ArrowRight className="w-3.5 h-3.5 text-[#0071e3]" />
                      <span className="text-xs font-medium text-[#0071e3]">Focus on our 100% free-to-play model.</span>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </div>

            <GlassCard className="p-6 text-center max-w-3xl mx-auto">
              <h3 className="text-sm font-semibold text-[#1d1d1f] mb-1.5 tracking-wide uppercase">Executive Strategy Verdict</h3>
              <p className="text-[#86868b] text-sm leading-relaxed">
                Target highly structured, testing-oriented indie communities (Tier 1). Strictly avoid generalist hubs (r/gaming) and lore-centric spaces (r/werewolf) to prevent immediate bans and algorithm death.
              </p>
            </GlassCard>
          </section>

          {/* Slide 1 - Community Intelligence Matrix */}
          <section className={`slide-container w-full ${currentSlide === 1 ? "active" : ""}`}>
            <GlassCard className="p-8 lg:p-10 w-full">
              <div className="mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/[0.04] text-[#86868b] text-xs font-semibold tracking-wide uppercase mb-4">
                    <Target className="w-3.5 h-3.5" /> Intelligence
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#1d1d1f] mb-2">
                    Community Intelligence Matrix
                  </h2>
                  <p className="text-[#86868b] max-w-xl text-sm leading-relaxed">
                    The exhaustive breakdown of all evaluated targets. Click Tier 1 and Tier 2 rows to reveal the exact rules of engagement.
                  </p>
                </div>
                <div className="flex gap-2">
                  {["all", "1", "2", "3"].map((tier) => {
                    const labels: Record<string, string> = { all: "All", "1": "Tier 1", "2": "Tier 2", "3": "Tier 3" }
                    return (
                      <button
                        key={tier}
                        onClick={() => setFilterTier(tier)}
                        className={cn(
                          "px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
                          filterTier === tier
                            ? "bg-[#0071e3] text-white shadow-sm"
                            : "bg-black/[0.04] text-[#86868b] hover:bg-black/[0.08]"
                        )}
                      >
                        {labels[tier]}
                      </button>
                    )
                  })}
                </div>
              </div>
              <div className="overflow-hidden rounded-2xl border border-black/[0.04]">
                <div className="max-h-[55vh] overflow-y-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-black/[0.02] text-[#86868b] font-medium sticky top-0 z-10">
                      <tr>
                        <th scope="col" className="px-6 py-4 font-medium">Subreddit</th>
                        <th scope="col" className="px-6 py-4 font-medium">Members</th>
                        <th scope="col" className="px-6 py-4 font-medium">Fit</th>
                        <th scope="col" className="px-6 py-4 font-medium">Rules</th>
                        <th scope="col" className="px-6 py-4 font-medium">Tier</th>
                      </tr>
                    </thead>
                    <tbody id="matrix-body" className="divide-y divide-black/[0.04]" />
                  </table>
                </div>
              </div>
            </GlassCard>
          </section>

          {/* Slide 2 - The Reach vs. Reality Trap */}
          <section className={`slide-container w-full ${currentSlide === 2 ? "active" : ""}`}>
            <GlassCard className="p-8 lg:p-10 w-full">
              <div className="text-center max-w-3xl mx-auto mb-10">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-50 text-red-500 text-xs font-semibold tracking-wide uppercase mb-4">
                  <AlertTriangle className="w-3.5 h-3.5" /> Insight
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#1d1d1f] mb-3">
                  The Reach vs. Reality Trap
                </h2>
                <p className="text-[#86868b] text-sm leading-relaxed max-w-2xl mx-auto">
                  Why we don&apos;t post in the biggest subreddits. Massive communities (Tier 3, Red) have strict anti-indie filters. Our strategy entirely targets the green and orange pillars: smaller, highly engaged communities that actually convert views to downloads.
                </p>
              </div>
              <div className="chart-container">
                <canvas ref={canvasRef} id="audienceChart" />
              </div>
              <div className="flex justify-center gap-6 mt-6">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-sm bg-[#0071e3]" />
                  <span className="text-xs text-[#86868b]">Tier 1 (Focus)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-sm bg-orange-500" />
                  <span className="text-xs text-[#86868b]">Tier 2</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-sm bg-red-500" />
                  <span className="text-xs text-[#86868b]">Tier 3 (Avoid)</span>
                </div>
              </div>
            </GlassCard>
          </section>

          {/* Slide 3 - Launch Week Protocol */}
          <section className={`slide-container w-full ${currentSlide === 3 ? "active" : ""}`}>
            <GlassCard className="p-8 lg:p-10 w-full max-w-4xl mx-auto">
              <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/[0.04] text-[#86868b] text-xs font-semibold tracking-wide uppercase mb-4">
                  <Calendar className="w-3.5 h-3.5" /> Timeline
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#1d1d1f] mb-3">
                  Launch Week Protocol
                </h2>
                <p className="text-[#86868b] text-sm leading-relaxed max-w-xl mx-auto">
                  A staggered deployment to avoid global spam filters. Click to execute. Never copy-paste titles; use the exact hooks prescribed below.
                </p>
              </div>
              <div className="space-y-3" id="timeline-container" ref={timelineRef} />
            </GlassCard>
          </section>
        </main>

        <div className="fixed bottom-8 left-0 right-0 flex justify-center items-center gap-2 z-50">
          {[0, 1, 2, 3].map((i) => (
            <button key={i} onClick={() => goToSlide(i)} className="flex items-center justify-center p-1">
              <Dot active={currentSlide === i} />
            </button>
          ))}
        </div>
      </div>

      <script src="https://cdn.jsdelivr.net/npm/chart.js" />
    </>
  )
}
