"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";
import {
  getAllColorSchemes,
  getAllGradientStyles,
  getAllLayoutStyles,
  getAllPresetTemplates,
  getColorScheme,
  getGradientStyle,
  getLayoutStyle,
  getTemplateConfig,
  DEFAULT_COLOR_SCHEME_ID,
  DEFAULT_GRADIENT_STYLE_ID,
  DEFAULT_LAYOUT_STYLE_ID,
  ColorScheme,
  GradientStyle,
  LayoutStyle,
  TemplateConfig,
} from "@/lib/templates/invoice-templates";

interface TemplateSelectorProps {
  selectedTemplateId: string;
  selectedColorSchemeId?: string;
  selectedGradientStyleId?: string;
  selectedLayoutStyleId?: string;
  onSelect: (templateId: string) => void;
  onSelectColorScheme: (colorSchemeId: string) => void;
  onSelectGradientStyle: (gradientStyleId: string) => void;
  onSelectLayoutStyle: (layoutStyleId: string) => void;
  onSelectPreset: (config: TemplateConfig) => void;
  onContinue: () => void;
  isContinueDisabled?: boolean;
}

const ColorSchemePreview: React.FC<{ scheme: ColorScheme; isSelected: boolean; onClick: () => void }> = ({
  scheme,
  isSelected,
  onClick,
}) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      "group relative flex flex-col items-center rounded-lg border-2 p-4 transition-all",
      "hover:scale-105 hover:shadow-md",
      isSelected ? "border-gray-900 shadow-lg" : "border-gray-200"
    )}
  >
    <div
      className="h-16 w-full rounded-md mb-2"
      style={{
        backgroundImage: `linear-gradient(135deg, ${scheme.previewGradient[0]}, ${scheme.previewGradient[1]})`,
      }}
    />
    <span className="text-xs font-medium text-gray-700">{scheme.name}</span>
    {isSelected && (
      <div className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-gray-900 flex items-center justify-center">
        <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
    )}
  </button>
);

const GradientStylePreview: React.FC<{ style: GradientStyle; isSelected: boolean; onClick: () => void; colorScheme: ColorScheme }> = ({
  style,
  isSelected,
  onClick,
  colorScheme,
}) => {
  const getGradientBackground = () => {
    if (style.type === "solid") {
      return { background: colorScheme.accentHex };
    }
    if (style.type === "linear-vertical") {
      return {
        background: `linear-gradient(180deg, ${colorScheme.accentHex}, ${colorScheme.previewGradient[1]})`,
      };
    }
    if (style.type === "linear-horizontal") {
      return {
        background: `linear-gradient(90deg, ${colorScheme.accentHex}, ${colorScheme.previewGradient[1]})`,
      };
    }
    if (style.type === "radial") {
      return {
        background: `radial-gradient(circle, ${colorScheme.accentHex}, ${colorScheme.previewGradient[1]})`,
      };
    }
    return { background: colorScheme.accentHex };
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group relative flex flex-col items-center rounded-lg border-2 p-4 transition-all",
        "hover:scale-105 hover:shadow-md",
        isSelected ? "border-gray-900 shadow-lg" : "border-gray-200"
      )}
    >
      <div className="h-16 w-full rounded-md mb-2" style={getGradientBackground()} />
      <span className="text-xs font-medium text-gray-700">{style.name}</span>
      {isSelected && (
        <div className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-gray-900 flex items-center justify-center">
          <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
      )}
    </button>
  );
};

const LayoutStylePreview: React.FC<{ style: LayoutStyle; isSelected: boolean; onClick: () => void }> = ({
  style,
  isSelected,
  onClick,
}) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      "group relative flex flex-col items-start rounded-lg border-2 p-4 transition-all text-left",
      "hover:scale-105 hover:shadow-md",
      isSelected ? "border-gray-900 shadow-lg bg-gray-50" : "border-gray-200 bg-white"
    )}
  >
    <div className="flex items-center gap-2 mb-2">
      <div className="h-2 w-2 rounded-full bg-gray-400" />
      <span className="text-sm font-semibold text-gray-900">{style.name}</span>
    </div>
    <p className="text-xs text-gray-600">{style.description}</p>
    {isSelected && (
      <div className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-gray-900 flex items-center justify-center">
        <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
    )}
  </button>
);

