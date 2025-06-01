import { PropertyService } from "./property_service";
import { FakePropertyRepository } from "../infrastructure/repositories/fake_property_repository";
import { Property } from "../domain/entities/property";

describe("PropertyService", () => {
  let propertyService: PropertyService;
  let fakePropertyRepository: FakePropertyRepository;

  beforeEach(() => {
    fakePropertyRepository = new FakePropertyRepository();
    propertyService = new PropertyService(fakePropertyRepository);
  });

  it("should return null when an invalid ID is passed in", async () => {
    const property = await propertyService.findPropertyById("999");
    expect(property).toBeNull();
  });

  it("should return a property when an valid ID is passed in", async () => {
    const property = await propertyService.findPropertyById("1");
    expect(property).not.toBeNull();
    expect(property?.getId()).toBe("1");
    expect(property?.getName()).toBe("Apartamento");
  });

  it("should save a new property using fake repository and searching again", async () => {
    const newProperty = new Property(
      "3",
      "Test Property",
      "Test Description",
      4,
      100
    );
    await fakePropertyRepository.save(newProperty);

    const property = await propertyService.findPropertyById("3");
    expect(property).not.toBeNull();
    expect(property?.getId()).toBe("3");
    expect(property?.getName()).toBe("Test Property");
  });
});
