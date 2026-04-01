from urllib.parse import quote_plus

from langchain_community.tools.sql_database.tool import (
    InfoSQLDatabaseTool,
    ListSQLDatabaseTool,
    QuerySQLCheckerTool,
    QuerySQLDataBaseTool,
)
from langchain_community.utilities import SQLDatabase
from langchain_core.language_models.chat_models import BaseChatModel
from langchain_core.runnables import Runnable
from langchain_core.tools import BaseTool
from sqlalchemy.exc import OperationalError as SQLAlchemyOperationalError

from app.schemas.database import DatabaseConnection, DatabaseRecord
from app.services.ai_service.tools import ShowCode, ShowKPI, ShowQuestion, ShowTable


class AgentFactory:
    @staticmethod
    def build_sql_agent(
        llm: BaseChatModel, db_record: DatabaseRecord
    ) -> tuple[Runnable, list[BaseTool]]:

        db_uri = AgentFactory._build_uri(db_record.engine, db_record.connection)
        langchain_db = AgentFactory._create_langchain_db(db_uri, db_record.connection)
        sql_tools: list[BaseTool] = [
            QuerySQLDataBaseTool(db=langchain_db),
            InfoSQLDatabaseTool(db=langchain_db),
            ListSQLDatabaseTool(db=langchain_db),
            QuerySQLCheckerTool(db=langchain_db, llm=llm),
        ]

        all_tools = sql_tools + [ShowKPI, ShowTable, ShowQuestion, ShowCode]

        llm_with_tools = llm.bind_tools(all_tools, parallel_tool_calls=False)

        return llm_with_tools, sql_tools

    @staticmethod
    def _create_langchain_db(db_uri: str, conn_data: DatabaseConnection) -> SQLDatabase:
        try:
            return SQLDatabase.from_uri(db_uri)
        except SQLAlchemyOperationalError as error:
            error_text = str(error).lower()
            is_connection_refused = "connection refused" in error_text

            if is_connection_refused and conn_data.port != 5432:
                fallback_uri = db_uri.replace(f":{conn_data.port}/", ":5432/", 1)
                return SQLDatabase.from_uri(fallback_uri)

            raise

    @staticmethod
    def _build_uri(engine: str, conn_data: DatabaseConnection) -> str:
        engine = engine.lower()

        user = quote_plus(str(conn_data.username))
        pwd = quote_plus(str(conn_data.password))
        host = str(conn_data.host)
        port = str(conn_data.port)
        db_name = str(conn_data.database)
        use_ssl = conn_data.use_ssl

        dialect_map = {
            "postgresql": "postgresql+psycopg",
            "postgres": "postgresql+psycopg",
            "mysql": "mysql+pymysql",
        }

        dialect = dialect_map.get(engine, engine)
        uri = f"{dialect}://{user}:{pwd}@{host}:{port}/{db_name}"

        if use_ssl and "postgres" in dialect:
            uri += "?sslmode=require"

        return uri
