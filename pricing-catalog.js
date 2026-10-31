/**
 * Generated provider price catalog (USD per 1M tokens).
 *
 * Derived from the `dsh-cost-meter` catalog (`docs/provider-pricing.json`,
 * generated 2026-09-01 from OpenCode Zen/Go list prices). Prices are flat, so the
 * peak and off-peak sides are identical. Regenerate with
 * `node scripts/build-catalog.mjs`.
 */

export const PROVIDER_PRICES = {
  "openai:gpt-5.6-sol": {
    "input": {
      "peak": 2,
      "offPeak": 2
    },
    "cacheHit": {
      "peak": 0.2,
      "offPeak": 0.2
    },
    "output": {
      "peak": 10,
      "offPeak": 10
    }
  },
  "openai:gpt-5.6-terra": {
    "input": {
      "peak": 2,
      "offPeak": 2
    },
    "cacheHit": {
      "peak": 0.2,
      "offPeak": 0.2
    },
    "output": {
      "peak": 12,
      "offPeak": 12
    }
  },
  "openai:gpt-5.6-luna": {
    "input": {
      "peak": 0.2,
      "offPeak": 0.2
    },
    "cacheHit": {
      "peak": 0.02,
      "offPeak": 0.02
    },
    "output": {
      "peak": 1.2,
      "offPeak": 1.2
    }
  },
  "openai:gpt-5.5": {
    "input": {
      "peak": 5,
      "offPeak": 5
    },
    "cacheHit": {
      "peak": 0.5,
      "offPeak": 0.5
    },
    "output": {
      "peak": 30,
      "offPeak": 30
    }
  },
  "openai:gpt-5.5-pro": {
    "input": {
      "peak": 30,
      "offPeak": 30
    },
    "cacheHit": {
      "peak": 30,
      "offPeak": 30
    },
    "output": {
      "peak": 180,
      "offPeak": 180
    }
  },
  "openai:gpt-5.4": {
    "input": {
      "peak": 2.5,
      "offPeak": 2.5
    },
    "cacheHit": {
      "peak": 0.25,
      "offPeak": 0.25
    },
    "output": {
      "peak": 15,
      "offPeak": 15
    }
  },
  "openai:gpt-5.4-pro": {
    "input": {
      "peak": 30,
      "offPeak": 30
    },
    "cacheHit": {
      "peak": 30,
      "offPeak": 30
    },
    "output": {
      "peak": 180,
      "offPeak": 180
    }
  },
  "openai:gpt-5.4-mini": {
    "input": {
      "peak": 0.75,
      "offPeak": 0.75
    },
    "cacheHit": {
      "peak": 0.075,
      "offPeak": 0.075
    },
    "output": {
      "peak": 4.5,
      "offPeak": 4.5
    }
  },
  "openai:gpt-5.4-nano": {
    "input": {
      "peak": 0.2,
      "offPeak": 0.2
    },
    "cacheHit": {
      "peak": 0.02,
      "offPeak": 0.02
    },
    "output": {
      "peak": 1.25,
      "offPeak": 1.25
    }
  },
  "openai:gpt-5.3-codex": {
    "input": {
      "peak": 1.75,
      "offPeak": 1.75
    },
    "cacheHit": {
      "peak": 0.175,
      "offPeak": 0.175
    },
    "output": {
      "peak": 14,
      "offPeak": 14
    }
  },
  "openai:gpt-5.3-codex-spark": {
    "input": {
      "peak": 1.75,
      "offPeak": 1.75
    },
    "cacheHit": {
      "peak": 0.175,
      "offPeak": 0.175
    },
    "output": {
      "peak": 14,
      "offPeak": 14
    }
  },
  "openai:gpt-5.2": {
    "input": {
      "peak": 1.75,
      "offPeak": 1.75
    },
    "cacheHit": {
      "peak": 0.175,
      "offPeak": 0.175
    },
    "output": {
      "peak": 14,
      "offPeak": 14
    }
  },
  "openai:gpt-5.2-codex": {
    "input": {
      "peak": 1.75,
      "offPeak": 1.75
    },
    "cacheHit": {
      "peak": 0.175,
      "offPeak": 0.175
    },
    "output": {
      "peak": 14,
      "offPeak": 14
    }
  },
  "openai:gpt-5.1": {
    "input": {
      "peak": 1.07,
      "offPeak": 1.07
    },
    "cacheHit": {
      "peak": 0.107,
      "offPeak": 0.107
    },
    "output": {
      "peak": 8.5,
      "offPeak": 8.5
    }
  },
  "openai:gpt-5.1-codex": {
    "input": {
      "peak": 1.07,
      "offPeak": 1.07
    },
    "cacheHit": {
      "peak": 0.107,
      "offPeak": 0.107
    },
    "output": {
      "peak": 8.5,
      "offPeak": 8.5
    }
  },
  "openai:gpt-5.1-codex-max": {
    "input": {
      "peak": 1.25,
      "offPeak": 1.25
    },
    "cacheHit": {
      "peak": 0.125,
      "offPeak": 0.125
    },
    "output": {
      "peak": 10,
      "offPeak": 10
    }
  },
  "openai:gpt-5.1-codex-mini": {
    "input": {
      "peak": 0.25,
      "offPeak": 0.25
    },
    "cacheHit": {
      "peak": 0.025,
      "offPeak": 0.025
    },
    "output": {
      "peak": 2,
      "offPeak": 2
    }
  },
  "openai:gpt-5": {
    "input": {
      "peak": 1.07,
      "offPeak": 1.07
    },
    "cacheHit": {
      "peak": 0.107,
      "offPeak": 0.107
    },
    "output": {
      "peak": 8.5,
      "offPeak": 8.5
    }
  },
  "openai:gpt-5-codex": {
    "input": {
      "peak": 1.07,
      "offPeak": 1.07
    },
    "cacheHit": {
      "peak": 0.107,
      "offPeak": 0.107
    },
    "output": {
      "peak": 8.5,
      "offPeak": 8.5
    }
  },
  "openai:gpt-5-nano": {
    "input": {
      "peak": 0.05,
      "offPeak": 0.05
    },
    "cacheHit": {
      "peak": 0.005,
      "offPeak": 0.005
    },
    "output": {
      "peak": 0.4,
      "offPeak": 0.4
    }
  },
  "openai:gpt-5-2025-08-07": {
    "input": {
      "peak": 1.25,
      "offPeak": 1.25
    },
    "cacheHit": {
      "peak": 0.13,
      "offPeak": 0.13
    },
    "output": {
      "peak": 10,
      "offPeak": 10
    }
  },
  "openai:gpt-4.1-2025-04-14": {
    "input": {
      "peak": 2,
      "offPeak": 2
    },
    "cacheHit": {
      "peak": 0.5,
      "offPeak": 0.5
    },
    "output": {
      "peak": 8,
      "offPeak": 8
    }
  },
  "openai:gpt-4.1-mini-2025-04-14": {
    "input": {
      "peak": 0.4,
      "offPeak": 0.4
    },
    "cacheHit": {
      "peak": 0.1,
      "offPeak": 0.1
    },
    "output": {
      "peak": 1.6,
      "offPeak": 1.6
    }
  },
  "anthropic:claude-fable-5": {
    "input": {
      "peak": 10,
      "offPeak": 10
    },
    "cacheHit": {
      "peak": 1,
      "offPeak": 1
    },
    "output": {
      "peak": 50,
      "offPeak": 50
    }
  },
  "anthropic:claude-opus-5": {
    "input": {
      "peak": 5,
      "offPeak": 5
    },
    "cacheHit": {
      "peak": 0.5,
      "offPeak": 0.5
    },
    "output": {
      "peak": 25,
      "offPeak": 25
    }
  },
  "anthropic:claude-opus-4-8": {
    "input": {
      "peak": 5,
      "offPeak": 5
    },
    "cacheHit": {
      "peak": 0.5,
      "offPeak": 0.5
    },
    "output": {
      "peak": 25,
      "offPeak": 25
    }
  },
  "anthropic:claude-opus-4-7": {
    "input": {
      "peak": 5,
      "offPeak": 5
    },
    "cacheHit": {
      "peak": 0.5,
      "offPeak": 0.5
    },
    "output": {
      "peak": 25,
      "offPeak": 25
    }
  },
  "anthropic:claude-opus-4-6": {
    "input": {
      "peak": 5,
      "offPeak": 5
    },
    "cacheHit": {
      "peak": 0.5,
      "offPeak": 0.5
    },
    "output": {
      "peak": 25,
      "offPeak": 25
    }
  },
  "anthropic:claude-opus-4-5": {
    "input": {
      "peak": 5,
      "offPeak": 5
    },
    "cacheHit": {
      "peak": 0.5,
      "offPeak": 0.5
    },
    "output": {
      "peak": 25,
      "offPeak": 25
    }
  },
  "anthropic:claude-sonnet-5": {
    "input": {
      "peak": 2,
      "offPeak": 2
    },
    "cacheHit": {
      "peak": 0.2,
      "offPeak": 0.2
    },
    "output": {
      "peak": 10,
      "offPeak": 10
    }
  },
  "anthropic:claude-sonnet-4-6": {
    "input": {
      "peak": 3,
      "offPeak": 3
    },
    "cacheHit": {
      "peak": 0.3,
      "offPeak": 0.3
    },
    "output": {
      "peak": 15,
      "offPeak": 15
    }
  },
  "anthropic:claude-sonnet-4-5": {
    "input": {
      "peak": 3,
      "offPeak": 3
    },
    "cacheHit": {
      "peak": 0.3,
      "offPeak": 0.3
    },
    "output": {
      "peak": 15,
      "offPeak": 15
    }
  },
  "anthropic:claude-haiku-4-5": {
    "input": {
      "peak": 1,
      "offPeak": 1
    },
    "cacheHit": {
      "peak": 0.1,
      "offPeak": 0.1
    },
    "output": {
      "peak": 5,
      "offPeak": 5
    }
  },
  "google:gemini-3.7-flash": {
    "input": {
      "peak": 0.75,
      "offPeak": 0.75
    },
    "cacheHit": {
      "peak": 0.75,
      "offPeak": 0.75
    },
    "output": {
      "peak": 3.75,
      "offPeak": 3.75
    }
  },
  "google:gemini-3.6-flash": {
    "input": {
      "peak": 1.5,
      "offPeak": 1.5
    },
    "cacheHit": {
      "peak": 0.15,
      "offPeak": 0.15
    },
    "output": {
      "peak": 7.5,
      "offPeak": 7.5
    }
  },
  "google:gemini-3.5-flash": {
    "input": {
      "peak": 1.5,
      "offPeak": 1.5
    },
    "cacheHit": {
      "peak": 0.15,
      "offPeak": 0.15
    },
    "output": {
      "peak": 9,
      "offPeak": 9
    }
  },
  "google:gemini-3.5-flash-lite": {
    "input": {
      "peak": 0.3,
      "offPeak": 0.3
    },
    "cacheHit": {
      "peak": 0.03,
      "offPeak": 0.03
    },
    "output": {
      "peak": 2.5,
      "offPeak": 2.5
    }
  },
  "google:gemini-3.1-pro-preview": {
    "input": {
      "peak": 2,
      "offPeak": 2
    },
    "cacheHit": {
      "peak": 0.2,
      "offPeak": 0.2
    },
    "output": {
      "peak": 12,
      "offPeak": 12
    }
  },
  "google:gemini-3.1-pro": {
    "input": {
      "peak": 2,
      "offPeak": 2
    },
    "cacheHit": {
      "peak": 0.2,
      "offPeak": 0.2
    },
    "output": {
      "peak": 12,
      "offPeak": 12
    }
  },
  "google:gemini-3-flash": {
    "input": {
      "peak": 0.5,
      "offPeak": 0.5
    },
    "cacheHit": {
      "peak": 0.05,
      "offPeak": 0.05
    },
    "output": {
      "peak": 3,
      "offPeak": 3
    }
  },
  "google:gemini-2.5-pro": {
    "input": {
      "peak": 1.25,
      "offPeak": 1.25
    },
    "cacheHit": {
      "peak": 0.125,
      "offPeak": 0.125
    },
    "output": {
      "peak": 10,
      "offPeak": 10
    }
  },
  "google:gemini-2.5-flash": {
    "input": {
      "peak": 0.3,
      "offPeak": 0.3
    },
    "cacheHit": {
      "peak": 0.03,
      "offPeak": 0.03
    },
    "output": {
      "peak": 2.5,
      "offPeak": 2.5
    }
  },
  "google:gemini-2.5-flash-lite": {
    "input": {
      "peak": 0.1,
      "offPeak": 0.1
    },
    "cacheHit": {
      "peak": 0.01,
      "offPeak": 0.01
    },
    "output": {
      "peak": 0.4,
      "offPeak": 0.4
    }
  },
  "moonshot:kimi-k3": {
    "input": {
      "peak": 3,
      "offPeak": 3
    },
    "cacheHit": {
      "peak": 0.3,
      "offPeak": 0.3
    },
    "output": {
      "peak": 15,
      "offPeak": 15
    }
  },
  "moonshot:kimi-k2.7-code": {
    "input": {
      "peak": 0.95,
      "offPeak": 0.95
    },
    "cacheHit": {
      "peak": 0.19,
      "offPeak": 0.19
    },
    "output": {
      "peak": 4,
      "offPeak": 4
    }
  },
  "moonshot:kimi-k2.6": {
    "input": {
      "peak": 0.95,
      "offPeak": 0.95
    },
    "cacheHit": {
      "peak": 0.16,
      "offPeak": 0.16
    },
    "output": {
      "peak": 4,
      "offPeak": 4
    }
  },
  "moonshot:kimi-k2.5": {
    "input": {
      "peak": 0.6,
      "offPeak": 0.6
    },
    "cacheHit": {
      "peak": 0.1,
      "offPeak": 0.1
    },
    "output": {
      "peak": 3,
      "offPeak": 3
    }
  },
  "z-ai:glm-5.3": {
    "input": {
      "peak": 1.4,
      "offPeak": 1.4
    },
    "cacheHit": {
      "peak": 0.26,
      "offPeak": 0.26
    },
    "output": {
      "peak": 4.4,
      "offPeak": 4.4
    }
  },
  "z-ai:glm-5.3-flash": {
    "input": {
      "peak": 0.15,
      "offPeak": 0.15
    },
    "cacheHit": {
      "peak": 0.03,
      "offPeak": 0.03
    },
    "output": {
      "peak": 0.5,
      "offPeak": 0.5
    }
  },
  "z-ai:glm-5.2": {
    "input": {
      "peak": 1.4,
      "offPeak": 1.4
    },
    "cacheHit": {
      "peak": 0.26,
      "offPeak": 0.26
    },
    "output": {
      "peak": 4.4,
      "offPeak": 4.4
    }
  },
  "z-ai:glm-5.1": {
    "input": {
      "peak": 1.4,
      "offPeak": 1.4
    },
    "cacheHit": {
      "peak": 0.26,
      "offPeak": 0.26
    },
    "output": {
      "peak": 4.4,
      "offPeak": 4.4
    }
  },
  "z-ai:glm-5": {
    "input": {
      "peak": 1,
      "offPeak": 1
    },
    "cacheHit": {
      "peak": 0.2,
      "offPeak": 0.2
    },
    "output": {
      "peak": 3.2,
      "offPeak": 3.2
    }
  },
  "xai:grok-4.6": {
    "input": {
      "peak": 2,
      "offPeak": 2
    },
    "cacheHit": {
      "peak": 0.5,
      "offPeak": 0.5
    },
    "output": {
      "peak": 6,
      "offPeak": 6
    }
  },
  "xai:grok-4.5": {
    "input": {
      "peak": 2,
      "offPeak": 2
    },
    "cacheHit": {
      "peak": 0.3,
      "offPeak": 0.3
    },
    "output": {
      "peak": 6,
      "offPeak": 6
    }
  },
  "xai:grok-4.3": {
    "input": {
      "peak": 1.25,
      "offPeak": 1.25
    },
    "cacheHit": {
      "peak": 1.25,
      "offPeak": 1.25
    },
    "output": {
      "peak": 2.5,
      "offPeak": 2.5
    }
  },
  "xai:grok-build-0.1": {
    "input": {
      "peak": 1,
      "offPeak": 1
    },
    "cacheHit": {
      "peak": 0.2,
      "offPeak": 0.2
    },
    "output": {
      "peak": 2,
      "offPeak": 2
    }
  },
  "alibaba:qwen3.8-max": {
    "input": {
      "peak": 2,
      "offPeak": 2
    },
    "cacheHit": {
      "peak": 0.25,
      "offPeak": 0.25
    },
    "output": {
      "peak": 6,
      "offPeak": 6
    }
  },
  "alibaba:qwen3.7-max": {
    "input": {
      "peak": 2.5,
      "offPeak": 2.5
    },
    "cacheHit": {
      "peak": 0.5,
      "offPeak": 0.5
    },
    "output": {
      "peak": 7.5,
      "offPeak": 7.5
    }
  },
  "alibaba:qwen3.7-plus": {
    "input": {
      "peak": 0.4,
      "offPeak": 0.4
    },
    "cacheHit": {
      "peak": 0.04,
      "offPeak": 0.04
    },
    "output": {
      "peak": 1.6,
      "offPeak": 1.6
    }
  },
  "alibaba:qwen3.6-plus": {
    "input": {
      "peak": 0.5,
      "offPeak": 0.5
    },
    "cacheHit": {
      "peak": 0.05,
      "offPeak": 0.05
    },
    "output": {
      "peak": 3,
      "offPeak": 3
    }
  },
  "alibaba:qwen3.5-plus": {
    "input": {
      "peak": 0.2,
      "offPeak": 0.2
    },
    "cacheHit": {
      "peak": 0.02,
      "offPeak": 0.02
    },
    "output": {
      "peak": 1.2,
      "offPeak": 1.2
    }
  },
  "alibaba:qwen3-plus": {
    "input": {
      "peak": 0.4,
      "offPeak": 0.4
    },
    "cacheHit": {
      "peak": 0.4,
      "offPeak": 0.4
    },
    "output": {
      "peak": 1.2,
      "offPeak": 1.2
    }
  },
  "minimax:minimax-m3": {
    "input": {
      "peak": 0.3,
      "offPeak": 0.3
    },
    "cacheHit": {
      "peak": 0.06,
      "offPeak": 0.06
    },
    "output": {
      "peak": 1.2,
      "offPeak": 1.2
    }
  },
  "minimax:minimax-m2.7": {
    "input": {
      "peak": 0.3,
      "offPeak": 0.3
    },
    "cacheHit": {
      "peak": 0.06,
      "offPeak": 0.06
    },
    "output": {
      "peak": 1.2,
      "offPeak": 1.2
    }
  },
  "minimax:minimax-m2.5": {
    "input": {
      "peak": 0.3,
      "offPeak": 0.3
    },
    "cacheHit": {
      "peak": 0.06,
      "offPeak": 0.06
    },
    "output": {
      "peak": 1.2,
      "offPeak": 1.2
    }
  },
  "tencent:hunyuan-a13b": {
    "input": {
      "peak": 0.0694,
      "offPeak": 0.0694
    },
    "cacheHit": {
      "peak": 0.0694,
      "offPeak": 0.0694
    },
    "output": {
      "peak": 0.2778,
      "offPeak": 0.2778
    }
  },
  "tencent:hy3": {
    "input": {
      "peak": 0.14,
      "offPeak": 0.14
    },
    "cacheHit": {
      "peak": 0.035,
      "offPeak": 0.035
    },
    "output": {
      "peak": 0.58,
      "offPeak": 0.58
    }
  },
  "xiaomi:mimo-v2.5": {
    "input": {
      "peak": 0.14,
      "offPeak": 0.14
    },
    "cacheHit": {
      "peak": 0.0028,
      "offPeak": 0.0028
    },
    "output": {
      "peak": 0.28,
      "offPeak": 0.28
    }
  },
  "xiaomi:mimo-v2.5-pro": {
    "input": {
      "peak": 0.435,
      "offPeak": 0.435
    },
    "cacheHit": {
      "peak": 0.003625,
      "offPeak": 0.003625
    },
    "output": {
      "peak": 0.87,
      "offPeak": 0.87
    }
  },
  "upstage:solar-pro4": {
    "input": {
      "peak": 0.3,
      "offPeak": 0.3
    },
    "cacheHit": {
      "peak": 0.06,
      "offPeak": 0.06
    },
    "output": {
      "peak": 1.2,
      "offPeak": 1.2
    }
  },
  "upstage:solar-pro3": {
    "input": {
      "peak": 0.15,
      "offPeak": 0.15
    },
    "cacheHit": {
      "peak": 0.015,
      "offPeak": 0.015
    },
    "output": {
      "peak": 0.6,
      "offPeak": 0.6
    }
  },
  "meta:muse-spark-1.2": {
    "input": {
      "peak": 1.25,
      "offPeak": 1.25
    },
    "cacheHit": {
      "peak": 0.15,
      "offPeak": 0.15
    },
    "output": {
      "peak": 4.25,
      "offPeak": 4.25
    }
  },
  "meituan:longcat-2.0": {
    "input": {
      "peak": 0.3,
      "offPeak": 0.3
    },
    "cacheHit": {
      "peak": 0.006,
      "offPeak": 0.006
    },
    "output": {
      "peak": 1.2,
      "offPeak": 1.2
    }
  },
  "mistral:mistral-large-2512": {
    "input": {
      "peak": 0.5,
      "offPeak": 0.5
    },
    "cacheHit": {
      "peak": 0.05,
      "offPeak": 0.05
    },
    "output": {
      "peak": 1.5,
      "offPeak": 1.5
    }
  },
  "mistral:mistral-medium-3.5": {
    "input": {
      "peak": 1.5,
      "offPeak": 1.5
    },
    "cacheHit": {
      "peak": 0.15,
      "offPeak": 0.15
    },
    "output": {
      "peak": 7.5,
      "offPeak": 7.5
    }
  },
  "mistral:mistral-small-4.0": {
    "input": {
      "peak": 0.15,
      "offPeak": 0.15
    },
    "cacheHit": {
      "peak": 0.015,
      "offPeak": 0.015
    },
    "output": {
      "peak": 0.6,
      "offPeak": 0.6
    }
  },
  "opencode-go:grok-4.5": {
    "input": {
      "peak": 2,
      "offPeak": 2
    },
    "cacheHit": {
      "peak": 0.3,
      "offPeak": 0.3
    },
    "output": {
      "peak": 6,
      "offPeak": 6
    }
  },
  "opencode-go:glm-5.3": {
    "input": {
      "peak": 1.4,
      "offPeak": 1.4
    },
    "cacheHit": {
      "peak": 0.26,
      "offPeak": 0.26
    },
    "output": {
      "peak": 4.4,
      "offPeak": 4.4
    }
  },
  "opencode-go:glm-5.3-flash": {
    "input": {
      "peak": 0.15,
      "offPeak": 0.15
    },
    "cacheHit": {
      "peak": 0.03,
      "offPeak": 0.03
    },
    "output": {
      "peak": 0.5,
      "offPeak": 0.5
    }
  },
  "opencode-go:glm-5.2": {
    "input": {
      "peak": 1.4,
      "offPeak": 1.4
    },
    "cacheHit": {
      "peak": 0.26,
      "offPeak": 0.26
    },
    "output": {
      "peak": 4.4,
      "offPeak": 4.4
    }
  },
  "opencode-go:glm-5.1": {
    "input": {
      "peak": 1.4,
      "offPeak": 1.4
    },
    "cacheHit": {
      "peak": 0.26,
      "offPeak": 0.26
    },
    "output": {
      "peak": 4.4,
      "offPeak": 4.4
    }
  },
  "opencode-go:gpt-5.6-luna": {
    "input": {
      "peak": 0.2,
      "offPeak": 0.2
    },
    "cacheHit": {
      "peak": 0.02,
      "offPeak": 0.02
    },
    "output": {
      "peak": 1.2,
      "offPeak": 1.2
    }
  },
  "opencode-go:kimi-k3": {
    "input": {
      "peak": 3,
      "offPeak": 3
    },
    "cacheHit": {
      "peak": 0.3,
      "offPeak": 0.3
    },
    "output": {
      "peak": 15,
      "offPeak": 15
    }
  },
  "opencode-go:kimi-k2.7-code": {
    "input": {
      "peak": 0.95,
      "offPeak": 0.95
    },
    "cacheHit": {
      "peak": 0.19,
      "offPeak": 0.19
    },
    "output": {
      "peak": 4,
      "offPeak": 4
    }
  },
  "opencode-go:kimi-k2.6": {
    "input": {
      "peak": 0.95,
      "offPeak": 0.95
    },
    "cacheHit": {
      "peak": 0.16,
      "offPeak": 0.16
    },
    "output": {
      "peak": 4,
      "offPeak": 4
    }
  },
  "opencode-go:mimo-v2.5": {
    "input": {
      "peak": 0.14,
      "offPeak": 0.14
    },
    "cacheHit": {
      "peak": 0.0028,
      "offPeak": 0.0028
    },
    "output": {
      "peak": 0.28,
      "offPeak": 0.28
    }
  },
  "opencode-go:mimo-v2.5-pro": {
    "input": {
      "peak": 0.435,
      "offPeak": 0.435
    },
    "cacheHit": {
      "peak": 0.003625,
      "offPeak": 0.003625
    },
    "output": {
      "peak": 0.87,
      "offPeak": 0.87
    }
  },
  "opencode-go:minimax-m3": {
    "input": {
      "peak": 0.3,
      "offPeak": 0.3
    },
    "cacheHit": {
      "peak": 0.06,
      "offPeak": 0.06
    },
    "output": {
      "peak": 1.2,
      "offPeak": 1.2
    }
  },
  "opencode-go:minimax-m2.7": {
    "input": {
      "peak": 0.3,
      "offPeak": 0.3
    },
    "cacheHit": {
      "peak": 0.06,
      "offPeak": 0.06
    },
    "output": {
      "peak": 1.2,
      "offPeak": 1.2
    }
  },
  "opencode-go:qwen3.8-max": {
    "input": {
      "peak": 2,
      "offPeak": 2
    },
    "cacheHit": {
      "peak": 0.25,
      "offPeak": 0.25
    },
    "output": {
      "peak": 6,
      "offPeak": 6
    }
  },
  "opencode-go:qwen3.7-max": {
    "input": {
      "peak": 2.5,
      "offPeak": 2.5
    },
    "cacheHit": {
      "peak": 0.5,
      "offPeak": 0.5
    },
    "output": {
      "peak": 7.5,
      "offPeak": 7.5
    }
  },
  "opencode-go:qwen3.7-plus": {
    "input": {
      "peak": 0.4,
      "offPeak": 0.4
    },
    "cacheHit": {
      "peak": 0.04,
      "offPeak": 0.04
    },
    "output": {
      "peak": 1.6,
      "offPeak": 1.6
    }
  },
  "opencode-go:qwen3.6-plus": {
    "input": {
      "peak": 0.5,
      "offPeak": 0.5
    },
    "cacheHit": {
      "peak": 0.05,
      "offPeak": 0.05
    },
    "output": {
      "peak": 3,
      "offPeak": 3
    }
  },
  "opencode-go:hy3": {
    "input": {
      "peak": 0.14,
      "offPeak": 0.14
    },
    "cacheHit": {
      "peak": 0.035,
      "offPeak": 0.035
    },
    "output": {
      "peak": 0.58,
      "offPeak": 0.58
    }
  },
  "opencode-go:longcat-2.0": {
    "input": {
      "peak": 0.3,
      "offPeak": 0.3
    },
    "cacheHit": {
      "peak": 0.006,
      "offPeak": 0.006
    },
    "output": {
      "peak": 1.2,
      "offPeak": 1.2
    }
  },
  "opencode-go:muse-spark-1.2-contributor": {
    "input": {
      "peak": 0.1,
      "offPeak": 0.1
    },
    "cacheHit": {
      "peak": 0.002,
      "offPeak": 0.002
    },
    "output": {
      "peak": 0.2,
      "offPeak": 0.2
    }
  }
}

