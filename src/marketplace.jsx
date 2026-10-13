
import { useEffect, useMemo, useState } from "react";
import {
  ExternalLink,
  Heart,
  Plus,
  Search,
  Sparkles,
  X,
  Users,
} from "lucide-react";
import "./marketplace.css";

const STORAGE_KEY = "muse-ai-marketplace-creators-v1";
const FAVORITES_KEY = "muse-ai-marketplace-favorites-v1";

const CATEGORIES = [
  "All Skills",
  "Design",
  "Writing",
  "Video",
  "Social Media",
  "Marketing",
  "Other",
];

const STARTER_CREATORS = [
  {
    id: "sample-1",
    name: "Aarav Sharma",
    title: "Graphic Designer",
    category: "Design",
    skills: ["Graphic Design", "Branding", "Canva"],
    bio: "I create clean and memorable designs for brands and creators.",
    portfolio: "",
    initials: "AS",
    image: "https://i.pravatar.cc/150?img=12",
  },
  {
    id: "sample-2",
    name: "Priya Reddy",
    title: "Content Writer",
    category: "Writing",
    skills: ["Content Writing", "Copywriting", "Storytelling"],
    bio: "I turn ideas into engaging captions, blogs, and stories.",
    portfolio: "",
    initials: "PR",
    image: "https://i.pravatar.cc/150?img=47",
  },
  {
    id: "sample-3",
    name: "Meera Das",
    title: "Social Media Creator",
    category: "Social Media",
    skills: ["Instagram", "Content Strategy", "Reels"],
    bio: "I help creators plan interesting social media content.",
    portfolio: "",
    initials: "MD",
    image: "https://i.pravatar.cc/150?img=33",
  },
  {
    id: "sample-4",
    name: "Rahul Kumar",
    title: "Video Editor",
    category: "Video",
    skills: ["Video Editing", "Reels", "Storytelling"],
    bio: "I edit short videos and turn raw clips into stories.",
    portfolio: "",
    initials: "RK",
    image: "https://i.pravatar.cc/150?img=15",
  },
  {
    id: "sample-5",
    name: "Ananya Rao",
    title: "UI/UX Designer",
    category: "Design",
    skills: ["UI/UX", "Figma", "Prototyping"],
    bio: "I design simple and user-friendly digital experiences.",
    portfolio: "",
    initials: "AR",
    image: "https://i.pravatar.cc/150?img=44",
  },
  {
    id: "sample-6",
    name: "Kiran Teja",
    title: "Digital Marketer",
    category: "Marketing",
    skills: ["Digital Marketing", "SEO", "Content Strategy"],
    bio: "I enjoy helping small businesses reach the right audience.",
    portfolio: "",
    initials: "KT",
    image: "https://i.pravatar.cc/150?img=49",
  },
];

