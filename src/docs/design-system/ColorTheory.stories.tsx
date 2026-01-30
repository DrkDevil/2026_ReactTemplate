import { useEffect, useState } from "react";
import type { Meta } from "@storybook/react-vite";

export default {
  title: 'Design System/Color Theory',
} as Meta;

const colorSteps = [
  "origin", "0", "5", "10", "15", "20", "25", "30",
  "45", "55", "65", "75", "85", "95", "100"
];

const colorNames = [
  "red", "redOrange", "orange", "amber", "yellow", "chartreuse", "lime",
  "green", "springGreen", "aquamarine", "turquoise", "cyan", "skyBlue",
  "azure", "royalBlue", "blue", "blueViolet", "violet", "purple",
  "magenta", "fuchsia", "rose"
];

const parseRGB = (rgb: string): [number, number, number] => {
  const match = rgb.match(/rgba?\((\d+), (\d+), (\d+)/);
  return match ? [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])] : [0, 0, 0];
};

const rgbToHex = ([r, g, b]: [number, number, number]) =>
  `#${[r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("")}`;

const toLinear = (c: number): number =>
  c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);

const luminance = ([r, g, b]: [number, number, number]) =>
  0.2126 * toLinear(r / 255) +
  0.7152 * toLinear(g / 255) +
  0.0722 * toLinear(b / 255);

const contrastRatio = (a: [number, number, number], b: [number, number, number]) => {
  const [L1, L2] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (L1 + 0.05) / (L2 + 0.05);
};

const rgbToHsl = ([r, g, b]: [number, number, number]): [number, number, number] => {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)); break;
      case g: h = ((b - r) / d + 2); break;
      case b: h = ((r - g) / d + 4); break;
    }
    h *= 60;
  }

  return [Math.round(h), Math.round(s * 100), Math.round(l * 100)];
};

const Swatch = ({ colorName, step, infoBg = "white", infoColor = "#000", availableSteps }: { colorName: string; step: string; infoBg?: string; infoColor?: string; availableSteps?: string[] }) => {
  const varName = `--${colorName}-${step}`;
  const bgColor = `var(${varName})`;

  const [contrast, setContrast] = useState("");
  const [hex, setHex] = useState("#000000");
  const [textColor, setTextColor] = useState("white");
  const [fallbackLabel, setFallbackLabel] = useState("");
  const [hslDisplay, setHslDisplay] = useState("HSL: ?");

  useEffect(() => {
    const el = document.createElement("div");
    el.style.backgroundColor = `var(${varName})`;
    document.body.appendChild(el);
    const computedColor = getComputedStyle(el).backgroundColor;
    document.body.removeChild(el);

    const rgb = parseRGB(computedColor);
    const hsl = rgbToHsl(rgb);
    setHslDisplay(`H: ${hsl[0]} S: ${hsl[1]} L: ${hsl[2]}`);
    setHex(rgbToHex(rgb));

    const white: [number, number, number] = [255, 255, 255];
    const ratio = contrastRatio(rgb, white);
    const ratioStr = ratio.toFixed(2);

    setContrast(
      ratio >= 7 ? `AAA ${ratioStr}` :
        ratio >= 4.5 ? `AA ${ratioStr}` :
          ratioStr
    );

    if (colorName === 'trans-light') {
       setTextColor("white");
       setFallbackLabel("");
       return;
    }

    const shadesToCheck = ["45", "55", "65", "75", "85", "95", "100"];
    const validShades = availableSteps 
      ? shadesToCheck.filter(s => availableSteps.includes(s))
      : shadesToCheck;

    if (validShades.includes(step) || ratio >= 4.5) {
      setTextColor("white");
      setFallbackLabel("");
      return;
    }

    for (const shade of validShades) {
      const shadeEl = document.createElement("div");
      shadeEl.style.backgroundColor = `var(--${colorName}-${shade})`;
      document.body.appendChild(shadeEl);
      const resolved = getComputedStyle(shadeEl).backgroundColor;
      document.body.removeChild(shadeEl);

      const shadeRGB = parseRGB(resolved);
      if (contrastRatio(shadeRGB, rgb) >= 4.5) {
        setTextColor(`var(--${colorName}-${shade})`);
        setFallbackLabel(`${colorName}-${shade}`);
        return;
      }
    }

    setTextColor("#212121");
    setFallbackLabel("fallback: #212121");

  }, [varName, colorName, step, availableSteps]);

  return (
    <div
      style={{
        width: "128px",
        borderRadius: "6px",
        overflow: "hidden",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)", // Darker shadow for better look on both light/dark
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          backgroundColor: bgColor,
          height: "64px",
          fontSize: "14px",
          fontWeight: 600,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: textColor,
          padding: "4px",
        }}
      >
        <div>{contrast}</div>
        {fallbackLabel && <div style={{ fontSize: "10px" }}>{fallbackLabel}</div>}
      </div>
      <div
        style={{
          backgroundColor: infoBg,
          padding: "8px",
          fontSize: "10px",
          color: infoColor,
        }}
      >
        <div style={{ fontWeight: 700 }}>{step}</div>
        <div style={{ color: bgColor, fontWeight: 300 }}>{colorName}-{step}</div>
        <div style={{ fontWeight: 600, opacity: 0.7, color: 'inherit' }}>{hex}</div>
        <div style={{ fontWeight: 600, marginTop: "4px", opacity: 0.5, color: 'inherit' }}>
          {hslDisplay}
        </div>
      </div>
    </div>
  );
};

