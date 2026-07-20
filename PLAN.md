# PLAN.md — เว็บเอกสารกฎ Texas Hold'em พร้อม Interactive Animation

> Root project: `/Users/joekim/workspace/github/poker`
> เอกสารนี้เป็นแผนหลักของโปรเจกต์ ใช้ไล่ทำทีละ milestone ได้ (เหมาะกับการสั่งงาน Claude Code ทีละส่วน)

## 1. เป้าหมาย

เว็บเอกสาร (docs site) สอนกฎ Texas Hold'em ภาษาไทย อ่านไล่เป็นบทเรียนได้เหมือน docs ทั่วไป
แต่ทุกหัวข้อสำคัญมี **interactive animation** ฝังในหน้า เพื่อสาธิตกฎที่ข้อความอธิบาย
เช่น อ่านเรื่องลำดับการเล่น → เห็นไฮไลต์วิ่งรอบโต๊ะจริง, อ่านเรื่อง side pot → ลากปรับ stack แล้วดูเงินแยกกองสด

หลักการออกแบบ: **animation ต้องอธิบายกฎ ไม่ใช่ตกแต่ง** ทุกการเคลื่อนไหวผูกกับ state ของ game engine

## 2. Tech Stack

| ส่วน | เลือกใช้ | เหตุผล |
|---|---|---|
| Framework | Astro + Starlight | docs framework สำเร็จรูป (sidebar, TOC, search, dark mode), เนื้อหาเป็น MDX, islands architecture ทำให้หน้าเอกสารเป็น static แต่ hydrate เฉพาะ component ที่ interactive |
| Interactive islands | React + TypeScript | ecosystem กว้าง, reuse ง่าย |
| Animation | Motion (framer-motion เดิม) + CSS transitions | layout animation / AnimatePresence สำหรับชิปวิ่ง ไพ่พลิก; CSS ล้วนสำหรับ transition ง่ายๆ |
| Game logic | `src/engine/engine.ts` (พอร์ตจาก engine.js ที่เทสต์แล้ว) | hand evaluator (best 5 of 7) + side pot distribution ผ่าน unit test 18 ข้อแล้ว ใช้ module เดียวร่วมกันทุก component |
| Unit test | Vitest | พอร์ตเทสต์เดิมมา + เพิ่มเคสใหม่ |
| E2E | Playwright | smoke test interactive หลัก |
| Deploy | Cloudflare Pages หรือ GitHub Pages | static ล้วน |

ข้อกำหนดเพิ่มเติม:
- รองรับ `prefers-reduced-motion` ทุก animation
- ฟอนต์ไทย: `Noto Sans Thai` + fallback ระบบ
- Design tokens ชุดเดียว (`src/styles/tokens.css`): โทน warm minimal — paper `#F1ECE1`, felt sage `#75876F`, ink `#3B372F`, brass `#C1953C`, action sage `#4C6B5B`

## 3. โครงสร้างโปรเจกต์

```
poker/
├── astro.config.mjs
├── package.json
├── tsconfig.json
├── PLAN.md                    # ไฟล์นี้
├── src/
│   ├── content/docs/          # เนื้อหา MDX ทั้งหมด
│   │   ├── index.mdx          # landing: โป๊กเกอร์คืออะไร ภาพรวม
│   │   ├── basics/
│   │   │   ├── overview.mdx       # เป้าหมายเกม, hole cards, community cards
│   │   │   ├── hand-rankings.mdx  # อันดับมือ 10 แบบ + kicker
│   │   │   └── dealing.mdx        # การแจกไพ่, burn card, misdeal
│   │   ├── positions/
│   │   │   ├── table-positions.mdx  # UTG/MP/CO/BTN/SB/BB, early-late
│   │   │   ├── play-order.mdx       # ลำดับการพูด pre-flop vs post-flop
│   │   │   └── heads-up.mdx         # กติกา 2 คน: BTN+SB ควบรวม
│   │   ├── betting/
│   │   │   ├── actions.mdx          # fold/check/bet/call/raise/all-in
│   │   │   ├── min-bet-raise.mdx    # ขั้นต่ำ bet = BB, ขั้นต่ำ raise = last raise size
│   │   │   ├── streets.mdx          # pre-flop/flop/turn/river, เงื่อนไขจบรอบ
│   │   │   └── limits.mdx           # no-limit vs pot-limit vs fixed-limit, table stakes
│   │   ├── showdown/
│   │   │   ├── showdown.mdx         # ลำดับเปิดไพ่, cards speak, play the board
│   │   │   ├── kickers-ties.mdx     # kicker, split pot, เคส flush บนบอร์ด
│   │   │   └── side-pots.mdx        # all-in + การแยก main/side pot
│   │   ├── etiquette.mdx        # string bet, verbal is binding, กฎปลีกย่อย
│   │   ├── glossary.mdx         # ศัพท์ไทย-อังกฤษ
│   │   └── playground.mdx       # simulator เต็มรูปแบบ
│   ├── components/
│   │   ├── core/                # Card.tsx, Chip.tsx, Seat.tsx, Table.tsx, CoachTape.tsx
│   │   └── interactive/         # islands ตามข้อ 4
│   ├── engine/
│   │   ├── engine.ts
│   │   └── engine.test.ts
│   └── styles/tokens.css
└── e2e/
```

