# Deloitte Innovation Hub Hackathon — 1st Place (February 2026)

I won 1st place at the Deloitte Innovation Hub Hackathon, hosted at AUC, in February 2026.

The challenge was inventory forecasting for a retail client. My team built an AI-powered inventory forecasting system that combined classical and deep-learning forecasting (XGBoost and LSTM) with DeepSeek V3.2 acting as an orchestration layer. The orchestrator's job was intelligent model selection — deciding which forecasting model to trust for which SKU, region, or seasonality regime, instead of bolting on a single global model.

The system delivered approximately 28% cost reduction, which translated to over $1M in projected client savings. The judges weighed both the technical depth of the ML stack and the business impact framing; combining a classical gradient-boosted model with an LSTM and routing between them via an LLM was unusual enough to stand out, and the savings number gave it clear stakes.

Key takeaways I bring forward from this work: hybrid model stacks beat monolithic ones for messy retail data, and using an LLM as a meta-router (not as a forecaster itself) is a practical pattern when no single model dominates across the data.
