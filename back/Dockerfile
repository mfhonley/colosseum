# Multi-stage build for production-ready image
FROM python:3.11-slim AS builder

# Install Poetry (latest version supports package-mode)
RUN pip install poetry>=1.8.0

# Set working directory
WORKDIR /app

# Copy dependency files
COPY pyproject.toml ./

# Install dependencies (without dev dependencies for production)
RUN poetry config virtualenvs.create false \
    && poetry install --no-root --without dev --no-interaction --no-ansi

# Final stage
FROM python:3.11-slim

WORKDIR /app

# Copy installed packages from builder
COPY --from=builder /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin

# Copy application code
COPY app/ ./app/
COPY scripts/ ./scripts/
COPY static/ ./static/

# Create directories for data
RUN mkdir -p /data /data/nft_images

# Environment variables
ENV PYTHONUNBUFFERED=1
ENV DATABASE_URL=sqlite:////data/water_management.db

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/api/health')"

# Run the application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
