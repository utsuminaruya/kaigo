// scripts/generate-sample-1000.js
const fs = require('fs');
const prefs = [
  { areaPref:'東京都', region:'関東', city_ja:'東京都・新宿区', city_vi:'Quận Shinjuku, Tokyo' },
  { areaPref:'神奈川県', region:'関東', city_ja:'神奈川県・横浜市', city_vi:'TP. Yokohama, Kanagawa' },
  { areaPref:'愛知県', region:'中部', city_ja:'愛知県・名古屋市', city_vi:'TP. Nagoya, Aichi' },
  { areaPref:'大阪府', region:'関西', city_ja:'大阪府・大阪市', city_vi:'TP. Osaka, Osaka' },
  { areaPref:'北海道', region:'北海道', city_ja:'北海道・札幌市', city_vi:'TP. Sapporo, Hokkaido' },
];
const baseTags = ['介護','看護','正社員','パート','日勤のみ','夜勤あり','寮あり','特定技能','JLPT N2','JLPT N3','在留資格変更可','無資格可','未経験歓迎','賞与年2回','資格取得支援','老健','特養','デイ','訪問介護','病院'];
const jobs = [];
for (let i=1;i<=1000;i++){
  const p = prefs[i%prefs.length];
  const tags = Array.from(new Set([baseTags[i%baseTags.length], baseTags[(i+3)%baseTags.length], baseTags[(i+7)%baseTags.length]]));
  jobs.push({
    id: `job-${String(i).padStart(4,'0')}`,
    title_ja: `介護スタッフ ${i}`,
    title_vi: `Nhân viên chăm sóc ${i}`,
    company: `メディフロー ${p.areaPref}${Math.floor(i/10)+1}号`,
    city_ja: p.city_ja, city_vi: p.city_vi, areaPref:p.areaPref, region:p.region,
    tags,
    salary_ja: `月給 ${210000+i}〜${260000+i}円`,
    salary_vi: `Lương ${210000+i}–${260000+i} yên/tháng`,
    visa_friendly: true,
    desc_ja:`仕事内容: 入浴・食事・排泄介助、記録など（サンプル${i}）。`,
    desc_vi:`Nội dung: hỗ trợ tắm/ăn/vệ sinh, ghi chép (mẫu ${i}).`,
    sample:false,
  });
}
fs.mkdirSync('./public',{recursive:true});
fs.writeFileSync('./public/jobs.json', JSON.stringify(jobs,null,2));
console.log('OK 1000件');
