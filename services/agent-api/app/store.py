import json
from datetime import datetime, timezone
import firebase_admin
from firebase_admin import credentials, firestore
from .settings import settings

def _db():
    if not firebase_admin._apps:
        if not settings.firebase_service_account_json:
            return None
        firebase_admin.initialize_app(credentials.Certificate(json.loads(settings.firebase_service_account_json)))
    return firestore.client()

def load_context() -> str:
    db = _db()
    if db is None:
        return "Rehan Mehmood is an AI + Full-Stack Engineer in Lahore. He builds AI agents, workflow automations and backend APIs using LangGraph, FastAPI, Node.js and Next.js."
    profile = db.document("site/profile").get().to_dict() or {}
    projects = [d.to_dict() for d in db.collection("projects").where("published", "==", True).limit(10).stream()]
    services = [d.to_dict() for d in db.collection("services").where("enabled", "==", True).limit(10).stream()]
    return json.dumps({"profile": profile, "projects": projects, "services": services}, default=str)

def save_message(session_id: str, role: str, content: str) -> None:
    db = _db()
    if db is None:
        return
    db.collection("chat_sessions").document(session_id).collection("messages").add({"role": role, "content": content, "createdAt": datetime.now(timezone.utc)})
