CREATE OR REPLACE FUNCTION set_updated_at()
  RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TABLE screenshot_metadata
(
  id TEXT NOT NULL,
  session_id TEXT NOT NULL,
  file_path TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

CREATE INDEX index_session_id_on_screenshot_metadata ON screenshot_metadata (session_id);

CREATE TRIGGER update_screenshot_metadata
  BEFORE UPDATE
  ON screenshot_metadata
  FOR EACH ROW EXECUTE PROCEDURE set_updated_at();
