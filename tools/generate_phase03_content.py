#!/usr/bin/env python3
"""Genera JSON educativo de la Fase 03. El resultado es la fuente de verdad."""

from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PENDING = "pending_validation"

DOTS = {
    "a": [1],
    "b": [1, 2],
    "c": [1, 4],
    "d": [1, 4, 5],
    "e": [1, 5],
    "f": [1, 2, 4],
    "g": [1, 2, 4, 5],
    "h": [1, 2, 5],
    "i": [2, 4],
    "j": [2, 4, 5],
    "k": [1, 3],
    "l": [1, 2, 3],
    "m": [1, 3, 4],
    "n": [1, 3, 4, 5],
    "o": [1, 3, 5],
    "p": [1, 2, 3, 4],
    "q": [1, 2, 3, 4, 5],
    "r": [1, 2, 3, 5],
    "s": [2, 3, 4],
    "t": [2, 3, 4, 5],
    "u": [1, 3, 6],
    "v": [1, 2, 3, 6],
    "w": [2, 4, 5, 6],
    "x": [1, 3, 4, 6],
    "y": [1, 3, 4, 5, 6],
    "z": [1, 3, 5, 6],
    "ñ": [1, 2, 4, 5, 6],
    "á": [1, 2, 3, 5, 6],
    "é": [2, 3, 4, 6],
    "í": [3, 4],
    "ó": [3, 4, 6],
    "ú": [2, 3, 4, 5, 6],
    "ü": [1, 2, 5, 6],
}

DIGRAPHS = {
    "ch": [[1, 4], [1, 2, 5]],
    "ll": [[1, 2, 3], [1, 2, 3]],
}

SEQUENCE = [
    "a", "e", "i", "o", "u", "m", "p", "s", "l", "t", "n", "d", "c", "b",
    "r", "f", "g", "h", "j", "v", "ñ", "ll", "ch", "q", "y", "z", "x", "k", "w",
]

ASSOCIATIONS = {
    "a": ("árbol", "Dibujo de un árbol"),
    "e": ("elefante", "Dibujo de un elefante"),
    "i": ("isla", "Dibujo de una isla"),
    "o": ("oso", "Dibujo de un oso"),
    "u": ("uva", "Dibujo de un racimo de uvas"),
    "m": ("mamá", "Dibujo de una madre"),
    "p": ("papá", "Dibujo de un padre"),
    "s": ("sol", "Dibujo del sol"),
    "l": ("luna", "Dibujo de la luna"),
    "t": ("tomate", "Dibujo de un tomate"),
    "n": ("nube", "Dibujo de una nube"),
    "d": ("dedo", "Dibujo de un dedo"),
    "c": ("casa", "Dibujo de una casa"),
    "b": ("barco", "Dibujo de un barco"),
    "r": ("ratón", "Dibujo de un ratón"),
    "f": ("foca", "Dibujo de una foca"),
    "g": ("gato", "Dibujo de un gato"),
    "h": ("hoja", "Dibujo de una hoja"),
    "j": ("jirafa", "Dibujo de una jirafa"),
    "v": ("vaca", "Dibujo de una vaca"),
    "ñ": ("ñandú", "Dibujo de un ñandú"),
    "ll": ("llave", "Dibujo de una llave"),
    "ch": ("chivo", "Dibujo de un chivo"),
    "q": ("queso", "Dibujo de un queso"),
    "y": ("yoyo", "Dibujo de un yoyo"),
    "z": ("zapato", "Dibujo de un zapato"),
    "x": ("xilófono", "Dibujo de un xilófono"),
    "k": ("kilo", "Dibujo de una balanza de un kilo"),
    "w": ("kiwi", "Dibujo de un kiwi"),
}

