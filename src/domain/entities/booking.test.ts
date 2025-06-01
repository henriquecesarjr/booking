import { DateRange } from "../value_objects/date_range";
import { Property } from "./property";
import { User } from "./user";
import { Booking } from "./booking";

describe("Booking Entity", () => {
  it("should create a booking instance with all the attributes", () => {
    const property = new Property("1", "Casa", "Descrição", 4, 100);
    const user = new User("1", "João Silva");
    const dateRange = new DateRange(
      new Date("2024-12-20"),
      new Date("2024-12-25")
    );

    const booking = new Booking("1", property, user, dateRange, 2);

    expect(booking.getId()).toBe("1");
    expect(booking.getProperty()).toBe(property);
    expect(booking.getGuest()).toBe(user);
    expect(booking.getDateRange()).toBe(dateRange);
    expect(booking.getGuestCount()).toBe(2);
  });

  it("should throw error if the numbers is higher than allowed", () => {
    const property = new Property("1", "Casa", "Descrição", 4, 150);
    const user = new User("1", "José Santos");
    const dateRange = new DateRange(
      new Date("2024-12-10"),
      new Date("2024-12-15")
    );

    expect(() => {
      new Booking("1", property, user, dateRange, 5);
    }).toThrow("Número máximo de hóspedes excedido. Máximo permitido: 4.");
  });

  it("should calculate the correct price with discount", () => {
    const property = new Property("1", "Casa", "Descrição", 4, 300);
    const user = new User("1", "José Santos");
    const dateRange = new DateRange(
      new Date("2024-12-01"),
      new Date("2024-12-10")
    );

    const booking = new Booking("1", property, user, dateRange, 4);

    expect(booking.getTotalPrice()).toBe(300 * 9 * 0.9);
  });

  it("should not schedule when a property is not available", () => {
    const property = new Property("1", "Casa", "Descrição", 4, 300);
    const user = new User("1", "José Santos");
    const dateRange = new DateRange(
      new Date("2024-12-01"),
      new Date("2024-12-10")
    );

    const booking = new Booking("1", property, user, dateRange, 4);

    const dateRange2 = new DateRange(
      new Date("2024-12-02"),
      new Date("2024-12-09")
    );

    expect(() => {
      new Booking("2", property, user, dateRange2, 4);
    }).toThrow("A propriedade não está disponível para o período selecionado.");
  });

  it("should cancel a reservation without a refund when there is less than one day until check-in", () => {
    const property = new Property("1", "Casa", "Descrição", 4, 300);
    const user = new User("1", "José Santos");
    const dateRange = new DateRange(
      new Date("2024-12-20"),
      new Date("2024-12-22")
    );

    const booking = new Booking("1", property, user, dateRange, 4);

    const currentDate = new Date("2024-12-20");
    booking.cancel(currentDate);

    expect(booking.getStatus()).toBe("CANCELLED");
    expect(booking.getTotalPrice()).toBe(600);
  });

  it("should cancel a reservation with a total refund when there is higher than seven days until check-in", () => {
    const property = new Property("1", "Casa", "Descrição", 4, 300);
    const user = new User("1", "José Santos");
    const dateRange = new DateRange(
      new Date("2024-12-20"),
      new Date("2024-12-25")
    );

    const booking = new Booking("1", property, user, dateRange, 4);

    const currentDate = new Date("2024-12-10");
    booking.cancel(currentDate);

    expect(booking.getStatus()).toBe("CANCELLED");
    expect(booking.getTotalPrice()).toBe(0);
  });

  it("should cancel a reservation with a partial refund when the date is between 1 and 7 days before check-in", () => {
    const property = new Property("1", "Casa", "Descrição", 4, 300);
    const user = new User("1", "José Santos");
    const dateRange = new DateRange(
      new Date("2024-12-20"),
      new Date("2024-12-25")
    );

    const booking = new Booking("1", property, user, dateRange, 4);

    const currentDate = new Date("2024-12-15");
    booking.cancel(currentDate);

    expect(booking.getStatus()).toBe("CANCELLED");
    expect(booking.getTotalPrice()).toBe(300 * 5 * 0.5);
  });

  it("should not allow cancel the same booking more than one time", () => {
    const property = new Property("1", "Casa", "Descrição", 4, 300);
    const user = new User("1", "José Santos");
    const dateRange = new DateRange(
      new Date("2024-12-20"),
      new Date("2024-12-25")
    );

    const booking = new Booking("1", property, user, dateRange, 4);

    const currentDate = new Date("2024-12-15");
    booking.cancel(currentDate);

    expect(() => {
      booking.cancel(currentDate);
    }).toThrow("A reserva já está cancelada.");
  });
});
