import React from "react";

const InfoPage = () => {
  return (
    <div className="pt-24 pb-20 px-6 container mx-auto max-w-3xl animate-[aiMessage_0.3s_ease-out] text-dark-100 dark:text-light-100">
      {/* Header */}
      <header className="border-b border-dark-100/10 dark:border-light-100/10 pb-10 mb-12">
        <h1 className="text-4xl font-logo mb-4 tracking-tighter uppercase">
          HUAI
        </h1>
        <p className="text-sm opacity-60 leading-relaxed max-w-xl">
          Hadhramaut University Artificial Intelligence — مشروع جامعي مطور لخدمة
          طلاب جامعة حضرموت في مجالات الحاسوب وتكنولوجيا المعلومات.
        </p>
      </header>

      <div className="space-y-16">
        {/* Section 01: About */}
        <section>
          <h2 className="text-xs uppercase tracking-[0.2em] opacity-40 mb-8 font-bold">
            01 / عن بوت HUAI
          </h2>
          <div className="space-y-6 text-md leading-relaxed">
            <p>
              HUAI هو مشروع جامعي تم تطويره بهدف مساعدة طلاب جامعة حضرموت، خاصة
              في مجال الحاسوب وتكنولوجيا المعلومات.
            </p>
            <p>
              صممه وطوره{" "}
              <span className="font-bold underline underline-offset-4">
                ياسر طارق النهدي
              </span>
              ، طالب السنة الأولى في كلية الحاسبات وتقنية المعلومات، بهدف إنشاء
              أداة ذكية تُمكّن الطلاب من الحصول على إجابات سريعة ودقيقة للأسئلة
              الأكاديمية والبحثية.
            </p>
            <p>
              يطمح HUAI لأن يكون مساعدًا موثوقًا لجميع طلاب الجامعة، ويسهل عليهم
              فهم المواد الدراسية، حل المسائل، وتحسين تجربتهم التعليمية بشكل
              عام.
            </p>
            <p className="text-sm italic opacity-80">
              لمشاهدة مشاريع أخرى:{" "}
              <a
                href="https://yasser811.vercel.app/"
                target="_blank"
                className="underline"
              >
                yasser811.vercel.app
              </a>
            </p>
            <div className="flex gap-6 pt-4 text-xs grayscale opacity-60">
              <a
                href="https://github.com/yasser8111"
                className="hover:opacity-100 hover:underline"
              >
                GITHUB
              </a>
              <a
                href="https://wa.me/967739770762"
                className="hover:opacity-100 hover:underline"
              >
                WHATSAPP
              </a>
              <a
                href="https://www.instagram.com/ysrnhdi811"
                className="hover:opacity-100 hover:underline"
              >
                INSTAGRAM
              </a>
            </div>
          </div>
        </section>

        {/* Section 02: Technology */}
        <section>
          <h2 className="text-xs uppercase tracking-[0.2em] opacity-40 mb-8 font-bold">
            02 / التقنية والموديلات
          </h2>
          <div className="space-y-6 text-md leading-relaxed">
            <p>
              يعتمد HUAI على <strong>Hugging Face Router</strong> للوصول إلى
              أحدث موديلات الذكاء الاصطناعي مفتوحة المصدر مع نظام تبديل ذكي:
            </p>

            <div className="grid grid-cols-1 gap-6 border-t border-dark-100/5 dark:border-light-100/5 pt-6 font-mono text-sm">
              <div className="border-l-2 border-dark-100/20 dark:border-light-100/20 pl-4">
                <span className="block font-bold">FAST: Llama 3.2 3B</span>
                <p className="mt-1 opacity-80 italic">
                  للسرعة العالية والاستفسارات البسيطة.
                </p>
              </div>

              <div className="border-l-2 border-dark-100/20 dark:border-light-100/20 pl-4">
                <span className="block font-bold">SMART: DeepSeek V3</span>
                <p className="mt-1 opacity-80 italic">
                  للتحليل العميق والأسئلة المعقدة.
                </p>
              </div>

              <div className="border-l-2 border-dark-100/20 dark:border-light-100/20 pl-4">
                <span className="block font-bold">
                  CODE: Qwen 2.5 Coder 32B
                </span>
                <p className="mt-1 opacity-80 italic">
                  المتخصص في البرمجة وتحليل الأكواد.
                </p>
              </div>
            </div>

            <p className="pt-4 border-t border-dark-100/5 dark:border-light-100/5">
              يعمل البوت بدون حدود صارمة على عدد الاستفسارات، مما يتيح للطلاب
              إرسال أي عدد من الأسئلة والحصول على إجابات فورية وشروحات تقنية
              واضحة.
            </p>
          </div>
        </section>
      </div>

      <footer className="mt-24 pt-8 border-t border-dark-100/10 dark:border-light-100/10 flex justify-between items-center text-[10px] tracking-widest opacity-30 font-mono uppercase">
        <span>HUAI V3.4 © 2025</span>
        <span>Made by Yasser Al-Nahdi</span>
      </footer>
    </div>
  );
};

export default InfoPage;
