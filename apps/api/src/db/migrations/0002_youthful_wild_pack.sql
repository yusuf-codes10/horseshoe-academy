CREATE TYPE "public"."degree" AS ENUM('Associate', 'Bachelor''s', 'Master''s', 'PhD');--> statement-breakpoint
CREATE TYPE "public"."gender" AS ENUM('female', 'male');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('admin', 'teacher', 'student');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('pending', 'accepted', 'rejected');