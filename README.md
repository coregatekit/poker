# โป๊กเกอร์อย่างเข้าใจ

เว็บเอกสารกฎ Texas Hold’em ภาษาไทย สร้างด้วย Astro + Starlight พร้อม interactive islands ที่ใช้ game engine ชุดเดียวกันในการประเมินไพ่และแยก side pot

## เริ่มใช้งาน

```bash
npm install
npm run dev
```

เปิด `http://localhost:4321` สำหรับ development

## ตรวจสอบ

```bash
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

## โครงสร้างสำคัญ

- `src/content/docs/` — บทเรียนภาษาไทยทั้งหมด
- `src/components/core/` — Card, Chip, Seat, Table และ CoachTape ที่ใช้ร่วมกัน
- `src/components/interactive/` — โต๊ะทดลองทั้ง 8 แบบ
- `src/engine/engine.ts` — typed evaluator, deck และ side-pot distribution
- `e2e/` — smoke tests ของเส้นทางสำคัญ

ทุก animation เคารพ `prefers-reduced-motion` และทุก control ใช้ได้ด้วยคีย์บอร์ด รองรับหน้าจอแคบถึง 380px

## Deploy

Workflow ใน `.github/workflows/deploy-cloudflare.yml` จะตรวจ unit tests และ build ก่อนเผยแพร่ `dist/` ไป Cloudflare Pages เมื่อ push เข้า `main` ตั้งค่า repository secrets `CLOUDFLARE_API_TOKEN` และ `CLOUDFLARE_ACCOUNT_ID` ก่อนใช้งานครั้งแรก
