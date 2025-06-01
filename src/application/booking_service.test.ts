import { CreateBookingDTO } from "../application/dtos/create_booking.dto";
import { Booking } from "../domain/entities/booking";
import { FakeBookingRepository } from "../infrastructure/repositories/fake_booking_repository";
import { BookingService } from "../application/booking_service";
import { PropertyService } from "../application/property_service";
import { UserService } from "../application/user_service";

jest.mock("./property_service");
jest.mock("./user_service");

describe("BookingService", () => {
  let bookingService: BookingService;
  let fakeBookingRepository: FakeBookingRepository;
  let mockPropertyService: jest.Mocked<PropertyService>;
  let mockUserService: jest.Mocked<UserService>;

  beforeEach(() => {
    const mockPropertyRepository = {} as any;
    const mockUserRepository = {} as any;

    mockPropertyService = new PropertyService(
      mockPropertyRepository
    ) as jest.Mocked<PropertyService>;

    mockUserService = new UserService(
      mockUserRepository
    ) as jest.Mocked<UserService>;

    fakeBookingRepository = new FakeBookingRepository();

    bookingService = new BookingService(
      fakeBookingRepository,
      mockPropertyService,
      mockUserService
    );
  });

  it("should create a booking with success using fake repository", async () => {
    const mockProperty = {
      getId: jest.fn().mockResolvedValue("1"),
      isAvailable: jest.fn().mockReturnValue(true),
      validateGuestsCount: jest.fn(),
      calculateTotalPrice: jest.fn().mockReturnValue(500),
      addBooking: jest.fn(),
    } as any;

    const mockUser = {
      getId: jest.fn().mockResolvedValue("1"),
    } as any;

    mockPropertyService.findPropertyById.mockResolvedValue(mockProperty);
    mockUserService.findUserById.mockResolvedValue(mockUser);

    const bookingDTO: CreateBookingDTO = {
      propertyId: "1",
      guestId: "1",
      startDate: new Date("2024-12-20"),
      endDate: new Date("2024-12-25"),
      guestCount: 2,
    };

    const result = await bookingService.createBooking(bookingDTO);

    expect(result).toBeInstanceOf(Booking);
    expect(result.getStatus()).toBe("CONFIRMED");
    expect(result.getTotalPrice()).toBe(500);

    const savedBooking = await fakeBookingRepository.findById(result.getId());
    expect(savedBooking).not.toBeNull();
    expect(savedBooking?.getId()).toBe(result.getId());
  });

  it("should throw error when property not found", async () => {
    mockPropertyService.findPropertyById.mockResolvedValue(null);

    const bookingDTO: CreateBookingDTO = {
      propertyId: "1",
      guestId: "1",
      startDate: new Date("2024-12-20"),
      endDate: new Date("2024-12-25"),
      guestCount: 2,
    };

    await expect(bookingService.createBooking(bookingDTO)).rejects.toThrow(
      "Propriedade não encontrada."
    );
  });

  it("should throw error when user not found", async () => {
    const mockProperty = {
      getId: jest.fn().mockReturnValue("1"),
    } as any;

    mockPropertyService.findPropertyById.mockResolvedValue(mockProperty);
    mockUserService.findUserById.mockResolvedValue(null);

    const bookingDTO: CreateBookingDTO = {
      propertyId: "1",
      guestId: "1",
      startDate: new Date("2024-12-20"),
      endDate: new Date("2024-12-25"),
      guestCount: 2,
    };

    await expect(bookingService.createBooking(bookingDTO)).rejects.toThrow(
      "Usuário não encontrado."
    );
  });

  it("should throw an error when trying to create a booking for an already booked period", async () => {
    const mockProperty = {
      getId: jest.fn().mockResolvedValue("1"),
      isAvailable: jest.fn().mockReturnValue(true),
      validateGuestsCount: jest.fn(),
      calculateTotalPrice: jest.fn().mockReturnValue(500),
      addBooking: jest.fn(),
    } as any;

    const mockUser = {
      getId: jest.fn().mockResolvedValue("1"),
    } as any;

    mockPropertyService.findPropertyById.mockResolvedValue(mockProperty);
    mockUserService.findUserById.mockResolvedValue(mockUser);

    const bookingDTO: CreateBookingDTO = {
      propertyId: "1",
      guestId: "1",
      startDate: new Date("2024-12-20"),
      endDate: new Date("2024-12-25"),
      guestCount: 2,
    };

    const result = await bookingService.createBooking(bookingDTO);

    mockProperty.isAvailable.mockResolvedValue(false);
    mockProperty.addBooking.mockImplementationOnce(() => {
      throw new Error("A propriedade nao está disponícel para o período solicitado.")
    })

    await expect(bookingService.createBooking(bookingDTO)).rejects.toThrow(
      "A propriedade nao está disponícel para o período solicitado."
    );
  });

  it("should cancel an existing book using fake repository", async () => {
    const mockProperty = {
      getId: jest.fn().mockResolvedValue("1"),
      isAvailable: jest.fn().mockReturnValue(true),
      validateGuestsCount: jest.fn(),
      calculateTotalPrice: jest.fn().mockReturnValue(500),
      addBooking: jest.fn(),
    } as any;

    const mockUser = {
      getId: jest.fn().mockResolvedValue("1"),
    } as any;

    mockPropertyService.findPropertyById.mockResolvedValue(mockProperty);
    mockUserService.findUserById.mockResolvedValue(mockUser);

    const bookingDTO: CreateBookingDTO = {
      propertyId: "1",
      guestId: "1",
      startDate: new Date("2024-12-20"),
      endDate: new Date("2024-12-25"),
      guestCount: 2,
    };

    const booking = await bookingService.createBooking(bookingDTO);

    const spyFindById = jest.spyOn(fakeBookingRepository, "findById");

    await bookingService.cancelBooking(booking.getId());

    const cancelBooking = await fakeBookingRepository.findById(
      booking.getId()
    );

    expect(cancelBooking?.getStatus()).toBe("CANCELLED");
    expect(spyFindById).toHaveBeenCalledWith(booking.getId());
    expect(spyFindById).toHaveBeenCalledTimes(2);
    spyFindById.mockRestore();
  });

});
