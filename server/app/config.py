from pydantic import Field, computed_field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    db_user: str = Field(alias="POSTGRES_USER", default=...)
    db_password: str = Field(alias="POSTGRES_PASSWORD", default=...)
    db_name: str = Field(alias="POSTGRES_DB", default=...)
    db_host: str = Field(default="postgres")
    db_port: int = Field(default=5432)

    openai_api_key: str = Field(default=...)

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    demo_user_id: str = Field(default=...)
    demo_db_id: str = Field(default=...)
    demo_db_name: str = Field(default=...)

    clerk_secret_key: str = Field(default=...)

    @computed_field
    @property
    def database_url(self) -> str:
        return f"postgresql+asyncpg://{self.db_user}:{self.db_password}@{self.db_host}:{self.db_port}/{self.db_name}"


settings = Settings()
