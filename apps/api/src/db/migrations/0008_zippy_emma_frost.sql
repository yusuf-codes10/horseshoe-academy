ALTER TABLE "classes" ADD COLUMN "code" text;--> statement-breakpoint
ALTER TABLE "classes" ADD CONSTRAINT "classes_code_unique" UNIQUE("code");