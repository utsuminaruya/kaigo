import React, { useMemo, useState, useEffect, useRef } from 'react'
import { Briefcase, MapPin, Languages, CheckCircle2, Building2, Phone, Mail, MessageSquare, MessageCircle } from 'lucide-react'

// ====== 運用定数 ======
const LINE_URL = 'https://lin.ee/vjwhNHU'
const CONTACT_TEL = '042-716-0218'
const CONTACT_MAIL = 'mediflow1002@gmail.com'
const MESSENGER_URL = 'https://www.facebook.com/MediflowKK'
const ADMIN_DEFAULT = false  // trueにすると起動時から編集モード

// ====== 1000件スケール用：/public/jobs.json を自動読込 ======
function generateSampleJobs(n = 20) {
  const prefs = [
    { areaPref: '東京都', region: '関東', city_ja: '東京都・新宿区', city_vi: 'Quận Shinjuku, Tokyo' },
    { areaPref: '神奈川県', region: '関東', city_ja: '神奈川県・横浜市', city_vi: 'TP. Yokohama, Kanagawa' },
    { areaPref: '愛知県', region: '中部', city_ja: '愛知県・名古屋市', city_vi: 'TP. Nagoya, Aichi' },
    { areaPref: '大阪府', region: '関西', city_ja: '大阪府・大阪市', city_vi: 'TP. Osaka, Osaka' },
    { areaPref: '北海道', region: '北海道', city_ja: '北海道・札幌市', city_vi: 'TP. Sapporo, Hokkaido' },
  ]
  const arr = []
  for (let i = 1; i <= n; i++) {
    const p = prefs[i % prefs.length]
    arr.push({
      id: `job-${i.toString().padStart(3,'0')}`,
      title_ja: `介護スタッフ ${i}`,
      title_vi: `Nhân viên chăm sóc ${i}`,
      company: `ケアホーム ${i}`,
      city_ja: p.city_ja,
      city_vi: p.city_vi,
      areaPref: p.areaPref,
      region: p.region,
      tags: ['介護', i % 3 ? '正社員' : 'パート', i % 2 ? 'JLPT N3+' : 'JLPT N2', i % 4 ? '寮あり' : '日勤のみ'],
      salary_ja: `月給 ${230000 + i * 1000}〜${270000 + i * 1000}円`,
      salary_vi: `Lương ${230000 + i * 1000}–${270000 + i * 1000} yên/tháng`,
      visa_friendly: true,
      desc_ja: `仕事内容: 入浴・食事・排泄介助、記録など（サンプル ${i}）。`,
      desc_vi: `Nội dung: hỗ trợ tắm/ăn/vệ sinh, ghi chép (mẫu ${i}).`,
      sample: false,
    })
  }
  return arr
}

// ====== 多言語UI ======
const UI = {
  ja: {
    brand: 'Mediflow',
    heroTitle: '外国人向け介護・医療求人サイト',
    heroBody: '日本全国の求人を日本語・ベトナム語で紹介。LINE/Messengerで簡単登録。',
    searchPlaceholder: 'キーワード例: 介護, N3, 寮あり',
    visaFriendly: 'ビザ支援あり',
    salary: '給与',
    city: '勤務地',
    area: 'エリア',
    region: '地域',
    lineCta: 'LINEで登録',
    lineCtaApply: 'LINEで応募・相談',
    jobs: '求人一覧',
    filters: 'エリア・地域で探す',
    lang: '言語',
    ja: '日本語',
    vi: 'ベトナム語',
    sample: '参考求人（応募不可）',
    disclaimer:
      '※本サイトは求人情報の掲載および職業紹介事業を行っています。参考求人は応募できません。最新条件は募集主へ確認ください。',
    contactOps: '運営連絡先',
  },
  vi: {
    brand: 'Mediflow',
    heroTitle: 'Trang việc làm y tế & điều dưỡng cho người nước ngoài tại Nhật',
    heroBody: 'Thông tin việc làm toàn Nhật bằng tiếng Nhật & Việt. Đăng ký nhanh qua LINE/Messenger.',
    searchPlaceholder: 'Từ khóa: Kaigo, N3, ký túc',
    visaFriendly: 'Hỗ trợ visa',
    salary: 'Lương',
    city: 'Nơi làm việc',
    area: 'Khu vực',
    region: 'Vùng',
    lineCta: 'Đăng ký qua LINE',
    lineCtaApply: 'Tư vấn/Ứng tuyển qua LINE',
    jobs: 'Danh sách việc làm',
    filters: 'Tìm theo khu vực & vùng',
    lang: 'Ngôn ngữ',
    ja: 'Tiếng Nhật',
    vi: 'Tiếng Việt',
    sample: 'Tin tham khảo (không ứng tuyển)',
    disclaimer:
      '※ Trang này cung cấp thông tin tuyển dụng và hoạt động giới thiệu việc làm. Tin tham khảo không thể ứng tuyển. Vui lòng xác nhận điều kiện mới nhất với doanh nghiệp.',
    contactOps: 'Liên hệ Ban vận hành',
  },
}

