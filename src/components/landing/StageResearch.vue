<template>
  <section id="research" class="py-24 lg:py-32 reveal bg-white" aria-labelledby="research-heading">
    <div class="max-w-7xl mx-auto px-6 md:px-10 lg:px-12 grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-16 lg:gap-24 items-center">
      <div class="max-w-2xl">
        <div class="inline-flex items-center gap-3 mb-6 px-4 py-2 bg-gray-50 border border-gray-100 rounded-full shadow-sm">
          <span class="text-sm font-semibold text-gray-900">01</span>
          <span class="w-1 h-1 bg-gray-300 rounded-full"></span>
          <span class="text-[13px] font-medium uppercase tracking-widest text-gray-500">Research</span>
        </div>
        <h2 id="research-heading" class="text-[clamp(2rem,4vw+1rem,3rem)] font-semibold tracking-tight leading-[1.15] text-gray-900 mb-6">Instant company intelligence</h2>
        <p class="text-[1.125rem] text-gray-500 mb-10 leading-relaxed font-medium tracking-wide">
          Enter a company name or domain. Our AI agents research across web, news, job boards,
          funding databases, and tech fingerprinting to build a complete profile in 30 seconds.
        </p>

        <div class="flex flex-col sm:flex-row gap-6 mb-10 p-8 bg-[#fafafa] rounded-[1.5rem] border border-gray-100 shadow-[inset_0_2px_10px_rgb(0,0,0,0.02)]">
          <div class="flex-1">
            <h3 class="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-2">Input</h3>
            <p class="text-[14px] text-gray-700 leading-relaxed m-0 font-medium">Company name or domain (e.g., "Stripe" or "stripe.com")</p>
          </div>
          <div class="hidden sm:block w-px bg-gray-200/60"></div>
          <div class="flex-[2]">
            <h3 class="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-2">Process</h3>
            <ul class="flex flex-col gap-3 list-none p-0 m-0">
              <li class="flex items-start gap-3 text-[13px] font-medium text-gray-600 leading-relaxed">
                <span class="shrink-0 mt-1.5 w-1.5 h-1.5 bg-gray-300 rounded-full"></span>
                Web search & company page analysis
              </li>
              <li class="flex items-start gap-3 text-[13px] font-medium text-gray-600 leading-relaxed">
                <span class="shrink-0 mt-1.5 w-1.5 h-1.5 bg-gray-300 rounded-full"></span>
                News API: recent articles, funding, launches
              </li>
              <li class="flex items-start gap-3 text-[13px] font-medium text-gray-600 leading-relaxed">
                <span class="shrink-0 mt-1.5 w-1.5 h-1.5 bg-gray-300 rounded-full"></span>
                Tech fingerprinting: stack, analytics, infra
              </li>
            </ul>
          </div>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div class="flex flex-col items-center justify-center p-5 bg-white border border-gray-100 rounded-[1rem] shadow-sm hover:-translate-y-1 hover:shadow-md transition-all">
            <span class="text-3xl font-semibold tracking-tight text-gray-900 mb-1">30s</span>
            <span class="text-[10px] text-gray-500 uppercase tracking-widest font-medium">vs 4h manual</span>
          </div>
          <div class="flex flex-col items-center justify-center p-5 bg-white border border-gray-100 rounded-[1rem] shadow-sm hover:-translate-y-1 hover:shadow-md transition-all">
            <span class="text-3xl font-semibold tracking-tight text-gray-900 mb-1">12+</span>
            <span class="text-[10px] text-gray-500 uppercase tracking-widest font-medium">Data sources</span>
          </div>
          <div class="flex flex-col items-center justify-center p-5 bg-white border border-gray-100 rounded-[1rem] shadow-sm hover:-translate-y-1 hover:shadow-md transition-all">
            <span class="text-3xl font-semibold tracking-tight text-gray-900 mb-1">95%</span>
            <span class="text-[10px] text-gray-500 uppercase tracking-widest font-medium">Coverage</span>
          </div>
          <div class="flex flex-col items-center justify-center p-5 bg-white border border-gray-100 rounded-[1rem] shadow-sm hover:-translate-y-1 hover:shadow-md transition-all">
            <span class="text-3xl font-semibold tracking-tight text-gray-900 mb-1">Live</span>
            <span class="text-[10px] text-gray-500 uppercase tracking-widest font-medium">Fresh data</span>
          </div>
        </div>
      </div>

      <div class="lg:order-2 max-lg:order-first relative group">
        <div class="absolute -inset-4 bg-gradient-to-tr from-gray-100/50 to-transparent rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl"></div>
        <div class="relative aspect-[4/3] lg:aspect-[4/3.5] rounded-[2rem] border border-gray-100/50 overflow-hidden shadow-[0_20px_60px_rgb(0,0,0,0.08)] bg-white transform transition-transform duration-700 group-hover:-translate-y-2">
          <div class="absolute inset-0 opacity-[0.02] bg-[oklch(0.95_0_0)]"></div>
          <img
            src="/images/stage-research.svg"
            alt="Research output: company summary, industry classification, employee count, tech stack tags, recent news cards, funding info, job posting signals"
            class="relative w-full h-full object-cover mix-blend-multiply"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  </section>
</template>
