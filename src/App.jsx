import { useEffect, useMemo, useState } from "react"

// ====== 設定（必要に応じて変更） ======
const LINE_URL = "https://lin.ee/xxxx"   // あなたのLINE公式URL
const CONTACT_TEL = "000-0000-0000"
const CONTACT_MAIL = "info@example.com"

// シンプルな求人カード（外部コンポーネント不要）
function JobCard({ job, lang = "ja" }) {
  const title = lang === "ja" ? job.title_ja : job.title_vi
  const city = lang === "ja" ? job.city_ja : job.city_vi
  const salary = lang === "ja" ? job.salary_ja : job.salary_vi
  const desc = lang === "ja" ? job.desc_ja : job.desc_vi

  return (
    <div className="rounded-2xl border shadow-sm p-4 bg-white">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-lg font-bold">{title}</h3>
        <span className="text-xs px-2 py-1 rounded-full border">
          {job.region}・{job.areaPref}
        </span>
      </div>
      <div className="mt-1 text-sm text-gray-600">{job.company}</div>
      <div className="mt-1 text-sm">{city}</div>

      <div className="mt-2 font-semibold">{salary}</div>

      <div className="mt-2 flex flex-wrap gap-2">
        {job.tags?.map((t) => (
          <span
            key={t}
            className="text-xs px-2 py-1 rounded-full border bg-gray-50"
          >
            {t}
          </span>
        ))}
      </div>

      <p className="mt-3 text-sm leading-relaxed line-clamp-3">{desc}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        <a
          href={LINE_URL}
          target="_blank"
          rel="noreferrer"
          className="px-3 py-2 rounded-xl bg-green-600 text-white hover:opacity-90"
        >
          LINEで応募
        </a>
        <a
          href={`tel:${CONTACT_TEL}`}
          className="px-3 py-2 rounded-xl border hover:bg-gray-50"
        >
          電話する
        </a>
        <a
          href={`mailto:${CONTACT_MAIL}`}
          className="px-3 py-2 rounded-xl border hover:bg-gray-50"
        >
          メール
        </a>
      </div>
    </div>
  )
}

export default function App() {
  const [lang, setLang] = useState("ja")       // "ja" or "vi"
  const [jobs, setJobs] = useState([])         // 全求人
  const [page, setPage] = useState(1)          // 現在のページ（累積）
  const pageSize = 50                           // 1回で増える件数（50/100などに調整可）

  // jobs.json を読み込み
  useEffect(() => {
    fetch("/jobs.json")
      .then((r) => r.json())
      .then((data) => setJobs(Array.isArray(data) ? data : []))
      .catch(() => setJobs([]))
  }, [])

  const total = jobs.length

  // ★修正ポイント：累積表示（pageが進むたび 0..page*pageSize を表示）
  const shown = useMemo(() => {
    const end = Math.min(page * pageSize, total)
    return jobs.slice(0, end)
  }, [jobs, page, pageSize, total])

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* ヘッダー */}
      <header className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Mediflow" className="w-28 h-auto" />
          <div>
            <h1 className="text-2xl font-bold">
              {lang === "ja" ? "医療・介護 求人一覧" : "Danh sách việc làm y tế/điều dưỡng"}
            </h1>
            <p className="text-sm text-gray-600">
              {lang === "ja"
                ? "条件で絞り込み、LINEで簡単応募。"
                : "Lọc theo điều kiện và ứng tuyển qua LINE."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setLang((v) => (v === "ja" ? "vi" : "ja"))}
            className="px-3 py-2 rounded-xl border hover:bg-gray-50"
          >
            {lang === "ja" ? "Tiếng Việt" : "日本語"}
          </button>
          <a
            href={LINE_URL}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 rounded-xl bg-green-600 text-white hover:opacity-90"
          >
            {lang === "ja" ? "LINEで相談" : "Tư vấn qua LINE"}
          </a>
        </div>
      </header>

      {/* 件数表示 */}
      <div className="mb-3 text-sm text-gray-600">
        {lang === "ja"
          ? `${shown.length} / ${total} 件を表示`
          : `Đang hiển thị ${shown.length} / ${total}`}
      </div>

      {/* 一覧 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {shown.map((job) => (
          <JobCard key={job.id} job={job} lang={lang} />
        ))}
      </div>

      {/* “さらに読み込む / すべて表示” */}
      {page * pageSize < total && (
        <div className="flex items-center justify-center gap-3 my-8">
          <button
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 rounded-2xl shadow border bg-white hover:bg-gray-50"
          >
            {lang === "ja" ? `さらに${pageSize}件読み込む` : `Tải thêm ${pageSize}`}
          </button>
          <button
            onClick={() => setPage(Math.ceil(total / pageSize))}
            className="px-4 py-2 rounded-2xl shadow border bg-white hover:bg-gray-50"
          >
            {lang === "ja" ? "すべて表示" : "Hiển thị tất cả"}
          </button>
        </div>
      )}

      {/* フッター */}
      <footer className="mt-10 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} Mediflow. {lang === "ja" ? "すべての権利を保有します。" : "Bảo lưu mọi quyền."}
      </footer>
    </div>
  )
}
