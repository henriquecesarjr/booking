import { Property } from "./property";
import { DateRange } from "../value_objects/date_range";
import { Booking } from "./booking";
import { User } from "./user";

describe("Property Entity", () => {
  it("should create an property instance with all the attributes", () => {
    const property = new Property(
      "1",
      "Casa de praia",
      "Uma bela casa na praia",
      4,
      200
    );

    expect(property.getId()).toBe("1");
    expect(property.getName()).toBe("Casa de praia");
    expect(property.getDescription()).toBe("Uma bela casa na praia");
    expect(property.getMaxGuests()).toBe(4);
    expect(property.getBasePricePerNight()).toBe(200);
  });

  it("should throw error if the name was empty", () => {
    expect(() => {
      new Property("1", "", "Descrição", 4, 200);
    }).toThrow("O nome é obrigatório");
  });

  it("should throw error if the number of guests if zero or negative", () => {
    expect(() => {
      new Property("1", "Casa", "Descrição", 0, 200);
    }).toThrow("O número máximo de hóspedes deve ser maior que zero");
  });

  it("should validate the maximum number of guests", () => {
    const property = new Property("1", "Casa de Campo", "Descrição", 5, 150);

    expect(() => {
      property.validateGuestsCount(6);
    }).toThrow("Número máximo de hóspedes excedido. Máximo permitido: 5");
  });

  it("should not apply discount for stays of less than seven nights", () => {
    const property = new Property("1", "Apartamento", "Descrição", 2, 100);
    const dataRange = new DateRange(
      new Date("2024-12-10"),
      new Date("2024-12-16")
    );
    const totalPrice = property.calculateTotalPrice(dataRange);
    expect(totalPrice).toBe(600);
  });

  it("should apply discount for stays of longer than or equal to seven nights", () => {
    const property = new Property("1", "Apartamento", "Descrição", 2, 100);
    const dataRange = new DateRange(
      new Date("2024-12-10"),
      new Date("2024-12-17")
    );
    const totalPrice = property.calculateTotalPrice(dataRange);
    expect(totalPrice).toBe(630);
  });

  it("should check disponibility of property", () => {
    const property = new Property("1", "Apartamento", "Descrição", 4, 200);
    const user = new User("1", "Maria Silva");
    const dateRange = new DateRange(
      new Date("2024-12-20"),
      new Date("2024-12-25")
    );

    const dateRange2 = new DateRange(
      new Date("2024-12-22"),
      new Date("2024-12-27")
    );

    new Booking("1", property, user, dateRange, 2);

    expect(property.isAvailable(dateRange)).toBe(false);
    expect(property.isAvailable(dateRange2)).toBe(false);
  });
});