const greySteps = [
  "0", "10", "20", "30", "40", "50", "60", "70", "80", "90", "100", "200", "300"
];

const binarySteps = ["0", "1"];

const transparencySteps = [
  "0", "2", "3", "4", "5", "10", "15", "20", "25", "30",
  "35", "40", "45", "50"
];

export const Greyscale = () => {
  return (
    <div style={{ padding: "24px", fontFamily: "sans-serif" }}>
      {/* Binary Section */}
      <div style={{ marginBottom: "32px" }}>
        <div style={{ fontWeight: 600, marginBottom: "8px" }}>BINARY</div>
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
          {binarySteps.map((step) => (
            <Swatch key={step} colorName="binary" step={step} availableSteps={binarySteps} />
          ))}
        </div>
      </div>

      {/* Grey Section */}
      <div style={{ marginBottom: "32px" }}>
        <div style={{ fontWeight: 600, marginBottom: "8px" }}>GREY</div>
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
          {greySteps.map((step) => (
            <Swatch key={step} colorName="grey" step={step} availableSteps={greySteps} />
          ))}
        </div>
      </div>
    </div>
  );
};

export const Transparencies = () => {
  const checkerboardStyle = {
    backgroundColor: '#fff',
    backgroundImage: `
      linear-gradient(45deg, #e6e6e6 25%, transparent 25%),
      linear-gradient(-45deg, #e6e6e6 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, #e6e6e6 75%),
      linear-gradient(-45deg, transparent 75%, #e6e6e6 75%)
    `,
    backgroundSize: '20px 20px',
    backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
  };

  const darkCheckerboardStyle = {
    backgroundColor: '#333', // Softer dark base
    backgroundImage: `
      linear-gradient(45deg, #444 25%, transparent 25%),
      linear-gradient(-45deg, #444 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, #444 75%),
      linear-gradient(-45deg, transparent 75%, #444 75%)
    `,
    backgroundSize: '20px 20px',
    backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
  };

  return (
    <div style={{ padding: "24px", fontFamily: "sans-serif" }}>
      {/* Trans Dark Section */}
      <div style={{ marginBottom: "32px" }}>
        <div style={{ fontWeight: 600, marginBottom: "8px" }}>TRANS DARK</div>
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", ...checkerboardStyle, padding: '20px', borderRadius: '8px' }}>
          {transparencySteps.map((step) => (
            <Swatch key={step} colorName="trans-dark" step={step} availableSteps={transparencySteps} />
          ))}
        </div>
      </div>

      {/* Trans Light Section */}
      <div style={{ marginBottom: "32px" }}>
        <div style={{ fontWeight: 600, marginBottom: "8px" }}>TRANS LIGHT (on Dark Background)</div>
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", ...darkCheckerboardStyle, padding: '20px', borderRadius: '8px' }}>
          {transparencySteps.map((step) => (
            <Swatch key={step} colorName="trans-light" step={step} infoBg="#444753" infoColor="#fff" availableSteps={transparencySteps} />
          ))}
        </div>
      </div>
    </div>
  );
};

export const GeneratedWCAGColors = () => {
  return (
    <div style={{ padding: "24px", fontFamily: "sans-serif" }}>
      {colorNames.map((name) => (
        <div key={name} style={{ marginBottom: "32px" }}>
          <div style={{ fontWeight: 600, marginBottom: "8px" }}>
            {name.toUpperCase()}
          </div>
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            {colorSteps.map((step) => (
              <Swatch key={step} colorName={name} step={step} availableSteps={colorSteps} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
