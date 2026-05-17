// 🤖 Gemini API Integration for IPL Akinator

const GEMINI_MODEL = 'gemini-2.0-flash';
const GEMINI_BASE  = 'https://generativelanguage.googleapis.com/v1beta/models';

let _apiKey = null;
let _currentLang = 'English';

// ── Set API Key ────────────────────────────────────────────────
function setGeminiKey(key) {
  _apiKey = key ? key.trim() : null;
}

function setGeminiLang(lang) {
  const map = { 'en': 'English', 'hi': 'Hindi', 'ta': 'Tamil' };
  _currentLang = map[lang] || 'English';
}

function hasGeminiKey() {
  return !!_apiKey;
}

// ── Core Fetch ─────────────────────────────────────────────────
async function geminiGenerate(prompt) {
  if (!_apiKey) return null;

  const url = `${GEMINI_BASE}/${GEMINI_MODEL}:generateContent?key=${_apiKey}`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.8,
          maxOutputTokens: 120,
          topP: 0.9
        }
      })
    });

    if (!res.ok) {
      console.warn('Gemini API error:', res.status, await res.text());
      return null;
    }

    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return text ? text.trim() : null;

  } catch (err) {
    console.warn('Gemini fetch failed:', err.message);
    return null;
  }
}

// ── Validate API Key ───────────────────────────────────────────
async function validateGeminiKey(key) {
  const url = `${GEMINI_BASE}/${GEMINI_MODEL}:generateContent?key=${key}`;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: 'Say "ok"' }] }],
        generationConfig: { maxOutputTokens: 5 }
      })
    });
    return res.ok;
  } catch {
    return false;
  }
}

// ── Phrase a Question Conversationally ─────────────────────────
// Takes a plain question and makes it feel like Akinator is asking
async function phraseQuestion(rawQuestion, questionNumber, remainingPlayers) {
  if (!_apiKey) return null;

  const prompt = `You are an AI Akinator guessing an IPL cricket player.
This is question #${questionNumber}.
There are ${remainingPlayers} possible players remaining.

Rephrase this question in an engaging, dramatic Akinator style (1 sentence, max 15 words, keep it a yes/no question):
"${rawQuestion}"

Rules:
- Keep cricket context clear
- Sound confident and mysterious  
- Do NOT add quotes around your answer
- IMPORTANT: You MUST translate and output the final rephrased question in ${_currentLang} language.
- Output only the rephrased question, nothing else`;

  return await geminiGenerate(prompt);
}

// ── Generate Dramatic Reveal Message ──────────────────────────
async function generateRevealMessage(playerName, questionsAsked, confidence) {
  if (!_apiKey) return null;

  const prompt = `You are an AI Akinator that just guessed an IPL cricket player.
You guessed "${playerName}" in ${questionsAsked} question${questionsAsked !== 1 ? 's' : ''} with ${confidence}% confidence.

Write a short dramatic reveal statement (max 20 words) that is exciting and confident.
Examples style: "The stars have aligned... your player is the legendary [Name]!"

Rules:
- Mention the player name
- Sound dramatic and confident
- Keep it cricket/IPL themed
- IMPORTANT: You MUST translate and output the final statement in ${_currentLang} language.
- Output only the statement, nothing else`;

  return await geminiGenerate(prompt);
}

// ── Generate Thinking Status Message ──────────────────────────
async function generateThinkingMessage(questionsAsked, remainingPlayers) {
  if (!_apiKey) return null;

  const prompt = `You are an AI Akinator thinking about an IPL player.
You've asked ${questionsAsked} questions and narrowed it down to ${remainingPlayers} players.

Write a very short thinking status (max 8 words, present tense, no punctuation at end):
Like: "Scanning through top-order batsmen", "Cross-referencing overseas players"

Rules:
- IMPORTANT: You MUST translate and output the final status in ${_currentLang} language.
- Output only the status, nothing else.`;

  return await geminiGenerate(prompt);
}

// ── Fetch Unknown Player Details ───────────────────────────────
async function fetchPlayerFromGemini(playerName) {
  if (!_apiKey) return null;

  const prompt = `You are an expert IPL cricket statistician.
I need to add the player "${playerName}" to my Akinator game database.
Please provide their attributes in the exact JSON format below.

Output ONLY valid JSON, nothing else. Do not use markdown code blocks, just raw JSON.

Format:
{
  "id": "lowercase_name_with_underscores",
  "name": "Full Player Name",
  "emoji": "🏏",
  "country": "India" OR "Overseas",
  "role": "Batsman" OR "Bowler" OR "All-rounder" OR "Wicketkeeper",
  "battingPosition": "Top" OR "Middle" OR "Finisher" OR "None",
  "teams": ["MI", "CSK", "RCB", "KKR", "SRH", "DC", "RR", "GT", "LSG", "KXIP"],
  "isCaptain": true/false,
  "isDeathBowler": true/false,
  "isFinisher": true/false,
  "isPowerplaySpecialist": true/false,
  "isAggressive": true/false,
  "isActive": true/false,
  "titles": number,
  "isWicketkeeper": true/false,
  "isSpin": true/false,
  "isFast": true/false,
  "isAllRounder": true/false,
  "isLeftHanded": true/false,
  "hasPlayedTest": true/false,
  "isOpener": true/false,
  "isYoung": true/false,
  "teamColor": "#HexColor"
}`;

  try {
    let text = await geminiGenerate(prompt);
    if (!text) return null;
    
    // Clean up potential markdown formatting from Gemini
    if (text.startsWith('\`\`\`json')) {
      text = text.replace(/^\`\`\`json\n/, '').replace(/\n\`\`\`$/, '');
    } else if (text.startsWith('\`\`\`')) {
      text = text.replace(/^\`\`\`\n/, '').replace(/\n\`\`\`$/, '');
    }
    
    const playerObj = JSON.parse(text);
    return playerObj;
  } catch (err) {
    console.error("Failed to parse Gemini player JSON:", err);
    return null;
  }
}
