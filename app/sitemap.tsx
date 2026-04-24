import { MetadataRoute } from "next";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://grammrlyst.com";

  // 🔹 MUST be absolute URL (very important)
  const API_BASE_URL = baseUrl;

  // 🔹 Static pages
  const staticPages = [
    "",
    "/dashboard",
    "/blog",
    "/contact",
    "/verbs",
    "/grammar",
    "/sentence-polisher",
    "/role-play",
    "/games",
    "/games/speed-typer",
    "/games/word-scramble",
    "/games/syntax-defender",
    "/pronunciation",
    "/accent-switch",
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
  }));

  let verbPages: MetadataRoute.Sitemap = [];

  try {
    const res = await fetch(
      `${API_BASE_URL}/verbs/getverbs?page=1&limit=100`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    if (!res.ok) {
      throw new Error(`API failed: ${res.status}`);
    }

    const verbsData = await res.json();
    const verbs = verbsData.data || verbsData;

    if (Array.isArray(verbs)) {
      verbPages = verbs.map((v: any) => ({
        url: `${baseUrl}/verbs/${v.word}`,
        lastModified: new Date(v.updated_at || new Date()),
      }));
    }
  } catch (err) {
    console.error("❌ Sitemap verbs fetch error:", err);
  }

  return [...staticPages, ...verbPages];
}