PHONEME = {
    "a": "a", "e": "e", "i": "i", "o": "o", "u": "u",
    "m": "m", "p": "p", "s": "s", "l": "l", "t": "t", "n": "n", "d": "d",
    "c": "k", "b": "b", "r": "r", "f": "f", "g": "g", "h": "∅",
    "j": "x", "v": "b", "ñ": "ɲ", "ll": "ʝ", "ch": "tʃ", "q": "k",
    "y": "ʝ", "z": "s", "x": "ks", "k": "k", "w": "w",
}

MVP = {"A": 1, "B": 2, "C": 3, "M": 4, "S": 5}

CONSONANTS_CV = list("mpsltndcbr")


def difficulty_for(index: int) -> int:
    if index < 5:
        return 1
    if index < 12:
        return 2
    if index < 20:
        return 3
    if index < 26:
        return 4
    return 5


def cells_for_text(text: str) -> list[list[int]]:
    raw = text.lower()
    cells: list[list[int]] = []
    i = 0
    while i < len(raw):
        pair = raw[i : i + 2]
        if pair in DIGRAPHS:
            cells.extend(list(map(list, DIGRAPHS[pair])))
            i += 2
            continue
        ch = raw[i]
        if ch == " ":
            i += 1
            continue
        if ch not in DOTS:
            raise SystemExit(f"Sin puntos Braille para {ch!r} en {text!r}")
        cells.append(list(DOTS[ch]))
        i += 1
    if not cells:
        raise SystemExit(f"Texto sin celdas Braille: {text!r}")
    return cells


def braille_from_cells(cells: list[list[int]], prefixes: list[str] | None = None) -> dict:
    first, *rest = cells
    spec: dict = {"dots": first, "validation": PENDING}
    if rest:
        spec["extraCells"] = rest
    if prefixes:
        spec["prefixes"] = prefixes
    return spec


def letter_cells(seq: str) -> list[list[int]]:
    if seq in DIGRAPHS:
        return [list(c) for c in DIGRAPHS[seq]]
    return [list(DOTS[seq])]


def write_json(path: Path, data) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print("wrote", path.relative_to(ROOT), "items", len(data) if isinstance(data, list) else "")


def letter_record(seq: str, order: int, case: str) -> dict:
    display = seq.upper() if case == "uppercase" else seq
    prefix = "upper" if case == "uppercase" else "lower"
    slug = "ny" if seq == "ñ" else seq
    letter_id = f"letter-{prefix}-{slug}"
    cells = letter_cells(seq)
    prefixes = ["capital"] if case == "uppercase" else None
    assoc_word, assoc_alt = ASSOCIATIONS[seq]
    is_mvp = case == "uppercase" and display in MVP
    fid = MVP.get(display)
    diff = difficulty_for(order - 1)
    counterpart = f"letter-{'lower' if case == 'uppercase' else 'upper'}-{slug}"
    vision = {
        "modelClass": f"letter-{display}",
        "minConfidence": 0.7,
        "hasPhysicalPiece": bool(is_mvp),
    }
    if fid is not None:
        vision["fiducialId"] = fid
    return {
        "id": letter_id,
        "type": "letter",
        "character": display,
        "caseForm": case,
        "order": order,
        "difficulty": diff,
        "phoneme": PHONEME[seq],
        "braille": braille_from_cells(cells, prefixes),
        "associations": [{"word": assoc_word, "imageAlt": assoc_alt}],
        "media": {},
        "vision": vision,
        "i18n": {
            "es": {
                "name": f"Letra {display}",
                "instruction": f"Esta es la letra {display}.",
                "instructionShort": f"Letra {display}",
                "example": assoc_word,
                "validation": PENDING,
            }
        },
        "tags": ["mvp"] if is_mvp else ["alphabet"],
        "relatedIds": [counterpart],
        "validation": PENDING,
    }


def make_letters():
    upper = []
    lower = []
    for i, seq in enumerate(SEQUENCE, start=1):
        upper.append(letter_record(seq, i, "uppercase"))
        lower.append(letter_record(seq, i, "lowercase"))
    return upper, lower


