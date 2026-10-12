---
title: "Behavioural Modelling of Non-Maturity Deposits: Getting the Core Right"
slug: behavioural-modelling-non-maturity-deposits
date: 2026-09-22
author: sushant-saurav
category: alm
tags: [ALM, IRRBB, Liquidity, Deposits]
summary: >-
  Savings and current accounts have no contractual maturity, yet they anchor most bank balance
  sheets. How you model their behaviour drives your liquidity gaps, IRRBB numbers and FTP curve.
premium: false
featured: true
---
Savings and current account balances carry no contractual maturity, yet for most Indian banks they
are the single largest and most stable source of funding. How an institution slots these balances
into its liquidity and interest-rate buckets quietly determines three critical outputs: the
structural liquidity gap, IRRBB sensitivity of NII and EVE, and the funds transfer pricing (FTP)
credit given to the liability franchise.

## Why "core vs volatile" is only the starting point

Most frameworks begin by splitting balances into a *volatile* portion — assumed to run off quickly —
and a *core* portion that is treated as stable. The split is usually derived from the historical
volatility of balances. That is a reasonable start, but on its own it misses several realities:

- **Segment behaviour differs sharply.** Salary accounts, government deposits, retail savings and
  high-value current accounts do not behave alike. Modelling them as one pool understates
  concentration risk.
- **Digital channels have changed run-off speed.** Balances can now move within hours. Survival
  horizons calibrated on pre-digital history may be optimistic.
- **Rate sensitivity is asymmetric.** Depositors react faster to competitive rate *increases*
  elsewhere than banks pass on rate cuts.

## A practical, defensible approach

1. **Segment first.** Split by product, customer type and balance band before any statistics.
2. **Model the core statistically** — using a minimum-balance or percentile approach over a long,
   representative window that includes at least one stress episode.
3. **Distribute the core over time buckets** using an observed decay profile, capped by the limits
   your board-approved policy and supervisory expectations allow.
4. **Overlay a behavioural stress.** Test the core assumption against a digital-led run, a rating
   downgrade and a sector-specific shock.
5. **Back-test and document.** Compare predicted versus actual run-off every quarter; record
   overrides and the rationale behind them.

## Where it shows up

A well-calibrated deposit model reduces unnecessary HQLA drag, gives a more honest EVE number and
lets the treasury price assets off a credible FTP curve. A poorly calibrated one often surfaces
first during supervisory review — when it is hardest to fix.

> **Practitioner note:** Supervisors increasingly ask *why* a behavioural assumption is reasonable,
> not just *what* it is. Keep the analysis that supports each assumption ready to share.
