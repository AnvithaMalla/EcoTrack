from __future__ import annotations

from collections import defaultdict, deque
from datetime import datetime, timedelta, timezone
from typing import Callable

from flask import jsonify, request

from backend.config import Config

_requests: dict[str, deque[datetime]] = defaultdict(deque)


def rate_limit(view: Callable) -> Callable:
    def wrapped(*args, **kwargs):
        config = Config()
        limit = max(1, config.rate_limit_per_minute)
        ip = request.headers.get('X-Forwarded-For', request.remote_addr or 'local').split(',')[0].strip()
        now = datetime.now(timezone.utc)
        queue = _requests[ip]
        while queue and now - queue[0] > timedelta(minutes=1):
            queue.popleft()
        if len(queue) >= limit:
            return jsonify({'error': 'Too many requests'}), 429
        queue.append(now)
        return view(*args, **kwargs)

    wrapped.__name__ = getattr(view, '__name__', 'rate_limited')
    return wrapped
