# grpc-message-size-benchmark
Benchmarks for gRPC message size limits (4MB vs 20MB) — latency, throughput, memory across payload sizes and concurrency levels

| Config     | Payload | Status | Mean (ms) | p95 (ms) | p99 (ms) | Throughput (rps) |
| ---------- | ------- | ------ | --------- | -------- | -------- | ---------------- |
| 4MB_limit  | 128 KB  | ✅ OK   | 5.05      | 8.55     | 14.19    | 198.2            |
| 4MB_limit  | 512 KB  | ✅ OK   | 7.63      | 28.42    | 28.42    | 131.1            |
| 4MB_limit  | 1 MB    | ✅ OK   | 8.36      | 15.67    | 15.67    | 119.6            |
| 4MB_limit  | 3.9 MB  | ✅ OK   | 23.41     | 31.87    | 31.87    | 42.7             |
| 4MB_limit  | 4 MB    | ❌ FAIL | —         | —        | —        | —                |
| 4MB_limit  | 8 MB    | ❌ FAIL | —         | —        | —        | —                |
| 20MB_limit | 128 KB  | ✅ OK   | 1.51      | 1.73     | 2.82     | 664.0            |
| 20MB_limit | 512 KB  | ✅ OK   | 5.13      | 16.58    | 16.58    | 195.0            |
| 20MB_limit | 1 MB    | ✅ OK   | 8.74      | 15.52    | 15.52    | 114.5            |
| 20MB_limit | 3.9 MB  | ✅ OK   | 30.48     | 41.51    | 41.51    | 32.8             |
| 20MB_limit | 4 MB    | ✅ OK   | 26.71     | 37.18    | 37.18    | 37.4             |
| 20MB_limit | 8 MB    | ✅ OK   | 50.80     | 59.71    | 59.71    | 19.7             |
| 20MB_limit | 16 MB   | ✅ OK   | 92.02     | 102.95   | 102.95   | 10.9             |
| 20MB_limit | 20 MB   | ❌ FAIL | —         | —        | —        | —                |
| 20MB_limit | 21 MB   | ❌ FAIL | —         | —        | —        | —                |
