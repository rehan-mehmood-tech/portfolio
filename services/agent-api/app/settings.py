from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    allowed_origins: str = "http://localhost:3000"
    groq_api_key: str = ""
    groq_model: str = "openai/gpt-oss-120b"
    firebase_service_account_json: str = ""
    web_leads_url: str = "http://localhost:3000/api/leads"
    web_internal_api_key: str = ""
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    @property
    def allowed_origin_list(self) -> list[str]:
        return [origin.strip().rstrip("/") for origin in self.allowed_origins.split(",") if origin.strip()]


settings = Settings()
