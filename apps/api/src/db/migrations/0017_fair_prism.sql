ALTER TABLE "notifications" ALTER COLUMN "is_read" SET DEFAULT false;--> statement-breakpoint
ALTER TABLE "notifications" ALTER COLUMN "is_read" SET NOT NULL;