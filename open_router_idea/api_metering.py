from fastapi import Request, HTTPException
from starlette.middleware.base import BaseHTTPMiddleware
from time import time
from collections import defaultdict

RATE_LIMITS = defaultdict(lambda: {"count": 0, "start": time()})
MAX_REQUESTS_PER_MINUTE = 60

class RateLimiterMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        ip = request.client.host
        usage = RATE_LIMITS[ip]
        now = time()
        if now - usage["start"] > 60:
            usage["count"] = 0
            usage["start"] = now
        if usage["count"] >= MAX_REQUESTS_PER_MINUTE:
            raise HTTPException(status_code=429, detail="Rate limit exceeded")
        usage["count"] += 1
        response = await call_next(request)
        return response

TOTAL_TOKENS = defaultdict(int)

from transformers import PreTrainedTokenizer

def count_tokens(tokenizer: PreTrainedTokenizer, prompt: str, reply: str, user_id: str):
    prompt_ids = tokenizer.encode(prompt)
    reply_ids = tokenizer.encode(reply)
    TOTAL_TOKENS[user_id] += len(prompt_ids) + len(reply_ids)

def get_usage_stats(user_id: str):
    return {"total_tokens": TOTAL_TOKENS.get(user_id, 0)}
