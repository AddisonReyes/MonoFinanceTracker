# ── Stage 1: deps ──────────────────────────────────────────────────────────────
FROM python:3.14.3-slim AS deps

WORKDIR /app

# Install system dependencies needed by psycopg2
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq-dev gcc \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir --prefix=/install -r requirements.txt


# ── Stage 2: runtime ───────────────────────────────────────────────────────────
FROM python:3.14.3-slim AS runtime

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=8000

WORKDIR /app

# Runtime-only system libs (libpq for psycopg2)
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq5 \
    && rm -rf /var/lib/apt/lists/*

# Copy installed packages from the deps stage
COPY --from=deps /install /usr/local

# Copy project source
COPY . .

# Collect static files (whitenoise serves them)
RUN python manage.py collectstatic --noinput

EXPOSE 8000

# Run migrations then start gunicorn
CMD python manage.py migrate --noinput && \
    gunicorn minift.wsgi \
        --bind 0.0.0.0:$PORT \
        --workers 2 \
        --threads 2 \
        --timeout 60 \
        --log-file -