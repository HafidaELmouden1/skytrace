# ASTRAVIEW — Speaker notes & judge Q&A
NASA International Space Apps Challenge 2026 · Challenge: *Planet X and SPHEREx*
Team: Ghita Dennoune · Hafida El Mouden · Nour el Houda OKMID
Live app: https://astraview.cloud.run/ · Source: https://github.com/NourelhoudaOKMID/space-challenge-nasa-sphere-x-astraview

Total pitch: ~3 minutes (≈25 s per slide). Everything below is written to be said out loud, not read.

---

## Slide 1 — Introduction (20 s)

> "We're AstraView. NASA's SPHEREx telescope photographs the entire sky every six months, in 102
> infrared bands. That means the sky has already been photographed twice — but nobody can actually
> *see* what changed. So we built a public web tool that puts two real SPHEREx observations of the
> same patch of sky next to each other, and lets anyone see the difference. Explore the universe,
> discover what changes."

**Point at:** the live screenshot on the right — it is the real app, not a mock-up.

---

## Slide 2 — The scientific challenge (30 s)

> "SPHEREx maps the whole sky in 102 narrow near-infrared bands, between 0.75 and 5 micrometres.
> Each band is sensitive to different molecules — water, carbon dioxide, carbon monoxide — and it
> images more than a billion objects per survey. The key point is the cadence: the survey *repeats*
> every six months. The same sky, twice, in the same band, is a time series. NASA asked for a
> public-facing web tool that makes it easy for anyone to see how the sky changes over time. That is
> exactly the sentence we built against."

**If asked about "Planet X":** it is the name of the challenge; our work is the part NASA specified
in the brief — the public tool that makes SPHEREx images comparable over time.

---

## Slide 3 — The problem (25 s)

> "Here is why this is hard. There are 1.6 million calibrated exposures in the archive. One exposure
> is not a picture: it is a 2040-by-2040 array of float pixels, with a coordinate solution and a flags
> bitmap — sixteen megabytes of raw data before you can even display it. And DR1 covers 2025 while QR3
> covers 2026, so if you use one release you see a single epoch over most of the sky. Archive tools
> answer 'show me this image'. Almost none answer 'what changed between these two dates?' — which is
> the question the challenge actually asks."

---

## Slide 4 — Our solution (35 s)

> "AstraView answers it in three modules. **Explorer**: search 1 513 indexed observations by position,
> by object name, by band, by release, by field size or by date window. **Time Machine**: it finds
> pairs of observations of the same sky in the same band, checks they actually overlap, and then lets
> you compare them — smart slider, side by side, or blink. We have 36 verified pairs, some 381 days
> apart. **Cosmic Signals**: it subtracts the two aligned frames pixel by pixel, measures the noise
> from the difference itself, and lists the regions above 4.8 sigma."

**Be explicit:** "These are screenshots of the deployed app running on real SPHEREx cutouts — you can
open it right now."

---

## Slide 5 — How it works (30 s)

> "The pipeline has five steps. SPHEREx delivers calibrated Level-2 exposures. We take them from
> NASA's IRSA services: the SIA2 catalogue, the IBE cutout service, and the NASA S3 mirror, where we
> read FITS headers with byte ranges instead of downloading whole files. Our backend — Express and
> TypeScript — parses the multi-extension FITS, encodes a display PNG, aligns the frames with the
> TAN-SIP solution and runs the difference. The React client renders it on a canvas with asinh, log,
> sqrt or linear stretch, and shows the sky coordinate and the brightness in MJy per steradian under
> the cursor. No API key, no account, no download: it runs in a browser tab."

---

## Slide 6 — Innovation, impact and team (30 s)

> "What makes it different is not that it displays SPHEREx images — it is that it is honest about what
> they mean. Every difference is measured against its own noise, every region is labelled 'potential
> candidate, unverified', and the app tells you what could fake it: cosmic rays, detector artifacts,
> spacecraft drift, calibration residuals. On the left, what is actually shipped today. On the right,
> what we would build next — those are not claims, they are a roadmap. We are three developers: Ghita
> on product and interface, Hafida on backend and the data pipeline, Nour el Houda on astronomy
> research and validation. We split the work the first evening and deployed early, so every
> screenshot you have seen was on a live URL, not a laptop."

---

## Slide 7 — Conclusion (20 s)

> "SPHEREx will photograph the whole sky again in six months, and again after that. The universe is
> always changing — the question is whether we are ready to notice. AstraView is our answer: one
> comparison, one click, on real NASA data. Try it at astraview dot cloud dot run. Thank you."

---

# Five likely judge questions

**1. Are these real discoveries? Did you find something new?**
> No — and we say so inside the app. What we produce are *candidates*: regions where the difference
> between two epochs exceeds 4.8 sigma of the measured noise. A real detection needs multi-band
> confirmation and follow-up; a single-band excess can be a cosmic ray, a detector artifact or a
> calibration residual. The app labels every region "Potential Candidate — Unverified", and that
> label is deliberate: honest limits are part of the product.

**2. How do you handle false positives?**
> Three ways. First, we only pair observations of the *same sky region in the same band*, and we
> verify the overlap before showing anything — 36 pairs qualify out of 1 513 indexed observations.
> Second, we measure the noise from the difference frame itself (σ = 0.0156 MJy/sr for the pair we
> present), instead of assuming a fixed threshold. Third, the verification notice in Cosmic Signals
> lists the exact artifacts that can create a false positive — cosmic rays, detector artifacts,
> spacecraft drift and PSF rotation, calibration residuals — so the user knows what to rule out.

**3. How is this different from Aladin, the IRSA finder chart, or WorldWide Telescope?**
> Those tools are excellent at showing *one* image with a lot of context. They are built for
> browsing a catalogue, not for comparing two epochs of the same patch. AstraView starts from the
> comparison: pick a pair, align it, subtract it, rank the residuals. We also index two releases
> together — DR1 and QR3 — because using one alone leaves most of the sky with a single epoch.

**4. Is the data really NASA's, and is it calibrated Level-2 or something synthetic?**
> It is NASA's. We read calibrated Level-2 SPHEREx exposures from IPAC/IRSA: SIA2 for the catalogue,
> IBE for cutouts, and the NASA S3 open-data mirror for byte-range header indexing and the IMAGE
> science HDU — 2040×2040, float32, in MJy/sr, exactly as published. There are no mock images in the
> application, and no key is required: IRSA is open.

**5. How would this scale to the whole sky, and what happens after the hackathon?**
> Today we index on demand: 1 513 observations across the six detectors, which is enough to
> demonstrate the method end to end. Scaling means pre-indexing the archive into a database, adding a
> batch difference job, and multi-band confirmation so a candidate surviving two detectors outranks a
> single-band spike. The indexer, the alignment and the difference detector do not depend on SPHEREx
> specifically — any survey that images the same sky more than once can use the same layer.

---

# If you only have 60 seconds

> "SPHEREx photographs the entire sky every six months in 102 infrared bands. The data is public, but
> there is no public way to see what changed between two epochs. AstraView is a web tool that finds
> two real observations of the same patch of sky, aligns them, and shows the difference — with the
> noise measured from the data and every candidate labelled unverified. It runs on NASA's archive
> today, at astraview.cloud.run."
