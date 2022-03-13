// words by length
const words6 = [
    "better",
    "beyond",
    "border",
    "bottom",
    "bottle",
    "branch",
    "butter",
    "bright",
    "camera",
    "dancer",
    "castle",
    "center",
    "change",
    "chance",
    "choice",
    "circle",
    "coffee",
    "common",
    "custom",
    "debate",
    "decide",
    "degree",
    "dollar",
    "desire",
    "design",
    "dessert",
    "double",
    "driver",
    "eating",
    "energy",
    "enough",
    "eleven",
    "escape",
    "facing",
    "family",
    "famous",
    "finger",
    "figure",
    "friend",
    "future",
    "garden",
    "health",
    "height",
    "honest",
    "hidden",
    "impact",
    "indeed",
    "income",
    "inside",
    "invest",
    "island",
    "launch",
    "leader",
    "lawyer",
    "legacy",
    "lesson",
    "length",
    "lights",
    "little",
    "luxury",
    "master",
    "market",
    "margin",
    "masked",
    "matter",
    "medium",
    "mature",
    "memory",
    "middle",
    "fiddle",
    "minute",
    "mirror",
    "modest",
    "modern",
    "moving",
    "nation",
    "nearby",
    "nights",
    "normal",
    "person",
    "office",
    "object",
    "option",
    "orange",
    "planet",
    "pocket",
    "pretty",
    "public",
    "random",
    "prince",
    "really",
    "rarely",
    "rather",
    "recall",
    "relief",
    "belief",
    "return",
    "reveal",
    "saving",
    "school",
    "screen",
    "search",
    "secret",
    "silent",
    "sister",
    "simple",
    "social",
    "spring",
    "summer",
    "talent",
    "thanks",
    "tennis",
    "ticket",
    "travel",
    "twelve",
    "unique",
    "unlike",
    "useful",
    "update",
    "valley",
    "vision",
    "visual",
    "wealth",
    "window",
    "winner",
    "wonder",
    "writer",
    "yellow"
]

const words5 = [
    "hello",
    "jello",
    "words",
    "apple",
    "award",
    "beach",
    "peach",
    "block",
    "brain",
    "bread",
    "break",
    "brown",
    "chain",
    "child",
    "class",
    "coach",
    "coast",
    "cover",
    "clock",
    "cream",
    "dream",
    "dance",
    "drink",
    "earth",
    "event",
    "final",
    "fruit",
    "glass",
    "group",
    "green",
    "heart",
    "horse",
    "hotel",
    "house",
    "issue",
    "image",
    "judge",
    "layer",
    "level",
    "light",
    "night",
    "lunch",
    "limit",
    "major",
    "march",
    "metal",
    "model",
    "money",
    "music",
    "party",
    "paper",
    "other",
    "order",
    "peace",
    "pilot",
    "place",
    "plant",
    "prize",
    "queen",
    "river",
    "ratio",
    "right",
    "round",
    "sound",
    "scale",
    "shape",
    "sheep",
    "shirt",
    "south",
    "speed",
    "start",
    "table",
    "sugar",
    "theme",
    "title",
    "touch",
    "track",
    "tower",
    "towel",
    "train",
    "trust",
    "uncle",
    "voice",
    "video",
    "value",
    "watch",
    "water",
    "while",
    "white",
    "youth",
    "tacks",
    "stack",
    "backs",
]

const words4 = [
    "baby",
    "back",
    "cats",
    "tack",
    "cabs",
    "sack",
    "blue",
    "taxi",
    "area",
    "band",
    "ball",
    "call",
    "cash",
    "card",
    "care",
    "city",
    "door",
    "east",
    "fact",
    "face",
    "fear",
    "film",
    "food",
    "fish",
    "game",
    "hope",
    "gold",
    "hair",
    "home",
    "hill",
    "help",
    "hour",
    "hope",
    "idea",
    "kind",
    "king",
    "life",
    "line",
    "love",
    "look",
    "miss",
    "mind",
    "name",
    "note",
    "page",
    "bear",
    "pear",
    "tear",
    "play",
    "plan",
    "rest",
    "rain",
    "road",
    "rock",
    "sale",
    "seat",
    "show",
    "shop",
    "slow",
    "sign",
    "size",
    "sort",
    "step",
    "star",
    "team",
    "test",
    "time",
    "tree",
    "town",
    "type",
    "wall",
    "week",
    "will",
    "work",
    "year",
    "task",
    "acts",
    "cast",
    "tabs",
    "bask"
]

const words3 = [
    "abs",
    "ask",
    "sat",
    "hat",
    "cab",
    "act",
    "cup",
    "not",
    "wet",
    "wet",
    "fox",
    "bat",
    "tip",
    "sit",
    "boy",
    "ace",
    "box",
    "ham",
    "ran",
    "hot",
    "toy",
    "cat",
    "dog",
    "bye",
    "bat",
    "sad",
    "map",
    "fog",
    "pay",
    "pad",
    "fun",
    "day",
    "log",
    "sun",
    "run",
    "can",
    "pen",
    "may",
    "say",
    "mom",
    "dad",
    "ant",
    "mat",
    "jog",
    "bag",
    "cap",
    "nap",
    "tag",
    "tap",
    "red",
    "bed"
]

// all words
const words = words3.concat(words4, words5, words6);

// letters learned by participant
const learned = ['b', 'k', 't', 'a', 'c', 's']

// letters that might be easily mixed up
const simLetters = [
    ['s', 't'],
    ['g', 'h'],
    ['m', 'n'],
    ['u', 'v'],
    ['e', 'o'],
    ['q', 'p'],
    ['i', 'j']
]

// see if word contains "enough" familiar letters
function famWord(word, mismatch) {
    count = 0;
    for (var i = 0; i < word.length; i++) {
        if (!learned.includes(word.charAt(i))) {
            count++;
            if (count > mismatch) { // too many unfamiliar letters
                return false;
            }
        }
    }
    return true;
}

// generate list of letters to avoid
var avoid_list = [];
function avoidLetters(num) {
    for (var i = 0; i < num; i++) {
        // choose random letter to avoid
        var list = simLetters[i];
        var letter = list[Math.floor(Math.random() * list.length)];
        avoid_list.push(letter);
    }
}

// see if word contains any similar letters it should avoid
function simWord(word) {
    for (var i = 0; i < avoid_list.length; i++) {
        if (word.includes(avoid_list[i])) {
            // this word contains letters it should avoid, so invalid
            return false;
        }
    }
    return true; // yay valid word!
}

// 7 possible values for familiarity/similarity
const ranges = [0.14, 0.28, 0.42, 0.56, 0.7, 0.84]