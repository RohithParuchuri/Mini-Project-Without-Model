# Store Intelligence System Architecture Design (Step 20)

This document describes the technical architecture, component choices, AI integration details, and known boundaries of the Store Intelligence system implemented for the retail analytics hiring challenge.

---

## 1. Architecture Overview

The system operates as a 5-stage pipeline mapping raw CCTV feeds to queryable analytics tables and live terminal dashboard updates.

```
+------------------+     +-------------------+     +------------------+
|   Video Feeds    | --> |  Detection Layer  | --> |   Event Stream   |
| (5 CAMs, 1080p)  |     | (YOLOv8 + Re-ID)  |     |  (events.jsonl)  |
+------------------+     +-------------------+     +------------------+
                                                            |
                                                            v
+------------------+     +-------------------+     +------------------+
|  Live Dashboard  | <-- |  Intelligence API | <-- | SQLite Database  |
|  (Terminal Rich) |     |  (FastAPI Router) |     |  (SQLAlchemy)    |
+------------------+     +-------------------+     +------------------+
```

### Pipeline Description:
1. **Video Input**: Raw 1920x1080 retail camera clips (CAM_1 to CAM_5) representing the entrance, makeup aisles, skincare floor, stockroom, and billing counter.
2. **Detection Layer**: Extracts tracks using YOLOv8n (or YOLOv8s depending on `--quality`) and ByteTrack. Tracks are processed by camera-specific modules:
   * `cam_entry.py` (CAM_3): Evaluates line crossings at `y=620` to log store entry/exit/reentry.
   * `cam_zones.py` (CAM_1 & CAM_2): Computes polygon collisions to register skincare and makeup aisle interactions.
   * `cam_billing.py` (CAM_5): Manages billing queues and detects abandonments.
   * `cam_stockroom.py` (CAM_4): Builds staff appearance profiles.
3. **Event Stream**: Outputs valid events in the specified JSON schema format to `events.jsonl`.
4. **Intelligence API**: Ingests JSONL streams in transactional batches via FastAPI, matching records against loaded POS transactions.
5. **Live Dashboard**: Replays events into the database in simulated real-time and renders store analytics via a rich CLI layout.

---

## 2. Component Decisions

* **SQLite & SQLAlchemy Core**: SQLite is chosen for simplicity and low operational overhead during deployment, abstracting access through SQLAlchemy Core so that migration to high-throughput servers (like PostgreSQL) requires only a connection string adjustment.
* **FastAPI**: Provides high-performance, asynchronous REST routing and validation, enabling validation error logging without dropping valid items.
* **Torso HSV Color Histogram (staff_id.py)**: Avoids complex neural networks by analyzing the top 45% torso segment for dark colors to identify black staff uniforms.
* **Upper Body Descriptor (reid.py)**: Extracts a 48-dimensional normalized Hue-Saturation-Value histogram from upper body crops to trace client reentries without requiring GPU models.
* **Dedicated Stockroom (cam_stockroom.py)**: Ensures CAM_4 is separated from client zones and leverages stockroom occurrences to dynamically update staff flags on other cameras.

---

## 3. AI-Assisted Decisions

1. **Zone Polygons & Point-in-Polygon Testing**: The LLM proposed mapping 2D zone coordinates from actual camera dimensions and using `cv2.pointPolygonTest` to resolve whether track centroids fall within retail regions. This replaced complex grid cell mappings.
2. **Timezone IST Standardization**: Initial model outputs proposed treating POS logs as UTC. This was overridden because analysis showed POS records are stored in IST store wall-clock times. Both camera and POS data are localized to `UTC+5:30` (IST) to resolve transaction matching offsets.
3. **FIFO Visitor-ID Propagation**: The model suggested simple time-window matching to map visitors from CAM_3 to CAM_1/CAM_2/CAM_5. This was upgraded to an explicit First-In, First-Out (FIFO) queue search matching closest entries to prevent collisions when groups enter together.

---

## 4. Known Limitations

* **Video Clip Time constraints**: The provided video clips represent a brief 2-minute interval (`20:10` to `20:12` IST). The nearest POS transaction logs occur 16 minutes before and 13 minutes after. Consequently, the real conversion rate for this test dataset is `0.0`, which is correct.
* **FIFO Propagation Accuracy**: FIFO mapping assumes entry ordering is preserved. If visitors pass each other between cameras, assignments could swap. Cross-camera Re-ID embedding matches would resolve this in production.
* **Simulated Baseline**: Due to the lack of historical records, the 7-day average for `CONVERSION_DROP` checks is hardcoded to `0.28`.
* **YOLOv8 Occupancy Gaps**: Under low lighting or high occlusion (such as behind structural columns), YOLOv8 tracking might assign new track IDs to existing visitors, triggering synthetic user creation.
