import type { ValuesType, $Keys } from "utility-types";

type Enumerate<N extends number, Acc extends number[] = []> = Acc["length"] extends N
  ? Acc[number]
  : Enumerate<N, [...Acc, Acc["length"]]>;

export type IntRange<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F>>;

export interface ComponentProps {
  lang: "en" | "CA-fr";
}

export const outlookVersionsMap = {
  "9": "2000",
  "10": "2002",
  "11": "2003",
  "12": "2007",
  "14": "2010",
  "15": "2013",
  "16": "2016",
} as const;

type OutlookVersions = ValuesType<typeof outlookVersionsMap> | $Keys<typeof outlookVersionsMap> | "2019";

export interface OutlookTagProps {
  onlyVersion?: OutlookVersions;
  notVersion?: OutlookVersions;
  onlyVersionsGreaterThanOrEqualTo?: OutlookVersions;
  onlyVersionsLessThanOrEqualTo?: OutlookVersions;
}