const PresetTemplateCard: React.FC<{ preset: TemplateConfig; isSelected: boolean; onClick: () => void }> = ({
  preset,
  isSelected,
  onClick,
}) => {
  const colorScheme = getColorScheme(preset.colorSchemeId);
  const gradientStyle = getGradientStyle(preset.gradientStyleId);
  const layoutStyle = getLayoutStyle(preset.layoutStyleId);

  const getGradientBackground = () => {
    if (gradientStyle.type === "solid") {
      return { background: colorScheme.accentHex };
    }
    if (gradientStyle.type === "linear-vertical") {
      return {
        background: `linear-gradient(180deg, ${colorScheme.accentHex}, ${colorScheme.previewGradient[1]})`,
      };
    }
    if (gradientStyle.type === "linear-horizontal") {
      return {
        background: `linear-gradient(90deg, ${colorScheme.accentHex}, ${colorScheme.previewGradient[1]})`,
      };
    }
    if (gradientStyle.type === "radial") {
      return {
        background: `radial-gradient(circle, ${colorScheme.accentHex}, ${colorScheme.previewGradient[1]})`,
      };
    }
    return { background: colorScheme.accentHex };
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group flex flex-col rounded-xl border-2 bg-white p-6 text-left shadow-sm transition-all",
        "hover:-translate-y-1 hover:shadow-lg",
        isSelected ? "border-gray-900 shadow-lg" : "border-gray-200"
      )}
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <p className="text-lg font-semibold text-gray-900">{preset.name}</p>
          <p className="mt-1 text-sm text-gray-600">{preset.description}</p>
        </div>
        {isSelected && (
          <div className="h-6 w-6 rounded-full bg-gray-900 flex items-center justify-center flex-shrink-0">
            <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        )}
      </div>
      <div className="h-20 w-full rounded-md mb-3" style={getGradientBackground()} />
      <div className="flex items-center gap-4 text-xs text-gray-500">
        <span>{colorScheme.name}</span>
        <span>•</span>
        <span>{gradientStyle.name}</span>
        <span>•</span>
        <span>{layoutStyle.name}</span>
      </div>
    </button>
  );
};

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  selectedTemplateId,
  selectedColorSchemeId,
  selectedGradientStyleId,
  selectedLayoutStyleId,
  onSelect,
  onSelectColorScheme,
  onSelectGradientStyle,
  onSelectLayoutStyle,
  onSelectPreset,
  onContinue,
  isContinueDisabled = false,
}) => {
  const [activeTab, setActiveTab] = useState<"presets" | "custom">("presets");

  const colorSchemes = getAllColorSchemes();
  const gradientStyles = getAllGradientStyles();
  const layoutStyles = getAllLayoutStyles();
  const presetTemplates = getAllPresetTemplates();

  const currentColorSchemeId = selectedColorSchemeId || DEFAULT_COLOR_SCHEME_ID;
  const currentGradientStyleId = selectedGradientStyleId || DEFAULT_GRADIENT_STYLE_ID;
  const currentLayoutStyleId = selectedLayoutStyleId || DEFAULT_LAYOUT_STYLE_ID;

  const currentColorScheme = getColorScheme(currentColorSchemeId);
  const currentConfig = getTemplateConfig(currentColorSchemeId, currentGradientStyleId, currentLayoutStyleId);

  const handlePresetSelect = (preset: TemplateConfig) => {
    onSelectPreset(preset);
    onSelectColorScheme(preset.colorSchemeId);
    onSelectGradientStyle(preset.gradientStyleId);
    onSelectLayoutStyle(preset.layoutStyleId);
    onSelect(preset.id);
  };

  const isPresetSelected = presetTemplates.some(
    (p) =>
      p.colorSchemeId === currentColorSchemeId &&
      p.gradientStyleId === currentGradientStyleId &&
      p.layoutStyleId === currentLayoutStyleId
  );

  return (
    <div className="space-y-8">
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Step 1 of 2</span>
        <h1 className="mt-2 text-3xl font-bold text-gray-900">Choose an Invoice Template</h1>
        <p className="mt-1 text-sm text-gray-600">
          Select a preset template or customize your own by choosing color and gradient options.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          type="button"
          onClick={() => setActiveTab("presets")}
          className={cn(
            "px-4 py-2 text-sm font-medium transition-colors",
            activeTab === "presets"
              ? "border-b-2 border-gray-900 text-gray-900"
              : "text-gray-500 hover:text-gray-700"
          )}
        >
          Preset Templates
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("custom")}
          className={cn(
            "px-4 py-2 text-sm font-medium transition-colors",
            activeTab === "custom"
              ? "border-b-2 border-gray-900 text-gray-900"
              : "text-gray-500 hover:text-gray-700"
          )}
        >
          Advanced
        </button>
      </div>

      {/* Preset Templates Tab */}
      {activeTab === "presets" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {presetTemplates.map((preset) => {
              const isSelected =
                preset.colorSchemeId === currentColorSchemeId &&
                preset.gradientStyleId === currentGradientStyleId &&
                preset.layoutStyleId === currentLayoutStyleId;

              return (
                <PresetTemplateCard key={preset.id} preset={preset} isSelected={isSelected} onClick={() => handlePresetSelect(preset)} />
              );
            })}
          </div>
        </div>
      )}

      {/* Customize Tab */}
      {activeTab === "custom" && (
        <div className="space-y-8">
          {/* Color Schemes */}
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Color Scheme</h2>
              <p className="text-sm text-gray-600">Choose a color palette for your invoice</p>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {colorSchemes.map((scheme) => (
                <ColorSchemePreview
                  key={scheme.id}
                  scheme={scheme}
                  isSelected={scheme.id === currentColorSchemeId}
                  onClick={() => {
                    onSelectColorScheme(scheme.id);
                    const newConfig = getTemplateConfig(scheme.id, currentGradientStyleId, currentLayoutStyleId);
                    onSelect(newConfig.id);
                  }}
                />
              ))}
            </div>
          </div>

          {/* Gradient Styles */}
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Gradient Style</h2>
              <p className="text-sm text-gray-600">Choose how colors are applied in the header</p>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {gradientStyles.map((style) => (
                <GradientStylePreview
                  key={style.id}
                  style={style}
                  isSelected={style.id === currentGradientStyleId}
                  colorScheme={currentColorScheme}
                  onClick={() => {
                    onSelectGradientStyle(style.id);
                    const newConfig = getTemplateConfig(currentColorSchemeId, style.id, currentLayoutStyleId);
                    onSelect(newConfig.id);
                  }}
                />
              ))}
            </div>
          </div>

          {/* Current Selection Summary */}
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <p className="text-sm font-medium text-gray-900">Current Selection:</p>
            <p className="mt-1 text-sm text-gray-600">{currentConfig.name}</p>
            <p className="mt-1 text-xs text-gray-500">{currentConfig.description}</p>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-gray-600">You can always return to this step to switch templates later.</p>
        <Button type="button" onClick={onContinue} disabled={isContinueDisabled} className="sm:w-auto">
          Next: Invoice Form
        </Button>
      </div>
    </div>
  );
};
