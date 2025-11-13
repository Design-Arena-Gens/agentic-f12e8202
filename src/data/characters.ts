export type Ability = {
  name: string;
  description: string;
};

export type Guide = {
  title: string;
  summary: string;
  steps: string[];
  tips: string[];
};

export type FanArt = {
  id: string;
  characterId: string;
  artist: string;
  imageUrl: string;
  caption: string;
};

export type Character = {
  id: string;
  name: string;
  alias: string;
  role: "Assassin" | "Support" | "Tank" | "Marksman" | "Mage";
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  background: string;
  abilities: Ability[];
  strengths: string[];
  guides: Guide[];
  element: string;
  portrait: string;
  tags: string[];
};

export const characters: Character[] = [
  {
    id: "ember",
    name: "Ember Lys",
    alias: "The Phoenix Blade",
    role: "Assassin",
    difficulty: "Advanced",
    element: "Pyro Edge Operatives",
    portrait:
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=700&q=80",
    background:
      "Raised within the covert Pyro Edge operatives, Ember channels arcane flames through twin blades forged from meteor shards. Her tactical upbringing taught her to strike fast, vanish quicker, and ignite hope in her allies.",
    abilities: [
      {
        name: "Ignition Dash",
        description:
          "Blink forward leaving a trail of embers that detonates after a short delay. Passing through enemies grants Ember a burst shield.",
      },
      {
        name: "Solar Flourish",
        description:
          "Unleash a spinning flame arc that ramps up damage with each consecutive hit within 6 seconds.",
      },
      {
        name: "Ashen Recall",
        description:
          "Mark a location with a Phoenix sigil and return to it after 4 seconds, healing for damage dealt in that time frame.",
      },
      {
        name: "Phoenix Overrun (Ultimate)",
        description:
          "Ember erupts into an infernal avatar, gaining untargetable frames and empowered strikes that apply burn stacks and explode at max stacks.",
      },
    ],
    strengths: [
      "Exceptional mobility for map rotations and flanks.",
      "High burst damage that scales with aggressive playstyles.",
      "Self-peel through Ashen Recall keeps her safe during dives.",
    ],
    guides: [
      {
        title: "Advanced Flanking Routes",
        summary:
          "Optimize Ember's mobility by mastering vertical routes and timing Ashen Recall perfectly.",
        steps: [
          "Scout enemy backline positioning before engaging.",
          "Dash behind cover using Ignition Dash to avoid crowd control.",
          "Activate Phoenix Overrun to disrupt priority targets.",
        ],
        tips: [
          "Always mark a safe recall spot before committing.",
          "Time Solar Flourish with team disables for guaranteed burn stacks.",
        ],
      },
      {
        title: "Combo Sequencing",
        summary:
          "Execute reliable combos that melt tanks while keeping you elusive.",
        steps: [
          "Ignition Dash through the target to start burn stacking.",
          "Follow with Solar Flourish to refresh burn timers.",
          "Finish with Phoenix Overrun for the final burst.",
        ],
        tips: [
          "Reset Ashen Recall between fights to maintain tempo.",
          "Cancel basic attack animations with Solar Flourish for higher DPS.",
        ],
      },
    ],
    tags: ["Burst", "Mobility", "High Skill"],
  },
  {
    id: "solenne",
    name: "Solenne Vale",
    alias: "Aurora Conduit",
    role: "Support",
    difficulty: "Intermediate",
    element: "Luminous Choir",
    portrait:
      "https://images.unsplash.com/photo-1521119989659-a83eee488004?auto=format&fit=crop&w=700&q=80",
    background:
      "Solenne channels the northern aurora, weaving radiant harmonics that shield allies and blind foes. As the youngest maestro of the Luminous Choir, she carries relic chimes tuned to the frequency of dawn.",
    abilities: [
      {
        name: "Radiant Veil",
        description:
          "Project a barrier that absorbs damage and pulses healing when it expires.",
      },
      {
        name: "Prism Volley",
        description:
          "Fire refracted bolts that slow enemies and briefly reveal invisible targets.",
      },
      {
        name: "Choral Resurgence",
        description:
          "Channel restorative resonance that cleanses debuffs and grants movement speed.",
      },
      {
        name: "Symphony of Daybreak (Ultimate)",
        description:
          "Summon an aurora field that grants allies invulnerability frames while silencing and disarming enemies caught within.",
      },
    ],
    strengths: [
      "Hybrid defensive utility that shields and heals simultaneously.",
      "Reliable crowd control with Prism Volley slows and reveals.",
      "Late-game team fight swing via Symphony of Daybreak.",
    ],
    guides: [
      {
        title: "Protective Rotations",
        summary:
          "Master the spacing needed to keep carries alive without overextending.",
        steps: [
          "Open with Radiant Veil during poke phases to negate chip damage.",
          "Hold Choral Resurgence until allies need a cleanse or speed boost.",
          "Use Symphony of Daybreak reactively to counter dive compositions.",
        ],
        tips: [
          "Synchronize Veil expiration with ally burst windows for extra heals.",
          "Prism Volley reveals cloak units—cast preemptively on choke points.",
        ],
      },
    ],
    tags: ["Healer", "Utility", "Control"],
  },
  {
    id: "kaio",
    name: "Kaio Rime",
    alias: "Glacial Vanguard",
    role: "Tank",
    difficulty: "Beginner",
    element: "Winterguard Legion",
    portrait:
      "https://images.unsplash.com/photo-1521092510655-3ce84d0b0c54?auto=format&fit=crop&w=700&q=80",
    background:
      "Kaio leads the Winterguard, wielding a living glacier shield that adapts to enemy pressure. His calm resilience and tactical foresight make him the unbreakable frontline every squad needs.",
    abilities: [
      {
        name: "Permafrost Bulwark",
        description:
          "Raise an adaptive barrier that grows thicker the longer it stands.",
      },
      {
        name: "Frost Herald",
        description:
          "Send a shard sentinel forward that taunts enemies upon contact and explodes after absorbing damage.",
      },
      {
        name: "Tundra Surge",
        description:
          "Slide forward, knocking enemies airborne and leaving an icy trail that slows pursuers.",
      },
      {
        name: "Glacial Cataclysm (Ultimate)",
        description:
          "Anchor to the battlefield, drawing enemies inward before shattering the ground for massive area damage.",
      },
    ],
    strengths: [
      "Straightforward kit ideal for new tank players.",
      "Excellent zone control with Frost Herald and Glacial Cataclysm.",
      "Reliable initiation and peel through Tundra Surge.",
    ],
    guides: [
      {
        title: "Frontline Fundamentals",
        summary:
          "Learn how to anchor team fights and absorb key cooldowns efficiently.",
        steps: [
          "Position Permafrost Bulwark to block primary sight lines.",
          "Follow Frost Herald taunt with Tundra Surge for a guaranteed juggle.",
          "Save Glacial Cataclysm to counter enemy dives or secure objectives.",
        ],
        tips: [
          "Refresh Bulwark as soon as it breaks; stagger casts to deny burst windows.",
          "Ping ultimate availability so allies can play around the vacuum effect.",
        ],
      },
    ],
    tags: ["Frontline", "Initiator", "Beginner Friendly"],
  },
  {
    id: "lyra",
    name: "Lyra Quell",
    alias: "Starborne Sniper",
    role: "Marksman",
    difficulty: "Intermediate",
    element: "Nebula Rangers",
    portrait:
      "https://images.unsplash.com/photo-1517697471339-4aa32003c11a?auto=format&fit=crop&w=700&q=80",
    background:
      "A prodigy within the Nebula Rangers, Lyra manipulates gravity wells to stabilize her rail shots. Each bullet is etched with constellations that illuminate targets for her squad.",
    abilities: [
      {
        name: "Celestial Scope",
        description:
          "Activate a focusing stance that increases range and headshot damage while slowing movement.",
      },
      {
        name: "Gravity Lash",
        description:
          "Launch a tether that roots the first enemy hit and amplifies subsequent damage.",
      },
      {
        name: "Orbital Relay",
        description:
          "Deploy a drone that scouts terrain and grants vision cones to nearby allies.",
      },
      {
        name: "Singularity Lance (Ultimate)",
        description:
          "Charge a piercing beam that detonates when it exits an enemy, creating a miniature black hole.",
      },
    ],
    strengths: [
      "Top-tier pick potential with long-range headshots.",
      "Team utility via Orbital Relay vision sharing.",
      "Can self-peel using Gravity Lash root.",
    ],
    guides: [
      {
        title: "Precision Tracking",
        summary:
          "Train muscle memory for scoped shots while maintaining map awareness.",
        steps: [
          "Set up in elevated sight lines before the fight starts.",
          "Tag priority targets with Gravity Lash to slow their retreat.",
          "Trigger Singularity Lance when enemies clump on objectives.",
        ],
        tips: [
          "Scope in only when safe; reposition after every two shots.",
          "Coordinate with controllers to push enemies into your sight lines.",
        ],
      },
    ],
    tags: ["Sniper", "Vision", "Burst"],
  },
];

export const initialFanArt: FanArt[] = [
  {
    id: "fa-ember-1",
    characterId: "ember",
    artist: "AvaSketch",
    imageUrl:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
    caption: "Ember mid-dive leaving a blazing horizon.",
  },
  {
    id: "fa-solenne-1",
    characterId: "solenne",
    artist: "LumenWorks",
    imageUrl:
      "https://images.unsplash.com/photo-1477764250597-c3c8c5f7b43d?auto=format&fit=crop&w=800&q=80",
    caption: "Aurora motif capturing Solenne's radiance.",
  },
  {
    id: "fa-kaio-1",
    characterId: "kaio",
    artist: "Frostbyte",
    imageUrl:
      "https://images.unsplash.com/photo-1618005198919-d3d4b5a92eee?auto=format&fit=crop&w=800&q=80",
    caption: "Kaio holding the line amidst a frozen siege.",
  },
];
