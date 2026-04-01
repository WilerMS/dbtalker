from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    demo_user_id: str = Field(default=...)

    db_user: str = Field(default=...)
    db_password: str = Field(default=...)
    db_name: str = Field(default=...)
    db_host: str = Field(default="postgres")

    openai_api_key: str = Field(default=...)
    database_url: str = Field(default=...)

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    demo_db_id: str = Field(default=...)
    demo_db_host: str = Field(default=...)
    demo_db_user: str = Field(default=...)
    demo_db_password: str = Field(default=...)
    demo_db_name: str = Field(default=...)
    demo_db_port: int = Field(default=...)

    clerk_secret_key: str = Field(default=...)


settings = Settings()
