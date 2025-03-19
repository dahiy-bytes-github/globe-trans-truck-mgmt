from alembic import context
from flask import current_app
from logging.config import fileConfig
import logging

# Use the existing Flask-SQLAlchemy connection
config = context.config
fileConfig(config.config_file_name)
logger = logging.getLogger('alembic.env')

# Reuse the Flask-SQLAlchemy connection
def run_migrations_online():
    """Run migrations in the context of the Flask application."""
    connectable = current_app.extensions['migrate'].db.engine

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=current_app.extensions['migrate'].db.metadata,
            **current_app.extensions['migrate'].configure_args
        )

        with context.begin_transaction():
            context.run_migrations()

# Run migrations
run_migrations_online()