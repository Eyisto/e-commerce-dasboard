from collections import defaultdict


class QualityReport:
    def __init__(self):
        self._report = defaultdict(lambda: {
            "rows_read": 0,
            "rows_inserted": 0,
            "rows_skipped": 0,
            "errors": defaultdict(int),
        })

    def record_read(self, file_key):
        self._report[file_key]["rows_read"] += 1

    def record_inserted(self, file_key, count=1):
        self._report[file_key]["rows_inserted"] += count

    def record_skipped(self, file_key, count=1):
        self._report[file_key]["rows_skipped"] += count

    def record_error(self, file_key, exc):
        error_name = type(exc).__name__
        self._report[file_key]["errors"][error_name] += 1

    def summary(self):
        return self._report
