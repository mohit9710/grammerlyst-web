import { MetadataRoute } from "next";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://grammrlyst.com";

  // 🔹 Static pages
  const staticPages = [
    "",
    "/dashboard",
    "/about",
    "/pricing",
    "/contact",
    "/partner",
    "/privacy-policy",
    "/terms",
    "/blog",
    "/tongue-twisters",
    "/verbs",
    "/grammar",
    "/sentence-polisher",
    "/writing-strategies",
    "/role-play",
    "/games",
    "/games/speed-typer",
    "/games/word-scramble",
    "/games/syntax-defender",
    "/games/word-memory",
    "/games/odd-one-out",
    "/pronunciation",
    "/accent-training",
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
  }));

  return staticPages;
}