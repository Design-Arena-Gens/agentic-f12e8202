/* eslint-disable @next/next/no-img-element */
"use client";

import { type ChangeEvent, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  characters,
  initialFanArt,
  type Character,
  type FanArt,
} from "@/data/characters";

type FilterOption = "All" | string;

const fanArtStorageKey = "legend-atlas-fanart";

const IconSpark = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    className="h-5 w-5 text-[var(--color-accent)]"
  >
    <path
      d="M12 2.75a.75.75 0 0 1 .69.462l1.74 4.16 4.5.356a.75.75 0 0 1 .417 1.321l-3.449 2.968 1.09 4.352a.75.75 0 0 1-1.13.81L12 15.9l-3.858 2.277a.75.75 0 0 1-1.13-.81l1.09-4.352-3.45-2.968a.75.75 0 0 1 .418-1.321l4.5-.356 1.74-4.16A.75.75 0 0 1 12 2.75Z"
      fill="currentColor"
    />
  </svg>
);

const IconSearch = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    className="h-5 w-5 text-[var(--color-accent-muted)]"
  >
    <path
      d="M11 4a7 7 0 0 1 5.623 11.18l3.099 3.098a1 1 0 0 1-1.415 1.415l-3.098-3.099A7 7 0 1 1 11 4Zm0 2a5 5 0 1 0 0 10A5 5 0 0 0 11 6Z"
      fill="currentColor"
    />
  </svg>
);

const IconGuide = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    className="h-5 w-5 text-[var(--color-accent)]"
  >
    <path
      d="M6 4a2 2 0 0 0-2 2v11.25a1.75 1.75 0 1 0 3.5 0V18h9v-.75a1.75 1.75 0 1 0 3.5 0V6a2 2 0 0 0-2-2H6Zm0 2h12v9H6V6Zm2.75 2.5a.75.75 0 0 0 0 1.5H10a.75.75 0 0 0 0-1.5H8.75Zm0 3a.75.75 0 0 0 0 1.5H13a.75.75 0 0 0 0-1.5H8.75Z"
      fill="currentColor"
    />
  </svg>
);

const getRoles = (items: Character[]): FilterOption[] => [
  "All",
  ...Array.from(new Set(items.map((item) => item.role))).sort(),
];

const getDifficulties = (items: Character[]): FilterOption[] => [
  "All",
  ...Array.from(new Set(items.map((item) => item.difficulty))).sort(),
];