def make_braille_table():
    glyphs = []
    for ch, dots in DOTS.items():
        category = "accent" if ch in "áéíóúü" else "letter"
        glyphs.append({
            "id": f"glyph-{ch}",
            "character": ch,
            "dots": dots,
            "category": category,
            "validation": PENDING,
        })
    glyphs.append({
        "id": "glyph-capital-sign",
        "character": "capital",
        "dots": [4, 6],
        "category": "prefix",
        "prefixKind": "capital",
        "validation": PENDING,
    })
    glyphs.append({
        "id": "glyph-number-sign",
        "character": "number",
        "dots": [3, 4, 5, 6],
        "category": "prefix",
        "prefixKind": "number",
        "validation": PENDING,
    })
    return {
        "meta": {"system": "braille-es-grade1", "cells": 6, "validation": PENDING},
        "glyphs": glyphs,
    }


DIGIT_LETTERS = {1: "a", 2: "b", 3: "c", 4: "d", 5: "e", 6: "f", 7: "g", 8: "h", 9: "i", 0: "j"}


def make_digits():
    rows = []
    for n in [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]:
        letter = DIGIT_LETTERS[n]
        order = 10 if n == 0 else n
        rows.append({
            "id": f"number-{n}",
            "type": "number",
            "character": str(n),
            "caseForm": "none",
            "order": order,
            "difficulty": 1 if n != 0 else 2,
            "braille": braille_from_cells([list(DOTS[letter])], ["number"]),
            "associations": [{
                "word": str(n),
                "imageAlt": f"Cantidad {n}",
            }],
            "media": {},
            "vision": {
                "modelClass": f"number-{n}",
                "minConfidence": 0.7,
                "hasPhysicalPiece": False,
            },
            "i18n": {
                "es": {
                    "name": f"Número {n}",
                    "instruction": f"Este es el número {n}.",
                    "instructionShort": f"Número {n}",
                    "validation": PENDING,
                }
            },
            "tags": ["number"],
            "relatedIds": [],
            "validation": PENDING,
        })
    return rows


def make_syllables():
    rows = []
    order = 1
    for cons in CONSONANTS_CV:
        for vowel in "aeiou":
            syl = cons + vowel
            rows.append({
                "id": f"syllable-{syl}",
                "type": "syllable",
                "character": syl,
                "caseForm": "none",
                "order": order,
                "difficulty": 2,
                "phoneme": syl,
                "braille": braille_from_cells(cells_for_text(syl)),
                "associations": [{
                    "word": syl,
                    "imageAlt": f"Sílabas {syl}",
                }],
                "media": {},
                "vision": {
                    "modelClass": f"syllable-{syl}",
                    "minConfidence": 0.7,
                    "hasPhysicalPiece": False,
                },
                "i18n": {
                    "es": {
                        "name": f"Sílaba {syl}",
                        "instruction": f"Esta es la sílaba {syl}.",
                        "instructionShort": f"Sílaba {syl}",
                        "validation": PENDING,
                    }
                },
                "tags": ["syllable"],
                "relatedIds": [],
                "validation": PENDING,
            })
            order += 1
    return rows


