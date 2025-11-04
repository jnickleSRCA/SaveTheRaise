/**
 * Brand utility for creating nominal types
 */
declare const brand: unique symbol;

export type Brand<T, TBrand extends string> = T & {
  readonly [brand]: TBrand;
};
