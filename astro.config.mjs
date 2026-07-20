import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: 'https://poker-rules-th.pages.dev',
  integrations: [
    react(),
    starlight({
      title: 'โป๊กเกอร์อย่างเข้าใจ',
      description: 'คู่มือกฎ Texas Hold’em ภาษาไทย พร้อมบททดลองแบบโต้ตอบ',
      defaultLocale: 'root',
      locales: { root: { label: 'ไทย', lang: 'th-TH' } },
      customCss: ['./src/styles/tokens.css', './src/styles/global.css'],
      sidebar: [
        { label: 'เริ่มต้น', items: [
          { label: 'ภาพรวม', slug: 'basics/overview' },
          { label: 'อันดับไพ่', slug: 'basics/hand-rankings' },
          { label: 'การแจกไพ่', slug: 'basics/dealing' }
        ]},
        { label: 'ตำแหน่งและลำดับเล่น', items: [
          { label: 'ตำแหน่งบนโต๊ะ', slug: 'positions/table-positions' },
          { label: 'ใครพูดก่อน', slug: 'positions/play-order' },
          { label: 'Heads-up', slug: 'positions/heads-up' }
        ]},
        { label: 'การเดิมพัน', items: [
          { label: 'การตัดสินใจ', slug: 'betting/actions' },
          { label: 'เดิมพันและเรสขั้นต่ำ', slug: 'betting/min-bet-raise' },
          { label: 'สี่รอบเดิมพัน', slug: 'betting/streets' },
          { label: 'รูปแบบลิมิต', slug: 'betting/limits' }
        ]},
        { label: 'เปิดไพ่ตัดสิน', items: [
          { label: 'Showdown', slug: 'showdown/showdown' },
          { label: 'Kicker และการเสมอ', slug: 'showdown/kickers-ties' },
          { label: 'Side pot', slug: 'showdown/side-pots' }
        ]},
        { label: 'เพิ่มเติม', items: [
          { label: 'มารยาทบนโต๊ะ', slug: 'etiquette' },
          { label: 'อภิธานศัพท์', slug: 'glossary' },
          { label: 'โต๊ะทดลอง', slug: 'playground' }
        ]}
      ]
    })
  ]
});
