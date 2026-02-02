export class Coordinates {
  private constructor(
    public readonly latitude: number,
    public readonly longitude: number,
  ) {
    if (latitude < -90 || latitude > 90) throw new Error("Invalid latitude");
    if (longitude < -180 || longitude > 180) throw new Error("Invalid longitude");
  }

  static fromObject(obj: { latitude: number; longitude: number }): Coordinates {
    return new Coordinates(obj.latitude, obj.longitude);
  }

  /**
   * Calculates the great-circle distance between this coordinate and another
   * using the Haversine formula.
   *
   * The Haversine formula calculates the shortest distance over the earth's surface,
   * giving an "as-the-crow-flies" distance between two points on a sphere.
   *
   * Formula: a = sin²(Δlat/2) + cos(lat1) * cos(lat2) * sin²(Δlon/2)
   *          c = 2 * atan2(√a, √(1−a))
   *          d = R * c
   *
   * Where R is Earth's radius (6371 km)
   *
   * @param other - The destination coordinates
   * @returns Distance in kilometers
   */
  distanceTo(other: Coordinates): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(other.latitude - this.latitude);
    const dLon = this.toRadians(other.longitude - this.longitude);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(this.latitude)) *
        Math.cos(this.toRadians(other.latitude)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
}
