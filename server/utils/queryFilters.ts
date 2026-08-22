export function getListQuery(query: Record<string, unknown>, searchFields: string[]) {
  const filters = (query.filter ?? {}) as Record<string, string | undefined>;
  const mongoQuery: Record<string, unknown> = {};
  const search = typeof query.search === "string" ? query.search.trim() : "";
  if (search && searchFields.length) mongoQuery.$or = searchFields.map(field => ({ [field]: { $regex: search, $options: "i" } }));
  for (const [field, value] of Object.entries(filters)) {
    if (!value || ["dateFrom", "dateTo", "minBudget", "maxBudget"].includes(field)) continue;
    mongoQuery[field] = value;
  }
  if (filters.dateFrom || filters.dateTo) {
    mongoQuery.startDate = { ...(filters.dateFrom ? { $gte: new Date(filters.dateFrom) } : {}), ...(filters.dateTo ? { $lte: new Date(filters.dateTo) } : {}) };
  }
  if (filters.minBudget || filters.maxBudget) {
    mongoQuery.budget = { ...(filters.minBudget ? { $gte: Number(filters.minBudget) } : {}), ...(filters.maxBudget ? { $lte: Number(filters.maxBudget) } : {}) };
  }
  const sortBy = typeof query.sortBy === "string" ? query.sortBy : "createdAt";
  const sortOrder = query.sortOrder === "asc" ? 1 : -1;
  return { mongoQuery, sort: { [sortBy]: sortOrder } as Record<string, 1 | -1>, groupBy: typeof query.groupBy === "string" ? query.groupBy : undefined };
}
