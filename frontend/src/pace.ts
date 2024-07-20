export type Pace = {
  minutes: number;
  seconds: number[];
};

export const pace: Pace[] = Array.from({ length: 14 }, (_, minute) => ({
  minutes: minute + 1,
  seconds: Array.from({ length: 12 }, (_, second) => 5 * second),
}));