export const MODEL_PRICES = {
  "gpt-5.6-sol": {
    "input": {
      "peak": 2,
      "offPeak": 2
    },
    "cacheHit": {
      "peak": 0.2,
      "offPeak": 0.2
    },
    "output": {
      "peak": 10,
      "offPeak": 10
    }
  },
  "gpt-5.6-terra": {
    "input": {
      "peak": 2,
      "offPeak": 2
    },
    "cacheHit": {
      "peak": 0.2,
      "offPeak": 0.2
    },
    "output": {
      "peak": 12,
      "offPeak": 12
    }
  },
  "gpt-5.6-luna": {
    "input": {
      "peak": 0.2,
      "offPeak": 0.2
    },
    "cacheHit": {
      "peak": 0.02,
      "offPeak": 0.02
    },
    "output": {
      "peak": 1.2,
      "offPeak": 1.2
    }
  },
  "gpt-5.5": {
    "input": {
      "peak": 5,
      "offPeak": 5
    },
    "cacheHit": {
      "peak": 0.5,
      "offPeak": 0.5
    },
    "output": {
      "peak": 30,
      "offPeak": 30
    }
  },
  "gpt-5.5-pro": {
    "input": {
      "peak": 30,
      "offPeak": 30
    },
    "cacheHit": {
      "peak": 30,
      "offPeak": 30
    },
    "output": {
      "peak": 180,
      "offPeak": 180
    }
  },
  "gpt-5.4": {
    "input": {
      "peak": 2.5,
      "offPeak": 2.5
    },
    "cacheHit": {
      "peak": 0.25,
      "offPeak": 0.25
    },
    "output": {
      "peak": 15,
      "offPeak": 15
    }
  },
  "gpt-5.4-pro": {
    "input": {
      "peak": 30,
      "offPeak": 30
    },
    "cacheHit": {
      "peak": 30,
      "offPeak": 30
    },
    "output": {
      "peak": 180,
      "offPeak": 180
    }
  },
  "gpt-5.4-mini": {
    "input": {
      "peak": 0.75,
      "offPeak": 0.75
    },
    "cacheHit": {
      "peak": 0.075,
      "offPeak": 0.075
    },
    "output": {
      "peak": 4.5,
      "offPeak": 4.5
    }
  },
  "gpt-5.4-nano": {
    "input": {
      "peak": 0.2,
      "offPeak": 0.2
    },
    "cacheHit": {
      "peak": 0.02,
      "offPeak": 0.02
    },
    "output": {
      "peak": 1.25,
      "offPeak": 1.25
    }
  },
  "gpt-5.3-codex": {
    "input": {
      "peak": 1.75,
      "offPeak": 1.75
    },
    "cacheHit": {
      "peak": 0.175,
      "offPeak": 0.175
    },
    "output": {
      "peak": 14,
      "offPeak": 14
    }
  },
  "gpt-5.3-codex-spark": {
    "input": {
      "peak": 1.75,
      "offPeak": 1.75
    },
    "cacheHit": {
      "peak": 0.175,
      "offPeak": 0.175
    },
    "output": {
      "peak": 14,
      "offPeak": 14
    }
  },
  "gpt-5.2": {
    "input": {
      "peak": 1.75,
      "offPeak": 1.75
    },
    "cacheHit": {
      "peak": 0.175,
      "offPeak": 0.175
    },
    "output": {
      "peak": 14,
      "offPeak": 14
    }
  },
  "gpt-5.2-codex": {
    "input": {
      "peak": 1.75,
      "offPeak": 1.75
    },
    "cacheHit": {
      "peak": 0.175,
      "offPeak": 0.175
    },
    "output": {
      "peak": 14,
      "offPeak": 14
    }
  },
  "gpt-5.1": {
    "input": {
      "peak": 1.07,
      "offPeak": 1.07
    },
    "cacheHit": {
      "peak": 0.107,
      "offPeak": 0.107
    },
    "output": {
      "peak": 8.5,
      "offPeak": 8.5
    }
  },
  "gpt-5.1-codex": {
    "input": {
      "peak": 1.07,
      "offPeak": 1.07
    },
    "cacheHit": {
      "peak": 0.107,
      "offPeak": 0.107
    },
    "output": {
      "peak": 8.5,
      "offPeak": 8.5
    }
  },
  "gpt-5.1-codex-max": {
    "input": {
      "peak": 1.25,
      "offPeak": 1.25
    },
    "cacheHit": {
      "peak": 0.125,
      "offPeak": 0.125
    },
    "output": {
      "peak": 10,
      "offPeak": 10
    }
  },
  "gpt-5.1-codex-mini": {
    "input": {
      "peak": 0.25,
      "offPeak": 0.25
    },
    "cacheHit": {
      "peak": 0.025,
      "offPeak": 0.025
    },
    "output": {
      "peak": 2,
      "offPeak": 2
    }
  },
  "gpt-5": {
    "input": {
      "peak": 1.07,
      "offPeak": 1.07
    },
    "cacheHit": {
      "peak": 0.107,
      "offPeak": 0.107
    },
    "output": {
      "peak": 8.5,
      "offPeak": 8.5
    }
  },
  "gpt-5-codex": {
    "input": {
      "peak": 1.07,
      "offPeak": 1.07
    },
    "cacheHit": {
      "peak": 0.107,
      "offPeak": 0.107
    },
    "output": {
      "peak": 8.5,
      "offPeak": 8.5
    }
  },
  "gpt-5-nano": {
    "input": {
      "peak": 0.05,
      "offPeak": 0.05
    },
    "cacheHit": {
      "peak": 0.005,
      "offPeak": 0.005
    },
    "output": {
      "peak": 0.4,
      "offPeak": 0.4
    }
  },
  "gpt-5-2025-08-07": {
    "input": {
      "peak": 1.25,
      "offPeak": 1.25
    },
    "cacheHit": {
      "peak": 0.13,
      "offPeak": 0.13
    },
    "output": {
      "peak": 10,
      "offPeak": 10
    }
  },
  "gpt-4.1-2025-04-14": {
    "input": {
      "peak": 2,
      "offPeak": 2
    },
    "cacheHit": {
      "peak": 0.5,
      "offPeak": 0.5
    },
    "output": {
      "peak": 8,
      "offPeak": 8
    }
  },
  "gpt-4.1-mini-2025-04-14": {
    "input": {
      "peak": 0.4,
      "offPeak": 0.4
    },
    "cacheHit": {
      "peak": 0.1,
      "offPeak": 0.1
    },
    "output": {
      "peak": 1.6,
      "offPeak": 1.6
    }
  },
  "claude-fable-5": {
    "input": {
      "peak": 10,
      "offPeak": 10
    },
    "cacheHit": {
      "peak": 1,
      "offPeak": 1
    },
    "output": {
      "peak": 50,
      "offPeak": 50
    }
  },
  "claude-opus-5": {
    "input": {
      "peak": 5,
      "offPeak": 5
    },
    "cacheHit": {
      "peak": 0.5,
      "offPeak": 0.5
    },
    "output": {
      "peak": 25,
      "offPeak": 25
    }
  },
  "claude-opus-4-8": {
    "input": {
      "peak": 5,
      "offPeak": 5
    },
    "cacheHit": {
      "peak": 0.5,
      "offPeak": 0.5
    },
    "output": {
      "peak": 25,
      "offPeak": 25
    }
  },
  "claude-opus-4-7": {
    "input": {
      "peak": 5,
      "offPeak": 5
    },
    "cacheHit": {
      "peak": 0.5,
      "offPeak": 0.5
    },
    "output": {
      "peak": 25,
      "offPeak": 25
    }
  },
  "claude-opus-4-6": {
    "input": {
      "peak": 5,
      "offPeak": 5
    },
    "cacheHit": {
      "peak": 0.5,
      "offPeak": 0.5
    },
    "output": {
      "peak": 25,
      "offPeak": 25
    }
  },
  "claude-opus-4-5": {
    "input": {
      "peak": 5,
      "offPeak": 5
    },
    "cacheHit": {
      "peak": 0.5,
      "offPeak": 0.5
    },
    "output": {
      "peak": 25,
      "offPeak": 25
    }
  },
  "claude-sonnet-5": {
    "input": {
      "peak": 2,
      "offPeak": 2
    },
    "cacheHit": {
      "peak": 0.2,
      "offPeak": 0.2
    },
    "output": {
      "peak": 10,
      "offPeak": 10
    }
  },
  "claude-sonnet-4-6": {
    "input": {
      "peak": 3,
      "offPeak": 3
    },
    "cacheHit": {
      "peak": 0.3,
      "offPeak": 0.3
    },
    "output": {
      "peak": 15,
      "offPeak": 15
    }
  },
  "claude-sonnet-4-5": {
    "input": {
      "peak": 3,
      "offPeak": 3
    },
    "cacheHit": {
      "peak": 0.3,
      "offPeak": 0.3
    },
    "output": {
      "peak": 15,
      "offPeak": 15
    }
  },
  "claude-haiku-4-5": {
    "input": {
      "peak": 1,
      "offPeak": 1
    },
    "cacheHit": {
      "peak": 0.1,
      "offPeak": 0.1
    },
    "output": {
      "peak": 5,
      "offPeak": 5
    }
  },
  "gemini-3.7-flash": {
    "input": {
      "peak": 0.75,
      "offPeak": 0.75
    },
    "cacheHit": {
      "peak": 0.75,
      "offPeak": 0.75
    },
    "output": {
      "peak": 3.75,
      "offPeak": 3.75
    }
  },
  "gemini-3.6-flash": {
    "input": {
      "peak": 1.5,
      "offPeak": 1.5
    },
    "cacheHit": {
      "peak": 0.15,
      "offPeak": 0.15
    },
    "output": {
      "peak": 7.5,
      "offPeak": 7.5
    }
  },
  "gemini-3.5-flash": {
    "input": {
      "peak": 1.5,
      "offPeak": 1.5
    },
    "cacheHit": {
      "peak": 0.15,
      "offPeak": 0.15
    },
    "output": {
      "peak": 9,
      "offPeak": 9
    }
  },
  "gemini-3.5-flash-lite": {
    "input": {
      "peak": 0.3,
      "offPeak": 0.3
    },
    "cacheHit": {
      "peak": 0.03,
      "offPeak": 0.03
    },
    "output": {
      "peak": 2.5,
      "offPeak": 2.5
    }
  },
  "gemini-3.1-pro-preview": {
    "input": {
      "peak": 2,
      "offPeak": 2
    },
    "cacheHit": {
      "peak": 0.2,
      "offPeak": 0.2
    },
    "output": {
      "peak": 12,
      "offPeak": 12
    }
  },
  "gemini-3.1-pro": {
    "input": {
      "peak": 2,
      "offPeak": 2
    },
    "cacheHit": {
      "peak": 0.2,
      "offPeak": 0.2
    },
    "output": {
      "peak": 12,
      "offPeak": 12
    }
  },
  "gemini-3-flash": {
    "input": {
      "peak": 0.5,
      "offPeak": 0.5
    },
    "cacheHit": {
      "peak": 0.05,
      "offPeak": 0.05
    },
    "output": {
      "peak": 3,
      "offPeak": 3
    }
  },
  "gemini-2.5-pro": {
    "input": {
      "peak": 1.25,
      "offPeak": 1.25
    },
    "cacheHit": {
      "peak": 0.125,
      "offPeak": 0.125
    },
    "output": {
      "peak": 10,
      "offPeak": 10
    }
  },
  "gemini-2.5-flash": {
    "input": {
      "peak": 0.3,
      "offPeak": 0.3
    },
    "cacheHit": {
      "peak": 0.03,
      "offPeak": 0.03
    },
    "output": {
      "peak": 2.5,
      "offPeak": 2.5
    }
  },
  "gemini-2.5-flash-lite": {
    "input": {
      "peak": 0.1,
      "offPeak": 0.1
    },
    "cacheHit": {
      "peak": 0.01,
      "offPeak": 0.01
    },
    "output": {
      "peak": 0.4,
      "offPeak": 0.4
    }
  },
  "kimi-k3": {
    "input": {
      "peak": 3,
      "offPeak": 3
    },
    "cacheHit": {
      "peak": 0.3,
      "offPeak": 0.3
    },
    "output": {
      "peak": 15,
      "offPeak": 15
    }
  },
  "kimi-k2.7-code": {
    "input": {
      "peak": 0.95,
      "offPeak": 0.95
    },
    "cacheHit": {
      "peak": 0.19,
      "offPeak": 0.19
    },
    "output": {
      "peak": 4,
      "offPeak": 4
    }
  },
  "kimi-k2.6": {
    "input": {
      "peak": 0.95,
      "offPeak": 0.95
    },
    "cacheHit": {
      "peak": 0.16,
      "offPeak": 0.16
    },
    "output": {
      "peak": 4,
      "offPeak": 4
    }
  },
  "kimi-k2.5": {
    "input": {
      "peak": 0.6,
      "offPeak": 0.6
    },
    "cacheHit": {
      "peak": 0.1,
      "offPeak": 0.1
    },
    "output": {
      "peak": 3,
      "offPeak": 3
    }
  },
  "glm-5.3": {
    "input": {
      "peak": 1.4,
      "offPeak": 1.4
    },
    "cacheHit": {
      "peak": 0.26,
      "offPeak": 0.26
    },
    "output": {
      "peak": 4.4,
      "offPeak": 4.4
    }
  },
  "glm-5.3-flash": {
    "input": {
      "peak": 0.15,
      "offPeak": 0.15
    },
    "cacheHit": {
      "peak": 0.03,
      "offPeak": 0.03
    },
    "output": {
      "peak": 0.5,
      "offPeak": 0.5
    }
  },
  "glm-5.2": {
    "input": {
      "peak": 1.4,
      "offPeak": 1.4
    },
    "cacheHit": {
      "peak": 0.26,
      "offPeak": 0.26
    },
    "output": {
      "peak": 4.4,
      "offPeak": 4.4
    }
  },
  "glm-5.1": {
    "input": {
      "peak": 1.4,
      "offPeak": 1.4
    },
    "cacheHit": {
      "peak": 0.26,
      "offPeak": 0.26
    },
    "output": {
      "peak": 4.4,
      "offPeak": 4.4
    }
  },
  "glm-5": {
    "input": {
      "peak": 1,
      "offPeak": 1
    },
    "cacheHit": {
      "peak": 0.2,
      "offPeak": 0.2
    },
    "output": {
      "peak": 3.2,
      "offPeak": 3.2
    }
  },
  "grok-4.6": {
    "input": {
      "peak": 2,
      "offPeak": 2
    },
    "cacheHit": {
      "peak": 0.5,
      "offPeak": 0.5
    },
    "output": {
      "peak": 6,
      "offPeak": 6
    }
  },
  "grok-4.5": {
    "input": {
      "peak": 2,
      "offPeak": 2
    },
    "cacheHit": {
      "peak": 0.3,
      "offPeak": 0.3
    },
    "output": {
      "peak": 6,
      "offPeak": 6
    }
  },
  "grok-4.3": {
    "input": {
      "peak": 1.25,
      "offPeak": 1.25
    },
    "cacheHit": {
      "peak": 1.25,
      "offPeak": 1.25
    },
    "output": {
      "peak": 2.5,
      "offPeak": 2.5
    }
  },
  "grok-build-0.1": {
    "input": {
      "peak": 1,
      "offPeak": 1
    },
    "cacheHit": {
      "peak": 0.2,
      "offPeak": 0.2
    },
    "output": {
      "peak": 2,
      "offPeak": 2
    }
  },
  "qwen3.8-max": {
    "input": {
      "peak": 2,
      "offPeak": 2
    },
    "cacheHit": {
      "peak": 0.25,
      "offPeak": 0.25
    },
    "output": {
      "peak": 6,
      "offPeak": 6
    }
  },
  "qwen3.7-max": {
    "input": {
      "peak": 2.5,
      "offPeak": 2.5
    },
    "cacheHit": {
      "peak": 0.5,
      "offPeak": 0.5
    },
    "output": {
      "peak": 7.5,
      "offPeak": 7.5
    }
  },
  "qwen3.7-plus": {
    "input": {
      "peak": 0.4,
      "offPeak": 0.4
    },
    "cacheHit": {
      "peak": 0.04,
      "offPeak": 0.04
    },
    "output": {
      "peak": 1.6,
      "offPeak": 1.6
    }
  },
  "qwen3.6-plus": {
    "input": {
      "peak": 0.5,
      "offPeak": 0.5
    },
    "cacheHit": {
      "peak": 0.05,
      "offPeak": 0.05
    },
    "output": {
      "peak": 3,
      "offPeak": 3
    }
  },
  "qwen3.5-plus": {
    "input": {
      "peak": 0.2,
      "offPeak": 0.2
    },
    "cacheHit": {
      "peak": 0.02,
      "offPeak": 0.02
    },
    "output": {
      "peak": 1.2,
      "offPeak": 1.2
    }
  },
  "qwen3-plus": {
    "input": {
      "peak": 0.4,
      "offPeak": 0.4
    },
    "cacheHit": {
      "peak": 0.4,
      "offPeak": 0.4
    },
    "output": {
      "peak": 1.2,
      "offPeak": 1.2
    }
  },
  "minimax-m3": {
    "input": {
      "peak": 0.3,
      "offPeak": 0.3
    },
    "cacheHit": {
      "peak": 0.06,
      "offPeak": 0.06
    },
    "output": {
      "peak": 1.2,
      "offPeak": 1.2
    }
  },
  "minimax-m2.7": {
    "input": {
      "peak": 0.3,
      "offPeak": 0.3
    },
    "cacheHit": {
      "peak": 0.06,
      "offPeak": 0.06
    },
    "output": {
      "peak": 1.2,
      "offPeak": 1.2
    }
  },
  "minimax-m2.5": {
    "input": {
      "peak": 0.3,
      "offPeak": 0.3
    },
    "cacheHit": {
      "peak": 0.06,
      "offPeak": 0.06
    },
    "output": {
      "peak": 1.2,
      "offPeak": 1.2
    }
  },
  "hunyuan-a13b": {
    "input": {
      "peak": 0.0694,
      "offPeak": 0.0694
    },
    "cacheHit": {
      "peak": 0.0694,
      "offPeak": 0.0694
    },
    "output": {
      "peak": 0.2778,
      "offPeak": 0.2778
    }
  },
  "hy3": {
    "input": {
      "peak": 0.14,
      "offPeak": 0.14
    },
    "cacheHit": {
      "peak": 0.035,
      "offPeak": 0.035
    },
    "output": {
      "peak": 0.58,
      "offPeak": 0.58
    }
  },
  "mimo-v2.5": {
    "input": {
      "peak": 0.14,
      "offPeak": 0.14
    },
    "cacheHit": {
      "peak": 0.0028,
      "offPeak": 0.0028
    },
    "output": {
      "peak": 0.28,
      "offPeak": 0.28
    }
  },
  "mimo-v2.5-pro": {
    "input": {
      "peak": 0.435,
      "offPeak": 0.435
    },
    "cacheHit": {
      "peak": 0.003625,
      "offPeak": 0.003625
    },
    "output": {
      "peak": 0.87,
      "offPeak": 0.87
    }
  },
  "solar-pro4": {
    "input": {
      "peak": 0.3,
      "offPeak": 0.3
    },
    "cacheHit": {
      "peak": 0.06,
      "offPeak": 0.06
    },
    "output": {
      "peak": 1.2,
      "offPeak": 1.2
    }
  },
  "solar-pro3": {
    "input": {
      "peak": 0.15,
      "offPeak": 0.15
    },
    "cacheHit": {
      "peak": 0.015,
      "offPeak": 0.015
    },
    "output": {
      "peak": 0.6,
      "offPeak": 0.6
    }
  },
  "muse-spark-1.2": {
    "input": {
      "peak": 1.25,
      "offPeak": 1.25
    },
    "cacheHit": {
      "peak": 0.15,
      "offPeak": 0.15
    },
    "output": {
      "peak": 4.25,
      "offPeak": 4.25
    }
  },
  "longcat-2.0": {
    "input": {
      "peak": 0.3,
      "offPeak": 0.3
    },
    "cacheHit": {
      "peak": 0.006,
      "offPeak": 0.006
    },
    "output": {
      "peak": 1.2,
      "offPeak": 1.2
    }
  },
  "mistral-large-2512": {
    "input": {
      "peak": 0.5,
      "offPeak": 0.5
    },
    "cacheHit": {
      "peak": 0.05,
      "offPeak": 0.05
    },
    "output": {
      "peak": 1.5,
      "offPeak": 1.5
    }
  },
  "mistral-medium-3.5": {
    "input": {
      "peak": 1.5,
      "offPeak": 1.5
    },
    "cacheHit": {
      "peak": 0.15,
      "offPeak": 0.15
    },
    "output": {
      "peak": 7.5,
      "offPeak": 7.5
    }
  },
  "mistral-small-4.0": {
    "input": {
      "peak": 0.15,
      "offPeak": 0.15
    },
    "cacheHit": {
      "peak": 0.015,
      "offPeak": 0.015
    },
    "output": {
      "peak": 0.6,
      "offPeak": 0.6
    }
  },
  "muse-spark-1.2-contributor": {
    "input": {
      "peak": 0.1,
      "offPeak": 0.1
    },
    "cacheHit": {
      "peak": 0.002,
      "offPeak": 0.002
    },
    "output": {
      "peak": 0.2,
      "offPeak": 0.2
    }
  }
}
