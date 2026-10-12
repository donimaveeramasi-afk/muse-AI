
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
  ArrowUpRight,
  ArrowRight,
  Copy,
  Download,
  Trash2,
  Menu,
  X,
  WandSparkles,
  FileText,
  Image as ImageIcon,
  Instagram,
  Check,
  Clock3,
  Heart,
  Send,
  ChevronDown,
  Lightbulb,
  Hash,
  RefreshCw
} from "lucide-react";
import "./app.css";

const STORAGE_KEY = "muse-ai-content-v1";

const initialTemplates = [
  {
    id: "t1",
    title: "Instagram caption",
    category: "Social media",
    description: "Create a caption that catches attention.",
    icon: Instagram,
    prompt: "Write an engaging Instagram caption about"
  },
  {
    id: "t2",
    title: "Story ideas",
    category: "Writing",
    description: "Turn a small idea into a story.",
    icon: FileText,
    prompt: "Give me creative story ideas about"
  },
  {
    id: "t3",
    title: "Brand name ideas",
    category: "Business",
    description: "Discover names for a new brand.",
    icon: Lightbulb,
    prompt: "Suggest memorable brand names for"
  },
  {
    id: "t4",
    title: "Post ideas",
    category: "Marketing",
    description: "Plan content for your next post.",
    icon: ImageIcon,
    prompt: "Give me social media post ideas about"
  },
  {
    id: "t5",
    title: "Product description",
    category: "Business",
    description: "Describe a product in a clear way.",
    icon: WandSparkles,
    prompt: "Write a product description for"
  },
  {
    id: "t6",
    title: "Daily motivation",
    category: "Personal",
    description: "Create a thoughtful motivational quote.",
    icon: Sparkles,
    prompt: "Write an original motivational quote about"
  }
];

