CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY,

    title TEXT NOT NULL
        CHECK (length(trim(title)) > 0),

    description TEXT NOT NULL DEFAULT '',

    due_date TEXT NOT NULL
        CHECK (
            length(due_date) = 10
            AND due_date GLOB
                '[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]'
        ),

    topic TEXT NOT NULL
        CHECK (length(trim(topic)) > 0),

    status TEXT NOT NULL DEFAULT 'Todo'
        CHECK (
            status IN ('Todo', 'In-Progress', 'Complete')
        ),

    archived_at TEXT DEFAULT NULL,

    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);