WORDS = [
    {"id": "casa", "display": "casa", "syl": ["ca", "sa"], "pieces": ["C", "A", "S", "A"], "alt": "Una casa", "demo": True, "diff": 2},
    {"id": "mesa", "display": "mesa", "syl": ["me", "sa"], "pieces": ["M", "E", "S", "A"], "alt": "Una mesa", "diff": 2},
    {"id": "mama", "display": "mamá", "syl": ["ma", "má"], "pieces": ["M", "A", "M", "A"], "alt": "Una mamá", "diff": 1},
    {"id": "papa", "display": "papá", "syl": ["pa", "pá"], "pieces": ["P", "A", "P", "A"], "alt": "Un papá", "diff": 1},
    {"id": "sol", "display": "sol", "syl": ["sol"], "pieces": ["S", "O", "L"], "alt": "El sol", "diff": 1},
    {"id": "luna", "display": "luna", "syl": ["lu", "na"], "pieces": ["L", "U", "N", "A"], "alt": "La luna", "diff": 2},
    {"id": "mano", "display": "mano", "syl": ["ma", "no"], "pieces": ["M", "A", "N", "O"], "alt": "Una mano", "diff": 2},
    {"id": "pato", "display": "pato", "syl": ["pa", "to"], "pieces": ["P", "A", "T", "O"], "alt": "Un pato", "diff": 2},
    {"id": "gato", "display": "gato", "syl": ["ga", "to"], "pieces": ["G", "A", "T", "O"], "alt": "Un gato", "diff": 2},
    {"id": "cama", "display": "cama", "syl": ["ca", "ma"], "pieces": ["C", "A", "M", "A"], "alt": "Una cama", "diff": 2},
    {"id": "pan", "display": "pan", "syl": ["pan"], "pieces": ["P", "A", "N"], "alt": "Un pan", "diff": 1},
    {"id": "sal", "display": "sal", "syl": ["sal"], "pieces": ["S", "A", "L"], "alt": "Sal", "diff": 1},
    {"id": "mar", "display": "mar", "syl": ["mar"], "pieces": ["M", "A", "R"], "alt": "El mar", "diff": 1},
    {"id": "libro", "display": "libro", "syl": ["li", "bro"], "pieces": ["L", "I", "B", "R", "O"], "alt": "Un libro", "diff": 3},
    {"id": "nino", "display": "niño", "syl": ["ni", "ño"], "pieces": ["N", "I", "Ñ", "O"], "alt": "Un niño", "diff": 3},
    {"id": "perro", "display": "perro", "syl": ["pe", "rro"], "pieces": ["P", "E", "R", "R", "O"], "alt": "Un perro", "diff": 3},
    {"id": "flor", "display": "flor", "syl": ["flor"], "pieces": ["F", "L", "O", "R"], "alt": "Una flor", "diff": 3},
    {"id": "agua", "display": "agua", "syl": ["a", "gua"], "pieces": ["A", "G", "U", "A"], "alt": "Agua", "diff": 2},
    {"id": "silla", "display": "silla", "syl": ["si", "lla"], "pieces": ["S", "I", "L", "L", "A"], "alt": "Una silla", "diff": 3},
    {"id": "pelota", "display": "pelota", "syl": ["pe", "lo", "ta"], "pieces": ["P", "E", "L", "O", "T", "A"], "alt": "Una pelota", "diff": 3},
    {"id": "boca", "display": "boca", "syl": ["bo", "ca"], "pieces": ["B", "O", "C", "A"], "alt": "Una boca", "diff": 2},
    {"id": "dedo", "display": "dedo", "syl": ["de", "do"], "pieces": ["D", "E", "D", "O"], "alt": "Un dedo", "diff": 2},
    {"id": "oso", "display": "oso", "syl": ["o", "so"], "pieces": ["O", "S", "O"], "alt": "Un oso", "diff": 1},
    {"id": "uva", "display": "uva", "syl": ["u", "va"], "pieces": ["U", "V", "A"], "alt": "Uvas", "diff": 1},
    {"id": "sapo", "display": "sapo", "syl": ["sa", "po"], "pieces": ["S", "A", "P", "O"], "alt": "Un sapo", "diff": 2},
    {"id": "lata", "display": "lata", "syl": ["la", "ta"], "pieces": ["L", "A", "T", "A"], "alt": "Una lata", "diff": 2},
    {"id": "mapa", "display": "mapa", "syl": ["ma", "pa"], "pieces": ["M", "A", "P", "A"], "alt": "Un mapa", "diff": 2},
    {"id": "nido", "display": "nido", "syl": ["ni", "do"], "pieces": ["N", "I", "D", "O"], "alt": "Un nido", "diff": 2},
    {"id": "limon", "display": "limón", "syl": ["li", "món"], "pieces": ["L", "I", "M", "O", "N"], "alt": "Un limón", "diff": 3},
    {"id": "puma", "display": "puma", "syl": ["pu", "ma"], "pieces": ["P", "U", "M", "A"], "alt": "Un puma", "diff": 2},
    {"id": "saco", "display": "saco", "syl": ["sa", "co"], "pieces": ["S", "A", "C", "O"], "alt": "Un saco", "diff": 2},
    {"id": "loma", "display": "loma", "syl": ["lo", "ma"], "pieces": ["L", "O", "M", "A"], "alt": "Una loma", "diff": 2},
    {"id": "mas", "display": "más", "syl": ["más"], "pieces": ["M", "A", "S"], "alt": "El signo de más", "diff": 1},
    {"id": "el", "display": "el", "syl": ["el"], "pieces": ["E", "L"], "alt": "Artículo el", "diff": 1},
    {"id": "la", "display": "la", "syl": ["la"], "pieces": ["L", "A"], "alt": "Artículo la", "diff": 1},
    {"id": "un", "display": "un", "syl": ["un"], "pieces": ["U", "N"], "alt": "Artículo un", "diff": 1},
    {"id": "una", "display": "una", "syl": ["u", "na"], "pieces": ["U", "N", "A"], "alt": "Artículo una", "diff": 1},
    {"id": "es", "display": "es", "syl": ["es"], "pieces": ["E", "S"], "alt": "Verbo es", "diff": 1},
    {"id": "mi", "display": "mi", "syl": ["mi"], "pieces": ["M", "I"], "alt": "Palabra mi", "diff": 1},
    {"id": "su", "display": "su", "syl": ["su"], "pieces": ["S", "U"], "alt": "Palabra su", "diff": 1},
    {"id": "ve", "display": "ve", "syl": ["ve"], "pieces": ["V", "E"], "alt": "Verbo ve", "diff": 1},
    {"id": "come", "display": "come", "syl": ["co", "me"], "pieces": ["C", "O", "M", "E"], "alt": "Verbo come", "diff": 2},
    {"id": "tiene", "display": "tiene", "syl": ["tie", "ne"], "pieces": ["T", "I", "E", "N", "E"], "alt": "Verbo tiene", "diff": 3},
    {"id": "en", "display": "en", "syl": ["en"], "pieces": ["E", "N"], "alt": "Palabra en", "diff": 1},
    {"id": "grande", "display": "grande", "syl": ["gran", "de"], "pieces": ["G", "R", "A", "N", "D", "E"], "alt": "Algo grande", "diff": 3},
    {"id": "rojo", "display": "rojo", "syl": ["ro", "jo"], "pieces": ["R", "O", "J", "O"], "alt": "Color rojo", "diff": 2},
]

