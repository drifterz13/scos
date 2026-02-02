import { describe, expect, test } from "bun:test";
import { Coordinates } from "./coordinates.vo";

describe("Coordinates", () => {
  describe("fromObject", () => {
    test("creates valid coordinates", () => {
      const coords = Coordinates.fromObject({ latitude: 40.7128, longitude: -74.006 });
      expect(coords.latitude).toBe(40.7128);
      expect(coords.longitude).toBe(-74.006);
    });
  });

  describe("validation", () => {
    test("throws error for latitude > 90", () => {
      expect(() => Coordinates.fromObject({ latitude: 91, longitude: 0 })).toThrow("Invalid latitude");
    });

    test("throws error for latitude < -90", () => {
      expect(() => Coordinates.fromObject({ latitude: -91, longitude: 0 })).toThrow("Invalid latitude");
    });

    test("throws error for longitude > 180", () => {
      expect(() => Coordinates.fromObject({ latitude: 0, longitude: 181 })).toThrow("Invalid longitude");
    });

    test("throws error for longitude < -180", () => {
      expect(() => Coordinates.fromObject({ latitude: 0, longitude: -181 })).toThrow("Invalid longitude");
    });

    test("accepts valid boundary values", () => {
      const coords1 = Coordinates.fromObject({ latitude: 90, longitude: 180 });
      expect(coords1.latitude).toBe(90);
      expect(coords1.longitude).toBe(180);

      const coords2 = Coordinates.fromObject({ latitude: -90, longitude: -180 });
      expect(coords2.latitude).toBe(-90);
      expect(coords2.longitude).toBe(-180);
    });
  });

  describe("distanceTo", () => {
    test("calculates distance correctly between New York and Los Angeles", () => {
      const ny = Coordinates.fromObject({ latitude: 40.639722, longitude: -73.778889 });
      const la = Coordinates.fromObject({ latitude: 33.9425, longitude: -118.408056 });
      const distance = ny.distanceTo(la);
      // Approximate distance is ~3,944 km
      expect(distance).toBeGreaterThan(3900);
      expect(distance).toBeLessThan(4000);
    });

    test("calculates distance correctly between Paris and Warsaw", () => {
      const paris = Coordinates.fromObject({ latitude: 49.009722, longitude: 2.547778 });
      const warsaw = Coordinates.fromObject({ latitude: 52.165833, longitude: 20.967222 });
      const distance = paris.distanceTo(warsaw);
      // Approximate distance is ~1,361 km
      expect(distance).toBeGreaterThan(1300);
      expect(distance).toBeLessThan(1400);
    });

    test("returns 0 for same point", () => {
      const coords = Coordinates.fromObject({ latitude: 40.7128, longitude: -74.006 });
      const distance = coords.distanceTo(coords);
      expect(distance).toBeCloseTo(0, 5);
    });
  });
});
