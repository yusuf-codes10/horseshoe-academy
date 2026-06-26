CREATE TABLE "applications" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"status" "status" DEFAULT 'pending' NOT NULL,
	"student_id" bigint,
	"class_id" bigint
);
--> statement-breakpoint
CREATE TABLE "attendances" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"enroll_id" bigint,
	"session_id" bigint
);
--> statement-breakpoint
CREATE TABLE "classes" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"capacity" bigint NOT NULL,
	"subject_id" bigint,
	"teacher_id" bigint
);
--> statement-breakpoint
CREATE TABLE "departments" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"code" varchar(7) NOT NULL,
	"name" varchar(50) NOT NULL,
	CONSTRAINT "departments_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "enrollements" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"student_id" bigint,
	"class_id" bigint
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"title" varchar(20) NOT NULL,
	"content" text NOT NULL,
	"time" timestamp DEFAULT now() NOT NULL,
	"user_id" bigint
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"date" timestamp NOT NULL,
	"location" text NOT NULL,
	"class_id" bigint
);
--> statement-breakpoint
CREATE TABLE "students" (
	"id" bigint PRIMARY KEY NOT NULL,
	"gpa" numeric(10, 2) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subjects" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"name" varchar(20) NOT NULL,
	"descriptions" text,
	"department_id" bigint
);
--> statement-breakpoint
CREATE TABLE "teachers" (
	"id" bigint PRIMARY KEY NOT NULL,
	"degree" "degree" DEFAULT 'Associate' NOT NULL,
	"major" varchar(30) NOT NULL,
	"salary" numeric(10, 2) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"email" text NOT NULL,
	"gender" "gender" NOT NULL,
	"fullName" text,
	"role" "role",
	"createdAt" timestamp DEFAULT now(),
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_class_id_classes_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attendances" ADD CONSTRAINT "attendances_enroll_id_enrollements_id_fk" FOREIGN KEY ("enroll_id") REFERENCES "public"."enrollements"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attendances" ADD CONSTRAINT "attendances_session_id_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."sessions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "classes" ADD CONSTRAINT "classes_subject_id_subjects_id_fk" FOREIGN KEY ("subject_id") REFERENCES "public"."subjects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "classes" ADD CONSTRAINT "classes_teacher_id_teachers_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "public"."teachers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "enrollements" ADD CONSTRAINT "enrollements_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "enrollements" ADD CONSTRAINT "enrollements_class_id_classes_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_class_id_classes_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "students" ADD CONSTRAINT "students_id_users_id_fk" FOREIGN KEY ("id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subjects" ADD CONSTRAINT "subjects_department_id_departments_id_fk" FOREIGN KEY ("department_id") REFERENCES "public"."departments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teachers" ADD CONSTRAINT "teachers_id_users_id_fk" FOREIGN KEY ("id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;