# HabitFlow 🔥

> Ứng dụng habit tracker PWA — đẹp, nhanh, chạy offline.

## Stack
- **React 18** + **Vite 5**
- **Tailwind CSS v3**
- **Zustand** (state + localStorage persistence)
- **Day.js** (date utils)

## Cấu trúc dự án

```
habitflow/
├── public/
│   ├── manifest.json       # PWA manifest
│   ├── sw.js               # Service worker
│   ├── icon-192.png
│   └── icon-512.png
├── src/
│   ├── components/
│   │   ├── WeekStrip.jsx       # Dải chọn ngày
│   │   ├── ProgressBar.jsx     # Thanh tiến độ
│   │   ├── HabitCard.jsx       # Card từng habit
│   │   ├── BottomSheet.jsx     # Modal base
│   │   ├── HabitModal.jsx      # Thêm/sửa habit
│   │   ├── TimerModal.jsx      # Timer đếm ngược
│   │   ├── CountModal.jsx      # Đếm số lần
│   │   ├── StatsPage.jsx       # Thống kê
│   │   └── AchievementsPage.jsx# Thành tích
│   ├── store/
│   │   └── useStore.js         # Zustand store
│   ├── utils/
│   │   └── helpers.js          # Utilities
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .github/workflows/
│   └── deploy.yml              # Auto deploy GitHub Pages
├── vite.config.js
├── tailwind.config.js
└── package.json
```

## Chạy local

```bash
npm install
npm run dev
```

## Deploy lên GitHub Pages (tự động)

1. Push code lên GitHub repo
2. Vào **Settings → Pages → Source**: chọn branch `gh-pages`
3. Mỗi khi push lên `main`, GitHub Actions tự build & deploy

Link app: `https://<username>.github.io/<repo-name>`

## Cài lên iPhone

1. Mở link GitHub Pages bằng **Safari**
2. Nhấn nút **Chia sẻ** (□↑)
3. Chọn **"Thêm vào Màn hình chính"**
4. App xuất hiện trên màn hình như app thật ✅
