# Loving Loyalty - Sales Forecasting (project README)
Source: /Users/yahya/Documents/loving loyalty internship/service/README.md

# Loving Loyalty AI Intelligence Suite — Pillar 1: Sales Forecasting

Demand forecasting microservice for Danish restaurants, built as part of the DIH-X-AUC Hackathon. Delivers daily per-item sales predictions with newsvendor-calibrated safety buffers, confidence scores, and forecast drivers.

## Architecture

The forecasting model is an AdaptiveBlendModel: a weighted combination of a global Random Forest and per-store Extra Trees regressors.

| Component | Detail |
|-----------|--------|
| Global model | RandomForestRegressor(n_estimators=300, min_samples_leaf=2) |
| Per-store model | ExtraTreesRegressor(n_estimators=800) |
| Blend ratio | 75% global / 25% per-store, adaptive: weight shifts toward local once a store has >= 100 training samples |
| Training weights | Exponential decay, half-life = 12 days (recent data weighted higher) |
| Feature interactions | lag7d x day_of_week, rolling_mean x is_weekend, lag7d / expanding_mean |
| Safety buffer | Newsvendor optimal buffer per item |

Best validated result: 5,225,357 DKK total business cost on the 14-day hold-out test set — a 25% reduction vs the MA-7 baseline.

### Newsvendor Safety Buffer

```
critical_ratio = 1.5 / (1.5 + 0.3)  = 0.833
buffer = 1 + z_{0.833} * sigma / mu
       = 1 + 0.967 * (std_demand / mean_demand)
clamped to [1.0, 2.0]; fallback 1.27 for items with < 30 days of history
```

## Output Variants

Three model variants produced from the same trained model:
- `balanced` (x1.00) - Default, newsvendor buffer fully applied
- `waste_optimized` (x0.90) - Accepts more stockout risk; reduces food waste
- `stockout_optimized` (x1.06) - Reduces stockout frequency; accepts slightly more waste

## API Endpoints

- POST /api/ai/forecast/items - Per-item daily forecasts (SRS Pillar 1, primary endpoint)
- POST /api/ai/forecast - Legacy per-item forecast (older schema)
- POST /api/forecast - Forecast using the pre-trained ensemble models
- GET /api/operations/insights - Staffing/operations guidance and menu-action insights from observed sales
- POST /api/train - Retrain the model on the demo dataset
- GET /api/health - Service health check
- GET /api/model/features - Top feature importances from trained model
- GET /api/forecast/ingredients - Ingredient-level demand via BOM explosion
- POST /api/forecast/cold-start - Demand estimate for new products with no history

### POST /api/ai/forecast/items example

Request: `{placeId, startDate, endDate, granularity, variant, topN}`. Response includes per-item per-day predictions with `predictedUnits`, `lowerBound`, `upperBound`, `confidence`, and `forecastDrivers` (e.g. "same day last week: 12 units", "7-day rolling average: 11.4 units/day avg", "Demand trending up week-over-week").

Confidence scores (SRS Table 25):
- 90+ days: 0.75 - 0.95
- 30-89 days: 0.50 - 0.74
- < 30 days: 0.20 - 0.49
- 0 orders: 0.10 - 0.25

### GET /api/operations/insights

Returns operational recommendations from observed sales history (not labor-cost optimization). Query params: `place_id`, `lookback_days` (7-730, default 60), `top_n` (1-100, default 10). Response includes weekday patterns, peak shift windows, source freshness, observed history, top sellers, slow movers, volatile items, and short actionable recommendations.

Important caveat: uses sales history only - does not observe labor cost, employee schedules, stock-on-hand, or true stockouts.

## Project Structure

```
services/forecasting/
├── src/
│   ├── main.py
│   ├── api/             # forecast_items_routes, forecast_routes, model_routes, data_routes, chat_routes, schemas, dependencies
│   ├── forecast/        # data_loader, feature_engineer, trainer, predictor (production pipeline)
│   ├── features/        # lag_features, time_features, external_features, builder
│   ├── models/          # ensemble (HybridForecaster XGB + MA7), model_service, trainer (legacy)
│   ├── data/loader.py   # DuckDB-based CSV/Supabase loader
│   └── llm/             # LLM client, RAG, tools
├── autoresearch/        # evaluate.py, experiment.py, results.tsv
├── data/
│   ├── demo/            # CSV demo dataset
│   └── models/          # Trained .pkl artifacts
├── requirements.txt
└── Dockerfile
```

## Run Locally

```bash
pip install -r requirements.txt
python run.py
# or
uvicorn src.main:app --reload --port 8002
# Docs at http://localhost:8002/docs
```

Environment variables: `USE_MYSQL`, `DB_DSN`, `DB_HOST`/`DB_USER`/`DB_PASSWORD`/`DB_NAME`, `OPENROUTER_API_KEY`, `SUPABASE_URL`/`SUPABASE_SERVICE_KEY`.

## Data Leakage Fix (Report B)

An independent audit identified that `expanding_mean` was computed across the entire dataset before the train/test split, allowing test rows to see future demand in their feature values. Fix: added `shift(1)` before `expanding()` in `src/features/lag_features.py`, fixed `autoresearch/evaluate.py`, and `FeatureEngineer.fit_transform()` now computes expanding_mean only on training rows; `transform()` freezes the value at the training cutoff for inference rows.
