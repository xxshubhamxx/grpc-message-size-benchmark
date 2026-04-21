# grpc-message-size-benchmark
Benchmarks for gRPC message size limits (4MB vs 20MB) — latency, throughput, memory across payload sizes and concurrency levels

| Config     | Payload | Status | Mean (ms) | p95 (ms) | p99 (ms) | Throughput (rps) |
| ---------- | ------- | ------ | --------- | -------- | -------- | ---------------- |
| 4MB_limit  | 128 KB  | ✅ OK   | 3.82      | 5.07     | 12.41    | 261.9            |
| 4MB_limit  | 512 KB  | ✅ OK   | 5.39      | 14.60    | 14.60    | 185.5            |
| 4MB_limit  | 1 MB    | ✅ OK   | 13.25     | 22.81    | 22.81    | 75.5             |
| 4MB_limit  | 3.9 MB  | ✅ OK   | 47.33     | 106.64   | 106.64   | 21.1             |
| 4MB_limit  | 4 MB    | ❌ FAIL | —         | —        | —        | —                |
| 4MB_limit  | 8 MB    | ❌ FAIL | —         | —        | —        | —                |
| 20MB_limit | 128 KB  | ✅ OK   | 1.99      | 2.93     | 7.69     | 501.4            |
| 20MB_limit | 512 KB  | ✅ OK   | 5.01      | 14.21    | 14.21    | 199.5            |
| 20MB_limit | 1 MB    | ✅ OK   | 11.31     | 26.57    | 26.57    | 88.4             |
| 20MB_limit | 3.9 MB  | ✅ OK   | 33.15     | 72.31    | 72.31    | 30.2             |
| 20MB_limit | 4 MB    | ✅ OK   | 25.54     | 36.05    | 36.05    | 39.1             |
| 20MB_limit | 8 MB    | ✅ OK   | 44.81     | 69.04    | 69.04    | 22.3             |
| 20MB_limit | 16 MB   | ✅ OK   | 141.45    | 201.85   | 201.85   | 7.1              |
| 20MB_limit | 20 MB   | ❌ FAIL | —         | —        | —        | —                |
| 20MB_limit | 21 MB   | ❌ FAIL | —         | —        | —        | —                |