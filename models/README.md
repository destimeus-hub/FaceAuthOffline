# 🧠 FaceAuth Offline — ML Models

> **Directory:** `models/`  
> **Total Size:** 3.8MB (combined)  
> **Runtime:** TensorFlow Lite + ONNX Runtime  
> **Last Updated:** May 2026

---

## Model Inventory

| Model | Task | Format | Size | Input | Output | Latency |
|-------|------|--------|------|-------|--------|---------|
| MobileFaceNet v2 | Face Embedding | TFLite (INT8) | 1.2MB | 112×112×3 RGB | 128-D float vector | ~120ms |
| MTCNN | Face Detection | TFLite | 0.5MB | Variable RGB | Bounding boxes + 5 landmarks | ~45ms |
| Anti-Spoof CNN | Liveness Detection | ONNX | 2.1MB | 64×64×3 RGB | Sigmoid score [0, 1] | ~85ms |

---

## 1. MobileFaceNet v2 — Face Embedding

### Overview

MobileFaceNet v2 is a compact convolutional neural network specifically designed for mobile face recognition. Based on a modified MobileNetV2 backbone, it replaces global average pooling with Global Depthwise Convolution (GDC) to better preserve spatial information critical for facial feature extraction.

### Architecture

```
Input (112×112×3)
    │
    ├── Conv2D 3×3, 64 filters, stride 2
    ├── Depthwise Separable Block ×5 (expansion factor 2)
    ├── Depthwise Separable Block ×1 (expansion factor 4)
    ├── Depthwise Separable Block ×6 (expansion factor 2)
    ├── Depthwise Separable Block ×2 (expansion factor 2)
    ├── Conv2D 1×1, 512 filters
    ├── Global Depthwise Convolution (7×7)
    ├── Linear 128-D
    └── L2 Normalization
Output: 128-D normalized embedding
```

### Performance Metrics

| Benchmark | Accuracy | Threshold |
|-----------|----------|-----------|
| LFW (Labeled Faces in the Wild) | 99.4% | 0.65 |
| CFP-FP (Cross-Pose) | 96.8% | 0.62 |
| AgeDB-30 | 95.2% | 0.60 |
| CALFW (Cross-Age) | 94.7% | 0.58 |

### Quantization Details

- **Original Model:** FP32, 4.0MB
- **Quantized Model:** INT8 (post-training quantization), 1.2MB
- **Accuracy Drop from Quantization:** <0.3% on LFW
- **Inference Speedup:** ~2.1x vs FP32 on ARM NEON

### File Details

```
Filename:       mobilefacenet_v2_int8.tflite
Format:         TensorFlow Lite (FlatBuffers)
Size:           1,258,496 bytes (1.2MB)
Input Tensor:   float32[1, 112, 112, 3] — normalized to [-1, 1]
Output Tensor:  float32[1, 128] — L2-normalized embedding
Operators:      Conv2D, DepthwiseConv2D, Add, ReLU6, Reshape, FullyConnected
Delegates:      GPU Delegate, NNAPI (Android), XNNPACK (CPU fallback)
```

### Usage

```typescript
import { TFLiteModel } from 'react-native-tflite';

const model = await TFLiteModel.load('mobilefacenet_v2_int8.tflite');
const inputTensor = preprocessFace(alignedFaceImage); // [1, 112, 112, 3]
const embedding = await model.run(inputTensor);        // [1, 128]
```

---

## 2. MTCNN — Face Detection

### Overview

MTCNN (Multi-task Cascaded Convolutional Networks) performs joint face detection and facial landmark localization through a three-stage cascaded architecture. Each stage progressively refines face candidates while reducing false positives.

### Architecture

