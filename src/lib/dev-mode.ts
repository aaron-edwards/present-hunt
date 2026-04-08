export type SearchParamsLike = Record<string, string | string[] | undefined>;

export function isDevModeEnabled(
  searchParams?: SearchParamsLike | URLSearchParams,
): boolean {
  if (!searchParams) {
    return false;
  }

  if (searchParams instanceof URLSearchParams) {
    return searchParams.get("dev") === "1";
  }

  const value = searchParams.dev;
  return Array.isArray(value) ? value.includes("1") : value === "1";
}

export function withDevMode(path: string, devMode: boolean): string {
  if (!devMode) {
    return path;
  }

  const [pathname, query = ""] = path.split("?");
  const params = new URLSearchParams(query);
  params.set("dev", "1");
  const nextQuery = params.toString();

  return nextQuery ? `${pathname}?${nextQuery}` : pathname;
}
