import { DateRange } from "./date_range";

describe("DateRange Value Object", () => {
  it("should throw error if the end date is before the start date", () => {
    expect(() => {
      new DateRange(new Date("2024-12-25"), new Date("2024-12-20"));
    }).toThrow("A data de término deve ser posterior à data de início.");
  });

  it("should create an instance of DateRange with the start date and the end date, and check the return of these dates", () => {
    const startDate = new Date("2024-12-20");
    const endDate = new Date("2024-12-25");
    const dateRange = new DateRange(startDate, endDate);
    expect(dateRange.getStartDate()).toEqual(startDate);
    expect(dateRange.getEndDate()).toEqual(endDate);
  });

  it("should calculate the total nights correctly", () => {
    const startDate = new Date("2024-12-20");
    const endDate = new Date("2024-12-25");
    const dateRange = new DateRange(startDate, endDate);

    const totalNights = dateRange.getTotalNights();
    expect(totalNights).toBe(5);

    const startDate1 = new Date("2024-12-10");
    const endDate1 = new Date("2024-12-25");
    const dateRange1 = new DateRange(startDate1, endDate1);

    const totalNights1 = dateRange1.getTotalNights();
    expect(totalNights1).toBe(15);
  });

  it("should check if two date ranges overlap", () => {
    const dateRange1 = new DateRange(
      new Date("2024-12-20"),
      new Date("2024-12-25")
    );

    const dateRange2 = new DateRange(
      new Date("2024-12-22"),
      new Date("2024-12-27")
    );

    const overlaps = dateRange1.overlaps(dateRange2);

    expect(overlaps).toBe(true);
  });

  it("should throw error if start date and end date are the same", () => {
    const date = new Date("2024-12-20");
    expect(() => {
      new DateRange(date, date);
    }).toThrow("A data de início e término não podem ser iguais.");
  });
});