// エリア/地域フィルタの候補
const FILTERS = [
  { label: 'All', type: 'all', value: 'all' },
  { label: '東京', type: 'pref', value: '東京都' },
  { label: '神奈川', type: 'pref', value: '神奈川県' },
  { label: '関東', type: 'region', value: '関東' },
  { label: '中部', type: 'region', value: '中部' },
  { label: '関西', type: 'region', value: '関西' },
  { label: '北海道', type: 'region', value: '北海道' },
  { label: '東北', type: 'region', value: '東北' },
  { label: '中国', type: 'region', value: '中国' },
  { label: '四国', type: 'region', value: '四国' },
  { label: '九州', type: 'region', value: '九州' },
]

export default function App() {
  const [lang, setLang] = useState('ja')
  const t = UI[lang]
  const [q, setQ] = useState('')
  const [filter, setFilter] = useState(FILTERS[0])
  const [jobsSrc, setJobsSrc] = useState([])
  const [admin, setAdmin] = useState(ADMIN_DEFAULT)
  const loaderRef = useRef(null)

  // 初回：/jobs.json を試し、無ければサンプル20件
  useEffect(() => {
    fetch('/jobs.json')
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => Array.isArray(data) ? setJobsSrc(data) : setJobsSrc(generateSampleJobs()))
      .catch(() => setJobsSrc(generateSampleJobs()))
  }, [])

  const jobs = useMemo(() => {
    const key = q.trim().toLowerCase()
    return jobsSrc.filter((j) => {
      const text = (
        (lang === 'ja' ? (j.title_ja||'') + (j.city_ja||'') + (j.desc_ja||'') : (j.title_vi||'') + (j.city_vi||'') + (j.desc_vi||'')) +
        ' ' + (j.company||'') + ' ' + ((j.tags||[]).join(' ')) + ' ' + (j.salary_ja||'') + ' ' + (j.salary_vi||'') + ' ' + (j.areaPref||'') + ' ' + (j.region||'')
      ).toLowerCase()
      const okKey = key === '' || text.includes(key)
      const okFilter =
        filter.type === 'all' ||
        (filter.type === 'pref' && j.areaPref === filter.value) ||
        (filter.type === 'region' && j.region === filter.value)
      return okKey && okFilter
    })
  }, [q, filter, lang, jobsSrc])

  // ページング（1000件でも軽い） + 自動読み込み
  const [page, setPage] = useState(1)
  const pageSize = 50
  const total = jobs.length
  const pages = Math.max(1, Math.ceil(total / pageSize))
  const shown = useMemo(
    () => jobs.slice(0, Math.min(page * pageSize, jobs.length)),
    [jobs, page, pageSize]
  )
  useEffect(() => { setPage(1) }, [q, filter, lang])

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setPage(p => (p * pageSize < jobs.length ? p + 1 : p))
    }, { rootMargin: '200px' })
    if (loaderRef.current) io.observe(loaderRef.current)
    return () => io.disconnect()
  }, [jobs.length])

  // タグ編集（管理用）
  const updateTags = (id, fn) =>
    setJobsSrc(prev => prev.map(j => j.id === id ? { ...j, tags: fn([...(j.tags||[])]) } : j))
  const removeTag = (id, tag) => updateTags(id, tags => tags.filter(t => t !== tag))
  const addTag = (id, tag) => updateTags(id, tags => {
    const t = (tag||'').trim()
    return t && !tags.includes(t) ? [...tags, t] : tags
  })
  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(jobsSrc, null, 2)], {type:'application/json'})
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob)
    a.download = 'jobs.json'; a.click(); URL.revokeObjectURL(a.href)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-cyan-50 to-white text-slate-800">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur bg-white/70 border-b border-slate-200">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* 画像ロゴ：public/logo.png に配置 */}
            <img src="/logo.png" alt="Mediflow logo" className="h-10 w-auto" />
            <span className="font-bold tracking-wide text-slate-900">{t.brand}</span>
          </div>
          <div className="flex items-center gap-2">
            {/* 言語切替：モバイルでも常に表示 */}
            <div className="flex items-center gap-2 text-sm text-slate-700">
              <Languages className="h-4 w-4" />
              <div className="flex rounded-lg border overflow-hidden">
                <button onClick={()=>setLang('ja')}
                  className={`px-2 py-1 ${lang==='ja'?'bg-teal-600 text-white':'bg-white'}`}>日本語</button>
                <button onClick={()=>setLang('vi')}
                  className={`px-2 py-1 ${lang==='vi'?'bg-teal-600 text-white':'bg-white'}`}>Tiếng Việt</button>
              </div>
            </div>
            <a
              href={LINE_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl px-3 py-2 bg-teal-600 text-white hover:bg-teal-700"
            >
              <MessageSquare className="h-4 w-4" />
              LINE
            </a>
            <a
              href="https://www.facebook.com/MediflowKK"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl px-3 py-2 bg-blue-600 text-white hover:bg-blue-700"
            >
              <MessageCircle className="h-4 w-4" />
              Messenger
            </a>
            <button onClick={()=>setAdmin(a=>!a)} className="px-3 py-2 rounded-xl border">{admin?'編集OFF':'編集ON'}</button>
            {admin && (
              <button onClick={exportJSON} className="px-3 py-2 rounded-xl border">JSONを書き出す</button>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 pt-10 pb-6">
        <div className="grid md:grid-cols-5 gap-6 items-center">
          <div className="md:col-span-3">
            <h1 className="text-3xl md:text-4xl font-extrabold leading-tight text-slate-900">{t.heroTitle}</h1>
            <p className="mt-3 text-slate-600 max-w-2xl">{t.heroBody}</p>
          </div>
          <div className="md:col-span-2">
            <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4 space-y-4">
              <div className="text-base font-semibold text-slate-800">{t.filters}</div>
              <input
                placeholder={t.searchPlaceholder}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="w-full rounded-xl bg-white border border-slate-200 px-3 py-2 placeholder:text-slate-400 outline-none"
              />
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                {FILTERS.map((f) => (
                  <button
                    key={f.label}
                    onClick={() => setFilter(f)}
                    className={`px-3 py-2 text-sm rounded-xl border ${filter.label === f.label ? 'bg-white border-teal-400 text-teal-700' : 'bg-cyan-50 border-cyan-200 text-cyan-700'} hover:bg-white`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Jobs */}
      <main className="mx-auto max-w-6xl px-4 py-8">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-slate-900">
          <Briefcase className="h-5 w-5 text-teal-600" /> {t.jobs}
        </h2>

        <div className="grid md:grid-cols-2 gap-5">
          {shown.map((j) => (
            <div key={j.id} className="rounded-2xl bg-white border border-slate-200 hover:bg-cyan-50 transition-colors">
              <div className="p-5 border-b border-slate-200">
                <div className="text-lg font-bold flex items-center justify-between text-slate-900">
                  <span>{lang === 'ja' ? j.title_ja : j.title_vi}</span>
                  <div className="flex items-center gap-2">
                    {j.sample && (
                      <span className="rounded-xl px-2 py-1 text-xs bg-amber-50 text-amber-700 border border-amber-200">{t.sample}</span>
                    )}
                    {j.visa_friendly && (
                      <span className="rounded-xl px-2 py-1 text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center gap-1">
                        <CheckCircle2 className="h-4 w-4" /> {t.visaFriendly}
                      </span>
                    )}
                  </div>
                </div>
                <div className="mt-1 text-sm text-slate-600 flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-teal-600" /> {j.company}
                </div>
                <div className="text-sm text-slate-600 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-teal-600" /> {lang === 'ja' ? j.city_ja : j.city_vi}
                </div>
                <div className="text-xs text-slate-600 mt-1">
                  <span className="mr-3">{t.area}: {j.areaPref}</span>
                  <span>{t.region}: {j.region}</span>
                </div>
              </div>
              <div className="p-5 space-y-3">
                <p className="text-sm text-slate-700">{lang === 'ja' ? j.desc_ja : j.desc_vi}</p>
                <div className="flex flex-wrap gap-2">
                  {(j.tags||[]).map((tg, idx) => (
                    <span key={idx} className="rounded-xl px-2 py-1 text-xs bg-cyan-50 text-cyan-700 border border-cyan-200">
                      {tg}
                      {admin && (
                        <button onClick={()=>removeTag(j.id, tg)} className="ml-1 text-[10px] text-slate-500">×</button>
                      )}
                    </span>
                  ))}
                  {admin && (
                    <form onSubmit={(e)=>{e.preventDefault(); addTag(j.id, e.currentTarget.tag.value); e.currentTarget.reset()}}
                          className="flex gap-1 items-center">
                      <input name="tag" placeholder="タグ追加" className="text-xs border rounded px-2 py-1" />
                      <button className="text-xs border rounded px-2 py-1">追加</button>
                    </form>
                  )}
                </div>
                <div className="text-sm text-slate-700">
                  <span className="opacity-75 mr-2">{t.salary}:</span>
                  <span>{lang === 'ja' ? j.salary_ja : j.salary_vi}</span>
                </div>
                <div className="pt-2 flex flex-wrap gap-2 text-sm">
                  <a
                    href={LINE_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 rounded-xl px-3 py-2 bg-teal-600 text-white hover:bg-teal-700"
                  >
                    <MessageSquare className="h-4 w-4" /> {j.sample ? t.lineCta : t.lineCtaApply}
                  </a>
                  <a href="https://www.facebook.com/MediflowKK" target="_blank" rel="noreferrer"
                     className="inline-flex items-center gap-1 rounded-xl px-3 py-2 bg-white border border-slate-200 hover:bg-cyan-50">
                    <MessageCircle className="h-4 w-4 text-blue-600" /> Messenger
                  </a>
                  <a href={`tel:${CONTACT_TEL}`} className="inline-flex items-center gap-1 rounded-xl px-3 py-2 bg-white border border-slate-200 hover:bg-cyan-50">
                    <Phone className="h-4 w-4 text-teal-600" /> {CONTACT_TEL}
                  </a>
                  <a href={`mailto:${CONTACT_MAIL}`} className="inline-flex items-center gap-1 rounded-xl px-3 py-2 bg-white border border-slate-200 hover:bg-cyan-50">
                    <Mail className="h-4 w-4 text-teal-600" /> {CONTACT_MAIL}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* さらに読み込む表示 */}
        <div className="mt-6 flex items-center justify-between">
          <span className="text-sm text-slate-600">
            {shown.length} / {total} 件を表示
          </span>
          {shown.length < total && (
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => p + 1)}
                className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-cyan-50"
              >
                さらに{pageSize}件読み込む
              </button>
              <button
                onClick={() => setPage(Math.ceil(total / pageSize))}
                className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-cyan-50"
              >
                すべて表示
              </button>
            </div>
          )}
        </div>

        <div ref={loaderRef} className="h-8" />

        <p className="mt-6 text-xs text-slate-500">{t.disclaimer}</p>
      </main>

      {/* Floating CTA：LINE & Messenger */}
      <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 flex flex-col gap-2">
        <a
          href={LINE_URL}
          target="_blank"
          rel="noreferrer"
          className="rounded-full shadow-lg bg-teal-600 hover:bg-teal-700 text-white px-4 py-3 inline-flex items-center gap-2"
        >
          <MessageSquare className="h-5 w-5" /> LINE
        </a>
        <a
          href="https://www.facebook.com/MediflowKK"
          target="_blank"
          rel="noreferrer"
          className="rounded-full shadow-lg bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 inline-flex items-center gap-2"
        >
          <MessageCircle className="h-5 w-5" /> Messenger
        </a>
      </div>

      {/* Footer */}
      <footer className="py-10 mt-8 border-t border-slate-200">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <p className="text-slate-500 text-sm">© Mediflow — 外国人と日本企業の懸け橋</p>
            <div className="text-xs text-slate-500 flex items-center gap-4">
              <span>{t.contactOps}:</span>
              <a href={`tel:${CONTACT_TEL}`} className="inline-flex items-center gap-1">
                <Phone className="h-4 w-4" /> {CONTACT_TEL}
              </a>
              <a href={`mailto:${CONTACT_MAIL}`} className="inline-flex items-center gap-1">
                <Mail className="h-4 w-4" /> {CONTACT_MAIL}
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
