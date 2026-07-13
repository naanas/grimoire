import { SITE_FAQ, SITE_NAME } from '@/lib/seo';

export default function HomeFaq() {
    return (
        <section
            className="w-full max-w-4xl mx-auto px-4 md:px-6 py-12 md:py-16"
            aria-labelledby="faq-heading"
        >
            <div className="text-center mb-8 md:mb-10">
                <p className="text-[10px] md:text-xs font-mono uppercase tracking-[0.35em] text-(--gold-soft) mb-2">
                    FAQ
                </p>
                <h2
                    id="faq-heading"
                    className="text-2xl md:text-3xl font-black text-white font-(family-name:--font-cinzel) tracking-tight"
                >
                    Pertanyaan <span className="gradient-text-mystic">Umum</span>
                </h2>
                <p className="text-sm text-(--text-secondary) mt-2 max-w-xl mx-auto">
                    Jawaban singkat seputar layanan top up game di {SITE_NAME}.
                </p>
            </div>

            <div className="space-y-3">
                {SITE_FAQ.map((item) => (
                    <details
                        key={item.question}
                        className="group glass-panel rounded-2xl border border-white/5 open:border-(--violet)/30 transition-colors"
                    >
                        <summary className="cursor-pointer list-none px-5 py-4 md:px-6 md:py-5 font-bold text-white text-sm md:text-base flex items-center justify-between gap-4">
                            <span>{item.question}</span>
                            <span className="text-(--violet-glow) text-xs shrink-0 group-open:rotate-45 transition-transform">
                                +
                            </span>
                        </summary>
                        <div className="px-5 pb-4 md:px-6 md:pb-5 text-sm text-(--text-secondary) leading-relaxed border-t border-white/5 pt-4">
                            {item.answer}
                        </div>
                    </details>
                ))}
            </div>
        </section>
    );
}
