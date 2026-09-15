import { ImageResponse } from "next/og";
import { COMPANY } from "@/lib/data/company";

export const dynamic = "force-static";
export const alt = COMPANY.legalName;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() {
  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#050F2C",
        color: "white",
        fontSize: 72,
        fontWeight: 700,
        padding: 80,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ color: "#F5A524", fontSize: 30, letterSpacing: 6 }}>
          {COMPANY.legalName.toUpperCase()}
        </div>
        <div style={{ marginTop: 28, maxWidth: 900 }}>Reliable Road Freight Transportation</div>
      </div>
    </div>,
    size,
  );
}
