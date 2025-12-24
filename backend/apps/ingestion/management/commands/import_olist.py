from pathlib import Path

from django.core.management.base import BaseCommand, CommandError

from apps.ingestion.domain.services import import_olist


class Command(BaseCommand):
    help = "Import Olist CSV files into SQLite"

    def add_arguments(self, parser):
        parser.add_argument("--data-dir", required=True, help="Path to the folder with Olist CSV files")
        parser.add_argument("--truncate", action="store_true", help="Delete tables before importing")
        parser.add_argument("--limit", type=int, default=None, help="Limit rows per file")

    def handle(self, *args, **options):
        data_dir = Path(options["data_dir"]).resolve()
        if not data_dir.exists():
            raise CommandError(f"Data dir does not exist: {data_dir}")

        self.stdout.write(self.style.MIGRATE_HEADING("Starting Olist import"))
        report = import_olist(
            data_dir=data_dir,
            truncate=options["truncate"],
            limit=options["limit"],
        )

        self.stdout.write(self.style.MIGRATE_HEADING("Import quality report"))
        for file_name, stats in report.summary().items():
            errors = ", ".join(f"{k}={v}" for k, v in stats["errors"].items()) or "none"
            self.stdout.write(
                f"{file_name}: read={stats['rows_read']} inserted={stats['rows_inserted']} "
                f"skipped={stats['rows_skipped']} errors={errors}"
            )
