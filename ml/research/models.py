from enum import Enum


class PosTag(str, Enum):
    """Universal POS tags.
    See https://universaldependencies.org/ for more information.
    """

    ADJ = "ADJ"  # example: big, old, green, incomprehensible, first
    ADP = "ADP"  # example: in, to, during
    PUNCT = "PUNCT"  # example: . , ; !
    ADV = "ADV"  # example: very, tomorrow, down, where, there
    AUX = "AUX"  # example: is, has (done), will (do), should (do)
    SYM = "SYM"  # example: $, %, §, ©, +, −, ×, ÷, =, :), 😝
    INTJ = "INTJ"  # example: psst, ouch, bravo, hello
    CCONJ = "CCONJ"  # example: and, or, but
    X = "X"  # example: sfpksdpsxmsa
    NOUN = "NOUN"  # example: girl, cat, tree, air, beauty
    DET = "DET"  # example: a, an, the
    PROPN = "PROPN"  # example: Mary, John, London, NATO, HBO
    NUM = "NUM"  # example: twenty-four, fourth, 1991, 14:24
    VERB = "VERB"  # example: run, runs, running, eat, ate, eating
    PART = "PART"  # example: 's, not,
    PRON = "PRON"  # example: I, you, he, she, myself, themselves, somebody
    SCONJ = "SCONJ"  # example: if, while, that


pos_tag_descriptions = {
    "ADJ": "ADJ (Adjective) - Adjectives are words that modify a noun by describing a quality of the thing named, indicating its quantity or extent, or specifying a thing as distinct from something else. Example: 'big,' 'old,' 'green,' 'incomprehensible,' 'first.'",
    "ADP": "ADP (Adposition) - Adpositions are words that are typically used in combination with a noun phrase to express relations of time, space, location, or other abstract relations. Example: 'in,' 'to,' 'during.'",
    "PUNCT": "PUNCT (Punctuation) - Punctuation marks are symbols that are used to aid the clarity and comprehension of written language. Example: '.', ',', ';', '!'",
    "ADV": "ADV (Adverb) - Adverbs modify verbs, adjectives, other adverbs, phrases, or whole sentences; they typically express manner, place, time, frequency, degree, level of certainty, etc. Example: 'very,' 'tomorrow,' 'down,' 'where,' 'there.'",
    "AUX": "AUX (Auxiliary) - Auxiliaries are verbs that add functional or grammatical meaning to the clauses in which they appear, such as to express tense, aspect, modality, voice, emphasis, etc. Example: 'is,' 'has' (done), 'will' (do), 'should' (do).",
    "SYM": "SYM (Symbol) - Symbols are characters or signs that function as a conventional representation of an object, function, or process. Example: '$,' '%,' '§,' '©,' '+,' '÷,' '=', ':)', '😝.'",
    "INTJ": "INTJ (Interjection) - Interjections are words or expressions that occur as utterances on their own and express a spontaneous feeling or reaction. Example: 'psst,' 'ouch,' 'bravo,' 'hello.'",
    "CCONJ": "CCONJ (Coordinating Conjunction) - Coordinating conjunctions are words that link together words, phrases, or clauses of equal importance or similar grammatical structure. Example: 'and,' 'or,' 'but.'",
    "X": "X (Other) - This tag is used for words that cannot be classified into any other category including words that do not fit any standard grammatical category. Example: 'sfpksdpsxmsa' (nonsensical string).",
    "NOUN": "NOUN (Noun) - Nouns are words that function as the name of specific objects or sets of things, such as physical objects, organisms, or places. Example: girl, cat, tree, air, beauty.",
    "DET": "DET (Determiner) - Determiners are words that modify nouns by setting a context in terms of definiteness, proximity, quantity, and possession. Example: a, an, the.",
    "PROPN": "PROPN (Proper Noun) - Proper nouns are the names of specific individuals, places, organizations, or sometimes things; they are usually capitalized. Example: Mary, John, London, NATO, HBO.",
    "NUM": "NUM (Numeral) - Numerals are words that denote a number. Example: twenty-four, fourth, 1991, 14:24.",
    "VERB": "VERB (Verb) - Verbs are words that describe an action, occurrence, or state of being. Example: run, runs, running, eat, ate, eating.",
    "PART": "PART (Particle) - Particles are words that do not change their form through inflection and do not easily fit into the established system of parts of speech. Example: 's, not.",
    "PRON": "PRON (Pronoun) - Pronouns are words that substitute for nouns or noun phrases, whose referents are named or understood in the context. Example: I, you, he, she, myself, themselves, somebody.",
    "SCONJ": "SCONJ (Subordinating Conjunction) - Subordinating conjunctions are conjunctions that connect a main clause with a subordinate clause, expressing relationships such as time, reason, condition, contrast, and concession. Example: if, while, that.",
}

pos_tag_names = {
    "ADJ": "Adjective",
    "ADP": "Adposition",
    "PUNCT": "Punctuation",
    "ADV": "Adverb",
    "AUX": "Auxiliary",
    "SYM": "Symbol",
    "INTJ": "Interjection",
    "CCONJ": "Coordinating Conjunction",
    "X": "Other",
    "NOUN": "Noun",
    "DET": "Determiner",
    "PROPN": "Proper Noun",
    "NUM": "Numeral",
    "VERB": "Verb",
    "PART": "Particle",
    "PRON": "Pronoun",
    "SCONJ": "Subordinating Conjunction",
}
