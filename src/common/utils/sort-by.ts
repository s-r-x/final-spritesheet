import { alphabetical, sort } from "radash";
import { isEmpty } from "./is-empty";

type tOrder = "asc" | "desc";
export function sortBy<T>(
  array: T[],
  getter: (item: T) => string,
  order: tOrder,
): T[];
export function sortBy<T>(
  array: T[],
  getter: (item: T) => number,
  order: tOrder,
): T[];

export function sortBy<T>(
  array: T[],
  getter: (item: T) => number | string,
  order: tOrder,
): T[] {
  if (isEmpty(array)) return array;
  if (typeof getter(array[0]) === "string") {
    return alphabetical(array, getter as (item: T) => string, order);
  } else {
    return sort(array, getter as (item: T) => number, order === "desc");
  }
}
