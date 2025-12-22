import random
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==============================
# Root check
# ==============================
@app.get("/")
def root():
    return {"status": "Vocab API is running 🚀"}


# ==============================
# Data Model (for Add Page)
# ==============================
class Word(BaseModel):
    word: str
    meaning: str
    example: str


# ==============================
# In-memory storage (shared)
# ==============================
WORDS = [
    {"id": 1, "word": "Cat", "meaning": "Cat is a pet animal", "example": "I have a cat"},
    {"id": 2, "word": "Peacock", "meaning": "Peacock is a bird", "example": "Peacock is our national bird"},
    {"id": 3, "word": "Resilient", "meaning": "Able to recover quickly", "example": "She is resilient"},
    {"id": 4, "word": "Sun", "meaning": "The star of our solar system", "example": "Sun gives energy"},
]


# ==============================
# GET words → Learn Page
# ==============================
@app.get("/words")
def get_words():
    return WORDS


# ==============================
# ADD word → Add Page
# ==============================
@app.post("/words")
def add_word(word: Word):
    new_word = {
        "id": len(WORDS) + 1,
        "word": word.word,
        "meaning": word.meaning,
        "example": word.example,
    }
    WORDS.append(new_word)
    return {"message": "Word added successfully"}


# ==============================
# Practice API (4 UNIQUE OPTIONS)
# ==============================
@app.get("/practice")
def practice():
    if len(WORDS) < 4:
        return []

    questions = []

    for w in WORDS:
        # Take meanings except current word
        wrong_meanings = [
            x["meaning"] for x in WORDS if x["id"] != w["id"]
        ]

        # Pick 3 different wrong meanings
        options = random.sample(wrong_meanings, 3)

        # Add correct meaning
        options.append(w["meaning"])

        # Shuffle options
        random.shuffle(options)

        questions.append({
            "word": w["word"],
            "options": options,   # ✅ ALWAYS 4 DIFFERENT
            "answer": w["meaning"]
        })

    return questions