MVP_POOL = ["A", "B", "C", "M", "S"]


def formable_with_mvp(pieces: list[str]) -> bool:
    pool = list(MVP_POOL)
    for piece in pieces:
        key = piece.upper()
        if key not in pool:
            return False
        pool.remove(key)
    return True


def make_words():
    rows = []
    for order, spec in enumerate(WORDS, start=1):
        related = [f"syllable-{s}" for s in spec["syl"] if len(s) == 2 and s[0] in CONSONANTS_CV and s[1] in "aeiou"]
        row = {
            "id": f"word-{spec['id']}",
            "type": "word",
            "character": spec["display"],
            "caseForm": "none",
            "order": order,
            "difficulty": spec["diff"],
            "braille": braille_from_cells(cells_for_text(spec["display"])),
            "associations": [{"word": spec["display"], "imageAlt": spec["alt"]}],
            "media": {},
            "vision": {
                "modelClass": f"word-{spec['id']}",
                "minConfidence": 0.7,
                "hasPhysicalPiece": False,
            },
            "i18n": {
                "es": {
                    "name": spec["display"],
                    "instruction": f"La palabra {spec['display']}.",
                    "instructionShort": spec["display"],
                    "validation": PENDING,
                }
            },
            "tags": ["demo"] if spec.get("demo") else ["word"],
            "relatedIds": related,
            "validation": PENDING,
            "syllables": spec["syl"],
            "constituentChars": spec["pieces"],
            "formableWithMvpPieces": formable_with_mvp(spec["pieces"]),
            "requiredPieces": spec["pieces"],
        }
        if spec.get("demo"):
            row["isDemoTarget"] = True
        rows.append(row)
    return rows