const getTags = (items: Character[]): FilterOption[] => [
  "All",
  ...Array.from(new Set(items.flatMap((item) => item.tags))).sort(),
];

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<FilterOption>("All");
  const [difficultyFilter, setDifficultyFilter] =
    useState<FilterOption>("All");
  const [tagFilter, setTagFilter] = useState<FilterOption>("All");
  const [activeCharacterId, setActiveCharacterId] = useState<string>(
    characters[0]?.id ?? "",
  );

  const [fanArtEntries, setFanArtEntries] = useState<FanArt[]>(() => {
    if (typeof window === "undefined") {
      return initialFanArt;
    }
    try {
      const stored = window.localStorage.getItem(fanArtStorageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed as FanArt[];
        }
      }
      window.localStorage.setItem(
        fanArtStorageKey,
        JSON.stringify(initialFanArt),
      );
    } catch {
      window.localStorage.removeItem(fanArtStorageKey);
    }
    return initialFanArt;
  });
  const [fanArtFilter, setFanArtFilter] = useState<FilterOption>("All");
  const [fanArtForm, setFanArtForm] = useState({
    characterId: characters[0]?.id ?? "",
    artist: "",
    imageUrl: "",
    caption: "",
  });
  const [formMessage, setFormMessage] = useState<string | null>(null);
  const [formMessageStatus, setFormMessageStatus] = useState<
    "success" | "error" | null
  >(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(
      fanArtStorageKey,
      JSON.stringify(fanArtEntries),
    );
  }, [fanArtEntries]);

  const roles = useMemo(() => getRoles(characters), []);
  const difficulties = useMemo(() => getDifficulties(characters), []);
  const tags = useMemo(() => getTags(characters), []);
  const characterLookup = useMemo(() => {
    const map = new Map<string, Character>();
    characters.forEach((character) => {
      map.set(character.id, character);
    });
    return map;
  }, []);

  const handleFanArtFieldChange =
    <
      Field extends keyof typeof fanArtForm,
      Element extends HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement,
    >(
      field: Field,
    ) =>
    (event: ChangeEvent<Element>) => {
      if (formMessageStatus) {
        setFormMessage(null);
        setFormMessageStatus(null);
      }
      const value = event.target.value;
      setFanArtForm((previous) => ({
        ...previous,
        [field]: value,
      }));
    };

  const filteredCharacters = useMemo(() => {
    return characters.filter((character) => {
      const matchesSearch =
        searchTerm.trim().length === 0 ||
        [character.name, character.alias, character.background, ...character.tags]
          .join(" ")
          .toLowerCase()
          .includes(searchTerm.trim().toLowerCase());
      const matchesRole =
        roleFilter === "All" ? true : character.role === roleFilter;
      const matchesDifficulty =
        difficultyFilter === "All"
          ? true
          : character.difficulty === difficultyFilter;
      const matchesTag =
        tagFilter === "All" ? true : character.tags.includes(tagFilter);
      return matchesSearch && matchesRole && matchesDifficulty && matchesTag;
    });
  }, [searchTerm, roleFilter, difficultyFilter, tagFilter]);

  const resolvedActiveCharacterId = useMemo(() => {
    if (
      filteredCharacters.some(
        (character) => character.id === activeCharacterId,
      )
    ) {
      return activeCharacterId;
    }
    return filteredCharacters[0]?.id ?? characters[0]?.id ?? "";
  }, [filteredCharacters, activeCharacterId]);

  const activeCharacter = useMemo(
    () =>
      characters.find(
        (character) => character.id === resolvedActiveCharacterId,
      ),
    [resolvedActiveCharacterId],
  );

  const displayedFanArt = useMemo(() => {
    return fanArtEntries.filter((entry) =>
      fanArtFilter === "All" ? true : entry.characterId === fanArtFilter,
    );
  }, [fanArtEntries, fanArtFilter]);

  const handleFanArtSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!fanArtForm.artist || !fanArtForm.imageUrl || !fanArtForm.caption) {
      setFormMessage("All fields are required.");
      setFormMessageStatus("error");
      return;
    }
    if (!/^https?:\/\//.test(fanArtForm.imageUrl)) {
      setFormMessage("Image URL must start with http:// or https://");
      setFormMessageStatus("error");
      return;
    }
    const newEntry: FanArt = {
      id: `fanart-${Date.now()}`,
      characterId: fanArtForm.characterId,
      artist: fanArtForm.artist.trim(),
      imageUrl: fanArtForm.imageUrl.trim(),
      caption: fanArtForm.caption.trim(),
    };
    setFanArtEntries((previous) => [newEntry, ...previous]);
    setFanArtForm((previous) => ({
      ...previous,
      artist: "",
      imageUrl: "",
      caption: "",
    }));
    setFanArtFilter("All");
    setFormMessage("Fan art submitted! Thanks for sharing your talent.");
    setFormMessageStatus("success");
  };

  return (
    <div className="relative mx-auto max-w-7xl px-6 pb-24 pt-16 sm:px-8 lg:px-12">
      <div className="absolute inset-0 -z-10 mx-auto max-w-4xl blur-[140px]">
        <div className="h-full w-full rounded-full bg-[radial-gradient(circle_at_20%_20%,rgba(122,111,255,0.35),transparent_60%),radial-gradient(circle_at_80%_10%,rgba(235,123,255,0.28),transparent_55%)] opacity-70"></div>
      </div>

      <header className="mb-14 flex flex-col gap-6 rounded-3xl border border-white/10 bg-white/5 p-9 text-white shadow-[0_25px_80px_rgba(30,27,75,0.35)] backdrop-blur-xl transition-all hover:border-white/25 dark:bg-black/30">
        <span className="inline-flex items-center justify-start gap-2 self-start rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium uppercase tracking-widest text-zinc-100 shadow-md backdrop-blur-lg">
          <IconSpark />
          Legend Atlas — Character Mastery Hub
        </span>
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-5">
            <h1 className="text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
              Become the strategist your squad relies on.
            </h1>
            <p className="text-base text-zinc-200 sm:text-lg">
              Explore cinematic dossiers, combat-ready guides, and community
              fan art for the most celebrated heroes in the arena shooter
              universe. Animated profile cards keep intel lively while you
              master every rotation.
            </p>
            <div className="flex flex-wrap gap-3 text-sm text-zinc-100">
              <span className="tag-chip rounded-full px-3 py-1">
                Real-time abilities reference
              </span>
              <span className="tag-chip rounded-full px-3 py-1">
                Community-powered fan art
              </span>
              <span className="tag-chip rounded-full px-3 py-1">
                Curated mastery guides
              </span>
            </div>
          </div>
          <div className="glass-panel relative overflow-hidden rounded-3xl p-6">
            <div className="absolute -left-10 top-10 h-32 w-32 rounded-full bg-[radial-gradient(circle,rgba(111,86,255,0.4),transparent_70%)] blur-xl"></div>
            <div className="absolute -bottom-10 right-2 h-24 w-24 rounded-full bg-[radial-gradient(circle,rgba(255,112,210,0.4),transparent_70%)] blur-xl"></div>
            <p className="text-xs uppercase tracking-widest text-zinc-300">
              Live Insights
            </p>
            <p className="mt-3 text-lg font-medium text-white">
              {filteredCharacters.length} featured specialists · {fanArtEntries.length} fan
              submissions · {characters.flatMap((c) => c.guides).length} tactical guides
            </p>
            <p className="mt-4 text-sm text-zinc-200">
              Use the search and filters below to zero in on the perfect hero
              for your playstyle, then deep dive into abilities and step-by-step
              mastery plans.
            </p>
          </div>
        </div>
      </header>

      <nav className="mb-12 flex flex-wrap items-center gap-4 text-sm font-medium text-zinc-200">
        <a className="rounded-full border border-white/10 px-4 py-2 transition hover:border-white/30 hover:text-white" href="#characters">
          Characters
        </a>
        <a className="rounded-full border border-white/10 px-4 py-2 transition hover:border-white/30 hover:text-white" href="#guides">
          Guides
        </a>
        <a className="rounded-full border border-white/10 px-4 py-2 transition hover:border-white/30 hover:text-white" href="#fan-art">
          Fan Art
        </a>
      </nav>

      <main className="space-y-24 text-white">
        <section id="characters" className="space-y-12">
          <div className="glass-panel flex flex-col gap-6 rounded-3xl p-8 shadow-[0_25px_80px_rgba(30,27,75,0.35)]">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-3 rounded-2xl bg-white/5 px-4 py-3 text-sm text-zinc-200 backdrop-blur">
                <IconSearch />
                <input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search character name, alias, or keywords..."
                  className="w-full bg-transparent text-sm text-white placeholder:text-zinc-400 focus:outline-none"
                  aria-label="Search characters"
                />
              </div>
              <div className="flex flex-wrap gap-3 text-sm">
                <label className="flex items-center gap-2 rounded-2xl bg-white/5 px-4 py-3 backdrop-blur">
                  <span className="text-zinc-300">Role</span>
                  <select
                    value={roleFilter}
                    onChange={(event) => setRoleFilter(event.target.value)}
                    className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-white focus:outline-none"
                  >
                    {roles.map((roleOption) => (
                      <option
                        key={roleOption}
                        value={roleOption}
                        className="bg-black"
                      >
                        {roleOption}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="flex items-center gap-2 rounded-2xl bg-white/5 px-4 py-3 backdrop-blur">
                  <span className="text-zinc-300">Difficulty</span>
                  <select
                    value={difficultyFilter}
                    onChange={(event) =>
                      setDifficultyFilter(event.target.value)
                    }
                    className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-white focus:outline-none"
                  >
                    {difficulties.map((difficultyOption) => (
                      <option
                        key={difficultyOption}
                        value={difficultyOption}
                        className="bg-black"
                      >
                        {difficultyOption}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="flex items-center gap-2 rounded-2xl bg-white/5 px-4 py-3 backdrop-blur">
                  <span className="text-zinc-300">Tag</span>
                  <select
                    value={tagFilter}
                    onChange={(event) => setTagFilter(event.target.value)}
                    className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-white focus:outline-none"
                  >
                    {tags.map((tagOption) => (
                      <option
                        key={tagOption}
                        value={tagOption}
                        className="bg-black"
                      >
                        {tagOption}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filteredCharacters.map((character, index) => {
                const isActive = character.id === resolvedActiveCharacterId;
                return (
                  <button
                    key={character.id}
                    type="button"
                    onClick={() => setActiveCharacterId(character.id)}
                    className={`glass-panel group relative flex flex-col overflow-hidden rounded-3xl p-6 text-left transition duration-500 ${
                      isActive
                        ? "border-[var(--color-accent)]/60 ring-2 ring-[var(--color-accent)]"
                        : "border-white/10 hover:border-[var(--color-accent)]/40 hover:shadow-[0_24px_60px_rgba(99,102,241,0.25)]"
                    } animate-float-up`}
                    style={{ animationDelay: `${index * 0.08}s` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/40 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    <div className="relative flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-zinc-300">
                          {character.alias}
                        </p>
                        <h2 className="mt-2 text-2xl font-semibold text-white">
                          {character.name}
                        </h2>
                      </div>
                      <div className="relative h-20 w-20 overflow-hidden rounded-2xl border border-white/10">
                        <Image
                          src={character.portrait}
                          alt={`${character.name} portrait`}
                          fill
                          className="object-cover transition duration-500 group-hover:scale-110"
                          sizes="80px"
                        />
                      </div>
                    </div>
                    <p className="relative mt-4 min-h-[88px] text-sm text-zinc-200">
                      {character.background}
                    </p>
                    <div className="relative mt-5 grid gap-2 text-sm text-zinc-100">
                      <div className="flex items-center justify-between rounded-2xl bg-white/5 px-3 py-2">
                        <span className="text-zinc-300">Role</span>
                        <span className="font-medium text-white">
                          {character.role}
                        </span>
                      </div>
                      <div className="flex items-center justify-between rounded-2xl bg-white/5 px-3 py-2">
                        <span className="text-zinc-300">Difficulty</span>
                        <span className="font-medium text-white">
                          {character.difficulty}
                        </span>
                      </div>
                    </div>
                    <div className="relative mt-4 flex flex-wrap gap-2 text-xs">
                      {character.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[0.75rem] uppercase tracking-widest text-zinc-200"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="relative mt-4 space-y-3 rounded-3xl bg-black/30 p-4">
                      <p className="flex items-center gap-2 text-sm font-semibold text-zinc-100">
                        <IconGuide />
                        Signature Combo
                      </p>
                      <p className="text-sm text-zinc-300">
                        {character.guides[0]?.summary}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {filteredCharacters.length === 0 && (
              <div className="rounded-3xl border border-white/5 bg-black/30 p-8 text-center text-sm text-zinc-300">
                No characters match your filters. Reset your search to rediscover
                the roster.
              </div>
            )}
          </div>
        </section>

        <section id="guides" className="space-y-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-zinc-300">
                Deep Dive Strategies
              </p>
              <h2 className="mt-2 text-3xl font-semibold">
                {activeCharacter?.name} Mastery Playbook
              </h2>
            </div>
            <p className="max-w-2xl text-sm text-zinc-300">
              Click cards above to switch specialists. Each playbook combines
              ability breakdowns, core strengths, and multi-step guides to
              elevate your decision-making in ranked lobbies.
            </p>
          </div>

          {activeCharacter && (
            <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="glass-panel rounded-3xl p-8">
                <h3 className="text-lg font-semibold text-white">
                  Ability Toolkit
                </h3>
                <p className="mt-2 text-sm text-zinc-300">
                  Internalize cooldown cadences and synergy windows before
                  stepping into the arena.
                </p>
                <ul className="mt-6 space-y-5">
                  {activeCharacter.abilities.map((ability) => (
                    <li key={ability.name} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm shadow-inner">
                      <p className="font-semibold uppercase tracking-wide text-[var(--color-accent-muted)]">
                        {ability.name}
                      </p>
                      <p className="mt-2 text-zinc-200">{ability.description}</p>
                    </li>
                  ))}
                </ul>
                <h4 className="mt-8 text-lg font-semibold text-white">
                  Core Strengths
                </h4>
                <ul className="mt-4 space-y-3 text-sm text-zinc-200">
                  {activeCharacter.strengths.map((strength) => (
                    <li key={strength} className="flex items-start gap-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-[var(--color-accent)]" />
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-6">
                {activeCharacter.guides.map((guide, guideIndex) => (
                  <article
                    key={guide.title}
                    className="glass-panel rounded-3xl border border-white/10 p-8 shadow-[0_25px_80px_rgba(30,27,75,0.25)]"
                    style={{ animationDelay: `${guideIndex * 0.05}s` }}
                  >
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <h3 className="text-2xl font-semibold text-white">
                        {guide.title}
                      </h3>
                      <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.25em] text-zinc-200">
                        Tactical Guide
                      </span>
                    </div>
                    <p className="mt-3 text-sm text-zinc-300">{guide.summary}</p>
                    <div className="mt-6 grid gap-4 md:grid-cols-2">
                      <div className="rounded-2xl border border-white/5 bg-black/30 p-5">
                        <p className="text-xs uppercase tracking-[0.25em] text-zinc-400">
                          Execution Steps
                        </p>
                        <ol className="mt-3 space-y-3 text-sm text-zinc-100">
                          {guide.steps.map((step) => (
                            <li key={step} className="flex gap-3">
                              <span className="mt-0.5 h-2.5 w-2.5 rounded-full bg-[var(--color-accent)]"></span>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                      <div className="rounded-2xl border border-white/5 bg-black/30 p-5">
                        <p className="text-xs uppercase tracking-[0.25em] text-zinc-400">
                          Pro Tips
                        </p>
                        <ul className="mt-3 space-y-3 text-sm text-zinc-100">
                          {guide.tips.map((tip) => (
                            <li key={tip} className="flex gap-3">
                              <span className="mt-0.5 h-2.5 w-2.5 rounded-full bg-[var(--color-accent-muted)]"></span>
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}
        </section>

        <section id="fan-art" className="space-y-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-zinc-300">
                Community Gallery
              </p>
              <h2 className="mt-2 text-3xl font-semibold text-white">
                Submit Fan Art &amp; Celebrate Your Heroes
              </h2>
            </div>
            <p className="max-w-2xl text-sm text-zinc-300">
              Share your creations with fellow agents. Submit a direct image URL,
              add a caption, and inspire others with your visual storytelling.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
            <form
              onSubmit={handleFanArtSubmit}
              className="glass-panel flex flex-col gap-5 rounded-3xl border border-white/10 p-8"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-zinc-400">
                    Submit Artwork
                  </p>
                  <h3 className="mt-1 text-2xl font-semibold text-white">
                    Feature your latest piece
                  </h3>
                </div>
                <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.25em] text-zinc-300">
                  Instant Publish
                </span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-2 text-sm text-zinc-200">
                  Character Focus
                  <select
                    value={fanArtForm.characterId}
                    onChange={handleFanArtFieldChange("characterId")}
                    className="rounded-2xl border border-white/10 bg-black/40 px-3 py-3 text-white focus:outline-none"
                  >
                    {characters.map((character) => (
                      <option key={character.id} value={character.id}>
                        {character.name} — {character.alias}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="flex flex-col gap-2 text-sm text-zinc-200">
                  Artist Name
                  <input
                    type="text"
                    value={fanArtForm.artist}
                    onChange={handleFanArtFieldChange("artist")}
                    placeholder="Your handle or studio"
                    className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white placeholder:text-zinc-500 focus:outline-none"
                    required
                  />
                </label>
              </div>

              <label className="flex flex-col gap-2 text-sm text-zinc-200">
                Image URL
                <input
                  type="url"
                  value={fanArtForm.imageUrl}
                  onChange={handleFanArtFieldChange("imageUrl")}
                  placeholder="https://"
                  className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white placeholder:text-zinc-500 focus:outline-none"
                  required
                />
              </label>

              <label className="flex flex-col gap-2 text-sm text-zinc-200">
                Caption
                <textarea
                  value={fanArtForm.caption}
                  onChange={handleFanArtFieldChange("caption")}
                  placeholder="What inspired this piece?"
                  className="min-h-[120px] rounded-3xl border border-white/10 bg-black/40 px-4 py-3 text-white placeholder:text-zinc-500 focus:outline-none"
                  required
                />
              </label>

              {formMessage && (
                <p
                  className={`rounded-2xl px-4 py-3 text-sm ${
                    formMessageStatus === "success"
                      ? "bg-emerald-500/20 text-emerald-200"
                      : "bg-rose-500/20 text-rose-200"
                  }`}
                >
                  {formMessage}
                </p>
              )}

              <button
                type="submit"
                className="group flex items-center justify-center gap-2 rounded-2xl bg-[var(--color-accent)] px-5 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white transition duration-200 hover:bg-[var(--color-accent-muted)]"
              >
                Publish to Gallery
                <span className="inline-block transition-transform group-hover:translate-x-1">
                  →
                </span>
              </button>
            </form>

            <div className="glass-panel flex flex-col justify-between rounded-3xl border border-white/10 p-8">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-zinc-400">
                  Community Highlights
                </p>
                <h3 className="mt-2 text-3xl font-semibold text-white">
                  {activeCharacter?.name ?? "Your squad"} Spotlight
                </h3>
                <p className="mt-3 text-sm text-zinc-300">
                  Every submission is immediately visible across the Atlas.
                  Curate collections by role, share them with your fireteam, and
                  track your evolution as an artist alongside your gameplay
                  mastery.
                </p>
              </div>
              <div className="mt-8 flex flex-col gap-4 rounded-3xl border border-white/5 bg-black/30 p-6 text-sm text-zinc-200">
                <p>
                  Need assets? Capture in-game photo mode shots, or export
                  grayscale sketches. Animated GIFs are welcome—host them on any
                  CDN and drop the link here.
                </p>
                <p className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs uppercase tracking-[0.3em] text-zinc-300">
                  Tip: Consistent tagging helps others find your art faster.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-zinc-200 backdrop-blur">
            <p>
              Showing {displayedFanArt.length} of {fanArtEntries.length} pieces.
              Rotate filters to surface character-specific galleries.
            </p>
            <label className="flex items-center gap-3">
              <span className="text-xs uppercase tracking-[0.3em] text-zinc-400">
                Filter
              </span>
              <select
                value={fanArtFilter}
                onChange={(event) => setFanArtFilter(event.target.value)}
                className="rounded-2xl border border-white/10 bg-black/40 px-4 py-2 text-white focus:outline-none"
              >
                <option value="All">All characters</option>
                {characters.map((character) => (
                  <option key={character.id} value={character.id}>
                    {character.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {displayedFanArt.map((entry) => {
              const associatedCharacter = characterLookup.get(entry.characterId);
              return (
                <figure
                  key={entry.id}
                  className="glass-panel flex flex-col overflow-hidden rounded-3xl border border-white/10"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={entry.imageUrl}
                      alt={`${associatedCharacter?.name ?? "Legend"} fan art by ${entry.artist}`}
                      className="h-full w-full object-cover transition duration-500 hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <figcaption className="flex flex-col gap-3 p-5 text-sm text-zinc-200">
                    <p className="text-base font-medium text-white">
                      {entry.caption}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.25em] text-zinc-400">
                      <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1">
                        {associatedCharacter?.name ?? "Unknown"}
                      </span>
                      <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1">
                        By {entry.artist}
                      </span>
                    </div>
                  </figcaption>
                </figure>
              );
            })}
          </div>

          {displayedFanArt.length === 0 && (
            <div className="rounded-3xl border border-white/10 bg-black/30 p-8 text-center text-sm text-zinc-300">
              No fan art yet. Be the first to share your masterpiece for{" "}
              {fanArtFilter === "All"
                ? "the roster"
                : characterLookup.get(fanArtFilter)?.name ?? "this specialist"}
              .
            </div>
          )}
        </section>
      </main>

      <footer className="mt-24 rounded-3xl border border-white/10 bg-black/30 p-8 text-center text-sm text-zinc-300">
        Built for strategy squads, lorekeepers, and creative minds. Deploy your
        Legends knowledge to the battlefield—and share the artistry that powers
        your plays.
      </footer>
    </div>
  );
}
