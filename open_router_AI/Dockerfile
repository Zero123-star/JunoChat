# Dockerfile for Character AI Router App

# Use official Python slim image
FROM python:3.10-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
        build-essential \
        git \
        && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt ./
#eUN pip install --no-cache-dir -r requirements.txt
# after copying requirements.txt
RUN pip install --no-cache-dir -r requirements.txt \
    && pip install optimum

# Copy application code
COPY . .

# Expose port
EXPOSE 8000

# Run database initialization and start the app
CMD ["/bin/sh", "-c", "python -c 'from models.db import init_db; init_db()' && uvicorn app:app --host 0.0.0.0 --port 8000"]
