<script setup lang="ts">
import api from '@/api';
import { ref } from 'vue';
import { toast } from '@/utils/toast';
import SkeletonCard from '@/components/SkeletonCard.vue';

const company = ref('');
const targetRole = ref('');
const domain = ref('');
const isLoading = ref(false);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const leadResult = ref<any>(null);

type Phase = 'lead' | 'research' | 'pain-points' | 'decision-maker' | 'outreach';
const currentPhase = ref<Phase>('lead');

const showFullSummary = ref(false);

const formatSummaryLinks = (text: string) => {
  if (!text) return '';
  let formatted = text.replace(/(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/g, '<a href="$1" target="_blank" class="text-blue-600 font-bold hover:underline relative z-10 pointer-events-auto cursor-pointer">$1</a>');

  const domainRegex = /(?<!https?:\/\/|\w@)([a-zA-Z0-9.-]+\.(?:com|org|net|io|co|ng|us|uk|ca)(?:\/[^\s<]*[^<.,:;"')\]\s])?)/gi;
  formatted = formatted.replace(domainRegex, '<a href="https://$1" target="_blank" class="text-blue-600 font-bold hover:underline relative z-10 pointer-events-auto cursor-pointer">$1</a>');
  return formatted;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const researchResult = ref<any>(null);
const isResearching = ref(false);

const ourProduct = ref('');
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const painPointsResult = ref<any[]>([]);
const isResolvingPainPoints = ref(false);

const companyDomain = ref('');
const isPrimary = ref(true);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const decisionMakerResult = ref<any>(null);
const isResolvingDecisionMaker = ref(false);

const senderName = ref('');
const senderCompany = ref('');
const tone = ref('conversational');
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const outreachResult = ref<any>(null);
const isResolvingOutreach = ref(false);

const handleResolveResearch = async () => {
  if (!leadResult.value || isResearching.value) return;
  isResearching.value = true;
  currentPhase.value = 'research';

  try {
    const res = await api.post(`/api/leads/${leadResult.value.id}/resolve-research`);
    researchResult.value = res.data.data;
    toast.success('Research Complete', 'Found company and market intel.');
  } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
    console.log(err);
    toast.error('Research Error', err.response?.data?.message || 'Failed to resolve research');
  } finally {
    isResearching.value = false;
  }
}

const handleResolvePainPoints = async () => {
  if (!ourProduct.value) {
    toast.warn('Missing Data', 'Please provide our product context.');
    return;
  }
  isResolvingPainPoints.value = true;
  currentPhase.value = 'pain-points';
  try {
    const res = await api.post(`/api/leads/${leadResult.value.id}/resolve-pain-points`, {
      ourProduct: ourProduct.value
    });
    painPointsResult.value = res.data.data;
    toast.success('Success', 'Pain points identified.');
  } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
    console.log(err);
    toast.error('Error', err.response?.data?.message || 'Failed to resolve pain points');
  } finally {
    isResolvingPainPoints.value = false;
  }
}

const handleResolveDecisionMaker = async () => {
  if (!companyDomain.value || !targetRole.value) {
    toast.warn('Missing Data', 'Please provide company domain and target role.');
    return;
  }
  isResolvingDecisionMaker.value = true;
  currentPhase.value = 'decision-maker';
  try {
    const res = await api.post(`/api/leads/${leadResult.value.id}/resolve-decision-maker`, {
      companyDomain: companyDomain.value,
      targetRole: targetRole.value,
      isPrimary: isPrimary.value
    });
    decisionMakerResult.value = res.data.data;
    toast.success('Decision Maker Found', 'Retrieved target contact info.');
  } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
    console.log(err);
    toast.error('Error', err.response?.data?.message || 'Failed to find decision maker');
  } finally {
    isResolvingDecisionMaker.value = false;
  }
}

const handleResolveOutreach = async () => {
  if (!senderName.value || !senderCompany.value || !ourProduct.value || !tone.value || !decisionMakerResult.value) {
    toast.warn('Missing Data', 'Please ensure all outreach fields are populated.');
    return;
  }
  isResolvingOutreach.value = true;
  currentPhase.value = 'outreach';
  try {
    const res = await api.post(`/api/leads/${leadResult.value.id}/resolve-outreach`, {
      decisionMakerId: decisionMakerResult.value.id,
      senderName: senderName.value,
      senderCompany: senderCompany.value,
      ourProduct: ourProduct.value,
      tone: tone.value
    });
    outreachResult.value = res.data.data;
    toast.success('Templates Generated', 'Outreach sequences are ready.');
  } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
    console.log(err);
    toast.error('Error', err.response?.data?.message || 'Failed to resolve outreach');
  } finally {
    isResolvingOutreach.value = false;
  }
}

const handleReturnHome = () => {
  company.value = '';
  targetRole.value = '';
  domain.value = '';
  leadResult.value = null;
  researchResult.value = null;
  painPointsResult.value = [];
  ourProduct.value = '';
  companyDomain.value = '';
  isPrimary.value = true;
  decisionMakerResult.value = null;
  senderName.value = '';
  senderCompany.value = '';
  tone.value = 'conversational';
  outreachResult.value = null;
  currentPhase.value = 'lead';
}

const handleNextProgression = () => {
  if (currentPhase.value === 'research') {
    currentPhase.value = 'pain-points';
  } else if (currentPhase.value === 'pain-points' && painPointsResult.value.length) {
    currentPhase.value = 'decision-maker';
    companyDomain.value = (companyDomain.value || researchResult.value?.website || '').replace(/^https?:\/\/(www\.)?/, '').split('/')[0];
  } else if (currentPhase.value === 'decision-maker' && decisionMakerResult.value) {
    currentPhase.value = 'outreach';
  }
}

const handleNext = async () => {
  if (isLoading.value) return;
  isLoading.value = true;
  // leadUI.value = true;
  try {
    const res = await api.post('/api/leads', {
      company: company.value,
      domain: domain.value,
      targetRole: targetRole.value
    })

    leadResult.value = res.data.data
    toast.success('Success', 'Lead created successfully')
    handleResolveResearch();
  } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
    console.log(err)
    toast.error('Error', err.response?.data?.message || 'Failed to create lead')
  } finally {
    isLoading.value = false;
    company.value = ''
    domain.value = ''
    targetRole.value = ''
  }
}
</script>

