import { describe, expect, test } from "bun:test";
import { Coordinates } from "../value-objects/coordinates.vo";
import { Warehouse } from "./warehouse.entity";

describe("Warehouse", () => {
  const coords = Coordinates.fromObject({ latitude: 33.9425, longitude: -118.408056 });

  describe("constructor", () => {
    test("creates warehouse correctly", () => {
      const warehouse = new Warehouse("id-1", "Los Angeles", coords, 355);
      expect(warehouse.id).toBe("id-1");
      expect(warehouse.name).toBe("Los Angeles");
      expect(warehouse.coordinates).toEqual(coords);
      expect(warehouse.stockQuantity).toBe(355);
    });
  });

  describe("canFulfill", () => {
    test("returns true when stock >= requested", () => {
      const warehouse = new Warehouse("id-1", "Los Angeles", coords, 355);
      expect(warehouse.canFulfill(300)).toBe(true);
      expect(warehouse.canFulfill(355)).toBe(true);
    });

    test("returns false when stock < requested", () => {
      const warehouse = new Warehouse("id-1", "Los Angeles", coords, 355);
      expect(warehouse.canFulfill(400)).toBe(false);
    });
  });

  describe("distanceTo", () => {
    test("delegates to coordinates.distanceTo", () => {
      const la = new Warehouse("id-1", "Los Angeles", coords, 355);
      const nyCoords = Coordinates.fromObject({
        latitude: 40.639722,
        longitude: -73.778889,
      });
      const distance = la.distanceTo(nyCoords);
      // Approximate distance is ~3,944 km
      expect(distance).toBeGreaterThan(3900);
      expect(distance).toBeLessThan(4000);
    });
  });
});
