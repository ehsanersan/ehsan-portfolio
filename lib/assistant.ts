import { faqs, services } from "./content";
const normalize = (s: string) =>
  s
    .trim()
    .replace(/ي/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/[\u200c\u200f]/g, " ")
    .toLowerCase();
export function answerQuestion(question: string) {
  const q = normalize(question);
  const exact = faqs.find((f) => normalize(f.q) === q);
  if (exact) return { answer: exact.a, fallback: false };
  if (/مستقیم|انسان|احسان|واتس|تماس/.test(q))
    return {
      answer:
        "می‌توانید مستقیم تماس بگیرید، در واتس‌اپ پیام بدهید یا درخواست مشاوره ثبت کنید.",
      fallback: true,
    };
  const match = faqs
    .map((f) => ({
      f,
      score: f.keys.reduce((n, k) => n + (q.includes(normalize(k)) ? 1 : 0), 0),
    }))
    .sort((a, b) => b.score - a.score)[0];
  if (match?.score) return { answer: match.f.a, fallback: false };
  const s = services.find((s) => q.includes(normalize(s.category)));
  if (s) return { answer: s.body, fallback: false };
  return {
    answer:
      "برای این سؤال پاسخ قطعی در اطلاعات فعلی ندارم. لطفاً درخواست مشاوره ثبت کنید یا مستقیم با احسان گفت‌وگو کنید.",
    fallback: true,
  };
}
