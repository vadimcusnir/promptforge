// tests/modules.spec.ts
import catalog from "../lib.modules.catalog.json";
import { CatalogSchema } from "../lib.module.schema";

describe("Module Catalog", () => {
  it("has exactly 50 modules, unique IDs, and passes schema", () => {
    const res = CatalogSchema.safeParse(catalog);
    expect(res.success).toBe(true);
    if (!res.success) {
      console.error(res.error.flatten());
    }
  });
});
