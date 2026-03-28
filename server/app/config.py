from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    db_user: str = Field(default=...)
    db_password: str = Field(default=...)
    db_name: str = Field(default=...)
    db_host: str = Field(default="postgres")

    openai_api_key: str = Field(default=...)
    database_url: str = Field(default=...)

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()
