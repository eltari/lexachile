import { describe, it, expect } from "vitest";
import { validarRut, formatRut, formatCLP, formatFecha } from "@/lib/utils";

describe("validarRut", () => {
  it("returns true for valid RUTs", () => {
    // Standard valid Chilean RUTs
    expect(validarRut("12.345.678-5")).toBe(true);
    expect(validarRut("12345678-5")).toBe(true);
    expect(validarRut("123456785")).toBe(true);
    expect(validarRut("7.654.321-K")).toBe(true);
    expect(validarRut("7654321-K")).toBe(true);
    expect(validarRut("7654321-k")).toBe(true);
    expect(validarRut("11.111.111-1")).toBe(true);
  });

  it("returns false for invalid RUTs", () => {
    expect(validarRut("12.345.678-0")).toBe(false);
    expect(validarRut("12.345.678-K")).toBe(false);
    expect(validarRut("0")).toBe(false);
    expect(validarRut("")).toBe(false);
    expect(validarRut("1")).toBe(false);
    expect(validarRut("abcdefgh-i")).toBe(false);
    expect(validarRut("11.111.111-2")).toBe(false);
  });

  it("handles RUTs with different formatting", () => {
    // Same RUT, different format should give same result
    const rut = "12345678-5";
    const rutDotted = "12.345.678-5";
    expect(validarRut(rut)).toBe(validarRut(rutDotted));
  });
});

describe("formatRut", () => {
  it("formats a clean RUT correctly", () => {
    expect(formatRut("123456785")).toBe("12.345.678-5");
  });

  it("formats a RUT with dashes", () => {
    expect(formatRut("12345678-5")).toBe("12.345.678-5");
  });

  it("formats a RUT with K verifier", () => {
    expect(formatRut("7654321K")).toBe("7.654.321-K");
  });

  it("handles already formatted RUTs", () => {
    expect(formatRut("12.345.678-5")).toBe("12.345.678-5");
  });

  it("returns input for very short strings", () => {
    expect(formatRut("1")).toBe("1");
    expect(formatRut("")).toBe("");
  });
});

describe("formatCLP", () => {
  it("formats positive amounts correctly", () => {
    const result = formatCLP(1000);
    // Chilean peso formatting uses $ and dot as thousands separator
    expect(result).toContain("1.000");
    expect(result).toContain("$");
  });

  it("formats zero correctly", () => {
    const result = formatCLP(0);
    expect(result).toContain("0");
    expect(result).toContain("$");
  });

  it("formats large amounts correctly", () => {
    const result = formatCLP(1500000);
    expect(result).toContain("1.500.000");
  });

  it("formats negative amounts", () => {
    const result = formatCLP(-5000);
    expect(result).toContain("5.000");
  });
});

describe("formatFecha", () => {
  it("formats a Date object correctly in Spanish", () => {
    // Use a fixed date
    const date = new Date(2026, 2, 28); // March 28, 2026
    const result = formatFecha(date);

    expect(result).toContain("28");
    expect(result).toContain("2026");
    // "marzo" in Spanish locale
    expect(result.toLowerCase()).toContain("marzo");
  });

  it("formats a date string correctly", () => {
    const result = formatFecha("2025-12-25");
    expect(result).toContain("25");
    expect(result).toContain("2025");
    expect(result.toLowerCase()).toContain("diciembre");
  });

  it("formats various months correctly", () => {
    const jan = formatFecha("2026-01-15");
    expect(jan.toLowerCase()).toContain("enero");

    const jul = formatFecha("2026-07-04");
    expect(jul.toLowerCase()).toContain("julio");
  });
});
