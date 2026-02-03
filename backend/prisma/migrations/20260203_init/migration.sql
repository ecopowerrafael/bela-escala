-- Trigger: add 50 points and update rank when meeting status becomes CONCLUIDA
-- Requires tables created by Prisma migrations.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE OR REPLACE FUNCTION add_points_on_meeting_complete()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'CONCLUIDA' AND (OLD.status IS DISTINCT FROM NEW.status) THEN
    INSERT INTO "PointsTransaction" ("id", "userId", "actionType", "points", "timestamp")
    VALUES (gen_random_uuid(), NEW."userId", 'meeting_completed', 50, now());

    UPDATE "User"
    SET "points" = "points" + 50
    WHERE "id" = NEW."userId";

    UPDATE "User"
    SET "rankId" = (
      SELECT "id" FROM "Rank"
      WHERE "minPoints" <= "User"."points"
      ORDER BY "minPoints" DESC
      LIMIT 1
    )
    WHERE "id" = NEW."userId";
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_meeting_complete ON "Meeting";
CREATE TRIGGER trg_meeting_complete
AFTER UPDATE OF "status" ON "Meeting"
FOR EACH ROW
EXECUTE FUNCTION add_points_on_meeting_complete();
