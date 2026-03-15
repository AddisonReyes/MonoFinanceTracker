import logging
import time
import uuid

from django.utils.deprecation import MiddlewareMixin


logger = logging.getLogger("minift.request")


def _get_client_ip(request) -> str:
    # Railway (and most reverse proxies) forward the original client IP.
    xff = request.META.get("HTTP_X_FORWARDED_FOR")
    if xff:
        # First IP is the original client
        return xff.split(",")[0].strip()
    return request.META.get("REMOTE_ADDR", "")


class RequestIdMiddleware(MiddlewareMixin):
    header_name = "HTTP_X_REQUEST_ID"
    response_header = "X-Request-ID"

    def process_request(self, request):
        rid = request.META.get(self.header_name)
        if not rid:
            rid = uuid.uuid4().hex
        request.request_id = rid

    def process_response(self, request, response):
        rid = getattr(request, "request_id", None)
        if rid:
            response[self.response_header] = rid
        return response


class RequestLogMiddleware(MiddlewareMixin):
    """Log each request/response without leaking sensitive data.

    Intentionally does NOT log headers (Authorization/Cookie), request bodies,
    or query values.
    """

    def process_request(self, request):
        request._start_time = time.perf_counter()

    def process_response(self, request, response):
        try:
            duration_ms = int(
                (time.perf_counter() - getattr(request, "_start_time", 0.0)) * 1000
            )
        except Exception:
            duration_ms = -1

        user_id = None
        try:
            if (
                getattr(request, "user", None) is not None
                and request.user.is_authenticated
            ):
                user_id = request.user.id
        except Exception:
            user_id = None

        query_keys = ",".join(sorted(request.GET.keys())) if request.GET else "-"
        rid = getattr(request, "request_id", "")
        status = getattr(response, "status_code", "")
        uid = user_id if user_id is not None else "-"
        ip = _get_client_ip(request) or "-"

        logger.info(
            "HTTP %s %s -> %s (%sms) uid=%s ip=%s q=%s rid=%s",
            request.method,
            request.path,
            status,
            duration_ms,
            uid,
            ip,
            query_keys,
            rid,
        )
        return response

    def process_exception(self, request, exception):
        user_id = None
        try:
            if (
                getattr(request, "user", None) is not None
                and request.user.is_authenticated
            ):
                user_id = request.user.id
        except Exception:
            user_id = None

        rid = getattr(request, "request_id", "")
        logger.exception(
            "EXC %s %s uid=%s ip=%s rid=%s",
            request.method,
            request.path,
            user_id if user_id is not None else "-",
            _get_client_ip(request) or "-",
            rid,
        )
