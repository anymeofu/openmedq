
# Why OpenMedQ Is 100% Free (And Always Will Be)

Every month, thousands of medical students across India spend between 5,000 to 15,000 rupees on question bank subscriptions. That is 60,000 to 180,000 rupees over a preparation cycle. For a student already buried in tuition fees, hostel costs, and textbook expenses, this is a significant financial burden.

This is the story of why I built OpenMedQ and how it remains completely free.

## The Problem With Commercial Prep Platforms

I am a 3rd year MBBS student. During my clinical rotations, I started using several popular question bank platforms to prepare for postgraduate entrance exams. Within weeks, I noticed a pattern that frustrated me:

**Paywalled explanations**: You could see the question and answer for free, but the detailed clinical explanation (the part that actually teaches you) was locked behind a premium subscription.

**Aggressive upselling**: My phone was flooded with promotional calls and messages pressuring me to upgrade. Some platforms would show you your first 50 questions for free, then lock the remaining 10,000 behind a paywall.

**Expired access**: When your subscription ran out, you lost access to everything, including your own bookmarks, notes, and progress data. Months of carefully curated study material, gone.

**Outdated content**: Despite charging premium prices, many platforms had questions with outdated clinical guidelines, incorrect answer keys, and unexplained errors that were never fixed.

I kept thinking: this information is not proprietary. These are standard medical facts from standard textbooks. Why are we paying corporations to quiz us on publicly available knowledge?

## The Local-First Architecture: How We Keep Costs at Zero

OpenMedQ is not free because we have investors or because we plan to monetize later. It is free because of a deliberate technical architecture that keeps operating costs at practically zero.

### Everything Runs in Your Browser

Traditional question bank platforms run expensive database servers that process every question you answer. Each click generates a server request, and servers cost money. At scale, these costs become the justification for subscription fees.

OpenMedQ takes a fundamentally different approach. When you load a subject pack, the entire question set downloads to your browser's local storage (IndexedDB). After that initial download, everything runs locally:

- **Answering questions**: Processed entirely in your browser
- **Viewing explanations**: Already stored locally, no server needed
- **FSRS calculations**: The spaced repetition algorithm runs in JavaScript on your device
- **Bookmark and progress tracking**: Saved in your browser's database

This means that after the first load, OpenMedQ works even in airplane mode. In clinical wards, in hostel basements with no signal, in lifts between floors. Everywhere.

### Cloudflare Free Tier

The minimal server infrastructure we do need (serving the initial page load and syncing progress for logged-in users) runs on Cloudflare's free tier, which provides:

- Unlimited static asset bandwidth
- 100,000 daily Worker requests (more than sufficient)
- 5 million daily D1 database reads (for sync only)

This costs us exactly zero rupees per month.

## The Open Source Commitment

OpenMedQ's entire codebase is open source under the MIT license. You can inspect every line of code, verify that we do not track you, and even run your own instance if you want.

The question content is licensed under Creative Commons CC-BY-SA 4.0, meaning it can be freely shared, adapted, and built upon, as long as derivative works maintain the same open license.

### Why Open Source Matters for Medical Education

Medical knowledge should not be proprietary. The clinical facts in our question bank come from standard textbooks like Robbins, Harrison's, and Guyton that are part of every medical school curriculum. Locking this knowledge behind paywalls creates an inequitable preparation landscape where students from wealthier backgrounds have an inherent advantage.

Open source ensures that:

1. **No single entity controls access** to the study material
2. **Community corrections** keep the content accurate and up-to-date
3. **Transparency** lets you verify the quality of the questions and algorithms
4. **Sustainability** is not dependent on any one person or company

## How You Can Help

OpenMedQ is a solo project built between hospital rotations, exam study sessions, and sleep. It is not perfect, and there are features I want to build but have not had time for yet.

Here is how you can contribute:

**Report errors**: If you find an incorrect answer key, an outdated drug guideline, or a typo, take a screenshot and send it to our Telegram group. Corrections are pushed out to everyone within hours.

**Contribute questions**: If you have MCQs from recent exams or your own study notes, you can format them using our JSON schema validator and submit them for inclusion in the question bank.

**Contribute code**: If you are a medical student who writes code (yes, we exist), the entire stack is React, TypeScript, and Cloudflare Workers. Pull requests are welcome.

**Spread the word**: The most impactful thing you can do is tell other medical students about OpenMedQ. Every student who discovers this platform is one less student pressured into an expensive subscription they cannot afford.

## The Promise

OpenMedQ will never charge for access. There will never be a "premium tier" that locks explanations behind a paywall. There will never be ads interrupting your study flow. There will never be promotional calls to your phone.

This is not a business. This is a tool built by a student who got tired of the status quo.

Your brain is not a sieve. The prep system is just broken. Let's fix it together.
