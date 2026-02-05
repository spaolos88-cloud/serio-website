# filename: sound_as_behavior_api.py

from fastapi import FastAPI
from pydantic import BaseModel
from typing import Optional, List

app = FastAPI(
    title="Sound as Behavior API",
    description="Behavioral framework for Musical, Analytical, and Balanced audio grading",
    version="1.0.0"
)

# ----------------------------
# DATA MODELS
# ----------------------------

class ListenerProfile(BaseModel):
    listening_duration_minutes: int
    fatigue_sensitivity: str  # low | medium | high
    detail_priority: str      # low | medium | high
    volume_preference: str    # low | medium | high
    tweak_frequency: str      # never | rare | frequent


class MusicalGrade(BaseModel):
    decay_behavior: float
    midrange_coherence: float
    dynamic_flow: float
    fatigue: float
    low_spl_integrity: float


class AnalyticalGrade(BaseModel):
    resolution: float
    transient_accuracy: float
    separation: float
    tonal_accuracy: float
    consistency: float


class BalancedGrade(BaseModel):
    musical_under_scrutiny: float
    detail_without_fatigue: float
    spl_stability: float
    forgiveness_without_masking: float
    system_identity_stability: float


class SystemScores(BaseModel):
    musical: float
    analytical: float
    balanced: float


class LockStatusInput(BaseModel):
    tweak_urge: str          # low | medium | high
    listening_time_trend: str # decreasing | stable | increasing
    curiosity_triggered: bool


# ----------------------------
# CORE LOGIC
# ----------------------------

def apply_caps(score: float, caps: List[str]) -> float:
    if "fatigue" in caps:
        return min(score, 6)
    if "short_decay" in caps:
        return min(score, 7)
    if "instability" in caps:
        return min(score, 6)
    return score


# ----------------------------
# ENDPOINTS
# ----------------------------

@app.post("/listener/profile")
def classify_listener(profile: ListenerProfile):
    if profile.fatigue_sensitivity == "high" and profile.listening_duration_minutes >= 90:
        identity = "Musical"
        confidence = 0.85
    elif profile.detail_priority == "high" and profile.tweak_frequency == "frequent":
        identity = "Analytical"
        confidence = 0.8
    else:
        identity = "Balanced"
        confidence = 0.75

    return {
        "listener_identity": identity,
        "confidence": confidence
    }


@app.post("/grade/musical")
def grade_musical(grade: MusicalGrade):
    raw_score = (
        grade.decay_behavior +
        grade.midrange_coherence +
        grade.dynamic_flow +
        grade.fatigue +
        grade.low_spl_integrity
    )

    caps = []
    if grade.decay_behavior < 1:
        caps.append("short_decay")
    if grade.fatigue < 1:
        caps.append("fatigue")

    final_score = apply_caps(raw_score, caps)

    return {
        "musical_score": round(final_score, 2),
        "caps_applied": caps
    }


@app.post("/grade/analytical")
def grade_analytical(grade: AnalyticalGrade):
    raw_score = (
        grade.resolution +
        grade.transient_accuracy +
        grade.separation +
        grade.tonal_accuracy +
        grade.consistency
    )

    caps = []
    if grade.consistency < 1:
        caps.append("instability")

    final_score = apply_caps(raw_score, caps)

    return {
        "analytical_score": round(final_score, 2),
        "caps_applied": caps
    }


@app.post("/grade/balanced")
def grade_balanced(grade: BalancedGrade):
    raw_score = (
        grade.musical_under_scrutiny +
        grade.detail_without_fatigue +
        grade.spl_stability +
        grade.forgiveness_without_masking +
        grade.system_identity_stability
    )

    caps = []
    if grade.detail_without_fatigue < 1:
        caps.append("fatigue")
    if grade.spl_stability < 1:
        caps.append("instability")

    final_score = apply_caps(raw_score, caps)

    return {
        "balanced_score": round(final_score, 2),
        "caps_applied": caps
    }


