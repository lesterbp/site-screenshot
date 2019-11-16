CREATE OR REPLACE FUNCTION set_updated_at()
  RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TABLE screenshot_batches
(
  id TEXT NOT NULL,
  screenshot_metadata JSONB DEFAULT '{}'::jsonb,
  status TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

CREATE INDEX index_status_on_screenshot_batches ON screenshot_batches (status);

CREATE TRIGGER update_screenshot_batches
  BEFORE UPDATE
  ON screenshot_batches
  FOR EACH ROW EXECUTE PROCEDURE set_updated_at();
