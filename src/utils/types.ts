type Enumerate<N extends number, Acc extends number[] = []> = Acc["length"] extends N
  ? Acc[number]
  : Enumerate<N, [...Acc, Acc["length"]]>;

export type IntRange<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F>>;

export interface ComponentProps {
  lang: "en" | "CA-fr";
}

type OutlookVersions = "2000" | "2002" | "2003" | "2007" | "2010" | "2013" | "2016" | "2019";
export interface OutlookTagProps {
  onlyVersions?: OutlookVersions;
  notVersions?: OutlookVersions;
  onlyVersionsGreaterThanOrEqualTo?: OutlookVersions;
  onlyVersionsLessThanOrEqualTo?: OutlookVersions;
}