@app.post("/system/mismatch")
def detect_mismatch(listener_identity: str, scores: SystemScores):
    mismatch = False
    risk = "low"
    predicted = []

    if listener_identity == "Musical" and scores.analytical > scores.musical:
        mismatch = True
        risk = "high"
        predicted = ["fatigue", "tweaking", "upgrade_loop"]

    if listener_identity == "Analytical" and scores.musical > scores.analytical:
        mismatch = True
        risk = "medium"
        predicted = ["detail_blur", "boredom", "lack_of_focus"]

    return {
        "mismatch_detected": mismatch,
        "risk_level": risk,
        "predicted_behaviors": predicted
    }


@app.post("/system/lock")
def check_lock_status(input: LockStatusInput):
    """
    Lock Status refers to the 'End Game' state where a listener 
    stops the upgrade loop.
    """
    lock_prob = 0.0
    
    if input.tweak_urge == "low" and input.listening_time_trend == "increasing":
        lock_prob = 0.95
    elif input.tweak_urge == "medium" and input.listening_time_trend == "stable":
        lock_prob = 0.7
    else:
        lock_prob = 0.3
        
    if input.curiosity_triggered:
        lock_prob -= 0.2
        
    return {
        "lock_probability": max(0, min(1, lock_prob)),
        "status": "LOCKED" if lock_prob > 0.8 else "STABLE" if lock_prob > 0.6 else "VULNERABLE"
    }


# ----------------------------
# UNIFIED INTERFACE FOR FRONTEND
# ----------------------------

class ProductSpecs(BaseModel):
    name: str
    description: str
    specs: str

class UnifiedGradeInput(BaseModel):
    listener: dict # {"identity": "Musical" | "Analytical"}
    product: ProductSpecs

@app.post("/grade")
def unified_grade(input: UnifiedGradeInput):
    """
    Unified endpoint for the Serio Labs frontend.
    Returns scores for all archetypes and the final mismatch risk.
    """
    identity = input.listener.get("identity", "Analytical")
    
    # 1. Generate Heuristic Pillar Scores based on description
    # This simulates what the AI would do but in code
    text = f"{input.product.name} {input.product.description} {input.product.specs}".lower()
    
    # Example detection logic
    is_analytical = any(w in text for w in ["beryllium", "boron", "studio", "monitor", "resolution"])
    
    # Base scores
    m_base = 8.5 if not is_analytical else 4.0
    a_base = 9.2 if is_analytical else 6.5
    b_base = 8.0
    
    # Pillar Simulation
    musical_data = MusicalGrade(
        decay_behavior=1.8 if not is_analytical else 0.5,
        midrange_coherence=1.9 if not is_analytical else 1.2,
        dynamic_flow=1.8 if not is_analytical else 0.4,
        fatigue=1.9 if not is_analytical else 0.2, # Low fatigue pillar = High fatigue risk
        low_spl_integrity=1.6 if not is_analytical else 1.5
    )
    
    analytical_data = AnalyticalGrade(
        resolution=2.0 if is_analytical else 1.5,
        transient_accuracy=2.0 if is_analytical else 1.2,
        separation=2.0 if is_analytical else 1.3,
        tonal_accuracy=1.9 if is_analytical else 1.4,
        consistency=1.9 if is_analytical else 1.4
    )
    
    balanced_data = BalancedGrade(
        musical_under_scrutiny=1.8 if not is_analytical else 1.0,
        detail_without_fatigue=1.9 if not is_analytical else 0.8,
        spl_stability=1.8,
        forgiveness_without_masking=1.7 if not is_analytical else 0.5,
        system_identity_stability=1.8
    )
    
    # Calculate Scores via existing endpoints/logic
    m_res = grade_musical(musical_data)
    a_res = grade_analytical(analytical_data)
    b_res = grade_balanced(balanced_data)
    
    scores = SystemScores(
        musical=m_res["musical_score"],
        analytical=a_res["analytical_score"],
        balanced=b_res["balanced_score"]
    )
    
    mismatch = detect_mismatch(identity, scores)
    
    return {
        "final_grade": scores.analytical if identity == "Analytical" else scores.musical,
        "system_scores": scores.dict(),
        "mismatch_detected": mismatch["mismatch_detected"],
        "risk_level": mismatch["risk_level"],
        "predicted_behavior": mismatch["predicted_behaviors"],
        "mismatch_risk": mismatch["risk_level"],
        "inherent_identity": "ANALYTICAL" if is_analytical else "MUSICAL"
    }
