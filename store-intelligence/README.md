# Store Intelligence System (Step 22)

This repository contains the complete Store Intelligence system built for the retail analytics hiring challenge. It parses CCTV camera streams to generate visitor and staff behavioral logs, matches transactions from POS records, exposes an intelligence REST API, and displays data in a terminal dashboard.

---

## Quick Start (Exact 5 Commands)

To run and initialize the system, execute the following commands in order:

```bash
git clone <your-repo-url> && cd store-intelligence
cp data/sample.env .env
docker compose up --build -d
bash pipeline/run.sh
open http://localhost:8000/stores/ST1008/metrics
```

---

## Setup & File Placement

Before executing the pipeline, ensure the source files are placed inside the local data directory:

```bash
# 1. Create the data directory
mkdir -p data

# 2. Copy the POS transactions CSV
cp /path/to/Brigade_Bangalore_10_April_26.csv data/pos_transactions.csv

# 3. Copy the camera footage clips
cp /path/to/CAM_1.mp4 data/CAM_1.mp4
cp /path/to/CAM_2.mp4 data/CAM_2.mp4
cp /path/to/CAM_3.mp4 data/CAM_3.mp4
cp /path/to/CAM_4.mp4 data/CAM_4.mp4
cp /path/to/CAM_5.mp4 data/CAM_5.mp4
```

> [!NOTE]
> **YOLO Weights Cache**: Model weights are downloaded automatically during docker compose build step (`docker compose up --build`). The initial build takes approximately 2 minutes to compile opencv and cache `yolov8n.pt`. Subsequent container builds use the cached images.

---

## Running the Detection Pipeline

To run the pipeline locally (without docker-compose):

```bash
# Run the pipeline shell script
bash pipeline/run.sh
```

### Script Execution Parameters:
* **Inputs**: Reads raw feeds from `data/CAM_*.mp4` and transactions from `data/pos_transactions.csv`.
* **Output Log**: Outputs processed tracking actions to `events.jsonl`.
* **Ingestion**: Automatically splits logs into batches of 500 and posts them to `http://localhost:8000/events/ingest`.

---

## Testing

To execute the unit and integration tests verifying API routing and operations:

```bash
pytest tests/ -v --tb=short
```

---

## Live Dashboard

To launch the real-time terminal visual monitor:

```bash
python dashboard/live_dashboard.py --events events.jsonl --store ST1008
```

This updates live store metrics, visitor funnel drop-offs, heat scores, active operational anomalies, and displays an ingestion progress bar.

---

## Expected Output & Timezone Handling

* **Timezone Offset**: All events and POS transactions use Indian Standard Time (IST, UTC+5:30) with explicit timezone offsets: `2026-04-10T20:10:02+05:30`.
* **Zero Conversion Rate**: The provided camera clips are a short ~2-minute window (20:10–20:12 IST). The nearest POS transaction in the dataset falls 13 minutes outside this window (at 20:25). The system correctly returns `conversion_rate: 0.0` for this clip window. In a full production deployment with complete day-long feeds, the conversion rate would reflect real purchase data.
* **Debug Video Verification**: Add the `--debug-video` flag during development runs to display zone polygon boundaries overlaid directly on active tracking output windows for visual verification.
