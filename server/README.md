# DBTalkie Backend

FastAPI backend scaffolded with `uv`.

## Development

```bash
uv sync
uv run uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

## Endpoints

- `GET /health`
- `GET /sse/stream`