<template>
  <main class="bg-[#fff] flex justify-center items-center h-screen">
    <div
      class="w-[300px] lg:w-[300px] xl:w-[600px] xl:h-[60vh] h-[90vh] bg-[#fff] rounded-[24px] border border-gray-200 overflow-x-hidden relative flex flex-col">
      <div
        class="w-[300px] lg:w-[300px] xl:w-[600px] fixed py-[16px] bg-black text-white rounded-t-[24px] text-center z-20">
        <div class="text-sm font-semibold">Lead Gen Assistant</div>
      </div>

      <!-- chat interface -->
      <!-- create lead -->
      <div v-show="currentPhase === 'lead'" class="px-[16px] pt-[90px] pb-[10px]">
        <p class="font-bold text-sm text-black mb-[10px]">Create lead: </p>

        <!-- forms -->
        <div class="flex items-center gap-[10px] mb-[8px]">
          <input v-model="company" type="text" placeholder="Company"
            class="w-1/2 h-[40px] border-b border-gray-200 px-[10px] text-sm text-black focus:outline-none">
          <input v-model="domain" type="text" placeholder="Domain"
            class="w-1/2 h-[40px] border-b border-gray-200 px-[10px] text-sm text-black focus:outline-none">
        </div>
        <input v-model="targetRole" type="text" placeholder="Target Role"
          class="w-full mb-[20px] h-[40px] border-b border-gray-200 px-[10px] text-sm text-black focus:outline-none">
        <div @click="handleNext"
          class="w-full text-center text-white text-[14px] font-bold rounded-xl py-3 px-4 shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] transition-all flex items-center justify-center"
          :class="isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#0A0A0A] hover:bg-[#1A1A1A] hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] cursor-pointer active:scale-[0.98]'">
          {{ isLoading ? 'Loading...' : 'Next' }}
        </div>
        <!-- end forms -->
      </div>
      <!-- end create lead -->

      <!-- resolve research -->
      <div v-show="currentPhase === 'research'"
        class="px-[16px] pt-[90px] pb-[80px] h-full overflow-y-auto w-full overscroll-contain"
        style="scrollbar-width: thin;">

        <div v-if="isResearching" class="flex flex-col items-center justify-center h-full space-y-4 w-full pb-8 pt-4">
          <SkeletonCard :count="3" />
          <p class="text-sm text-gray-500 font-semibold animate-pulse mt-4">Gathering Intel on {{ company }}...</p>
        </div>

        <div v-else-if="researchResult" class="flex flex-col gap-[20px] pb-4">
          <div class="flex flex-col gap-1 items-start bg-blue-50/50 p-4 rounded-xl border border-blue-100">
            <h2 class="text-xl font-bold text-gray-900 leading-tight">{{ researchResult.rawResearch?.company || company
            }}</h2>
            <a v-if="researchResult.website" :href="researchResult.website" target="_blank"
              class="text-blue-600 text-sm font-medium hover:underline">{{ researchResult.website }}</a>
            <p class="text-xs text-gray-600 mt-1 font-medium bg-white px-2 py-1 rounded shadow-sm">
              Funding: {{ researchResult?.fundingInfo?.amount || 'Undisclosed' }}
            </p>
          </div>

          <div v-if="researchResult?.summary" class="bg-gray-50 p-4 rounded-xl border border-gray-100 mt-1">
            <div class="flex items-center gap-2 mb-3">
              <div class="w-[2px] h-4 bg-gray-400 rounded-full"></div>
              <h3 class="text-[11px] font-bold text-gray-800 uppercase tracking-wider">Executive Overview</h3>
            </div>

            <div class="relative">
              <p class="text-xs text-gray-700 leading-relaxed font-serif whitespace-pre-line transition-all duration-300 pointer-events-auto"
                :class="{ 'line-clamp-4': !showFullSummary }" v-html="formatSummaryLinks(researchResult.summary)">
              </p>
            </div>

            <button @click="showFullSummary = !showFullSummary"
              class="text-gray-500 text-[10px] font-regular capitalize tracking-wider mt-2 hover:text-gray-800 transition-colors cursor-pointer">
              {{ showFullSummary ? 'Show Less' : 'View More' }}
            </button>
          </div>

          <div v-if="researchResult.recentNews && researchResult.recentNews.length" class="flex flex-col gap-3">
            <div class="flex items-center gap-2">
              <div class="w-[2px] h-4 bg-blue-600 rounded-full"></div>
              <h3 class="text-sm font-bold text-gray-800 uppercase tracking-wider">Recent News</h3>
            </div>
            <div class="flex overflow-x-auto snap-x snap-mandatory gap-3 pb-2 -mx-4 px-4"
              style="scrollbar-width: none;">
              <a v-for="news in researchResult.recentNews" :key="news.url" :href="news.url" target="_blank"
                class="snap-center shrink-0 w-[240px] xl:w-[280px] bg-white border border-gray-200 rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-2">
                <h4 class="text-xs font-bold text-gray-900 line-clamp-2 leading-tight">{{ news.title }}</h4>
                <p class="text-[10px] text-gray-500 line-clamp-3 leading-relaxed">{{ news.snippet }}</p>
                <span class="text-[9px] text-gray-400 font-medium uppercase truncate mt-auto">{{ news.date || 'Recent'
                }}</span>
              </a>
            </div>
          </div>

          <div v-if="researchResult.jobPostings && researchResult.jobPostings.length" class="flex flex-col gap-3">
            <div class="flex items-center gap-2">
              <div class="w-[2px] h-4 bg-green-500 rounded-full"></div>
              <h3 class="text-sm font-bold text-gray-800 uppercase tracking-wider">Active Job Postings</h3>
            </div>
            <div class="flex flex-col gap-2">
              <div v-for="job in researchResult.jobPostings.slice(0, 4)" :key="job.title"
                class="bg-gray-50 border border-gray-100 rounded-lg p-3 flex flex-col gap-1.5 hover:bg-white transition-colors cursor-default">
                <h4 class="text-xs font-bold text-gray-800 leading-tight">{{ job.title }}</h4>
                <div class="flex flex-wrap gap-1">
                  <span v-if="job.department"
                    class="px-1.5 py-0.5 bg-gray-200 text-gray-700 rounded text-[9px] font-semibold">{{ job.department
                    }}</span>
                  <span v-for="signal in job.signals" :key="signal"
                    class="px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded text-[9px] font-semibold">{{ signal }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- end resolve research -->

      <!-- absolute bottom next button for research layout -->
      <div v-if="currentPhase === 'research' && researchResult && !isResearching"
        class="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 z-10 w-full rounded-b-[24px]">
        <div @click="handleNextProgression"
          class="w-full cursor-pointer text-center text-white text-[14px] font-bold rounded-xl py-3 px-4 bg-[#0A0A0A] hover:bg-[#1A1A1A] shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] transition-all active:scale-[0.98]">
          Proceed to Pain Points
        </div>
      </div>
      <!-- pain-points phase -->
      <div v-show="currentPhase === 'pain-points'"
        class="px-[16px] pt-[90px] pb-[80px] h-full overflow-y-auto w-full overscroll-contain"
        style="scrollbar-width: thin;">
        <div class="flex flex-col gap-4">
          <div class="flex flex-col gap-2">
            <p class="font-bold text-sm text-black">Identify Pain Points:</p>
            <input v-model="ourProduct" type="text" placeholder="Your Product Context (e.g. Crypto exchange platform)"
              class="w-full h-[40px] border border-gray-200 rounded-lg px-[10px] text-sm text-black focus:outline-none focus:border-indigo-500 bg-gray-50">
            <div @click="handleResolvePainPoints"
              class="w-full text-center text-white text-[14px] font-bold rounded-xl py-3 px-4 bg-[#0A0A0A] hover:bg-[#1A1A1A] shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] cursor-pointer transition-all active:scale-[0.98]"
              :class="{ 'opacity-50 pointer-events-none': isResolvingPainPoints }">
              {{ isResolvingPainPoints ? 'Analyzing...' : 'Resolve Pain Points' }}
            </div>
          </div>

          <!-- skeleton loader -->
          <div v-if="isResolvingPainPoints" class="w-full mt-4">
            <SkeletonCard :count="2" />
          </div>

          <!-- Results -->
          <div v-else-if="painPointsResult && painPointsResult.length > 0" class="flex flex-col gap-3 mt-2">
            <div class="flex items-center gap-2">
              <div class="w-[2px] h-4 bg-indigo-500 rounded-full"></div>
              <h3 class="text-sm font-bold text-gray-800 uppercase tracking-wider">Identified Challenges</h3>
            </div>

            <div v-for="pp in painPointsResult" :key="pp.id"
              class="bg-white border border-gray-100 rounded-xl p-3 shadow-sm flex flex-col gap-2 relative overflow-hidden">
              <div class="absolute w-1 top-0 bottom-0 left-0"
                :class="pp.urgency === 'high' ? 'bg-red-400' : 'bg-yellow-400'"></div>
              <div class="flex justify-between items-start gap-2 ml-1">
                <h4 class="text-xs font-bold text-gray-900 leading-tight">{{ pp.title }}</h4>
                <span class="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wide shrink-0"
                  :class="pp.urgency === 'high' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'">{{
                    pp.urgency }}</span>
              </div>
              <p class="text-[11px] text-gray-700 leading-relaxed ml-1 font-serif">{{ pp.description }}</p>
              <div class="mt-1 pt-2 border-t border-gray-50 ml-1">
                <span class="text-[9px] font-bold text-indigo-400 uppercase">Context Signal:</span>
                <p class="text-[10px] text-gray-500 italic mt-0.5">{{ pp.relevantSignal }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="currentPhase === 'pain-points' && painPointsResult && painPointsResult.length > 0 && !isResolvingPainPoints"
        class="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 z-10 w-full rounded-b-[24px]">
        <div @click="handleNextProgression"
          class="w-full cursor-pointer text-center text-white text-[14px] font-bold rounded-xl py-3 px-4 bg-[#0A0A0A] hover:bg-[#1A1A1A] shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] transition-all active:scale-[0.98]">
          Proceed to Decision Maker
        </div>
      </div>
      <!-- end pain-points -->

      <!-- decision-maker phase -->
      <div v-show="currentPhase === 'decision-maker'"
        class="px-[16px] pt-[90px] pb-[80px] h-full overflow-y-auto w-full overscroll-contain"
        style="scrollbar-width: thin;">
        <div class="flex flex-col gap-4">
          <!-- Input form -->
          <div class="flex flex-col gap-3">
            <p class="font-bold text-sm text-black">Target Decision Maker:</p>
            <div class="flex flex-col gap-2">
              <input v-model="companyDomain" type="text" placeholder="Company Domain"
                class="w-full h-[40px] border border-gray-200 rounded-lg px-[10px] text-[13px] text-black focus:outline-none focus:border-green-500 bg-gray-50">
              <input v-model="targetRole" type="text" placeholder="Target Role"
                class="w-full h-[40px] border border-gray-200 rounded-lg px-[10px] text-[13px] text-black focus:outline-none focus:border-green-500 bg-gray-50">
              <label class="flex items-center gap-2 cursor-pointer mt-1 mb-1">
                <input type="checkbox" v-model="isPrimary"
                  class="w-4 h-4 text-green-600 rounded bg-gray-100 border-gray-300 focus:ring-green-500">
                <span class="text-xs text-gray-700 font-medium">Must be primary contact</span>
              </label>
            </div>
            <div @click="handleResolveDecisionMaker"
              class="w-full text-center text-white text-[14px] font-bold rounded-xl py-3 px-4 bg-[#0A0A0A] hover:bg-[#1A1A1A] shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] cursor-pointer transition-all active:scale-[0.98]"
              :class="{ 'opacity-50 pointer-events-none': isResolvingDecisionMaker }">
              {{ isResolvingDecisionMaker ? 'Searching...' : 'Find Contact' }}
            </div>
          </div>

          <!-- skeleton loader -->
          <div v-if="isResolvingDecisionMaker" class="w-full mt-4">
            <SkeletonCard :count="1" />
          </div>

          <!-- Results -->
          <div v-else-if="decisionMakerResult" class="flex flex-col gap-3 mt-4">
            <div class="flex items-center gap-2">
              <div class="w-[2px] h-4 bg-green-500 rounded-full"></div>
              <h3 class="text-sm font-bold text-gray-800 uppercase tracking-wider">Perfect Match Found</h3>
            </div>

            <div
              class="bg-white border-2 border-green-100 rounded-xl p-4 shadow-sm flex flex-col gap-2 relative overflow-hidden">
              <div class="absolute -right-6 -top-6 text-green-50/50">
                <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor">
                  <path
                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
                </svg>
              </div>
              <h4 class="text-xl font-black text-green-900 leading-tight relative z-10">{{ decisionMakerResult.name ||
                'Unhidden Contact' }} <span v-if="decisionMakerResult.isPrimary"
                  class="bg-green-100 text-green-700 text-[9px] px-1.5 py-0.5 rounded ml-1 align-top relative -top-0.5">PRIMARY</span>
              </h4>
              <p class="text-[13px] font-semibold text-gray-600 relative z-10">{{ decisionMakerResult.title }}</p>

              <div class="flex flex-col gap-1 mt-2 relative z-10">
                <div
                  class="flex items-center gap-2 text-gray-600 text-xs bg-gray-50 p-2 rounded border border-gray-100">
                  <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                  </svg>
                  <span class="font-medium truncate">{{ decisionMakerResult.email || 'Click to reveal in CRM' }}</span>
                </div>
              </div>

              <a v-if="decisionMakerResult.linkedInUrl" :href="decisionMakerResult.linkedInUrl" target="_blank"
                class="w-full text-center text-blue-700 text-[11px] font-bold mt-2 bg-blue-50 py-1.5 rounded hover:bg-blue-100 transition-colors z-10">
                View on LinkedIn
              </a>
            </div>
          </div>
        </div>
      </div>

      <div v-if="currentPhase === 'decision-maker' && decisionMakerResult && !isResolvingDecisionMaker"
        class="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 z-10 w-full rounded-b-[24px]">
        <div @click="handleNextProgression"
          class="w-full cursor-pointer text-center text-white text-[14px] font-bold rounded-xl py-3 px-4 bg-[#0A0A0A] hover:bg-[#1A1A1A] shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] transition-all active:scale-[0.98]">
          Proceed to Outreach
        </div>
      </div>
      <!-- end decision-maker -->

      <!-- outreach phase -->
      <div v-show="currentPhase === 'outreach'"
        class="px-[16px] pt-[90px] pb-[80px] h-full overflow-y-auto w-full overscroll-contain"
        style="scrollbar-width: thin;">
        <div class="flex flex-col gap-4">
          <!-- Input form -->
          <div class="flex flex-col gap-3">
            <p class="font-bold text-sm text-black">Configure Sales Outreach:</p>
            <div class="flex flex-col gap-2">
              <div class="flex gap-2">
                <input v-model="senderName" type="text" placeholder="Your Name"
                  class="w-1/2 h-[40px] border border-gray-200 rounded-lg px-[10px] text-[12px] text-black focus:outline-none focus:border-purple-500 bg-gray-50">
                <input v-model="senderCompany" type="text" placeholder="Your Company"
                  class="w-1/2 h-[40px] border border-gray-200 rounded-lg px-[10px] text-[12px] text-black focus:outline-none focus:border-purple-500 bg-gray-50">
              </div>
              <div class="grid grid-cols-3 gap-2 mt-1">
                <div @click="tone = 'professional'"
                  class="text-center py-2 rounded-lg text-[10px] font-bold uppercase cursor-pointer border transition-colors"
                  :class="tone === 'professional' ? 'bg-purple-100 border-purple-500 text-purple-800' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'">
                  Pro</div>
                <div @click="tone = 'conversational'"
                  class="text-center py-2 rounded-lg text-[10px] font-bold uppercase cursor-pointer border transition-colors"
                  :class="tone === 'conversational' ? 'bg-purple-100 border-purple-500 text-purple-800' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'">
                  Casual</div>
                <div @click="tone = 'direct'"
                  class="text-center py-2 rounded-lg text-[10px] font-bold uppercase cursor-pointer border transition-colors"
                  :class="tone === 'direct' ? 'bg-purple-100 border-purple-500 text-purple-800' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'">
                  Direct</div>
              </div>
            </div>
            <div @click="handleResolveOutreach"
              class="w-full text-center text-white text-[14px] font-bold rounded-xl py-3 px-4 bg-[#0A0A0A] hover:bg-[#1A1A1A] shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] cursor-pointer transition-all active:scale-[0.98]"
              :class="{ 'opacity-50 pointer-events-none': isResolvingOutreach }">
              {{ isResolvingOutreach ? 'Drafting Sequence...' : 'Generate Sequences' }}
            </div>
          </div>

          <!-- skeleton loader -->
          <div v-if="isResolvingOutreach" class="w-full mt-4">
            <SkeletonCard :count="2" />
          </div>

          <!-- Results -->
          <div v-else-if="outreachResult" class="flex flex-col gap-4 mt-4">

            <!-- Email -->
            <div class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
              <div class="bg-gray-800 text-white p-3 flex justify-between items-center">
                <div class="flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <h3 class="text-xs font-bold uppercase tracking-wide">Cold Email</h3>
                </div>
                <span class="text-[9px] bg-white/20 px-2 py-0.5 rounded-full">{{ outreachResult.emailWordCount }}
                  words</span>
              </div>
              <div class="p-3 border-b border-gray-100">
                <p class="text-[11px] font-bold text-gray-700 break-words"><span
                    class="text-gray-400 font-normal">Subject:</span> {{ outreachResult.emailSubject ||
                      outreachResult.email?.subject }}</p>
              </div>
              <div class="p-3 bg-gray-50/50">
                <p class="text-[12px] text-gray-800 leading-relaxed whitespace-pre-wrap font-serif">{{
                  outreachResult.emailBody || outreachResult.email?.body }}</p>
              </div>
            </div>

            <!-- LinkedIn -->
            <div class="bg-blue-50 border border-blue-100 rounded-xl shadow-sm overflow-hidden flex flex-col">
              <div class="bg-blue-600 text-white p-3 flex justify-between items-center">
                <div class="flex items-center gap-2">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                  <h3 class="text-xs font-bold uppercase tracking-wide">LinkedIn Note</h3>
                </div>
              </div>
              <div class="p-3">
                <p class="text-[12px] text-gray-800 leading-relaxed font-serif">{{ outreachResult.linkedinBody ||
                  outreachResult.linkedin?.body }}</p>
              </div>
            </div>

            <!-- Notes -->
            <div v-if="outreachResult.validationNotes"
              class="bg-orange-50 border border-orange-100 rounded-xl p-3 shadow-sm mb-4">
              <div class="flex items-center gap-2 mb-2">
                <div class="w-1 h-3 bg-orange-400 rounded-full"></div>
                <h3 class="text-[10px] font-bold text-orange-900 uppercase tracking-widest">AI Strategist Notes <span
                    class="bg-orange-200 text-orange-800 px-1 rounded ml-1">{{ outreachResult.validationScore
                    }}/10</span></h3>
              </div>
              <p class="text-[10px] text-orange-800 leading-relaxed whitespace-pre-line">{{
                outreachResult.validationNotes }}</p>
            </div>

          </div>
        </div>
      </div>

      <div v-if="currentPhase === 'outreach' && outreachResult && !isResolvingOutreach"
        class="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 z-10 w-full rounded-b-[24px]">
        <div @click="handleReturnHome"
          class="w-full cursor-pointer text-center text-white text-[14px] font-bold rounded-xl py-3 px-4 bg-[#0A0A0A] hover:bg-[#1A1A1A] shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] transition-all active:scale-[0.98]">
          Finish & Return to Home
        </div>
      </div>
      <!-- end outreach -->

      <!-- end chat interface -->
    </div>
  </main>
</template>