SENTENCES = [
    ("el-gato-come-pan", "el gato come pan", ["el", "gato", "come", "pan"]),
    ("mi-mama-ve-el-sol", "mi mamá ve el sol", ["mi", "mama", "ve", "el", "sol"]),
    ("la-casa-es-grande", "la casa es grande", ["la", "casa", "es", "grande"]),
    ("el-perro-come-pan", "el perro come pan", ["el", "perro", "come", "pan"]),
    ("un-pato-en-el-mar", "un pato en el mar", ["un", "pato", "en", "el", "mar"]),
    ("mi-papa-tiene-un-libro", "mi papá tiene un libro", ["mi", "papa", "tiene", "un", "libro"]),
    ("el-nino-ve-la-luna", "el niño ve la luna", ["el", "nino", "ve", "la", "luna"]),
    ("el-oso-come-uva", "el oso come uva", ["el", "oso", "come", "uva"]),
    ("su-mano-es-grande", "su mano es grande", ["su", "mano", "es", "grande"]),
    ("el-sol-es-rojo", "el sol es rojo", ["el", "sol", "es", "rojo"]),
]


def make_sentences():
    rows = []
    for order, (sid, text, word_ids) in enumerate(SENTENCES, start=1):
        rows.append({
            "id": f"sentence-{sid}",
            "type": "sentence",
            "character": text,
            "caseForm": "none",
            "order": order,
            "difficulty": 3,
            "braille": braille_from_cells(cells_for_text(text)),
            "associations": [{"word": text, "imageAlt": f"Oración: {text}"}],
            "media": {},
            "vision": {
                "modelClass": f"sentence-{sid}",
                "minConfidence": 0.7,
                "hasPhysicalPiece": False,
            },
            "i18n": {
                "es": {
                    "name": text,
                    "instruction": f"Lee la oración: {text}.",
                    "instructionShort": text,
                    "validation": PENDING,
                }
            },
            "tags": ["sentence"],
            "relatedIds": [f"word-{w}" for w in word_ids],
            "validation": PENDING,
            "wordIds": [f"word-{w}" for w in word_ids],
        })
    return rows


def link_related(upper, lower, syllables, words):
    syl_ids = {row["id"] for row in syllables}
    word_ids = {row["id"] for row in words}
    for letter in upper + lower:
        ch = letter["character"].lower()
        extra = []
        for vowel in "aeiou":
            sid = f"syllable-{ch}{vowel}"
            if sid in syl_ids:
                extra.append(sid)
        for word in words:
            if ch in word["character"].lower() and word["id"] in word_ids:
                extra.append(word["id"])
                if len(extra) >= 6:
                    break
        letter["relatedIds"] = list(dict.fromkeys(letter["relatedIds"] + extra))
    for word in words:
        word["relatedIds"] = [rid for rid in word["relatedIds"] if rid in syl_ids]


def main():
    upper, lower = make_letters()
    syllables = make_syllables()
    words = make_words()
    sentences = make_sentences()
    digits = make_digits()
    link_related(upper, lower, syllables, words)

    write_json(ROOT / "src/data/alphabet/uppercase.json", upper)
    write_json(ROOT / "src/data/alphabet/lowercase.json", lower)
    write_json(ROOT / "src/data/numbers/digits.json", digits)
    write_json(ROOT / "src/data/syllables/basic-es.json", syllables)
    write_json(ROOT / "src/data/words/basic-es.json", words)
    write_json(ROOT / "src/data/sentences/basic-es.json", sentences)
    write_json(ROOT / "src/data/braille/spanish-grade1.json", make_braille_table())


if __name__ == "__main__":
    main()