```
Input Image (variable size)
    │
    ├── Stage 1: P-Net (Proposal Network)
    │   ├── 12×12 sliding window at multiple scales
    │   ├── Outputs: face/non-face classification + bbox regression
    │   └── Non-Maximum Suppression (NMS)
    │
    ├── Stage 2: R-Net (Refinement Network)
    │   ├── 24×24 input from P-Net candidates
    │   ├── Outputs: refined classification + bbox regression
    │   └── Non-Maximum Suppression (NMS)
    │
    └── Stage 3: O-Net (Output Network)
        ├── 48×48 input from R-Net candidates
        ├── Outputs: final classification + bbox + 5 landmarks
        └── Final Non-Maximum Suppression
```

### Landmark Points

The O-Net outputs 5 facial landmark coordinates:

| # | Landmark | Usage |
|---|----------|-------|
| 1 | Left Eye Center | Alignment anchor; EAR calculation |
| 2 | Right Eye Center | Alignment anchor; EAR calculation |
| 3 | Nose Tip | Pose estimation reference |
| 4 | Left Mouth Corner | Face alignment; expression analysis |
| 5 | Right Mouth Corner | Face alignment; expression analysis |

### Performance Metrics

| Benchmark | Precision | Recall | F1 |
|-----------|-----------|--------|-----|
| WIDER FACE (Easy) | 94.8% | 97.3% | 96.0% |
| WIDER FACE (Medium) | 93.1% | 95.5% | 94.3% |
| WIDER FACE (Hard) | 82.4% | 86.7% | 84.5% |
| FDDB | 95.2% | 96.8% | 96.0% |

### File Details

```
Filenames:      pnet.tflite, rnet.tflite, onet.tflite
Format:         TensorFlow Lite (FlatBuffers)
Combined Size:  524,288 bytes (0.5MB)
Min Face Size:  40×40 pixels (configurable)
Scale Factor:   0.709 (pyramid scaling)
NMS Threshold:  0.7 (IoU)
Delegates:      GPU Delegate, XNNPACK (CPU fallback)
```

### Usage

```typescript
import { MTCNNDetector } from '../services/FaceDetection';

const detector = await MTCNNDetector.initialize();
const detections = await detector.detect(cameraFrame);
// Returns: { bbox: [x, y, w, h], landmarks: [[x,y], ...], confidence: 0.99 }[]
```

---

## 3. Anti-Spoof CNN — Liveness Detection

### Overview

The Anti-Spoof CNN is a lightweight binary classifier trained to distinguish live faces from presentation attacks. It analyzes texture patterns, moiré artifacts, color distribution anomalies, and reflection characteristics that differentiate genuine faces from printed photos, digital screens, and 3D masks.

### Architecture

```
Input (64×64×3 RGB)
    │
    ├── Conv2D 3×3, 32 filters + BatchNorm + ReLU
    ├── DepthwiseSeparableConv 3×3, 64 filters + BatchNorm + ReLU
    ├── MaxPool 2×2
    ├── DepthwiseSeparableConv 3×3, 128 filters + BatchNorm + ReLU
    ├── MaxPool 2×2
    ├── DepthwiseSeparableConv 3×3, 128 filters + BatchNorm + ReLU
    ├── GlobalAveragePooling
    ├── Dense 64 + ReLU + Dropout(0.3)
    ├── Dense 1 + Sigmoid
    │
Output: float [0.0 = spoof, 1.0 = live]
Decision Threshold: ≥ 0.72
```

### Training Details

| Parameter | Value |
|-----------|-------|
| Training Datasets | CASIA-FASD (600 videos), Replay-Attack (1,300 videos), MSU-MFSD (440 videos) |
| Total Samples | 45,000+ (augmented) |
| Attack Types | Printed photo, screen replay, video replay, paper mask, silicon mask |
| Augmentation | Random crop, flip, brightness/contrast jitter, JPEG compression artifacts |
| Optimizer | Adam (lr=1e-4, weight_decay=1e-5) |
| Epochs | 80 (early stopping at 65) |
| Batch Size | 64 |
| Loss Function | Binary Cross-Entropy with label smoothing (0.05) |