function readStorage(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

function getInitials(name = "") {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");
}

export default function Marketplace() {
  const [creators, setCreators] = useState(() =>
    readStorage(STORAGE_KEY, STARTER_CREATORS)
  );

  const [favorites, setFavorites] = useState(() =>
    readStorage(FAVORITES_KEY, [])
  );

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Skills");
  const [showForm, setShowForm] = useState(false);
  const [selectedCreator, setSelectedCreator] = useState(null);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    name: "",
    title: "",
    category: "Design",
    skills: "",
    bio: "",
    portfolio: "",
    image: "",
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(creators));
  }, [creators]);

  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const filteredCreators = useMemo(() => {
    const query = search.trim().toLowerCase();

    return creators.filter((creator) => {
      const matchesCategory =
        category === "All Skills" || creator.category === category;

      const searchableText = [
        creator.name,
        creator.title,
        creator.category,
        creator.bio,
        ...(creator.skills || []),
      ]
        .join(" ")
        .toLowerCase();

      return matchesCategory && searchableText.includes(query);
    });
  }, [creators, search, category]);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function createProfile(event) {
    event.preventDefault();

    const name = form.name.trim();
    const title = form.title.trim();
    const skills = form.skills
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);

    if (!name || !title || skills.length === 0) {
      setMessage("Please add your name, title, and at least one skill.");
      return;
    }

    const newCreator = {
      id: `creator-${Date.now()}`,
      name,
      title,
      category: form.category,
      skills,
      bio: form.bio.trim() || "This creator is ready to share their work.",
      portfolio: form.portfolio.trim(),
      initials: getInitials(name),
      image: form.image.trim(),
    };

    setCreators((current) => [newCreator, ...current]);
    setSearch("");
    setCategory("All Skills");
    setSelectedCreator(newCreator);
    setShowForm(false);
    setMessage("");

    setForm({
      name: "",
      title: "",
      category: "Design",
      skills: "",
      bio: "",
      portfolio: "",
      image: "",
    });
  }

  function toggleFavorite(id) {
    setFavorites((current) =>
      current.includes(id)
        ? current.filter((favoriteId) => favoriteId !== id)
        : [...current, id]
    );
  }

  function closeForm() {
    setShowForm(false);
    setMessage("");
  }

  function renderAvatar(creator, index, extraClass = "") {
    return (
      <div
        className={`marketplace-avatar avatar-color-${index % 6} ${extraClass}`}
      >
        {creator.image ? (
          <img
            src={creator.image}
            alt={`${creator.name} profile`}
            className="marketplace-avatar-image"
            onError={(event) => {
              event.currentTarget.style.display = "none";
              event.currentTarget.parentElement?.classList.add(
                "marketplace-avatar-fallback"
              );
              if (event.currentTarget.parentElement) {
                event.currentTarget.parentElement.textContent =
                  creator.initials || getInitials(creator.name);
              }
            }}
          />
        ) : (
          creator.initials || getInitials(creator.name)
        )}
      </div>
    );
  }

  return (
    <section className="marketplace-page">
      <header className="marketplace-hero">
        <div className="marketplace-hero-copy">
          <span className="marketplace-eyebrow">
            <Sparkles size={14} /> MUSE CREATOR COMMUNITY
          </span>

          <h1>Find your creative people.</h1>

          <p>
            Discover creators, explore skills, and connect with people who
            turn ideas into reality.
          </p>

          <button
            type="button"
            className="marketplace-primary-button"
            onClick={() => {
              setMessage("");
              setShowForm(true);
            }}
          >
            <Plus size={18} /> Create your profile
          </button>
        </div>

        <div className="marketplace-hero-art" aria-hidden="true">
          <Users size={76} />
          <Sparkles size={28} />
        </div>
      </header>

      <div className="marketplace-toolbar">
        <div className="marketplace-search">
          <Search size={18} />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search creators, skills, or interests..."
            aria-label="Search creators"
          />
        </div>

        <label className="marketplace-category-filter">
          <span className="sr-only">Filter by category</span>
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            {CATEGORIES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="marketplace-section-heading">
        <div>
          <h2>Explore creators</h2>
          <p>
            {filteredCreators.length}{" "}
            {filteredCreators.length === 1 ? "creator" : "creators"} to explore
          </p>
        </div>
      </div>

      {filteredCreators.length > 0 ? (
        <div className="marketplace-grid">
          {filteredCreators.map((creator, index) => {
            const isFavorite = favorites.includes(creator.id);

            return (
              <article className="marketplace-card" key={creator.id}>
                <div className="marketplace-card-top">
                  {renderAvatar(creator, index)}

                  <button
                    type="button"
                    className={`marketplace-favorite ${
                      isFavorite ? "is-favorite" : ""
                    }`}
                    onClick={() => toggleFavorite(creator.id)}
                    aria-label={
                      isFavorite
                        ? `Remove ${creator.name} from favorites`
                        : `Add ${creator.name} to favorites`
                    }
                    aria-pressed={isFavorite}
                  >
                    <Heart
                      size={19}
                      fill={isFavorite ? "currentColor" : "none"}
                    />
                  </button>
                </div>

                <span className="marketplace-category-badge">
                  {creator.category}
                </span>

                <h3>{creator.name}</h3>
                <p className="marketplace-creator-title">{creator.title}</p>
                <p className="marketplace-creator-bio">{creator.bio}</p>

                <div className="marketplace-skills">
                  {(creator.skills || []).slice(0, 4).map((skill) => (
                    <span className="marketplace-skill-tag" key={skill}>
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="marketplace-card-actions">
                  <button
                    type="button"
                    className="marketplace-secondary-button"
                    onClick={() => setSelectedCreator(creator)}
                  >
                    View profile
                  </button>

                  {creator.portfolio && (
                    <a
                      className="marketplace-link-icon"
                      href={creator.portfolio}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Open ${creator.name}'s portfolio`}
                    >
                      <ExternalLink size={17} />
                    </a>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="marketplace-empty-state">
          <Search size={32} />
          <h3>No creators found</h3>
          <p>Try another search or choose a different category.</p>

          <button
            type="button"
            className="marketplace-secondary-button"
            onClick={() => {
              setSearch("");
              setCategory("All Skills");
            }}
          >
            Clear filters
          </button>
        </div>
      )}

      {showForm && (
        <div
          className="marketplace-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeForm();
          }}
        >
          <div
            className="marketplace-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="marketplace-form-title"
          >
            <div className="marketplace-modal-heading">
              <div>
                <span className="marketplace-eyebrow">JOIN THE COMMUNITY</span>
                <h2 id="marketplace-form-title">Create your profile</h2>
              </div>

              <button
                type="button"
                className="marketplace-close-button"
                onClick={closeForm}
                aria-label="Close form"
              >
                <X size={20} />
              </button>
            </div>

            <form className="marketplace-form" onSubmit={createProfile}>
              <label>
                Full name *
                <input
                  name="name"
                  value={form.name}
                  onChange={updateField}
                  placeholder="Your name"
                  required
                />
              </label>

              <label>
                Creator title *
                <input
                  name="title"
                  value={form.title}
                  onChange={updateField}
                  placeholder="e.g. UI Designer"
                  required
                />
              </label>

              <label>
                Category
                <select
                  name="category"
                  value={form.category}
                  onChange={updateField}
                >
                  {CATEGORIES.filter((item) => item !== "All Skills").map(
                    (item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    )
                  )}
                </select>
              </label>

              <label>
                Skills, separated by commas *
                <input
                  name="skills"
                  value={form.skills}
                  onChange={updateField}
                  placeholder="e.g. Figma, Canva, UI Design"
                  required
                />
              </label>

              <label>
                Short bio
                <textarea
                  name="bio"
                  value={form.bio}
                  onChange={updateField}
                  placeholder="Tell people about your work"
                  rows={3}
                />
              </label>

              <label>
                Portfolio link
                <input
                  name="portfolio"
                  type="url"
                  value={form.portfolio}
                  onChange={updateField}
                  placeholder="https://..."
                />
              </label>

              <label>
                Profile photo URL
                <input
                  name="image"
                  type="url"
                  value={form.image}
                  onChange={updateField}
                  placeholder="https://... (optional)"
                />
              </label>

              {message && (
                <p className="marketplace-form-message" role="status">
                  {message}
                </p>
              )}

              <div className="marketplace-form-actions">
                <button
                  type="button"
                  className="marketplace-secondary-button"
                  onClick={closeForm}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="marketplace-primary-button"
                >
                  Create profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedCreator && (
        <div
          className="marketplace-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedCreator(null);
            }
          }}
        >
          <div
            className="marketplace-modal marketplace-profile-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="marketplace-profile-title"
          >
            <button
              type="button"
              className="marketplace-close-button marketplace-profile-close"
              onClick={() => setSelectedCreator(null)}
              aria-label="Close profile"
            >
              <X size={20} />
            </button>

            <div className="marketplace-profile-header">
              {renderAvatar(selectedCreator, 0, "marketplace-profile-avatar")}

              <span className="marketplace-category-badge">
                {selectedCreator.category}
              </span>

              <h2 id="marketplace-profile-title">
                {selectedCreator.name}
              </h2>

              <p className="marketplace-creator-title">
                {selectedCreator.title}
              </p>
            </div>

            <div className="marketplace-profile-details">
              <h3>About</h3>
              <p>{selectedCreator.bio}</p>

              <h3>Skills</h3>
              <div className="marketplace-skills">
                {(selectedCreator.skills || []).map((skill) => (
                  <span className="marketplace-skill-tag" key={skill}>
                    {skill}
                  </span>
                ))}
              </div>

              {selectedCreator.portfolio && (
                <a
                  className="marketplace-portfolio-link"
                  href={selectedCreator.portfolio}
                  target="_blank"
                  rel="noreferrer"
                >
                  Visit portfolio <ExternalLink size={16} />
                </a>
              )}

              <button
                type="button"
                className="marketplace-primary-button"
                onClick={() => toggleFavorite(selectedCreator.id)}
              >
                <Heart
                  size={18}
                  fill={
                    favorites.includes(selectedCreator.id)
                      ? "currentColor"
                      : "none"
                  }
                />
                {favorites.includes(selectedCreator.id)
                  ? "Remove from favorites"
                  : "Add to favorites"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
