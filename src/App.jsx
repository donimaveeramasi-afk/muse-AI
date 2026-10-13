
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Sparkles,
  PanelsTopLeft,
  PenLine,
  FolderHeart,
  Settings,
  Search,
  Bell,
  Plus,
  ArrowRight,
  Copy,
  Download,
  Trash2,
  Menu,
  X,
  Instagram,
  Check,
  Clock3,
  Heart,
  Lightbulb,
  Hash,
  RefreshCw,
  Store,
  FileText,
  Palette,
  Camera,
  Video,
  WandSparkles,
} from "lucide-react";
import Marketplace from "./marketplace.jsx";
import "./App.css";

const STORAGE_KEY = "muse-ai-content-v1";

const navigation = [
  { name: "Dashboard", icon: LayoutDashboard },
  { name: "AI Generator", icon: Sparkles },
  { name: "Templates", icon: PanelsTopLeft },
  { name: "Post Creator", icon: PenLine },
  { name: "My Content", icon: FolderHeart },
  { name: "Marketplace", icon: Store },
];

const templates = [
  {
    id: "t1",
    title: "Instagram Caption",
    category: "Social Media",
    description: "Create engaging captions for your next post.",
    icon: Instagram,
    type: "Instagram caption",
    topic: "A day in my life",
  },
  {
    id: "t2",
    title: "Business Idea",
    category: "Business",
    description: "Turn a simple idea into a business concept.",
    icon: Lightbulb,
    type: "Business idea",
    topic: "A small online business",
  },
  {
    id: "t3",
    title: "Product Description",
    category: "Marketing",
    description: "Describe a product attractively.",
    icon: FileText,
    type: "Product description",
    topic: "A creative lifestyle product",
  },
  {
    id: "t4",
    title: "Social Media Plan",
    category: "Marketing",
    description: "Plan content for your social media page.",
    icon: Hash,
    type: "Content plan",
    topic: "A personal brand",
  },
  {
    id: "t5",
    title: "Creative Story",
    category: "Writing",
    description: "Start a short creative story.",
    icon: WandSparkles,
    type: "Short story",
    topic: "A girl discovering a secret garden",
  },
  {
    id: "t6",
    title: "Video Ideas",
    category: "Video",
    description: "Generate ideas for short creative videos.",
    icon: Video,
    type: "Video ideas",
    topic: "A short inspirational video",
  },
];

