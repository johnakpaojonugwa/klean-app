import React, { useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { User, MessageCircle, ArrowLeft, Search, Clock, ChevronRight } from "lucide-react";
import { blogs } from "@/constants/blogs";
import BlogHero from "@/components/landing/BlogHero";

const CATEGORIES = ["All", "Fabric Care", "Savings", "Sustainability", "Service Updates", "Business"];

export default function BlogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeId = searchParams.get("id");
  const activeCategory = searchParams.get("category") || "All";
  const searchQuery = searchParams.get("q") || "";

  // Find the selected blog
  const selectedBlog = useMemo(() => {
    if (!activeId) return null;
    return blogs.find((b) => b.id === parseInt(activeId, 10));
  }, [activeId]);

  // Filtered blogs for listing
  const filteredBlogs = useMemo(() => {
    return blogs.filter((blog) => {
      const matchesCategory = activeCategory === "All" || blog.category === activeCategory;
      const matchesSearch =
        blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.content.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  // Get related blogs (different from the current one, up to 3)
  const relatedBlogs = useMemo(() => {
    if (!selectedBlog) return [];
    return blogs
      .filter((b) => b.id !== selectedBlog.id)
      .slice(0, 3);
  }, [selectedBlog]);

  const handleSearchChange = (e) => {
    const q = e.target.value;
    const newParams = new URLSearchParams(searchParams);
    if (q) {
      newParams.set("q", q);
    } else {
      newParams.delete("q");
    }
    setSearchParams(newParams);
  };

  const handleCategorySelect = (category) => {
    const newParams = new URLSearchParams(searchParams);
    if (category !== "All") {
      newParams.set("category", category);
    } else {
      newParams.delete("category");
    }
    setSearchParams(newParams);
  };

  const handleClearSearch = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("q");
    setSearchParams(newParams);
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen w-full font-sans text-slate-900">
      {selectedBlog ? (
        // ==========================================
        // DETAILS VIEW
        // ==========================================
        <div>
          {/* Subpage Banner/Header Style */}
          <div className="relative min-h-[40vh] flex items-center pt-20 overflow-hidden bg-[#0f172a]">
            <div className="absolute inset-0 z-0">
              <img
                src={selectedBlog.image}
                alt={selectedBlog.title}
                className="w-full h-full object-cover object-center opacity-40 blur-[2px]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#F8FAFC] via-[#1A2E56]/80 to-[#1A2E56] z-10" />
            </div>
            <div className="max-w-[1024px] mx-auto px-6 relative z-20 w-full text-center">
              <div className="inline-flex items-center gap-2 bg-[#26C1C9]/20 text-[#26C1C9] px-4 py-2 rounded-full mb-6 font-bold text-xs uppercase tracking-widest">
                {selectedBlog.category}
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-white leading-tight uppercase tracking-tight max-w-4xl mx-auto mb-6">
                {selectedBlog.title}
              </h1>
              <div className="flex items-center justify-center gap-6 text-sm text-slate-300 font-semibold tracking-wider">
                <span className="flex items-center gap-1.5">
                  <User size={16} className="text-[#26C1C9]" />
                  {selectedBlog.author.split("@")[0]}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                <span className="flex items-center gap-1.5">
                  <Clock size={16} className="text-[#26C1C9]" />
                  {selectedBlog.date}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                <span className="flex items-center gap-1.5">
                  <MessageCircle size={16} className="text-[#26C1C9]" />
                  {selectedBlog.comments}
                </span>
              </div>
            </div>
          </div>

          <div className="max-w-[1024px] mx-auto px-6 py-12 md:py-20 -mt-10 relative z-30">
            <div className="bg-white rounded-[2rem] p-6 md:p-12 shadow-xl border border-slate-100 mb-16">
              {/* Back Button */}
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 text-slate-500 hover:text-[#4F7DF3] font-bold text-xs uppercase tracking-widest mb-10 transition-colors"
              >
                <ArrowLeft size={16} /> Back to Blog list
              </Link>

              {/* Main Image */}
              <div className="rounded-2xl overflow-hidden aspect-video mb-10 shadow-md">
                <img
                  src={selectedBlog.image}
                  alt={selectedBlog.title}
                  className="w-full h-full object-cover object-center"
                />
              </div>

              {/* Article Content */}
              <article className="prose prose-slate max-w-none">
                {selectedBlog.content.split("\n\n").map((para, i) => (
                  <p key={i} className="text-slate-700 text-base md:text-lg leading-relaxed mb-6 font-medium whitespace-pre-line">
                    {para}
                  </p>
                ))}
              </article>
            </div>

            {/* Related Articles */}
            <div className="border-t border-slate-200 pt-16">
              <h3 className="text-2xl font-black text-[#1A2E56] uppercase tracking-tight mb-8">
                Related Articles
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedBlogs.map((post) => (
                  <div key={post.id} className="bg-white rounded-3xl border border-slate-100 overflow-hidden flex flex-col hover:shadow-lg transition-all duration-300">
                    <div className="aspect-video relative overflow-hidden">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#26C1C9] mb-2 block">
                        {post.category}
                      </span>
                      <h4 className="font-black text-sm text-[#1A2E56] leading-snug uppercase mb-3 line-clamp-2">
                        {post.title}
                      </h4>
                      <Link
                        to={`/blog?id=${post.id}`}
                        className="text-xs font-bold uppercase tracking-wider text-[#4F7DF3] hover:text-[#3B63C9] mt-auto inline-flex items-center gap-1"
                      >
                        Read Article <ChevronRight size={14} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        // ==========================================
        // LISTING VIEW
        // ==========================================
        <div>
          <BlogHero />

          <div className="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-20 py-16">
            {/* Control Bar: Search & Categories */}
            <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-6 mb-12">
              {/* Category Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-3 lg:pb-0 scrollbar-none -mx-6 px-6 lg:mx-0 lg:px-0">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategorySelect(cat)}
                    className={`whitespace-nowrap px-6 py-3 rounded-full text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                      activeCategory === cat
                        ? "bg-[#4F7DF3] text-white shadow-md shadow-[#4F7DF3]/25"
                        : "bg-white text-slate-500 border border-slate-100 hover:bg-slate-50 hover:text-[#1A2E56]"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Search input */}
              <div className="relative max-w-md w-full">
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full bg-white border border-slate-200 rounded-full py-4 pl-12 pr-6 text-sm font-semibold text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4F7DF3]/25 focus:border-[#4F7DF3] shadow-sm transition-all"
                />
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            {/* Empty State */}
            {filteredBlogs.length === 0 ? (
              <div className="text-center bg-white rounded-[2rem] border border-slate-100 p-16 shadow-sm max-w-xl mx-auto">
                <h3 className="text-2xl font-black text-[#1A2E56] uppercase mb-4">No Articles Found</h3>
                <p className="text-slate-500 font-medium leading-relaxed mb-6">
                  We couldn't find any articles matching your filters or search query. Try tweaking your keywords or category.
                </p>
                <button
                  onClick={handleClearSearch}
                  className="bg-[#4F7DF3] text-white px-8 py-4 rounded-full font-black text-xs uppercase tracking-wider hover:bg-[#3B63C9] transition-all cursor-pointer shadow-md shadow-[#4F7DF3]/20"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              // Blogs Grid
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
                {filteredBlogs.map((post) => (
                  <div key={post.id} className="relative py-2">
                    <div className="bg-white rounded-[2rem] rounded-br-[7rem] border border-slate-100 overflow-hidden flex flex-col h-full hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 relative">
                      <div className="relative w-full aspect-video lg:aspect-[16/10] overflow-hidden shrink-0">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover object-center"
                        />
                        <div className="absolute top-0 right-0 bg-[#00A878] text-white px-6 py-2 font-bold uppercase text-[10px] tracking-widest rounded-bl-3xl shadow-sm">
                          {post.date}
                          <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-white rounded-full"></div>
                        </div>
                      </div>

                      <div className="p-6 lg:p-10 flex flex-col flex-grow">
                        <div className="flex items-center gap-3 text-xs font-bold text-slate-500 mb-4 tracking-widest">
                          <span className="text-[#1A2E56] flex items-center gap-1">
                            <User size={14} className="text-[#26C1C9]" />{" "}
                            {post.author.split("@")[0]}
                          </span>
                          <span className="opacity-30">|</span>
                          <span className="text-[#26C1C9] uppercase">
                            {post.category}
                          </span>
                        </div>

                        <h3 className="text-lg lg:text-xl font-black text-[#1A2E56] leading-tight mb-4 uppercase line-clamp-2">
                          {post.title}
                        </h3>

                        <p className="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-3 font-medium">
                          {post.excerpt}
                        </p>

                        <div className="mt-auto">
                          <Link
                            to={`/blog?id=${post.id}`}
                            className="inline-block text-center relative overflow-hidden bg-[#E5B14A] text-white font-black px-8 py-4 lg:py-5 cursor-pointer rounded-full text-xs uppercase tracking-[0.2em] group/btn transition-colors duration-300 hover:text-white w-full sm:w-auto"
                          >
                            <span className="relative z-10">Read More</span>
                            <span className="absolute top-0 left-0 w-0 h-full bg-[#1A2E56] transition-all duration-500 ease-in-out group-hover/btn:w-1/2"></span>
                            <span className="absolute top-0 right-0 w-0 h-full bg-[#1A2E56] transition-all duration-500 ease-in-out group-hover/btn:w-1/2"></span>
                          </Link>
                        </div>
                      </div>
                      <div className="absolute bottom-0 right-0 w-20 h-20 rounded-br-[7rem] bg-[#26C1C9]/10 pointer-events-none" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
