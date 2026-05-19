"use client"

import { useEffect, useRef, useCallback, useState } from "react"
import { ArrowUp, ArrowDown, MessageCircle, Share2, Bookmark, ExternalLink, Eye, ArrowLeft, ArrowRight } from "lucide-react"

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
          ? "bg-[#FF4500] text-white"
          : sub.tier === 2
            ? "bg-[#FFB800] text-stone-900"
            : "bg-stone-200 text-stone-500"
      const isClickable = sub.tier !== 3
      const rowId = `row-${index}`

      const tr = document.createElement("tr")
      tr.className = `bg-white ${isClickable ? "cursor-pointer hover:bg-[#FFF8F6] transition-colors" : "opacity-50"}`
      if (isClickable) {
        tr.onclick = () => {
          const el = document.getElementById(rowId)
          if (el) el.classList.toggle("expanded")
        }
      }

      tr.innerHTML = `
        <td class="px-6 py-4 font-semibold text-[#1A1A2E] text-sm">${sub.name} ${isClickable ? '<span class="ml-1 text-[10px] text-stone-300">▼</span>' : ""}</td>
        <td class="px-6 py-4 text-stone-400 text-sm">${sub.members.toLocaleString()}</td>
        <td class="px-6 py-4 text-sm text-[#1A1A2E]">${sub.fit}</td>
        <td class="px-6 py-4 text-sm text-stone-400">${sub.strictness}</td>
        <td class="px-6 py-4"><span class="inline-block px-3 py-1.5 rounded-lg text-sm font-bold ${badgeClass}">Tier ${sub.tier}</span></td>
      `
      tbody.appendChild(tr)

      if (isClickable) {
        const trDetails = document.createElement("tr")
        trDetails.id = rowId
        trDetails.className = "bg-[#FFF8F6] border-0"
        trDetails.innerHTML = `
          <td colspan="5" class="p-0">
            <div class="expandable-content px-6 text-sm text-stone-600">
              <div class="p-5 bg-white rounded-lg border border-[#FF4500]/10 mb-2">
                <strong class="text-[#FF4500] block mb-1 text-sm uppercase tracking-wider font-bold">Execution Rule</strong>
                <p class="text-stone-700 leading-relaxed">${sub.details}</p>
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
      item.className = "flex items-center gap-5 p-5 rounded-xl bg-white border border-stone-200 cursor-pointer transition-all duration-200 hover:border-[#FF4500]/30 hover:shadow-sm"
      item.innerHTML = `
        <div class="flex-shrink-0 w-12 h-12 rounded-xl bg-[#1A1A2E] flex items-center justify-center text-white font-bold text-sm">${day.day.substring(0, 3)}</div>
        <div class="flex-grow min-w-0">
          <div class="flex items-center gap-2 mb-1">
            <h4 class="font-semibold text-[#1A1A2E] text-base truncate">${day.sub}</h4>
            <span class="hidden sm:inline text-xs text-stone-400 bg-stone-100 px-2.5 py-0.5 rounded-full font-medium">${day.type}</span>
          </div>
          <p class="text-sm text-stone-500 leading-relaxed">${day.hook}</p>
        </div>
        <div class="flex-shrink-0 w-7 h-7 rounded-full border-2 border-stone-200 flex items-center justify-center transition-all duration-200 checkmark">
          <svg class="w-3 h-3 text-transparent transition-colors duration-200" viewBox="0 0 12 12" fill="none">
            <path d="M2 6l3 3 5-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      `
      item.onclick = () => {
        const circle = item.querySelector(".checkmark") as HTMLElement
        const svg = circle.querySelector("svg") as unknown as HTMLElement
        const isActive = circle.classList.contains("bg-[#FF4500]/10")
        if (isActive) {
          circle.classList.remove("bg-[#FF4500]/10", "border-[#FF4500]/30")
          svg.classList.remove("text-[#FF4500]")
          circle.classList.add("border-stone-200")
          svg.classList.add("text-transparent")
        } else {
          circle.classList.add("bg-[#FF4500]/10", "border-[#FF4500]/30")
          svg.classList.remove("text-transparent")
          svg.classList.add("text-[#FF4500]")
          circle.classList.remove("border-stone-200")
        }
      }
      container.appendChild(item)
    })
  }, [])

  const renderChart = useCallback(() => {
    if (!canvasRef.current) return
    if (chartRef.current) chartRef.current.destroy()

    const labels: string[] = []
    const dataCounts: number[] = []
    const bgColors: string[] = []

    ;[1, 2, 3].forEach((tier) => {
      subreddits.filter((s) => s.tier === tier).sort((a, b) => b.members - a.members).forEach((sub) => {
        labels.push(sub.name)
        dataCounts.push(sub.members)
        bgColors.push(tier === 1 ? "#FF4500" : tier === 2 ? "#FFB800" : "#CCC")
      })
    })

    const ctx = canvasRef.current.getContext("2d")
    if (!ctx) return
    const Chart = (window as any).Chart
    if (!Chart) return

    chartRef.current = new Chart(ctx, {
      type: "bar",
      data: { labels, datasets: [{ data: dataCounts, backgroundColor: bgColors, borderRadius: 4, borderSkipped: false }] },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "#1A1A2E",
            titleColor: "#fff",
            bodyColor: "#ccc",
            cornerRadius: 8,
            padding: 12,
          },
        },
        scales: {
          y: {
            type: "logarithmic",
            grid: { color: "rgba(0,0,0,0.04)" },
            title: { display: true, text: "Members (Log)", color: "#999", font: { size: 11 } },
            ticks: { color: "#999", font: { size: 10 }, callback: (v: any) => v === 10000 || v === 100000 || v === 1000000 || v === 10000000 ? (v / 1000).toLocaleString() + "k" : null },
          },
          x: {
            grid: { display: false },
            ticks: { color: "#999", font: { size: 10 }, maxRotation: 40, minRotation: 40, callback: function (this: any, v: any) { const l = this.getLabelForValue(v); return l.length > 12 ? l.substring(0, 10) + ".." : l } },
          },
        },
      },
    })
  }, [])

  useEffect(() => { renderTable() }, [renderTable])
  useEffect(() => { renderTimeline() }, [renderTimeline])
  useEffect(() => { if (currentSlide === 2) renderChart() }, [currentSlide, renderChart])

  return (
    <>
      <style>{`
        body {
          background-color: #F5F5FA;
          color: #1A1A2E;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Roboto, Arial, sans-serif;
          overflow-x: hidden;
        }
        .chart-container {
          position: relative; width: 100%; max-width: 900px; margin: 0 auto;
          height: 45vh; max-height: 450px; min-height: 300px;
        }
        .slide-container { display: none; }
        .slide-container.active { display: block; animation: fadeUp 0.35s ease-out forwards; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .expandable-content {
          transition: max-height 0.3s ease, padding 0.3s ease, opacity 0.3s ease;
          max-height: 0; opacity: 0; overflow: hidden; padding-top: 0; padding-bottom: 0;
        }
        .expanded .expandable-content {
          max-height: 600px; opacity: 1; padding-top: 0.75rem; padding-bottom: 0.75rem;
        }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #DDD; border-radius: 3px; }
      `}</style>

      {/* Top bar — Reddit-style */}
      <div className="sticky top-0 z-50 bg-white border-b border-stone-200 px-6 sm:px-10">
        <div className="max-w-6xl mx-auto h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#FF4500] flex items-center justify-center">
              <span className="text-white font-bold text-sm">G</span>
            </div>
            <span className="font-bold text-base text-[#1A1A2E] hidden sm:inline">r/GameGrowthNet</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-stone-400">
            <Eye className="w-4 h-4" />
            <span>{currentSlide + 1} / {totalSlides}</span>
          </div>
        </div>
      </div>

      <div className="min-h-screen flex flex-col relative pb-24">
        <main className="flex-grow flex items-center justify-center w-full max-w-6xl mx-auto px-6 sm:px-10 pt-8">

          {/* Arrows */}
          <button onClick={prevSlide} className="fixed left-4 sm:left-8 top-1/2 -translate-y-1/2 z-50 w-12 h-12 flex items-center justify-center rounded-full bg-white border border-stone-200 text-stone-400 hover:text-[#FF4500] hover:border-[#FF4500]/40 transition-all shadow-sm" aria-label="Previous slide">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button onClick={nextSlide} className="fixed right-4 sm:right-8 top-1/2 -translate-y-1/2 z-50 w-12 h-12 flex items-center justify-center rounded-full bg-white border border-stone-200 text-stone-400 hover:text-[#FF4500] hover:border-[#FF4500]/40 transition-all shadow-sm" aria-label="Next slide">
            <ArrowRight className="w-5 h-5" />
          </button>

          {/* SLIDE 0 */}
          <section className={`slide-container w-full ${currentSlide === 0 ? "active" : ""}`}>
            {/* Reddit post card */}
            <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
              <div className="flex">
                {/* Vote column */}
                <div className="w-14 bg-stone-50 flex flex-col items-center py-5 gap-1.5 flex-shrink-0">
                  <ArrowUp className="w-6 h-6 text-stone-300 hover:text-[#FF4500] hover:cursor-pointer transition-colors" />
                  <span className="text-sm font-bold text-[#FF4500]">127</span>
                  <ArrowDown className="w-6 h-6 text-stone-300 hover:text-[#7193FF] hover:cursor-pointer transition-colors" />
                </div>
                {/* Content */}
                <div className="flex-grow p-6 sm:p-8 pt-4">
                  <div className="flex items-center gap-2 text-sm text-stone-400 mb-3">
                    <span className="font-bold text-[#FF4500]">r/GameGrowthNet</span>
                    <span>·</span>
                    <span>Posted by u/strategy_dev</span>
                    <span>·</span>
                    <span>3 hours ago</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-[#1A1A2E] mb-3 leading-tight">The Acquisition Argument</h1>
                  <p className="text-base text-stone-500 leading-relaxed mb-6">
                    Why intent-driven communities are the only viable zero-budget launchpad for <strong className="text-[#1A1A2E]">AI Wolves</strong>.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                    <div className="p-5 sm:p-6 rounded-xl bg-gradient-to-br from-[#1A1A2E] to-[#16213E] text-white">
                      <h2 className="text-base font-bold mb-3 flex items-center gap-1.5">
                        <span className="w-6 h-6 rounded bg-[#FF4500]/20 flex items-center justify-center text-[#FF4500] text-sm">!</span>
                        The Problem
                      </h2>
                      <p className="text-sm text-stone-300 leading-relaxed mb-4">
                        Scrolling platforms (TikTok, IG Reels) capture <em className="text-white font-medium">passive</em> attention. Users are not looking to leave the app. Conversions are abysmal without massive ad spend.
                      </p>
                      <p className="text-sm font-semibold text-[#FF4500] mb-3">The Reddit Advantage:</p>
                      <ul className="space-y-3">
                        <li className="flex items-start gap-2 text-sm text-stone-300">
                          <span className="text-[#FF4500] mt-0.5">✓</span>
                          <span>r/playmygame users actively seek new indie mechanics to test.</span>
                        </li>
                        <li className="flex items-start gap-2 text-sm text-stone-300">
                          <span className="text-[#FF4500] mt-0.5">✓</span>
                          <span>r/AndroidGaming biases premium/free-to-play with zero P2W.</span>
                        </li>
                      </ul>
                    </div>

                    <div className="p-5 sm:p-6 rounded-xl bg-stone-50 border border-stone-200">
                      <h2 className="text-base font-bold text-[#1A1A2E] mb-4 flex items-center gap-1.5">
                        <span className="w-6 h-6 rounded bg-[#FF4500]/10 flex items-center justify-center text-[#FF4500] text-sm">"</span>
                        Market Pulse
                      </h2>
                      <p className="text-sm text-stone-500 mb-4">Players are actively requesting what AI Wolves provides:</p>
                      <div className="space-y-3">
                        <div className="p-4 rounded-lg bg-white border border-stone-100">
                          <div className="text-xs text-stone-400 mb-1.5">r/AndroidGaming · 2d</div>
                          <p className="text-sm text-stone-600 leading-relaxed italic">"I love werewolf games but don't have 8 friends. Public lobbies are full of trolls. Any good single-player version?"</p>
                          <div className="mt-2 text-xs font-bold text-[#FF4500]">→ AI Wolves solves the empty seat problem.</div>
                        </div>
                        <div className="p-4 rounded-lg bg-white border border-stone-100">
                          <div className="text-xs text-stone-400 mb-1.5">r/iosgaming · 1w</div>
                          <p className="text-sm text-stone-600 leading-relaxed italic">"Looking for a deduction game without P2W microtransactions. Raw graphics are fine if mechanics are good."</p>
                          <div className="mt-2 text-xs font-bold text-[#FF4500]">→ Focus on 100% free-to-play model.</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-stone-50 border border-stone-100 text-center">
                    <p className="text-sm text-stone-500"><strong className="text-[#1A1A2E]">Verdict:</strong> Target testing-oriented indie communities (Tier 1). Avoid generalist hubs (r/gaming) and lore spaces (r/werewolf).</p>
                  </div>

                  {/* Action bar */}
                  <div className="flex items-center gap-6 mt-5 pt-4 border-t border-stone-100 text-sm text-stone-400">
                    <button className="flex items-center gap-2 hover:text-[#FF4500] transition-colors">
                      <MessageCircle className="w-5 h-5" /> 24 Comments
                    </button>
                    <button className="flex items-center gap-2 hover:text-[#FF4500] transition-colors">
                      <Share2 className="w-5 h-5" /> Share
                    </button>
                    <button className="flex items-center gap-2 hover:text-[#FF4500] transition-colors">
                      <Bookmark className="w-5 h-5" /> Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SLIDE 1 */}
          <section className={`slide-container w-full ${currentSlide === 1 ? "active" : ""}`}>
            <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
              <div className="p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-6">
                  <div>
                    <div className="text-sm font-bold text-[#FF4500] uppercase tracking-wider mb-1.5">Community Intel</div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-[#1A1A2E]">Community Intelligence Matrix</h2>
                    <p className="text-sm text-stone-500 mt-1.5 max-w-xl">Click Tier 1 and Tier 2 rows to reveal exact rules of engagement.</p>
                  </div>
                  <div className="flex gap-2">
                    {["all", "1", "2", "3"].map((tier) => {
                      const labels: Record<string, string> = { all: "All", "1": "T1", "2": "T2", "3": "T3" }
                      return (
                        <button key={tier} onClick={() => setFilterTier(tier)}
                          className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                            filterTier === tier ? "bg-[#FF4500] text-white" : "bg-stone-100 text-stone-500 hover:bg-stone-200"
                          }`}
                        >
                          {labels[tier]}
                        </button>
                      )
                    })}
                  </div>
                </div>
                <div className="overflow-hidden rounded-lg border border-stone-200">
                  <div className="max-h-[55vh] overflow-y-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-stone-50 text-stone-500 font-bold sticky top-0 z-10">
                        <tr>
                          <th scope="col" className="px-6 py-4">Subreddit</th>
                          <th scope="col" className="px-6 py-4">Members</th>
                          <th scope="col" className="px-6 py-4">Fit</th>
                          <th scope="col" className="px-6 py-4">Rules</th>
                          <th scope="col" className="px-6 py-4">Tier</th>
                        </tr>
                      </thead>
                      <tbody id="matrix-body" className="divide-y divide-stone-100" />
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SLIDE 2 */}
          <section className={`slide-container w-full ${currentSlide === 2 ? "active" : ""}`}>
            <div className="bg-white rounded-xl border border-stone-200 overflow-hidden p-6 sm:p-8">
              <div className="text-center max-w-3xl mx-auto mb-8">
                <div className="text-sm font-bold text-[#FF4500] uppercase tracking-wider mb-1.5">Insight</div>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#1A1A2E] mb-3">The Reach vs. Reality Trap</h2>
                <p className="text-sm text-stone-500 leading-relaxed">
                  Massive communities (red) have strict anti-indie filters. Our strategy targets green and orange pillars — smaller, engaged communities that convert.
                </p>
              </div>
              <div className="chart-container">
                <canvas ref={canvasRef} id="audienceChart" />
              </div>
              <div className="flex justify-center gap-6 mt-5">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-[#FF4500]" />
                  <span className="text-sm text-stone-500">Tier 1</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-[#FFB800]" />
                  <span className="text-sm text-stone-500">Tier 2</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-[#CCC]" />
                  <span className="text-sm text-stone-500">Tier 3</span>
                </div>
              </div>
            </div>
          </section>

          {/* SLIDE 3 */}
          <section className={`slide-container w-full ${currentSlide === 3 ? "active" : ""}`}>
            <div className="bg-white rounded-xl border border-stone-200 overflow-hidden p-6 sm:p-8 max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <div className="text-sm font-bold text-[#FF4500] uppercase tracking-wider mb-1.5">Timeline</div>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#1A1A2E]">Launch Week Protocol</h2>
                <p className="text-sm text-stone-500 mt-1.5">Click items to mark complete. Use exact hooks below.</p>
              </div>
              <div className="space-y-3" id="timeline-container" ref={timelineRef} />
            </div>
          </section>
        </main>

        {/* Dots */}
        <div className="fixed bottom-8 left-0 right-0 flex justify-center items-center gap-3 z-50">
          {[0, 1, 2, 3].map((i) => (
            <button key={i}
              className={`h-3 rounded-full transition-all duration-300 cursor-pointer ${
                currentSlide === i ? "w-8 bg-[#FF4500]" : "w-3 bg-stone-300 hover:bg-stone-400"
              }`}
              onClick={() => goToSlide(i)}
            />
          ))}
        </div>
      </div>

      <script src="https://cdn.jsdelivr.net/npm/chart.js" />
    </>
  )
}