function readContent() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function downloadText(filename, text) {
  const blob = new Blob([text], {
    type: "text/plain;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();

  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function createDemoContent(type, topic, tone, length) {
  const subject = topic.trim() || "my creative journey";

  const examples = {
    "Instagram caption":
      `✨ Every little step counts.

Today is another chance to learn, grow, and create something meaningful about ${subject}.

Keep showing up and trust your journey. 💜

#CreativeJourney #DailyInspiration

Tone: ${tone}. Length: ${length}.`,

    "Business idea":
      `Business idea: ${subject}

Concept:
Create a useful product or service for a clearly defined audience.

Target audience:
People who need a simple, convenient solution.

First steps:
1. Understand the audience's needs.
2. Research similar businesses.
3. Test the idea on a small scale.
4. Collect feedback and improve.

Tone: ${tone}. Length: ${length}.`,

    "Product description":
      `${subject}

Discover a thoughtful product designed to make everyday life easier. With a simple approach and a focus on usability, it is made for people who value creativity and convenience.

Explore the idea and see whether it fits your needs.`,

    "Content plan":
      `Content plan for: ${subject}

1. Introduction: Share who you are.
2. Educational post: Share a useful tip.
3. Behind the scenes: Show your creative process.
4. Engagement post: Ask your audience a question.
5. Reflection: Share what you learned.

Review feedback and plan your next posts.`,

    "Short story":
      `The Secret Garden

One quiet morning, a girl named Mira discovered a tiny door hidden behind an old tree. Curious, she opened it and found a garden filled with glowing flowers. Every flower seemed to hold a different memory. She realized that the garden was inviting her to discover a story of her own.`,

    "Video ideas":
      `Video ideas about ${subject}

1. A short introduction to the idea.
2. Three things people may not know about it.
3. A day-in-the-life video.
4. A creative process video.
5. A short motivational story.

Choose one idea and build a scene-by-scene plan.`,
  };

  return examples[type] || examples["Instagram caption"];
}

export default function App() {
  const [page, setPage] = useState("Dashboard");
  const [content, setContent] = useState(readContent);
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("Friendly");
  const [length, setLength] = useState("Medium");
  const [contentType, setContentType] = useState("Instagram caption");
  const [generated, setGenerated] = useState("");
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState("");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [postText, setPostText] = useState("");
  const [postTitle, setPostTitle] = useState("");
  const [likedTemplates, setLikedTemplates] = useState([]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
    } catch {
      setToast("Could not save content in this browser.");
    }
  }, [content]);

  function notify(message) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2400);
  }

  function navigate(destination) {
    setPage(destination);
    setMobileMenu(false);
    setSearch("");
  }

  // Frontend-only demo generation: no backend request.
  function generateContent() {
    if (!topic.trim()) {
      notify("Enter a topic first.");
      return;
    }

    setLoading(true);
    setGenerated("");

    try {
      const result = createDemoContent(
        contentType,
        topic,
        tone,
        length
      );

      setGenerated(result);
      notify("Demo content created!");
    } catch {
      notify("Could not create the demo draft.");
    } finally {
      setLoading(false);
    }
  }

  function saveContent(
    text = generated,
    title = topic,
    type = contentType
  ) {
    if (!text.trim()) {
      notify("There is no content to save.");
      return;
    }

    const item = {
      id: makeId(),
      title: title.trim() || "Untitled creation",
      type,
      body: text,
      favorite: false,
      createdAt: new Date().toISOString(),
    };

    setContent((previous) => [item, ...previous]);
    notify("Content saved!");
  }

  function deleteContent(id) {
    setContent((previous) =>
      previous.filter((item) => item.id !== id)
    );
    notify("Content deleted.");
  }

  function toggleFavorite(id) {
    setContent((previous) =>
      previous.map((item) =>
        item.id === id
          ? { ...item, favorite: !item.favorite }
          : item
      )
    );
  }

  async function copyText(text) {
    try {
      if (!navigator.clipboard) {
        throw new Error("Clipboard unavailable");
      }

      await navigator.clipboard.writeText(text);
      notify("Copied to clipboard!");
    } catch {
      notify("Copy failed. Please select and copy the text.");
    }
  }

  function useTemplate(template) {
    setContentType(template.type);
    setTopic(template.topic);
    setGenerated("");
    setPage("AI Generator");
    notify("Template added to AI Generator.");
  }

  function createPost() {
    if (!postTitle.trim() || !postText.trim()) {
      notify("Enter a title and post content.");
      return;
    }

    saveContent(postText, postTitle, "Post Creator");
    setPostText("");
    setPostTitle("");
  }

  const filteredContent = content.filter((item) => {
    const matchesSearch =
      `${item.title} ${item.body} ${item.type}`
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesCategory =
      activeCategory === "All" ||
      (activeCategory === "Favorites" && item.favorite) ||
      item.type === activeCategory;

    return matchesSearch && matchesCategory;
  });

  const favoriteCount = content.filter(
    (item) => item.favorite
  ).length;

  return (
    <div className="app-shell">
      {mobileMenu && (
        <button
          className="mobile-overlay"
          aria-label="Close navigation"
          onClick={() => setMobileMenu(false)}
        />
      )}

      <aside className={`sidebar ${mobileMenu ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-icon">
            <Sparkles size={23} />
          </div>
          <div>
            <strong>Muse AI</strong>
            <span>Creative workspace</span>
          </div>
          <button
            className="mobile-close"
            onClick={() => setMobileMenu(false)}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <div className="workspace-label">WORKSPACE</div>

        <nav className="navigation">
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.name}
                className={`nav-item ${
                  page === item.name ? "active" : ""
                }`}
                onClick={() => navigate(item.name)}
              >
                <Icon size={19} />
                <span>{item.name}</span>
                {item.name === "Marketplace" && (
                  <span className="nav-new">NEW</span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-tip">
            <div className="tip-icon">
              <Lightbulb size={18} />
            </div>
            <strong>A little inspiration</strong>
            <p>Small ideas can grow into wonderful things.</p>
            <button onClick={() => navigate("AI Generator")}>
              Start creating <ArrowRight size={15} />
            </button>
          </div>

          <button
            className={`nav-item ${
              page === "Settings" ? "active" : ""
            }`}
            onClick={() => navigate("Settings")}
          >
            <Settings size={19} />
            <span>Settings</span>
          </button>

          <div className="sidebar-profile">
            <div className="profile-avatar">M</div>
            <div>
              <strong>My Workspace</strong>
              <span>Free plan</span>
            </div>
          </div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <button
            className="mobile-menu-button"
            onClick={() => setMobileMenu(true)}
            aria-label="Open navigation"
          >
            <Menu size={22} />
          </button>

          <div className="breadcrumb">
            <span>Workspace</span>
            <ArrowRight size={14} />
            <strong>{page}</strong>
          </div>

          <div className="topbar-actions">
            <label className="global-search">
              <Search size={17} />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search your content..."
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                >
                  <X size={15} />
                </button>
              )}
            </label>

            <button
              className="notification-button"
              onClick={() => notify("You're all caught up!")}
              aria-label="Notifications"
            >
              <Bell size={19} />
              <span />
            </button>

            <div className="topbar-avatar">M</div>
          </div>
        </header>

        <div className="page-container">
          {page === "Marketplace" && <Marketplace />}

          {page === "Dashboard" && (
            <section className="dashboard-page">
              <div className="welcome-banner">
                <div className="welcome-content">
                  <span className="welcome-label">
                    <Sparkles size={15} /> YOUR CREATIVE SPACE
                  </span>
                  <h1>
                    Make room for
                    <br />
                    <span>great ideas.</span>
                  </h1>
                  <p>
                    Your ideas deserve a place to grow. Start creating
                    something today.
                  </p>
                  <button
                    className="primary-button"
                    onClick={() => navigate("AI Generator")}
                  >
                    <Plus size={18} /> Create something{" "}
                    <ArrowRight size={16} />
                  </button>
                </div>

                <div className="welcome-art">
                  <div className="welcome-art-circle circle-one" />
                  <div className="welcome-art-circle circle-two" />
                  <div className="welcome-art-center">
                    <WandSparkles size={48} />
                  </div>
                  <div className="floating-art floating-one">
                    <Palette size={22} />
                  </div>
                  <div className="floating-art floating-two">
                    <Camera size={22} />
                  </div>
                  <div className="floating-art floating-three">
                    <Sparkles size={20} />
                  </div>
                </div>
              </div>

              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon stat-purple">
                    <FileText size={21} />
                  </div>
                  <span>Total creations</span>
                  <strong>{content.length}</strong>
                  <small>Your saved ideas</small>
                </div>

                <div className="stat-card">
                  <div className="stat-icon stat-pink">
                    <Heart size={21} />
                  </div>
                  <span>Favorites</span>
                  <strong>{favoriteCount}</strong>
                  <small>Ideas you love</small>
                </div>

                <div className="stat-card">
                  <div className="stat-icon stat-blue">
                    <PanelsTopLeft size={21} />
                  </div>
                  <span>Templates</span>
                  <strong>{templates.length}</strong>
                  <small>Ready to explore</small>
                </div>

                <div className="stat-card">
                  <div className="stat-icon stat-yellow">
                    <Sparkles size={21} />
                  </div>
                  <span>Workspace</span>
                  <strong>Free</strong>
                  <small>Creative plan</small>
                </div>
              </div>

              <div className="dashboard-section-heading">
                <div>
                  <h2>Quick start</h2>
                  <p>Choose what you want to create today.</p>
                </div>
              </div>

              <div className="quick-start-grid">
                <button
                  className="quick-start-card"
                  onClick={() => navigate("AI Generator")}
                >
                  <div className="quick-icon quick-purple">
                    <Sparkles size={22} />
                  </div>
                  <strong>AI Generator</strong>
                  <span>Generate captions and creative ideas.</span>
                  <ArrowRight size={18} />
                </button>

                <button
                  className="quick-start-card"
                  onClick={() => navigate("Templates")}
                >
                  <div className="quick-icon quick-blue">
                    <PanelsTopLeft size={22} />
                  </div>
                  <strong>Explore templates</strong>
                  <span>Start with a ready-made template.</span>
                  <ArrowRight size={18} />
                </button>

                <button
                  className="quick-start-card"
                  onClick={() => navigate("Post Creator")}
                >
                  <div className="quick-icon quick-pink">
                    <PenLine size={22} />
                  </div>
                  <strong>Write a post</strong>
                  <span>Draft and save your own content.</span>
                  <ArrowRight size={18} />
                </button>
              </div>

              <div className="dashboard-section-heading recent-heading">
                <div>
                  <h2>Recent creations</h2>
                  <p>Pick up where you left off.</p>
                </div>
                <button
                  className="text-button"
                  onClick={() => navigate("My Content")}
                >
                  View all <ArrowRight size={15} />
                </button>
              </div>

              {content.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">
                    <FolderHeart size={27} />
                  </div>
                  <h3>Your creative journey starts here</h3>
                  <p>
                    Create your first piece of content and it will appear here.
                  </p>
                  <button
                    className="primary-button"
                    onClick={() => navigate("AI Generator")}
                  >
                    <Plus size={17} /> Create your first idea
                  </button>
                </div>
              ) : (
                <div className="recent-content-list">
                  {content.slice(0, 4).map((item) => (
                    <article className="recent-content-item" key={item.id}>
                      <div className="recent-content-icon">
                        <FileText size={20} />
                      </div>
                      <div className="recent-content-info">
                        <strong>{item.title}</strong>
                        <span>{item.type}</span>
                      </div>
                      <span className="recent-content-date">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                      <button
                        className="icon-button"
                        onClick={() => copyText(item.body)}
                        aria-label="Copy content"
                      >
                        <Copy size={17} />
                      </button>
                    </article>
                  ))}
                </div>
              )}
            </section>
          )}

          {page === "AI Generator" && (
            <section className="standard-page">
              <div className="page-intro">
                <div className="eyebrow">
                  <Sparkles size={15} /> YOUR CREATIVE ASSISTANT
                </div>
                <h1>
                  AI <span>Generator</span>
                </h1>
                <p className="page-description">
                  Turn a simple idea into a creative first draft.
                </p>
              </div>

              <div className="generator-layout">
                <div className="panel generator-panel">
                  <div className="panel-heading">
                    <div>
                      <h2>What are we creating?</h2>
                      <p>Give your idea a starting point.</p>
                    </div>
                    <div className="panel-heading-icon">
                      <WandSparkles size={21} />
                    </div>
                  </div>

                  <label className="field-label" htmlFor="content-type">
                    Content type
                  </label>
                  <select
                    id="content-type"
                    className="form-control"
                    value={contentType}
                    onChange={(event) => setContentType(event.target.value)}
                  >
                    {[
                      "Instagram caption",
                      "Business idea",
                      "Product description",
                      "Content plan",
                      "Short story",
                      "Video ideas",
                    ].map((type) => (
                      <option key={type}>{type}</option>
                    ))}
                  </select>

                  <label className="field-label" htmlFor="topic">
                    Your idea or topic
                  </label>
                  <textarea
                    id="topic"
                    className="form-control topic-textarea"
                    value={topic}
                    onChange={(event) => setTopic(event.target.value)}
                    placeholder="Example: a creative brand for students..."
                    rows={4}
                  />

                  <div className="form-two-columns">
                    <div>
                      <label className="field-label" htmlFor="tone">
                        Writing tone
                      </label>
                      <select
                        id="tone"
                        className="form-control"
                        value={tone}
                        onChange={(event) => setTone(event.target.value)}
                      >
                        {[
                          "Friendly",
                          "Professional",
                          "Creative",
                          "Funny",
                          "Inspirational",
                        ].map((value) => (
                          <option key={value}>{value}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="field-label" htmlFor="length">
                        Length
                      </label>
                      <select
                        id="length"
                        className="form-control"
                        value={length}
                        onChange={(event) => setLength(event.target.value)}
                      >
                        {["Short", "Medium", "Long"].map((value) => (
                          <option key={value}>{value}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <button
                    className="primary-button generate-button"
                    onClick={generateContent}
                    disabled={loading}
                  >
                    {loading ? (
                      <RefreshCw size={18} className="spin-icon" />
                    ) : (
                      <Sparkles size={18} />
                    )}
                    {loading ? "Creating..." : "Generate content"}
                  </button>

                  <p className="generator-note">
                    <Lightbulb size={15} />
                    Demo drafts are examples, not real AI-generated content.
                  </p>
                </div>

                <div className="panel result-panel">
                  <div className="panel-heading">
                    <div>
                      <h2>Your result</h2>
                      <p>Your draft will appear here.</p>
                    </div>
                    <div className="panel-heading-icon">
                      <FileText size={21} />
                    </div>
                  </div>

                  {generated ? (
                    <>
                      <div className="generated-content">{generated}</div>
                      <div className="result-actions">
                        <button
                          className="secondary-button"
                          onClick={() => copyText(generated)}
                        >
                          <Copy size={16} /> Copy
                        </button>
                        <button
                          className="secondary-button"
                          onClick={() =>
                            downloadText("muse-ai-content.txt", generated)
                          }
                        >
                          <Download size={16} /> Download
                        </button>
                        <button
                          className="primary-button"
                          onClick={() => saveContent()}
                        >
                          <Plus size={16} /> Save
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="result-placeholder">
                      <div className="placeholder-art">
                        <Sparkles size={30} />
                      </div>
                      <h3>Your next idea starts here</h3>
                      <p>Add a topic and generate your first draft.</p>
                    </div>
                  )}
                </div>
              </div>
            </section>
          )}

          {page === "Templates" && (
            <section className="standard-page">
              <div className="page-intro">
                <div className="eyebrow">
                  <PanelsTopLeft size={15} /> CREATIVE STARTING POINTS
                </div>
                <h1>
                  Explore <span>Templates</span>
                </h1>
                <p className="page-description">
                  Find a starting point for your next idea.
                </p>
              </div>

              <div className="template-grid">
                {templates
                  .filter((template) =>
                    `${template.title} ${template.category} ${template.description}`
                      .toLowerCase()
                      .includes(search.toLowerCase())
                  )
                  .map((template) => {
                    const Icon = template.icon;
                    const liked = likedTemplates.includes(template.id);

                    return (
                      <article className="template-card" key={template.id}>
                        <div className="template-card-top">
                          <div className="template-icon">
                            <Icon size={23} />
                          </div>
                          <button
                            className={`icon-button ${
                              liked ? "favorite-active" : ""
                            }`}
                            onClick={() =>
                              setLikedTemplates((previous) =>
                                liked
                                  ? previous.filter(
                                      (id) => id !== template.id
                                    )
                                  : [...previous, template.id]
                              )
                            }
                            aria-label="Favorite template"
                          >
                            <Heart
                              size={18}
                              fill={liked ? "currentColor" : "none"}
                            />
                          </button>
                        </div>
                        <span className="template-category">
                          {template.category}
                        </span>
                        <h3>{template.title}</h3>
                        <p>{template.description}</p>
                        <button
                          className="template-use-button"
                          onClick={() => useTemplate(template)}
                        >
                          Use template <ArrowRight size={16} />
                        </button>
                      </article>
                    );
                  })}
              </div>
            </section>
          )}

          {page === "Post Creator" && (
            <section className="standard-page">
              <div className="page-intro">
                <div className="eyebrow">
                  <PenLine size={15} /> SOCIAL CONTENT STUDIO
                </div>
                <h1>
                  Post <span>Creator</span>
                </h1>
                <p className="page-description">
                  Write your own post and save it to your workspace.
                </p>
              </div>

              <div className="panel">
                <div className="panel-heading">
                  <div>
                    <h2>Create your post</h2>
                    <p>Write in your own voice.</p>
                  </div>
                  <div className="panel-heading-icon">
                    <PenLine size={20} />
                  </div>
                </div>

                <label className="field-label" htmlFor="post-title">
                  Post title
                </label>
                <input
                  id="post-title"
                  className="form-control"
                  value={postTitle}
                  onChange={(event) => setPostTitle(event.target.value)}
                  placeholder="Give your post a title"
                />

                <label className="field-label" htmlFor="post-text">
                  Post content
                </label>
                <textarea
                  id="post-text"
                  className="form-control post-textarea"
                  value={postText}
                  onChange={(event) => setPostText(event.target.value)}
                  placeholder="Start writing your post..."
                  rows={10}
                />

                <div className="post-editor-footer">
                  <span>{postText.length} characters</span>
                  <button className="primary-button" onClick={createPost}>
                    <Check size={17} /> Save post
                  </button>
                </div>
              </div>
            </section>
          )}

          {page === "My Content" && (
            <section className="standard-page">
              <div className="page-intro">
                <div className="eyebrow">
                  <FolderHeart size={15} /> YOUR COLLECTION
                </div>
                <h1>
                  My <span>Content</span>
                </h1>
                <p className="page-description">
                  Find your saved drafts and creative ideas.
                </p>
              </div>

              <div className="content-toolbar">
                <div className="category-tabs">
                  {[
                    "All",
                    "Favorites",
                    "Instagram caption",
                    "Post Creator",
                  ].map((category) => (
                    <button
                      key={category}
                      className={`category-tab ${
                        activeCategory === category ? "active" : ""
                      }`}
                      onClick={() => setActiveCategory(category)}
                    >
                      {category}
                    </button>
                  ))}
                </div>

                <button
                  className="secondary-button"
                  disabled={content.length === 0}
                  onClick={() =>
                    downloadText(
                      "muse-ai-content.txt",
                      content
                        .map((item) => `${item.title}\n${item.body}`)
                        .join("\n\n---\n\n")
                    )
                  }
                >
                  <Download size={16} /> Export all
                </button>
              </div>

              {filteredContent.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">
                    <FolderHeart size={28} />
                  </div>
                  <h3>No content found</h3>
                  <p>Create something new or try a different search.</p>
                  <button
                    className="primary-button"
                    onClick={() => navigate("AI Generator")}
                  >
                    <Plus size={17} /> Create content
                  </button>
                </div>
              ) : (
                <div className="saved-content-grid">
                  {filteredContent.map((item) => (
                    <article
                      className="saved-content-card"
                      key={item.id}
                    >
                      <div className="saved-card-header">
                        <span className="content-type-badge">
                          {item.type}
                        </span>
                        <button
                          className={`icon-button ${
                            item.favorite ? "favorite-active" : ""
                          }`}
                          onClick={() => toggleFavorite(item.id)}
                          aria-label="Toggle favorite"
                        >
                          <Heart
                            size={18}
                            fill={
                              item.favorite ? "currentColor" : "none"
                            }
                          />
                        </button>
                      </div>

                      <h3>{item.title}</h3>
                      <p className="saved-content-preview">{item.body}</p>

                      <div className="saved-card-footer">
                        <span>
                          <Clock3 size={14} />
                          {new Date(
                            item.createdAt
                          ).toLocaleDateString()}
                        </span>
                        <div className="saved-card-actions">
                          <button
                            className="icon-button"
                            onClick={() => copyText(item.body)}
                            aria-label="Copy content"
                          >
                            <Copy size={16} />
                          </button>
                          <button
                            className="icon-button"
                            onClick={() =>
                              downloadText(
                                `${item.title.replace(
                                  /[^a-z0-9]/gi,
                                  "-"
                                )}.txt`,
                                item.body
                              )
                            }
                            aria-label="Download content"
                          >
                            <Download size={16} />
                          </button>
                          <button
                            className="icon-button delete-button"
                            onClick={() => deleteContent(item.id)}
                            aria-label="Delete content"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          )}

          {page === "Settings" && (
            <section className="standard-page">
              <div className="page-intro">
                <div className="eyebrow">
                  <Settings size={15} /> WORKSPACE PREFERENCES
                </div>
                <h1>
                  App <span>Settings</span>
                </h1>
                <p className="page-description">
                  Manage your local creative workspace.
                </p>
              </div>

              <div className="panel settings-panel">
                <div className="panel-heading">
                  <div>
                    <h2>Workspace</h2>
                    <p>Your personal creative workspace.</p>
                  </div>
                </div>

                <div className="settings-row">
                  <div className="settings-avatar">M</div>
                  <div className="settings-row-copy">
                    <strong>My Workspace</strong>
                    <span>Personal workspace</span>
                  </div>
                </div>

                <div className="settings-row">
                  <div className="settings-row-copy">
                    <strong>Saved content</strong>
                    <span>Stored in this browser.</span>
                  </div>
                  <span className="settings-value">
                    {content.length} items
                  </span>
                </div>

                <div className="settings-row">
                  <div className="settings-row-copy">
                    <strong>Generation mode</strong>
                    <span>
                      Sample content is created locally.
                    </span>
                  </div>
                  <span className="status-pill status-offline">
                    Demo mode
                  </span>
                </div>

                <div className="settings-row">
                  <div className="settings-row-copy">
                    <strong>Marketplace</strong>
                    <span>Explore sample creator profiles.</span>
                  </div>
                  <button
                    className="secondary-button"
                    onClick={() => navigate("Marketplace")}
                  >
                    Open <ArrowRight size={15} />
                  </button>
                </div>

                <div className="settings-danger-zone">
                  <h3>Clear local content</h3>
                  <p>
                    This removes saved creations from this browser.
                  </p>
                  <button
                    className="danger-button"
                    onClick={() => {
                      if (
                        window.confirm("Delete all saved content?")
                      ) {
                        setContent([]);
                        notify("Local content cleared.");
                      }
                    }}
                  >
                    <Trash2 size={16} /> Clear saved content
                  </button>
                </div>
              </div>
            </section>
          )}
        </div>
      </main>

      {toast && (
        <div className="toast-message" role="status">
          <Check size={17} /> {toast}
        </div>
      )}
    </div>
  );
}