## 4. Interactive Components

| # | Component | ฝังที่หน้า | สาธิตอะไร | ความยาก |
|---|---|---|---|---|
| 1 | `HandRankingExplorer` | hand-rankings | การ์ด 10 อันดับ กดแล้วสุ่มไพ่ตัวอย่างใหม่ (animation ไพ่พลิก) + โหมด "ทายมือไหนชนะ" เฉลยด้วย evaluator จริง | ต่ำ |
| 2 | `DealingDemo` | dealing | กด "แจกไพ่" ดูไพ่วิ่งจากสำรับไปที่นั่งทีละใบตามเข็ม เห็น burn ก่อน flop/turn/river | กลาง |
| 3 | `PositionWheel` | table-positions | slider ผู้เล่น 2–9 คน ป้ายตำแหน่งจัดใหม่, กด "มือถัดไป" ปุ่มหมุน, กรณี 2 คนโชว์ BTN+SB ควบรวม | ต่ำ |
| 4 | `PlayOrderStepper` | play-order | step ทีละจังหวะ ไฮไลต์วิ่งจาก UTG (pre-flop) แล้วสลับเป็นเริ่ม SB (post-flop) ให้เห็นจุดพลิก | ต่ำ |
| 5 | `BettingPlayground` | min-bet-raise | ตั้งสถานการณ์ "bet 20 → raise เป็น 60" ผู้อ่านกรอกยอด raise เอง ระบบตัดสินว่าถูกกติกาไหมพร้อมเหตุผล | กลาง |
| 6 | `SidePotVisualizer` | side-pots | ตั้ง stack 3–4 คน ดูเงินแยกเป็นชั้น main/side pot ใช้ `distributePots()` จริง | กลาง |
| 7 | `TieBreakerLab` | kickers-ties | แก้ไพ่ในมือสองฝั่งบนบอร์ดที่กำหนด เห็นสดว่า 5 ใบที่ดีที่สุดของแต่ละคนคือชุดไหน ใบในมือถูกใช้หรือถูกทิ้ง | กลาง |
| 8 | `FullSimulator` | playground | เกมเต็ม: user + บอท 3 ตัว, blinds 5/10, coach tape ภาษาไทย (refactor จาก simulator HTML เดิมเป็น React) | สูง |

ทุกตัวใช้ `core/` ร่วมกัน — ห้ามเขียน Card/Table ซ้ำในแต่ละ island

## 5. Milestones

### M1 — Foundation
- [ ] `npm create astro@latest -- --template starlight` + ตั้งค่า locale ไทย
- [ ] เพิ่ม `@astrojs/react`, `motion`, `vitest`, `playwright`
- [ ] พอร์ต `engine.js` → `src/engine/engine.ts` (typed: `Card`, `HandEval`, `PotResult`)
- [ ] พอร์ต unit tests เดิม 18 ข้อ + เพิ่ม: ties หลายคน, side pot ซ้อน 3 ชั้น, wheel straight edge cases
- [ ] สร้าง `tokens.css` + core components (Card, Chip, Seat, Table, CoachTape)

### M2 — เนื้อหา (ยังไม่มี interaction)
- [ ] เขียน MDX ครบทุกหน้าตามโครงข้อ 3
- [ ] จัด sidebar เรียงเป็นเส้นทางการเรียน: basics → positions → betting → showdown → playground
- [ ] แต่ละหน้ามี "จุดที่คนมักเข้าใจผิด" ปิดท้าย (เช่น มีดอกในมือ ≠ ชนะ flush board, ขั้นต่ำ bet ≠ ขนาด pot)

### M3 — Interactive ชุดแรก (effort ต่ำ คุ้มสุด)
- [ ] HandRankingExplorer
- [ ] PositionWheel
- [ ] PlayOrderStepper

### M4 — Interactive ชุดยาก
- [ ] BettingPlayground
- [ ] SidePotVisualizer
- [ ] TieBreakerLab
- [ ] DealingDemo

### M5 — FullSimulator + เก็บงาน
- [ ] Refactor simulator เดิมเป็น React island (state machine แยกจาก UI)
- [ ] Playwright e2e: เล่นจบ 1 มือ, all-in runout, side pot แสดงถูก
- [ ] Lighthouse ≥ 95 ทุกหน้า, ตรวจ reduced-motion, keyboard focus
- [ ] Deploy (Cloudflare Pages) + README

## 6. Definition of Done ต่อ component

1. ผูกกับ engine จริง ไม่ hardcode ผลลัพธ์
2. มีโหมดช้า/step ได้ ถ้าเป็น animation ต่อเนื่อง
3. เคารพ `prefers-reduced-motion`
4. ใช้งานได้ด้วยคีย์บอร์ด + focus visible
5. Responsive ถึง 380px

