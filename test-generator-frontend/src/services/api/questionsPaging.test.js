import { describe, expect, it } from "vitest";
import {
  MAX_PAGE_SIZE,
  fetchAllQuestionPages,
  fetchQuestionPage,
} from "./questionsPaging";

/** Fake backend: `total` items split into pages of the requested limit. */
function fakeBackend(total) {
  const calls = [];
  const baseQuery = async ({ url }) => {
    calls.push(url);
    const params = new URL(url).searchParams;
    const page = Number(params.get("page"));
    const limit = Number(params.get("limit"));
    const start = (page - 1) * limit;
    const data = Array.from(
      { length: Math.max(0, Math.min(limit, total - start)) },
      (_, index) => ({ id: `q${start + index + 1}`, question_text: "Q" }),
    );
    return {
      data: {
        data,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.max(1, Math.ceil(total / limit)),
        },
      },
    };
  };
  return { baseQuery, calls };
}

const URL_BASE = "http://api.test/api/questions/getmcq";

describe("questions paging", () => {
  it("fetches every page instead of truncating at one page", async () => {
    const { baseQuery, calls } = fakeBackend(450);
    const result = await fetchAllQuestionPages(
      baseQuery,
      URL_BASE,
      { chapterId: "c1" },
      "mcq",
    );
    expect(result.data).toHaveLength(450);
    expect(new Set(result.data.map((q) => q.id)).size).toBe(450);
    expect(calls).toHaveLength(3);
    expect(calls[0]).toContain(`limit=${MAX_PAGE_SIZE}`);
    expect(calls[0]).toContain("chapterId=c1");
  });

  it("returns one page with backend meta", async () => {
    const { baseQuery } = fakeBackend(120);
    const result = await fetchQuestionPage(
      baseQuery,
      URL_BASE,
      { page: 3, limit: 50 },
      "mcq",
    );
    expect(result.data.items).toHaveLength(20);
    expect(result.data.meta).toEqual({
      total: 120,
      page: 3,
      limit: 50,
      totalPages: 3,
    });
  });

  it("treats 'no questions found' 404 as an empty page", async () => {
    const baseQuery = async () => ({ error: { status: 404, data: {} } });
    const result = await fetchAllQuestionPages(baseQuery, URL_BASE, {}, "long");
    expect(result).toEqual({ data: [] });
  });

  it("propagates other errors", async () => {
    const error = { status: 500, data: { message: "boom" } };
    const result = await fetchAllQuestionPages(
      async () => ({ error }),
      URL_BASE,
      {},
      "short",
    );
    expect(result).toEqual({ error });
  });
});