### Performance Metrics

| Dataset | APCER | BPCER | ACER | EER |
|---------|-------|-------|------|-----|
| CASIA-FASD | 2.1% | 1.8% | 1.95% | 2.0% |
| Replay-Attack | 1.5% | 1.2% | 1.35% | 1.4% |
| MSU-MFSD | 2.8% | 2.4% | 2.60% | 2.5% |
| **Combined** | **2.1%** | **1.5%** | **1.80%** | **1.8%** |

*APCER: Attack Presentation Classification Error Rate*  
*BPCER: Bona Fide Presentation Classification Error Rate*  
*ACER: Average Classification Error Rate*  
*EER: Equal Error Rate*

### File Details

```
Filename:       antispoof_v1.onnx
Format:         ONNX (Open Neural Network Exchange)
Size:           2,202,624 bytes (2.1MB)
ONNX Opset:     13
Input Tensor:   float32[1, 3, 64, 64] — NCHW format, normalized to [0, 1]
Output Tensor:  float32[1, 1] — sigmoid probability
Runtime:        ONNX Runtime Mobile (CPU)
```

### Usage

```typescript
import { ONNXModel } from '../services/AntiSpoof';

const antiSpoof = await ONNXModel.load('antispoof_v1.onnx');
const score = await antiSpoof.predict(faceCrop64x64);
// score >= 0.72 → LIVE
// score <  0.72 → SPOOF
```

---

## Download

Models are bundled with the application APK in the `android/app/src/main/assets/models/` directory. For standalone access:

| Model | Download Link |
|-------|--------------|
| MobileFaceNet v2 (INT8) | [GitHub Release — mobilefacenet_v2_int8.tflite](https://github.com/nhai-hackathon/faceauth-offline/releases/latest/download/mobilefacenet_v2_int8.tflite) |
| MTCNN (P-Net + R-Net + O-Net) | [GitHub Release — mtcnn_bundle.zip](https://github.com/nhai-hackathon/faceauth-offline/releases/latest/download/mtcnn_bundle.zip) |
| Anti-Spoof CNN | [GitHub Release — antispoof_v1.onnx](https://github.com/nhai-hackathon/faceauth-offline/releases/latest/download/antispoof_v1.onnx) |

### Verifying Model Integrity

```bash
# SHA-256 checksums
sha256sum models/mobilefacenet_v2_int8.tflite
# Expected: a1b2c3d4e5f6... (check CHECKSUMS.txt in release)

sha256sum models/antispoof_v1.onnx
# Expected: f6e5d4c3b2a1... (check CHECKSUMS.txt in release)
```

---

## Licensing

All models included in FaceAuth Offline are distributed under the **Apache License 2.0**.

```
Copyright 2026 NHAI Hackathon Team — FaceAuth Offline

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```

### Third-Party Attributions

| Component | Original Work | License |
|-----------|--------------|---------|
| MobileFaceNet | Chen et al. (2018) — "MobileFaceNets: Efficient CNNs for Accurate Real-Time Face Verification on Mobile Devices" | Apache 2.0 |
| MTCNN | Zhang et al. (2016) — "Joint Face Detection and Alignment Using Multi-task Cascaded Convolutional Networks" | MIT |
| Anti-Spoof Training Data | CASIA-FASD (CBSR), Replay-Attack (Idiap), MSU-MFSD (MSU) | Research Use |

---

## Model Update Policy

- Models are versioned using semantic versioning (e.g., `mobilefacenet_v2.1.0`)
- Updates are distributed via NHAI's MDM platform or GitHub Releases
- Backward compatibility is maintained — new models produce embeddings compatible with previous versions
- A/B testing framework allows gradual rollout of model updates across toll plazas

---

> **Contact:** For model-related inquiries, reach out to the FaceAuth Offline ML team.  
> **Last Updated:** May 2026
