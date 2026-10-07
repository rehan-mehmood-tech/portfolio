from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    allowed_origins: str = "http://localhost:3000"
    groq_api_key: str = ""
    groq_model: str = "llama-3.3-70b-versatile"
    firebase_service_account_json: str = ""
    web_leads_url: str = "http://localhost:3000/api/leads"
    web_internal_api_key: str = ""
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()