const navigation = [
  { id: "Dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "AI Generator", label: "AI Generator", icon: Sparkles },
  { id: "Templates", label: "Templates", icon: PanelsTopLeft },
  { id: "Post Creator", label: "Post Creator", icon: PenLine },
  { id: "My Content", label: "My Content", icon: FolderHeart }
];

function readSavedContent() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function createDemoContent(type, topic, tone, length) {
  const subject = topic.trim();

  if (type === "Instagram caption") {
    return `✨ ${subject}\n\nEvery little detail has a story to tell. Take a moment, find your inspiration, and make it your own. 💜\n\nWhat does ${subject} mean to you?\n\n#Inspiration #CreativeLife #MuseAI`;
  }

  if (type === "Story ideas") {
    return `Story idea: A new beginning\n\nA character discovers something unexpected connected to ${subject}. At first, it seems ordinary, but each small discovery reveals a new possibility.\n\nOpening: Introduce the character and their everyday world.\n\nMiddle: An unexpected event changes their plans.\n\nEnding: A thoughtful choice leads to a surprising discovery.\n\nWriting tip: Give the main character a clear goal and one meaningful challenge.`;
  }

  if (type === "Brand name ideas") {
    const clean = subject.replace(/[^a-zA-Z0-9 ]/g, "").trim();
    const word = clean.split(/\s+/)[0] || "Nova";

    return `Here are some starting points for your brand:\n\n1. ${word} Studio\n2. Nova & Co.\n3. Purely ${word}\n4. Bright Origin\n5. Bloom Theory\n\nChoose a name that fits your audience, is easy to remember, and is available to use. Check trademarks and domain availability before finalizing a name.`;
  }

  if (type === "Product description") {
    return `Discover ${subject}, designed with simplicity and everyday usefulness in mind.\n\nWhy it stands out:\n• A clear, easy-to-understand design\n• Made for everyday use\n• A thoughtful choice for people who value simplicity\n\nMake ${subject} part of your next idea.\n\nNote: These are sample marketing lines. Replace general claims with verified product details before publishing.`;
  }

  if (type === "Daily motivation") {
    return `“You do not have to have everything figured out today. Take one honest step, learn from it, and keep moving toward the life you want.”\n\nTheme: ${subject}\nTone: ${tone}`;
  }

  if (type === "Post ideas") {
    return `Content ideas for ${subject}:\n\n1. A beginner's guide\n2. Three things people often misunderstand\n3. A personal lesson or reflection\n4. Five useful tips\n5. A question that starts a conversation\n6. A before-and-after process, if you have genuine examples\n7. A short myth-versus-fact post\n\nSuggested format: ${length === "Short" ? "a short carousel or reel outline" : "a detailed carousel with one main point per slide"}.`;
  }

  return `Here is a ${tone.toLowerCase()} starting draft about ${subject}:\n\nStart with one clear idea. Explain why it matters to your audience, give a practical example, and finish with a useful takeaway.\n\nNext step: Add specific details, examples, and your own voice before publishing.`;
}

function downloadText(filename, text) {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  link.click();

  URL.revokeObjectURL(url);
}

export default function App() {
  const [page, setPage] = useState("Dashboard");
  const [content, setContent] = useState(readSavedContent);
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
  const [apiStatus, setApiStatus] = useState("checking");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
  }, [content]);

  useEffect(() => {
    let cancelled = false;

    fetch("http://localhost:5000/api/health")
      .then((response) => {
        if (!response.ok) throw new Error("Backend unavailable");
        return response.json();
      })
      .then(() => {
        if (!cancelled) setApiStatus("online");
      })
      .catch(() => {
        if (!cancelled) setApiStatus("offline");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  function notify(message) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2400);
  }

  function navigate(destination) {
    setPage(destination);
    setMobileMenu(false);
  }

  async function generateContent() {
    if (!topic.trim()) {
      notify("Please enter your idea first.");
      return;
    }

    setLoading(true);
    setGenerated("");

    try {
      const response = await fetch("http://localhost:5000/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: contentType,
          topic: topic.trim(),
          tone,
          length
        })
      });

      if (!response.ok) {
        throw new Error("The backend could not generate content.");
      }

      const data = await response.json();
      setGenerated(data.content);
      notify("Your draft is ready.");
    } catch {
      const demo = createDemoContent(contentType, topic, tone, length);
      setGenerated(demo);
      notify("Demo draft created. Check your backend when ready.");
    } finally {
      setLoading(false);
    }
  }

  function saveContent() {
    if (!generated.trim()) {
      notify("Generate some content first.");
      return;
    }

    const item = {
      id: makeId(),
      title: topic.trim() || contentType,
      type: contentType,
      body: generated,
      createdAt: new Date().toISOString(),
      favorite: false
    };

    setContent((previous) => [item, ...previous]);
    notify("Saved to My Content.");
  }

  function deleteContent(id) {
    setContent((previous) => previous.filter((item) => item.id !== id));
    notify("Content deleted.");
  }

  function toggleFavorite(id) {
    setContent((previous) =>
      previous.map((item) =>
        item.id === id ? { ...item, favorite: !item.favorite } : item
      )
    );
  }

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      notify("Copied to clipboard.");
    } catch {
      notify("Copy is unavailable in this browser.");
    }
  }

  function useTemplate(template) {
    setContentType(template.title);
    setTopic("");
    setGenerated("");
    setPage("AI Generator");
  }

  function createPost() {
    if (!postTitle.trim() || !postText.trim()) {
      notify("Add a title and post text.");
      return;
    }

    const item = {
      id: makeId(),
      title: postTitle.trim(),
      type: "Post Creator",
      body: postText.trim(),
      createdAt: new Date().toISOString(),
      favorite: false
    };

    setContent((previous) => [item, ...previous]);
    setPostTitle("");
    setPostText("");
    navigate("My Content");
    notify("Post saved.");
  }

  const filteredContent = content.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.body.toLowerCase().includes(search.toLowerCase()) ||
      item.type.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      activeCategory === "All" ||
      (activeCategory === "Favorites" && item.favorite) ||
      item.type === activeCategory;

    return matchesSearch && matchesCategory;
  });

  const favoriteCount = content.filter((item) => item.favorite).length;

  return (
    <div className="app-shell">
      {mobileMenu && (
        <button
          className="mobile-overlay"
          aria-label="Close menu"
          onClick={() => setMobileMenu(false)}
        />
      )}

      <aside className={`sidebar ${mobileMenu ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-mark">
            <Sparkles size={23} />
          </div>
          <div>
            <div className="brand-name">muse<span>ai</span></div>
            <div className="brand-subtitle">YOUR CREATIVE SPACE</div>
          </div>
          <button
            className="icon-button sidebar-close"
            aria-label="Close menu"
            onClick={() => setMobileMenu(false)}
          >
            <X size={19} />
          </button>
        </div>

        <div className="workspace-label">WORKSPACE</div>

        <nav className="navigation">
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                className={`nav-item ${page === item.id ? "active" : ""}`}
                onClick={() => navigate(item.id)}
              >
                <Icon size={19} />
                <span>{item.label}</span>
                {item.id === "My Content" && content.length > 0 && (
                  <span className="nav-count">{content.length}</span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="sidebar-bottom">
          <div className="upgrade-card">
            <div className="upgrade-icon">
              <Sparkles size={18} />
            </div>
            <h3>Your ideas deserve space.</h3>
            <p>Create, organize and explore your next idea.</p>
            <button
              className="upgrade-button"
              onClick={() => navigate("AI Generator")}
            >
              Start creating <ArrowRight size={15} />
            </button>
          </div>

          <button
            className={`nav-item ${page === "Settings" ? "active" : ""}`}
            onClick={() => navigate("Settings")}
          >
            <Settings size={19} />
            <span>Settings</span>
          </button>

          <div className="profile">
            <div className="avatar">D</div>
            <div className="profile-text">
              <strong>Creative workspace</strong>
              <span>Personal account</span>
            </div>
            <ChevronDown size={16} />
          </div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <button
            className="icon-button mobile-menu-button"
            aria-label="Open menu"
            onClick={() => setMobileMenu(true)}
          >
            <Menu size={21} />
          </button>

          <div className="breadcrumb">
            Workspace <span>/</span> <strong>{page}</strong>
          </div>

          <div className="topbar-actions">
            <div className="global-search">
              <Search size={17} />
              <input
                aria-label="Search saved content"
                placeholder="Search your content..."
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  if (event.target.value) setPage("My Content");
                }}
              />
              <kbd>⌘ K</kbd>
            </div>
            <button
              className="icon-button notification-button"
              aria-label="Notifications"
              onClick={() => notify("You're all caught up.")}
            >
              <Bell size={19} />
              <span />
            </button>
          </div>
        </header>

        <div className="page-container">
          {page === "Dashboard" && (
            <Dashboard
              content={content}
              favoriteCount={favoriteCount}
              apiStatus={apiStatus}
              onNavigate={navigate}
              onTemplate={useTemplate}
              onDelete={deleteContent}
            />
          )}

          {page === "AI Generator" && (
            <section className="page-section">
              <PageHeading
                eyebrow="YOUR CREATIVE ASSISTANT"
                title="AI Generator"
                description="Start with an idea. Turn it into a first draft."
              />

              <div className="generator-layout">
                <div className="panel generator-form">
                  <div className="panel-heading">
                    <div className="panel-icon purple-icon">
                      <WandSparkles size={20} />
                    </div>
                    <div>
                      <h3>Tell Muse your idea</h3>
                      <p>Choose what you want to create.</p>
                    </div>
                  </div>

                  <label className="field-label" htmlFor="contentType">
                    Content type
                  </label>
                  <div className="select-wrap">
                    <select
                      id="contentType"
                      value={contentType}
                      onChange={(event) => setContentType(event.target.value)}
                    >
                      <option>Instagram caption</option>
                      <option>Story ideas</option>
                      <option>Brand name ideas</option>
                      <option>Post ideas</option>
                      <option>Product description</option>
                      <option>Daily motivation</option>
                      <option>Blog draft</option>
                    </select>
                    <ChevronDown size={17} />
                  </div>

                  <label className="field-label" htmlFor="topic">
                    Your idea or topic
                  </label>
                  <textarea
                    id="topic"
                    className="input-textarea"
                    value={topic}
                    onChange={(event) => setTopic(event.target.value)}
                    placeholder="Example: a small business for handmade jewellery..."
                    rows={5}
                  />

                  <label className="field-label" htmlFor="tone">
                    Writing tone
                  </label>
                  <div className="select-wrap">
                    <select
                      id="tone"
                      value={tone}
                      onChange={(event) => setTone(event.target.value)}
                    >
                      <option>Friendly</option>
                      <option>Professional</option>
                      <option>Creative</option>
                      <option>Confident</option>
                      <option>Simple</option>
                      <option>Inspirational</option>
                    </select>
                    <ChevronDown size={17} />
                  </div>

                  <label className="field-label">Draft length</label>
                  <div className="length-options">
                    {["Short", "Medium", "Long"].map((value) => (
                      <button
                        key={value}
                        className={`length-option ${length === value ? "selected" : ""}`}
                        onClick={() => setLength(value)}
                      >
                        {value}
                      </button>
                    ))}
                  </div>

                  <button
                    className="primary-button generate-button"
                    onClick={generateContent}
                    disabled={loading}
                  >
                    {loading ? (
                      <RefreshCw size={17} className="spin" />
                    ) : (
                      <Sparkles size={17} />
                    )}
                    {loading ? "Creating..." : "Generate draft"}
                    {!loading && <ArrowRight size={17} />}
                  </button>

                  <p className="form-footnote">
                    <Lightbulb size={14} />
                    Review and personalize every draft before publishing.
                  </p>
                </div>

                <div className="panel output-panel">
                  <div className="output-header">
                    <div>
                      <span className="section-eyebrow">YOUR RESULT</span>
                      <h3>Creative output</h3>
                    </div>
                    <span className="status-pill">
                      <span className="status-dot" /> Draft
                    </span>
                  </div>

                  {generated ? (
                    <div className="generated-result">
                      <div className="result-toolbar">
                        <span><Sparkles size={15} /> Your draft</span>
                        <button
                          className="icon-button"
                          aria-label="Copy draft"
                          onClick={() => copyText(generated)}
                        >
                          <Copy size={16} />
                        </button>
                      </div>
                      <textarea
                        className="result-editor"
                        aria-label="Generated draft"
                        value={generated}
                        onChange={(event) => setGenerated(event.target.value)}
                        rows={15}
                      />
                      <div className="result-actions">
                        <button
                          className="secondary-button"
                          onClick={() => downloadText("muse-ai-draft.txt", generated)}
                        >
                          <Download size={16} /> Download
                        </button>
                        <button className="primary-button" onClick={saveContent}>
                          <FolderHeart size={16} /> Save draft
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="empty-output">
                      <div className="empty-art">
                        <div className="art-card art-card-one">
                          <FileText size={22} />
                        </div>
                        <div className="art-card art-card-two">
                          <Sparkles size={25} />
                        </div>
                        <div className="art-card art-card-three">
                          <Lightbulb size={21} />
                        </div>
                      </div>
                      <h3>Your next idea starts here.</h3>
                      <p>
                        Your draft will appear here. Enter a topic and select
                        Generate draft to begin.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </section>
          )}

          {page === "Templates" && (
            <section className="page-section">
              <PageHeading
                eyebrow="START WITH A LITTLE INSPIRATION"
                title="Creative templates"
                description="Ready-made starting points for your next idea."
              />
              <div className="template-grid">
                {initialTemplates.map((template) => {
                  const Icon = template.icon;
                  const liked = likedTemplates.includes(template.id);

                  return (
                    <article className="template-card" key={template.id}>
                      <div className="template-card-top">
                        <div className="template-icon">
                          <Icon size={22} />
                        </div>
                        <button
                          className={`icon-button favorite-button ${liked ? "favorited" : ""}`}
                          aria-label={liked ? "Unlike template" : "Like template"}
                          onClick={() =>
                            setLikedTemplates((previous) =>
                              liked
                                ? previous.filter((id) => id !== template.id)
                                : [...previous, template.id]
                            )
                          }
                        >
                          <Heart size={18} fill={liked ? "currentColor" : "none"} />
                        </button>
                      </div>
                      <span className="template-category">{template.category}</span>
                      <h3>{template.title}</h3>
                      <p>{template.description}</p>
                      <button
                        className="template-use"
                        onClick={() => useTemplate(template)}
                      >
                        Use template <ArrowUpRight size={16} />
                      </button>
                    </article>
                  );
                })}
              </div>
            </section>
          )}

          {page === "Post Creator" && (
            <section className="page-section">
              <PageHeading
                eyebrow="MAKE IT YOURS"
                title="Post Creator"
                description="Write, edit and save your own post."
              />
              <div className="post-layout">
                <div className="panel post-form">
                  <div className="panel-heading">
                    <div className="panel-icon pink-icon">
                      <PenLine size={20} />
                    </div>
                    <div>
                      <h3>Create a post</h3>
                      <p>Your writing stays in this browser.</p>
                    </div>
                  </div>
                  <label className="field-label" htmlFor="postTitle">
                    Post title
                  </label>
                  <input
                    id="postTitle"
                    className="text-input"
                    value={postTitle}
                    onChange={(event) => setPostTitle(event.target.value)}
                    placeholder="Give your post a title"
                  />
                  <label className="field-label" htmlFor="postText">
                    Post content
                  </label>
                  <textarea
                    id="postText"
                    className="input-textarea"
                    rows={10}
                    value={postText}
                    onChange={(event) => setPostText(event.target.value)}
                    placeholder="Start writing your thoughts..."
                  />
                  <div className="post-form-bottom">
                    <span>{postText.length} characters</span>
                    <button className="primary-button" onClick={createPost}>
                      <FolderHeart size={16} /> Save post
                    </button>
                  </div>
                </div>

                <div className="post-preview-wrap">
                  <span className="section-eyebrow">LIVE PREVIEW</span>
                  <div className="post-preview">
                    <div className="preview-brand">
                      <div className="preview-avatar"><Sparkles size={17} /></div>
                      <div>
                        <strong>Muse AI</strong>
                        <span>Creative thoughts</span>
                      </div>
                    </div>
                    <div className="preview-content">
                      <h3>{postTitle || "Your post title"}</h3>
                      <p>{postText || "Your post preview will appear here as you type..."}</p>
                    </div>
                    <div className="preview-actions">
                      <Heart size={19} />
                      <Send size={18} />
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {page === "My Content" && (
            <section className="page-section">
              <PageHeading
                eyebrow="YOUR PERSONAL LIBRARY"
                title="My Content"
                description="All your saved drafts in one place."
                action={
                  <button
                    className="primary-button"
                    onClick={() => navigate("AI Generator")}
                  >
                    <Plus size={17} /> New draft
                  </button>
                }
              />

              <div className="library-toolbar">
                <div className="filter-pills">
                  {["All", "Favorites"].map((filter) => (
                    <button
                      key={filter}
                      className={`filter-pill ${activeCategory === filter ? "active" : ""}`}
                      onClick={() => setActiveCategory(filter)}
                    >
                      {filter === "Favorites" && <Heart size={14} />}
                      {filter}
                    </button>
                  ))}
                </div>
                <span className="content-count">
                  {filteredContent.length} {filteredContent.length === 1 ? "item" : "items"}
                </span>
              </div>

              {filteredContent.length > 0 ? (
                <div className="content-list">
                  {filteredContent.map((item) => (
                    <article className="content-card" key={item.id}>
                      <div className="content-card-icon">
                        <FileText size={20} />
                      </div>
                      <div className="content-card-main">
                        <div className="content-card-meta">
                          <span>{item.type}</span>
                          <span className="meta-separator">·</span>
                          <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                        </div>
                        <h3>{item.title}</h3>
                        <p>{item.body}</p>
                      </div>
                      <div className="content-card-actions">
                        <button
                          className={`icon-button ${item.favorite ? "favorited" : ""}`}
                          aria-label="Toggle favorite"
                          onClick={() => toggleFavorite(item.id)}
                        >
                          <Heart size={17} fill={item.favorite ? "currentColor" : "none"} />
                        </button>
                        <button
                          className="icon-button"
                          aria-label="Copy content"
                          onClick={() => copyText(item.body)}
                        >
                          <Copy size={17} />
                        </button>
                        <button
                          className="icon-button delete-button"
                          aria-label="Delete content"
                          onClick={() => deleteContent(item.id)}
                        >
                          <Trash2 size={17} />
                        </button>
                        <button
                          className="icon-button"
                          aria-label="Download content"
                          onClick={() => downloadText("muse-ai-content.txt", item.body)}
                        >
                          <Download size={17} />
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="panel library-empty">
                  <div className="empty-icon"><FolderHeart size={26} /></div>
                  <h3>{search ? "No matching content" : "Your library is waiting."}</h3>
                  <p>
                    {search
                      ? "Try a different search term."
                      : "Create a draft and save it here. Your saved items stay in this browser."}
                  </p>
                  <button
                    className="primary-button"
                    onClick={() => navigate("AI Generator")}
                  >
                    <Sparkles size={16} /> Create your first draft
                  </button>
                </div>
              )}
            </section>
          )}

          {page === "Settings" && (
            <section className="page-section">
              <PageHeading
                eyebrow="YOUR WORKSPACE"
                title="Settings"
                description="Manage your local Muse AI workspace."
              />
              <div className="panel settings-panel">
                <div className="settings-row">
                  <div className="settings-icon"><FolderHeart size={19} /></div>
                  <div className="settings-copy">
                    <h3>Saved content</h3>
                    <p>{content.length} saved items in this browser.</p>
                  </div>
                  <button
                    className="secondary-button"
                    onClick={() => navigate("My Content")}
                  >
                    View library <ArrowRight size={15} />
                  </button>
                </div>
                <div className="settings-row">
                  <div className="settings-icon"><RefreshCw size={19} /></div>
                  <div className="settings-copy">
                    <h3>Backend connection</h3>
                    <p>
                      {apiStatus === "online"
                        ? "The local backend is responding."
                        : apiStatus === "checking"
                          ? "Checking local backend..."
                          : "Backend not detected. Demo generation is available."}
                    </p>
                  </div>
                  <span className={`connection-label ${apiStatus}`}>
                    {apiStatus === "online" ? "Connected" : apiStatus === "checking" ? "Checking" : "Offline"}
                  </span>
                </div>
                <div className="settings-row">
                  <div className="settings-icon"><Trash2 size={19} /></div>
                  <div className="settings-copy">
                    <h3>Clear local content</h3>
                    <p>Remove saved drafts from this browser.</p>
                  </div>
                  <button
                    className="secondary-button danger-outline"
                    onClick={() => {
                      if (window.confirm("Delete all saved Muse AI content from this browser?")) {
                        setContent([]);
                        notify("Local content cleared.");
                      }
                    }}
                  >
                    Clear content
                  </button>
                </div>
                <p className="settings-note">
                  No database is used. Clearing browser data can also remove saved content.
                </p>
              </div>
            </section>
          )}
        </div>
      </main>

      {toast && (
        <div className="toast">
          <Check size={17} />
          {toast}
        </div>
      )}
    </div>
  );
}

function PageHeading({ eyebrow, title, description, action }) {
  return (
    <div className="page-heading">
      <div>
        <div className="section-eyebrow">{eyebrow}</div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {action && <div className="heading-action">{action}</div>}
    </div>
  );
}

function Dashboard({
  content,
  favoriteCount,
  apiStatus,
  onNavigate,
  onTemplate,
  onDelete
}) {
  const recent = content.slice(0, 3);

  return (
    <section className="page-section dashboard-page">
      <div className="welcome-row">
        <div>
          <div className="section-eyebrow">MONDAY STARTS WITH AN IDEA</div>
          <h1>Make room for <span>your ideas.</span></h1>
          <p>A little inspiration can take you somewhere new.</p>
        </div>
        <div className="welcome-decoration">
          <div className="welcome-orbit orbit-one" />
          <div className="welcome-orbit orbit-two" />
          <div className="welcome-sparkle sparkle-one"><Sparkles size={24} /></div>
          <div className="welcome-sparkle sparkle-two"><Lightbulb size={20} /></div>
          <div className="welcome-sparkle sparkle-three"><Heart size={19} /></div>
        </div>
      </div>

      <div className="hero-card">
        <div className="hero-content">
          <span className="hero-badge"><Sparkles size={14} /> YOUR CREATIVE ASSISTANT</span>
          <h2>Big ideas begin<br />with a small spark.</h2>
          <p>
            Explore ideas, write your first draft, and make something that feels like you.
          </p>
          <button className="hero-button" onClick={() => onNavigate("AI Generator")}>
            Create with Muse <ArrowRight size={17} />
          </button>
        </div>
        <div className="hero-art">
          <div className="hero-circle hero-circle-one" />
          <div className="hero-circle hero-circle-two" />
          <div className="hero-paper">
            <div className="paper-top"><Sparkles size={17} /><span>IDEA NO. 01</span></div>
            <div className="paper-title">Think it.<br /><span>Make it.</span></div>
            <div className="paper-line paper-line-one" />
            <div className="paper-line paper-line-two" />
            <div className="paper-line paper-line-three" />
            <div className="paper-sticker"><Lightbulb size={26} /></div>
          </div>
          <div className="hero-floating hero-floating-one"><Sparkles size={19} /></div>
          <div className="hero-floating hero-floating-two"><Heart size={19} /></div>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard
          icon={FileText}
          color="lavender"
          label="Saved drafts"
          value={content.length}
          detail="In your library"
        />
        <StatCard
          icon={Heart}
          color="rose"
          label="Favorites"
          value={favoriteCount}
          detail="Your liked drafts"
        />
        <StatCard
          icon={Sparkles}
          color="peach"
          label="Templates"
          value={initialTemplates.length}
          detail="Ideas to explore"
        />
        <StatCard
          icon={Clock3}
          color="mint"
          label="Workspace"
          value={apiStatus === "online" ? "Ready" : "Local"}
          detail={apiStatus === "online" ? "Backend connected" : "Demo mode available"}
        />
      </div>

      <div className="dashboard-columns">
        <div className="panel quick-panel">
          <div className="panel-title-row">
            <div>
              <h3>Quick create</h3>
              <p>Pick a starting point.</p>
            </div>
            <button className="text-link" onClick={() => onNavigate("Templates")}>
              View all <ArrowRight size={15} />
            </button>
          </div>

          <div className="quick-list">
            {initialTemplates.slice(0, 4).map((template) => {
              const Icon = template.icon;

              return (
                <button
                  className="quick-item"
                  key={template.id}
                  onClick={() => onTemplate(template)}
                >
                  <div className="quick-icon"><Icon size={19} /></div>
                  <div className="quick-copy">
                    <strong>{template.title}</strong>
                    <span>{template.description}</span>
                  </div>
                  <ArrowUpRight size={17} className="quick-arrow" />
                </button>
              );
            })}
          </div>
        </div>

        <div className="panel recent-panel">
          <div className="panel-title-row">
            <div>
              <h3>Recently saved</h3>
              <p>Your latest ideas.</p>
            </div>
            <button className="text-link" onClick={() => onNavigate("My Content")}>
              See all <ArrowRight size={15} />
            </button>
          </div>

          {recent.length ? (
            <div className="recent-list">
              {recent.map((item) => (
                <article className="recent-item" key={item.id}>
                  <div className="recent-icon"><FileText size={18} /></div>
                  <div className="recent-copy">
                    <strong>{item.title}</strong>
                    <span>{item.type} · {new Date(item.createdAt).toLocaleDateString()}</span>
                    <p>{item.body.replace(/\s+/g, " ").slice(0, 82)}{item.body.length > 82 ? "..." : ""}</p>
                  </div>
                  <button
                    className="icon-button"
                    aria-label="Delete saved draft"
                    onClick={() => onDelete(item.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </article>
              ))}
            </div>
          ) : (
            <div className="recent-empty">
              <div className="empty-icon"><FolderHeart size={22} /></div>
              <h3>Nothing saved just yet</h3>
              <p>Your saved drafts will show up here.</p>
              <button
                className="secondary-button"
                onClick={() => onNavigate("AI Generator")}
              >
                Create a draft <ArrowRight size={15} />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="tip-banner">
        <div className="tip-icon"><Lightbulb size={21} /></div>
        <div>
          <strong>A little creative reminder</strong>
          <p>Your first draft doesn't need to be perfect. It just needs to exist.</p>
        </div>
        <Sparkles size={20} className="tip-decoration" />
      </div>
    </section>
  );
}

function StatCard({ icon: Icon, color, label, value, detail }) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${color}`}><Icon size={20} /></div>
      <div className="stat-copy">
        <span>{label}</span>
        <strong>{value}</strong>
        <small>{detail}</small>
      </div>
    </div>
  );
}
