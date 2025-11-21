export function generateWorkflowName() {
  const adjectives = [
    "Dark",
    "Silly",
    "Quiet",
    "Brave",
    "Lucky",
    "Swift",
    "Golden",
    "Wild",
    "Gentle",
    "Clever",
    "Lonely",
    "Mighty",
    "Silent",
    "Crimson",
    "Hidden",
  ];

  const nouns = [
    "Horse",
    "Muse",
    "Falcon",
    "River",
    "Shadow",
    "Dream",
    "Voyager",
    "Forest",
    "Echo",
    "Phoenix",
    "Wolf",
    "Lantern",
    "Horizon",
    "Ember",
    "Whisper",
  ];

  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];

  return `${adj} ${noun}`;
}
