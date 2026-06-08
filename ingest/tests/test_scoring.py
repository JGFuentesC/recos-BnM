import json
import os
import subprocess

import pytest

REPO_ROOT = os.path.normpath(os.path.join(os.path.dirname(__file__), "..", ".."))
SCORING_JS = os.path.join(REPO_ROOT, "backend", "src", "services", "scoring.js")


def _run_node(script: str) -> list:
    rel = os.path.relpath(SCORING_JS, REPO_ROOT).replace("\\", "/")
    full = f"const {{ computeScore }} = require('./{rel}');\n{script}"
    result = subprocess.run(
        ["node", "-e", full],
        capture_output=True,
        text=True,
        cwd=REPO_ROOT,
    )
    if result.returncode != 0:
        raise RuntimeError(f"Node error:\n{result.stderr}")
    return json.loads(result.stdout)


def test_basic_ranking():
    items = [
        {"title": "A", "popularity": 100, "rating": 8.0, "genres": ["Action"]},
        {"title": "B", "popularity": 50, "rating": 6.0, "genres": ["Drama"]},
    ]
    scored = _run_node(f"console.log(JSON.stringify(computeScore({json.dumps(items)})));")
    assert scored[0]["title"] == "A"
    assert scored[0]["score"] > scored[1]["score"]


def test_score_formula_known_values():
    items = [
        {"title": "High", "popularity": 100, "rating": 10.0, "genres": []},
        {"title": "Low", "popularity": 0, "rating": 0.0, "genres": []},
    ]
    scored = _run_node(f"console.log(JSON.stringify(computeScore({json.dumps(items)})));")
    assert scored[0]["title"] == "High"
    assert scored[0]["norm_popularity"] == 1.0
    assert scored[0]["norm_rating"] == 1.0
    assert scored[0]["score"] == 1.0
    assert scored[1]["norm_popularity"] == 0.0
    assert scored[1]["norm_rating"] == 0.0
    assert scored[1]["score"] == 0.0


def test_all_same_popularity_and_rating():
    items = [
        {"title": "X", "popularity": 50, "rating": 7.0, "genres": []},
        {"title": "Y", "popularity": 50, "rating": 7.0, "genres": []},
        {"title": "Z", "popularity": 50, "rating": 7.0, "genres": []},
    ]
    scored = _run_node(f"console.log(JSON.stringify(computeScore({json.dumps(items)})));")
    for s in scored:
        assert s["norm_popularity"] == 0.5
        assert s["norm_rating"] == 0.5
    assert scored[0]["score"] == pytest.approx(0.5)


def test_empty_array():
    scored = _run_node("console.log(JSON.stringify(computeScore([])));")
    assert scored == []


def test_empty_array_with_affinity():
    scored = _run_node("console.log(JSON.stringify(computeScore([], { Action: 1.2 })));")
    assert scored == []


def test_affinity_boost():
    items = [
        {"title": "Action Movie", "popularity": 100, "rating": 8.0, "genres": ["Action"]},
        {"title": "Drama Movie", "popularity": 50, "rating": 6.0, "genres": ["Drama"]},
    ]
    affinity = {"Action": 1.5, "Drama": 1.0}
    scored = _run_node(f"console.log(JSON.stringify(computeScore({json.dumps(items)}, {json.dumps(affinity)})));")
    for s in scored:
        if s["genres"] == ["Action"]:
            assert s["affinityMultiplier"] == 1.5
        elif s["genres"] == ["Drama"]:
            assert s["affinityMultiplier"] == 1.0


def test_affinity_penalty():
    items = [
        {"title": "Bad Genre", "popularity": 100, "rating": 10.0, "genres": ["Romance"]},
    ]
    affinity = {"Romance": 0.5}
    scored = _run_node(f"console.log(JSON.stringify(computeScore({json.dumps(items)}, {json.dumps(affinity)})));")
    assert scored[0]["affinityMultiplier"] == 0.5
    assert scored[0]["score"] < 1.0


def test_affinity_boost_takes_max_genre():
    items = [
        {"title": "Multi", "popularity": 100, "rating": 10.0, "genres": ["Action", "Drama"]},
    ]
    affinity = {"Action": 1.2, "Drama": 0.8}
    scored = _run_node(f"console.log(JSON.stringify(computeScore({json.dumps(items)}, {json.dumps(affinity)})));")
    assert scored[0]["affinityMultiplier"] == 1.2


def test_no_genres_uses_default_affinity():
    items = [
        {"title": "No Genres", "popularity": 50, "rating": 7.0},
    ]
    affinity = {"Action": 1.5}
    scored = _run_node(f"console.log(JSON.stringify(computeScore({json.dumps(items)}, {json.dumps(affinity)})));")
    assert scored[0]["affinityMultiplier"] == 1.0


def test_normalize_auto_adds_fields():
    items = [
        {"title": "T1", "popularity": 80, "rating": 7.5, "genres": []},
        {"title": "T2", "popularity": 20, "rating": 5.0, "genres": []},
    ]
    scored = _run_node(f"console.log(JSON.stringify(computeScore({json.dumps(items)})));")
    assert "norm_popularity" in scored[0]
    assert "norm_rating" in scored[0]
    assert "score" in scored[0]
    assert scored[0]["score"] == pytest.approx(
        0.7 * scored[0]["norm_popularity"] + 0.3 * scored[0]["norm_rating"]
    )


def test_node_module_exports():
    rel = os.path.relpath(SCORING_JS, REPO_ROOT).replace("\\", "/")
    result = subprocess.run(
        ["node", "-e", f"const m = require('./{rel}'); console.log(typeof m.computeScore, typeof m.normalize);"],
        capture_output=True, text=True, cwd=REPO_ROOT,
    )
    assert result.stdout.strip() == "function function"

def test_node_module_exports_scoreCandidates():
    rel = os.path.relpath(SCORING_JS, REPO_ROOT).replace("\\", "/")
    result = subprocess.run(
        ["node", "-e", f"const m = require('./{rel}'); console.log(typeof m.scoreCandidates, m.scoreCandidates === m.computeScore);"],
        capture_output=True, text=True, cwd=REPO_ROOT,
    )
    assert result.stdout.strip() == "function true"
