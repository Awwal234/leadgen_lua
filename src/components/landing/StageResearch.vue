<template>
  <section id="research" class="py-20 md:py-24 lg:py-32 reveal" aria-labelledby="research-heading">
    <div class="max-w-7xl mx-auto px-6 md:px-10 lg:px-12">
      <div class="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-10 lg:gap-16 items-start">
        <div>
          <div class="pt-4">
            <span class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-500 bg-gray-100 rounded-full mb-4">
              <strong class="font-display text-lg font-bold text-black">01</strong>
              <span>Research</span>
            </span>
            <h2 id="research-heading" class="font-display text-[clamp(1.75rem,3vw+0.5rem,2.5rem)] font-semibold leading-tight text-gray-900 mb-4">Instant company intelligence</h2>
            <p class="text-lg text-gray-500 mb-10 max-w-[60ch] leading-relaxed">
              Enter a company name or domain. Our AI agents research across web, news, job boards,
              funding databases, and tech fingerprinting to build a complete profile in 30 seconds.
            </p>

            <div class="mb-8">
              <h3 class="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-2">Input</h3>
              <p class="text-base text-gray-700">Company name or domain (e.g., "Stripe" or "stripe.com")</p>
            </div>

            <div class="mb-8">
              <h3 class="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-2">Process</h3>
              <ul class="grid grid-cols-1 sm:grid-cols-2 gap-2 list-none p-0 m-0">
                <li class="flex items-center gap-2 text-sm text-gray-700 py-2 px-3 bg-gray-100 rounded-md before:w-[6px] before:h-[6px] before:bg-black before:rounded-full before:shrink-0">Web search & company page analysis</li>
                <li class="flex items-center gap-2 text-sm text-gray-700 py-2 px-3 bg-gray-100 rounded-md before:w-[6px] before:h-[6px] before:bg-black before:rounded-full before:shrink-0">News API: recent articles, funding, launches</li>
                <li class="flex items-center gap-2 text-sm text-gray-700 py-2 px-3 bg-gray-100 rounded-md before:w-[6px] before:h-[6px] before:bg-black before:rounded-full before:shrink-0">Job boards (Greenhouse, Lever): hiring signals</li>
                <li class="flex items-center gap-2 text-sm text-gray-700 py-2 px-3 bg-gray-100 rounded-md before:w-[6px] before:h-[6px] before:bg-black before:rounded-full before:shrink-0">Tech fingerprinting: stack, analytics, infra</li>
                <li class="flex items-center gap-2 text-sm text-gray-700 py-2 px-3 bg-gray-100 rounded-md before:w-[6px] before:h-[6px] before:bg-black before:rounded-full before:shrink-0">Funding data: rounds, investors, valuation</li>
              </ul>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-4 gap-6">
              <div class="flex flex-col items-center gap-1 p-4 bg-white border border-gray-200 rounded-lg text-center">
                <span class="font-display text-3xl font-bold leading-tight text-gray-900">30 sec</span>
                <span class="text-xs text-gray-500 uppercase tracking-wider">vs 4 hrs manual</span>
              </div>
              <div class="flex flex-col items-center gap-1 p-4 bg-white border border-gray-200 rounded-lg text-center">
                <span class="font-display text-3xl font-bold leading-tight text-gray-900">12+</span>
                <span class="text-xs text-gray-500 uppercase tracking-wider">Data sources</span>
              </div>
              <div class="flex flex-col items-center gap-1 p-4 bg-white border border-gray-200 rounded-lg text-center">
                <span class="font-display text-3xl font-bold leading-tight text-gray-900">95%</span>
                <span class="text-xs text-gray-500 uppercase tracking-wider">Coverage rate</span>
              </div>
              <div class="flex flex-col items-center gap-1 p-4 bg-white border border-gray-200 rounded-lg text-center">
                <span class="font-display text-3xl font-bold leading-tight text-gray-900">Real-time</span>
                <span class="text-xs text-gray-500 uppercase tracking-wider">Fresh data</span>
              </div>
            </div>
          </div>
        </div>

        <div class="lg:order-2 max-lg:order-first">
          <div class="aspect-[4/3] rounded-2xl border border-gray-200 overflow-hidden shadow-xl">
            <img
              src="/images/stage-research.svg"
              alt="Research output: company summary, industry classification, employee count, tech stack tags, recent news cards, funding info, job posting signals"
              class="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
