"use client";

import { useEffect, useMemo, useState } from "react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import { fetchBlogPosts, BlogPost } from "@/services/blogService";

const CATEGORY_STYLES: Record<string, string> = {
  Grammar: "bg-amber-500/10 border-amber-500/20 text-amber-300",
  IELTS: "bg-pink-500/10 border-pink-500/20 text-pink-300",
  Vocabulary: "bg-emerald-500/10 border-emerald-500/20 text-emerald-300",
  Speaking: "bg-cyan-500/10 border-cyan-500/20 text-cyan-300",
  "Learning Tech": "bg-violet-500/10 border-violet-500/20 text-violet-300",
  "Learning Tips": "bg-indigo-500/10 border-indigo-500/20 text-indigo-300",
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("All");

  const [activePost, setActivePost] = useState<BlogPost | null>(null);

  // =====================================================
  // SEO
  // =====================================================

  useEffect(() => {
    document.title = "Blog | English Learning Tips & Insights | Grammrlyst";

    let metaDesc = document.querySelector('meta[name="description"]');

    if (!metaDesc) {
      metaDesc = document.createElement("meta");

      metaDesc.setAttribute("name", "description");

      document.head.appendChild(metaDesc);
    }

    metaDesc.setAttribute(
      "content",
      "Free English learning articles covering grammar, IELTS writing, vocabulary, pronunciation, and fluency tips. No sign-up required."
    );
  }, []);

  // =====================================================
  // FETCH POSTS — publicly accessible, no auth required
  // =====================================================

  useEffect(() => {
    fetchBlogPosts()
      .then(setPosts)
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  // =====================================================
  // FILTERS
  // =====================================================

  const categories = useMemo(() => {
    const unique = [...new Set(posts.map((p) => p.category))];

    return ["All", ...unique];
  }, [posts]);

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const query = search.toLowerCase();

      const matchesSearch =
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.tags.some((tag) => tag.toLowerCase().includes(query));

      const matchesCategory =
        selectedCategory === "All" ? true : post.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [posts, search, selectedCategory]);

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050816] flex items-center justify-center text-white text-xl font-bold">
        Loading Blog...
      </div>
    );
  }

  // =====================================================
  // ARTICLE READING VIEW
  // =====================================================

  if (activePost) {
    return (
      <>
        <Navbar />

        <main className="min-h-screen bg-[#050816] text-white overflow-x-hidden relative">
          <div className="absolute top-0 left-0 w-96 h-96 bg-amber-500/20 blur-3xl rounded-full"></div>

          <div className="absolute top-20 right-0 w-[30rem] h-[30rem] bg-pink-500/20 blur-3xl rounded-full"></div>

          <div className="relative z-10 w-full max-w-3xl mx-auto px-4 sm:px-6 py-10 lg:py-14">
            <button
              onClick={() => setActivePost(null)}
              className="mb-8 inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-sm font-semibold text-slate-300"
            >
              ← Back to all posts
            </button>

            <div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-6 ${
                CATEGORY_STYLES[activePost.category] ||
                "bg-white/5 border-white/10 text-slate-300"
              }`}
            >
              <span className="text-sm font-semibold">
                {activePost.category}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-black leading-tight mb-6">
              {activePost.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400 mb-10">
              <span>{activePost.author}</span>

              <span>•</span>

              <span>{formatDate(activePost.publishedDate)}</span>

              <span>•</span>

              <span>{activePost.readTimeMinutes} min read</span>
            </div>

            <article className="space-y-6">
              {activePost.content.map((paragraph, index) => (
                <p
                  key={index}
                  className="text-lg text-slate-300 leading-relaxed"
                >
                  {paragraph}
                </p>
              ))}
            </article>

            <div className="flex flex-wrap gap-2 mt-10 pt-8 border-t border-white/10">
              {activePost.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-slate-400"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  // =====================================================
  // LISTING VIEW
  // =====================================================

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#050816] text-white overflow-x-hidden relative">
        {/* BACKGROUND GLOWS */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-amber-500/20 blur-3xl rounded-full"></div>

        <div className="absolute top-20 right-0 w-[30rem] h-[30rem] bg-pink-500/20 blur-3xl rounded-full"></div>

        <div className="relative z-10 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-16 py-10 lg:py-14">
          {/* HERO */}
          <div className="mb-14 lg:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl mb-6">
              <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></div>

              <span className="text-sm text-slate-300">
                Free & Open to Everyone
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl font-black leading-tight mb-5">
              Grammrlyst
              <br />
              <span className="bg-gradient-to-r from-amber-400 to-pink-500 bg-clip-text text-transparent">
                Blog
              </span>
            </h1>

            <p className="text-slate-400 text-lg max-w-3xl leading-relaxed">
              Practical articles on grammar, IELTS writing, vocabulary, and
              fluency — no account required.
            </p>
          </div>

          {/* FILTERS */}
          <div className="flex flex-col md:flex-row gap-4 mb-10">
            <input
              type="text"
              placeholder="Search articles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full md:max-w-md px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400 transition-all"
            />

            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-5 py-2.5 rounded-2xl text-sm font-semibold border transition-all ${
                    selectedCategory === category
                      ? "bg-gradient-to-r from-amber-500 to-pink-600 border-transparent text-white"
                      : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* POSTS GRID */}
          {filteredPosts.length > 0 ? (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6 xl:gap-8">
              {filteredPosts.map((post) => (
                <button
                  key={post.id}
                  onClick={() => setActivePost(post)}
                  className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-6 lg:p-7 text-left hover:border-amber-400/30 transition-all duration-300 flex flex-col"
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-r from-amber-500 to-pink-600 transition-all duration-500"></div>

                  <div className="relative z-10 flex flex-col flex-1">
                    <div
                      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border mb-4 self-start ${
                        CATEGORY_STYLES[post.category] ||
                        "bg-white/5 border-white/10 text-slate-300"
                      }`}
                    >
                      <span className="text-xs font-semibold">
                        {post.category}
                      </span>
                    </div>

                    <h2 className="text-xl font-black mb-3 leading-snug">
                      {post.title}
                    </h2>

                    <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-1">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center justify-between text-xs text-slate-500 pt-4 border-t border-white/10">
                      <span>{formatDate(post.publishedDate)}</span>

                      <span>{post.readTimeMinutes} min read</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-12 text-center">
              <div className="text-6xl mb-5">📚</div>

              <h3 className="text-2xl font-bold mb-3">No Articles Found</h3>

              <p className="text-slate-400">
                Try a different search term or category.
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
