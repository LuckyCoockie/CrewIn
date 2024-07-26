import api from "../utils/instance";

export type Point = { latitude: number; longitude: number };

export type AddressDto = {
  fullAddress: string;
  addressType: string;
  city_do: string;
  gu_gun: string;
  eup_myun: string;
  adminDong: string;
  adminDongCode: string;
  legalDong: string;
  legalDongCode: string;
  ri: string;
  bunji: string;
  roadName: string;
  buildingIndex: string;
  buildingName: string;
  mappingDistance: string;
  roadCode: string;
};

export type ReverseGeocodeRequestDto = {
  lat: number;
  lon: number;
  addressType: "A10";
  newAddressExtend: "Y";
};

export type ReverseGeocodeResponseDto = {
  addressInfo: AddressDto;
};

export const reversGeocodingApi = async (
  dto: ReverseGeocodeRequestDto
): Promise<ReverseGeocodeResponseDto> => {
  // TODO : reverse geocoding api path 변경
  const response = await api.post("/", dto);
  return response.data as ReverseGeocodeResponseDto;
};
