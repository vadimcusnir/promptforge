export const LAYER_ORDER = [
  "BaseCanvas",
  "GridLines",
  "MatrixTokens",
  "BackgroundFigures",
  "MatrixQuotes",
  "NoiseLayer",
  "HeroContent",
  "MicroUI",
] as const;

export type LayerId = (typeof LAYER_ORDER)[number];

// Helper function to get z-index for a layer
export function getLayerZIndex(layerId: LayerId): number {
  return LAYER_ORDER.indexOf(layerId) + 1;
}

// CSS custom properties for layer management
export const LAYER_CSS_VARS = LAYER_ORDER.reduce(
  (acc, layer, index) => {
    acc[`--layer-${layer.toLowerCase()}`] = (index + 1).toString();
    return acc;
  },
  {} as Record<string, string>,
);
