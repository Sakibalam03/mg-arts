import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'client', 'architect');
  CREATE TYPE "public"."enum_admin_invitations_role" AS ENUM('admin', 'client', 'architect');
  CREATE TYPE "public"."enum_projects_status" AS ENUM('inquiry', 'quoted', 'active', 'completed');
  CREATE TYPE "public"."enum_documents_label" AS ENUM('requirement', 'quote', 'boq', 'drawing', 'other');
  CREATE TYPE "public"."enum_documents_visible_to" AS ENUM('client', 'architect', 'admin', 'all');
  CREATE TYPE "public"."enum_inquiries_source" AS ENUM('contact', 'landing', 'rates', 'pmc');
  CREATE TYPE "public"."enum_inquiries_status" AS ENUM('new', 'contacted', 'converted');
  CREATE TYPE "public"."enum_vendors_trade_type" AS ENUM('plumber', 'electrician', 'carpenter', 'civil', 'other');
  CREATE TYPE "public"."enum_vendors_status" AS ENUM('pending', 'approved', 'rejected');
  CREATE TYPE "public"."enum_vendor_field_schema_field_type" AS ENUM('text', 'number', 'select', 'file');
  CREATE TYPE "public"."enum_rate_items_category" AS ENUM('civil', 'electrical', 'plumbing', 'carpentry');
  CREATE TYPE "public"."enum_notices_target_role" AS ENUM('all', 'client', 'architect');
  CREATE TYPE "public"."enum_portfolio_projects_category" AS ENUM('residential', 'commercial', 'hospitality');
  CREATE TYPE "public"."enum_architect_resources_type" AS ENUM('boq-template', 'rate-sheet', 'guideline');
  CREATE TYPE "public"."enum_site_settings_offices_city" AS ENUM('mumbai', 'bangalore', 'kolkata');
  CREATE TABLE "users_role" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_users_role",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"email_verified" boolean DEFAULT false NOT NULL,
  	"image" varchar,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"firm_name" varchar,
  	"phone" varchar,
  	"approved" boolean
  );
  
  CREATE TABLE "sessions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"expires_at" timestamp(3) with time zone NOT NULL,
  	"token" varchar NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"ip_address" varchar,
  	"user_agent" varchar,
  	"user_id" integer NOT NULL
  );
  
  CREATE TABLE "accounts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"account_id" varchar NOT NULL,
  	"provider_id" varchar NOT NULL,
  	"user_id" integer NOT NULL,
  	"access_token" varchar,
  	"refresh_token" varchar,
  	"id_token" varchar,
  	"access_token_expires_at" timestamp(3) with time zone,
  	"refresh_token_expires_at" timestamp(3) with time zone,
  	"scope" varchar,
  	"password" varchar,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "verifications" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"identifier" varchar NOT NULL,
  	"value" varchar NOT NULL,
  	"expires_at" timestamp(3) with time zone NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "admin_invitations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"role" "enum_admin_invitations_role" DEFAULT 'admin' NOT NULL,
  	"token" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "projects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"client_id" integer NOT NULL,
  	"architect_id" integer,
  	"status" "enum_projects_status" DEFAULT 'inquiry' NOT NULL,
  	"city" varchar NOT NULL,
  	"notes" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "projects_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"documents_id" integer
  );
  
  CREATE TABLE "documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"project_id" integer NOT NULL,
  	"uploaded_by_id" integer NOT NULL,
  	"file_url" varchar NOT NULL,
  	"file_name" varchar,
  	"file_type" varchar,
  	"label" "enum_documents_label" DEFAULT 'other' NOT NULL,
  	"visible_to" "enum_documents_visible_to" DEFAULT 'all' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "inquiries" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"phone" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"message" varchar NOT NULL,
  	"source" "enum_inquiries_source" DEFAULT 'contact' NOT NULL,
  	"user_id" integer,
  	"status" "enum_inquiries_status" DEFAULT 'new' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "vendors" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"phone" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"trade_type" "enum_vendors_trade_type" NOT NULL,
  	"city" varchar NOT NULL,
  	"license_file" varchar,
  	"extra_fields" jsonb,
  	"status" "enum_vendors_status" DEFAULT 'pending' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "vendor_field_schema_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "vendor_field_schema" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"field_key" varchar NOT NULL,
  	"field_type" "enum_vendor_field_schema_field_type" NOT NULL,
  	"required" boolean DEFAULT false,
  	"order" numeric DEFAULT 0,
  	"active" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "rate_items" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"category" "enum_rate_items_category" NOT NULL,
  	"service_label" varchar NOT NULL,
  	"unit" varchar NOT NULL,
  	"mg_arts_rate" numeric NOT NULL,
  	"market_rate" numeric NOT NULL,
  	"with_material" boolean DEFAULT false,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "notices" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"body" jsonb,
  	"active" boolean DEFAULT false,
  	"send_email" boolean DEFAULT false,
  	"sent_at" timestamp(3) with time zone,
  	"target_role" "enum_notices_target_role" DEFAULT 'all' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "portfolio_projects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar,
  	"city" varchar NOT NULL,
  	"category" "enum_portfolio_projects_category" NOT NULL,
  	"year" numeric NOT NULL,
  	"description" jsonb,
  	"collaborator" varchar,
  	"meta_title" varchar,
  	"meta_desc" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "portfolio_projects_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer,
  	"brands_id" integer
  );
  
  CREATE TABLE "brands" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"logo_id" integer NOT NULL,
  	"auth_letter_id" integer,
  	"visible" boolean DEFAULT true,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "architect_resources" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"type" "enum_architect_resources_type" NOT NULL,
  	"file_id" integer NOT NULL,
  	"active" boolean DEFAULT true,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "services" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" jsonb,
  	"icon_id" integer,
  	"with_material" boolean DEFAULT false,
  	"active" boolean DEFAULT true,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"sessions_id" integer,
  	"accounts_id" integer,
  	"verifications_id" integer,
  	"admin_invitations_id" integer,
  	"media_id" integer,
  	"projects_id" integer,
  	"documents_id" integer,
  	"inquiries_id" integer,
  	"vendors_id" integer,
  	"vendor_field_schema_id" integer,
  	"rate_items_id" integer,
  	"notices_id" integer,
  	"portfolio_projects_id" integer,
  	"brands_id" integer,
  	"architect_resources_id" integer,
  	"services_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "landing_page_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar NOT NULL,
  	"subheading" varchar,
  	"cta_text" varchar,
  	"cta_link" varchar,
  	"background_image_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "landing_page_blocks_value_props_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"icon_id" integer
  );
  
  CREATE TABLE "landing_page_blocks_value_props" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "landing_page_blocks_rate_teaser" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"description" varchar,
  	"cta_text" varchar,
  	"cta_link" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "landing_page_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar NOT NULL,
  	"description" varchar,
  	"button_text" varchar,
  	"button_link" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "landing_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "about_page_team_members" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"role" varchar NOT NULL,
  	"photo_id" integer,
  	"bio" varchar
  );
  
  CREATE TABLE "about_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"company_story" jsonb,
  	"brands_section_heading" varchar DEFAULT 'Our Authorized Brands',
  	"brands_section_description" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "pmc_page_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar
  );
  
  CREATE TABLE "pmc_page_past_collaborations" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"architect_firm" varchar NOT NULL,
  	"project_name" varchar NOT NULL,
  	"city" varchar NOT NULL,
  	"year" numeric NOT NULL
  );
  
  CREATE TABLE "pmc_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"intro" jsonb,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "site_settings_offices" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"city" "enum_site_settings_offices_city" NOT NULL,
  	"address" varchar NOT NULL,
  	"phone" varchar,
  	"email" varchar
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"site_name" varchar DEFAULT 'MG Arts',
  	"topbar_enabled" boolean DEFAULT false,
  	"topbar_text" varchar,
  	"topbar_link_url" varchar,
  	"phone" varchar,
  	"email" varchar,
  	"social_links_instagram" varchar,
  	"social_links_linkedin" varchar,
  	"social_links_facebook" varchar,
  	"social_links_youtube" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "navigation_items_sections_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"link" varchar NOT NULL,
  	"description" varchar
  );
  
  CREATE TABLE "navigation_items_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar
  );
  
  CREATE TABLE "navigation_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"link" varchar
  );
  
  CREATE TABLE "navigation" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "footer_columns_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL,
  	"link" varchar NOT NULL
  );
  
  CREATE TABLE "footer_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar NOT NULL
  );
  
  CREATE TABLE "footer" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tagline" varchar DEFAULT 'Interior Execution & PMC',
  	"copyright_name" varchar DEFAULT 'MG Arts',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "users_role" ADD CONSTRAINT "users_role_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects" ADD CONSTRAINT "projects_client_id_users_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects" ADD CONSTRAINT "projects_architect_id_users_id_fk" FOREIGN KEY ("architect_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_rels" ADD CONSTRAINT "projects_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_rels" ADD CONSTRAINT "projects_rels_documents_fk" FOREIGN KEY ("documents_id") REFERENCES "public"."documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "documents" ADD CONSTRAINT "documents_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "documents" ADD CONSTRAINT "documents_uploaded_by_id_users_id_fk" FOREIGN KEY ("uploaded_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "inquiries" ADD CONSTRAINT "inquiries_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "vendor_field_schema_options" ADD CONSTRAINT "vendor_field_schema_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."vendor_field_schema"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "portfolio_projects_rels" ADD CONSTRAINT "portfolio_projects_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."portfolio_projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "portfolio_projects_rels" ADD CONSTRAINT "portfolio_projects_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "portfolio_projects_rels" ADD CONSTRAINT "portfolio_projects_rels_brands_fk" FOREIGN KEY ("brands_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "brands" ADD CONSTRAINT "brands_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "brands" ADD CONSTRAINT "brands_auth_letter_id_media_id_fk" FOREIGN KEY ("auth_letter_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "architect_resources" ADD CONSTRAINT "architect_resources_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services" ADD CONSTRAINT "services_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_sessions_fk" FOREIGN KEY ("sessions_id") REFERENCES "public"."sessions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_accounts_fk" FOREIGN KEY ("accounts_id") REFERENCES "public"."accounts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_verifications_fk" FOREIGN KEY ("verifications_id") REFERENCES "public"."verifications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_admin_invitations_fk" FOREIGN KEY ("admin_invitations_id") REFERENCES "public"."admin_invitations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_documents_fk" FOREIGN KEY ("documents_id") REFERENCES "public"."documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_inquiries_fk" FOREIGN KEY ("inquiries_id") REFERENCES "public"."inquiries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_vendors_fk" FOREIGN KEY ("vendors_id") REFERENCES "public"."vendors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_vendor_field_schema_fk" FOREIGN KEY ("vendor_field_schema_id") REFERENCES "public"."vendor_field_schema"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_rate_items_fk" FOREIGN KEY ("rate_items_id") REFERENCES "public"."rate_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_notices_fk" FOREIGN KEY ("notices_id") REFERENCES "public"."notices"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_portfolio_projects_fk" FOREIGN KEY ("portfolio_projects_id") REFERENCES "public"."portfolio_projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_brands_fk" FOREIGN KEY ("brands_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_architect_resources_fk" FOREIGN KEY ("architect_resources_id") REFERENCES "public"."architect_resources"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_page_blocks_hero" ADD CONSTRAINT "landing_page_blocks_hero_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "landing_page_blocks_hero" ADD CONSTRAINT "landing_page_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_page_blocks_value_props_items" ADD CONSTRAINT "landing_page_blocks_value_props_items_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "landing_page_blocks_value_props_items" ADD CONSTRAINT "landing_page_blocks_value_props_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing_page_blocks_value_props"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_page_blocks_value_props" ADD CONSTRAINT "landing_page_blocks_value_props_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_page_blocks_rate_teaser" ADD CONSTRAINT "landing_page_blocks_rate_teaser_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_page_blocks_cta" ADD CONSTRAINT "landing_page_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_team_members" ADD CONSTRAINT "about_page_team_members_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_page_team_members" ADD CONSTRAINT "about_page_team_members_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pmc_page_services" ADD CONSTRAINT "pmc_page_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pmc_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pmc_page_past_collaborations" ADD CONSTRAINT "pmc_page_past_collaborations_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pmc_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_offices" ADD CONSTRAINT "site_settings_offices_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_items_sections_items" ADD CONSTRAINT "navigation_items_sections_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation_items_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_items_sections" ADD CONSTRAINT "navigation_items_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_items" ADD CONSTRAINT "navigation_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_columns_items" ADD CONSTRAINT "footer_columns_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_columns" ADD CONSTRAINT "footer_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_role_order_idx" ON "users_role" USING btree ("order");
  CREATE INDEX "users_role_parent_idx" ON "users_role" USING btree ("parent_id");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE UNIQUE INDEX "sessions_token_idx" ON "sessions" USING btree ("token");
  CREATE INDEX "sessions_created_at_idx" ON "sessions" USING btree ("created_at");
  CREATE INDEX "sessions_updated_at_idx" ON "sessions" USING btree ("updated_at");
  CREATE INDEX "sessions_user_idx" ON "sessions" USING btree ("user_id");
  CREATE INDEX "accounts_account_id_idx" ON "accounts" USING btree ("account_id");
  CREATE INDEX "accounts_user_idx" ON "accounts" USING btree ("user_id");
  CREATE INDEX "accounts_created_at_idx" ON "accounts" USING btree ("created_at");
  CREATE INDEX "accounts_updated_at_idx" ON "accounts" USING btree ("updated_at");
  CREATE INDEX "verifications_identifier_idx" ON "verifications" USING btree ("identifier");
  CREATE INDEX "verifications_created_at_idx" ON "verifications" USING btree ("created_at");
  CREATE INDEX "verifications_updated_at_idx" ON "verifications" USING btree ("updated_at");
  CREATE INDEX "admin_invitations_token_idx" ON "admin_invitations" USING btree ("token");
  CREATE INDEX "admin_invitations_updated_at_idx" ON "admin_invitations" USING btree ("updated_at");
  CREATE INDEX "admin_invitations_created_at_idx" ON "admin_invitations" USING btree ("created_at");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "projects_client_idx" ON "projects" USING btree ("client_id");
  CREATE INDEX "projects_architect_idx" ON "projects" USING btree ("architect_id");
  CREATE INDEX "projects_updated_at_idx" ON "projects" USING btree ("updated_at");
  CREATE INDEX "projects_created_at_idx" ON "projects" USING btree ("created_at");
  CREATE INDEX "projects_rels_order_idx" ON "projects_rels" USING btree ("order");
  CREATE INDEX "projects_rels_parent_idx" ON "projects_rels" USING btree ("parent_id");
  CREATE INDEX "projects_rels_path_idx" ON "projects_rels" USING btree ("path");
  CREATE INDEX "projects_rels_documents_id_idx" ON "projects_rels" USING btree ("documents_id");
  CREATE INDEX "documents_project_idx" ON "documents" USING btree ("project_id");
  CREATE INDEX "documents_uploaded_by_idx" ON "documents" USING btree ("uploaded_by_id");
  CREATE INDEX "documents_updated_at_idx" ON "documents" USING btree ("updated_at");
  CREATE INDEX "documents_created_at_idx" ON "documents" USING btree ("created_at");
  CREATE INDEX "inquiries_user_idx" ON "inquiries" USING btree ("user_id");
  CREATE INDEX "inquiries_updated_at_idx" ON "inquiries" USING btree ("updated_at");
  CREATE INDEX "inquiries_created_at_idx" ON "inquiries" USING btree ("created_at");
  CREATE INDEX "vendors_city_idx" ON "vendors" USING btree ("city");
  CREATE INDEX "vendors_updated_at_idx" ON "vendors" USING btree ("updated_at");
  CREATE INDEX "vendors_created_at_idx" ON "vendors" USING btree ("created_at");
  CREATE INDEX "vendor_field_schema_options_order_idx" ON "vendor_field_schema_options" USING btree ("_order");
  CREATE INDEX "vendor_field_schema_options_parent_id_idx" ON "vendor_field_schema_options" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "vendor_field_schema_field_key_idx" ON "vendor_field_schema" USING btree ("field_key");
  CREATE INDEX "vendor_field_schema_updated_at_idx" ON "vendor_field_schema" USING btree ("updated_at");
  CREATE INDEX "vendor_field_schema_created_at_idx" ON "vendor_field_schema" USING btree ("created_at");
  CREATE INDEX "rate_items_category_idx" ON "rate_items" USING btree ("category");
  CREATE INDEX "rate_items_updated_at_idx" ON "rate_items" USING btree ("updated_at");
  CREATE INDEX "rate_items_created_at_idx" ON "rate_items" USING btree ("created_at");
  CREATE INDEX "notices_updated_at_idx" ON "notices" USING btree ("updated_at");
  CREATE INDEX "notices_created_at_idx" ON "notices" USING btree ("created_at");
  CREATE UNIQUE INDEX "portfolio_projects_slug_idx" ON "portfolio_projects" USING btree ("slug");
  CREATE INDEX "portfolio_projects_city_idx" ON "portfolio_projects" USING btree ("city");
  CREATE INDEX "portfolio_projects_category_idx" ON "portfolio_projects" USING btree ("category");
  CREATE INDEX "portfolio_projects_updated_at_idx" ON "portfolio_projects" USING btree ("updated_at");
  CREATE INDEX "portfolio_projects_created_at_idx" ON "portfolio_projects" USING btree ("created_at");
  CREATE INDEX "portfolio_projects_rels_order_idx" ON "portfolio_projects_rels" USING btree ("order");
  CREATE INDEX "portfolio_projects_rels_parent_idx" ON "portfolio_projects_rels" USING btree ("parent_id");
  CREATE INDEX "portfolio_projects_rels_path_idx" ON "portfolio_projects_rels" USING btree ("path");
  CREATE INDEX "portfolio_projects_rels_media_id_idx" ON "portfolio_projects_rels" USING btree ("media_id");
  CREATE INDEX "portfolio_projects_rels_brands_id_idx" ON "portfolio_projects_rels" USING btree ("brands_id");
  CREATE INDEX "brands_logo_idx" ON "brands" USING btree ("logo_id");
  CREATE INDEX "brands_auth_letter_idx" ON "brands" USING btree ("auth_letter_id");
  CREATE INDEX "brands_updated_at_idx" ON "brands" USING btree ("updated_at");
  CREATE INDEX "brands_created_at_idx" ON "brands" USING btree ("created_at");
  CREATE INDEX "architect_resources_file_idx" ON "architect_resources" USING btree ("file_id");
  CREATE INDEX "architect_resources_updated_at_idx" ON "architect_resources" USING btree ("updated_at");
  CREATE INDEX "architect_resources_created_at_idx" ON "architect_resources" USING btree ("created_at");
  CREATE INDEX "services_icon_idx" ON "services" USING btree ("icon_id");
  CREATE INDEX "services_updated_at_idx" ON "services" USING btree ("updated_at");
  CREATE INDEX "services_created_at_idx" ON "services" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_sessions_id_idx" ON "payload_locked_documents_rels" USING btree ("sessions_id");
  CREATE INDEX "payload_locked_documents_rels_accounts_id_idx" ON "payload_locked_documents_rels" USING btree ("accounts_id");
  CREATE INDEX "payload_locked_documents_rels_verifications_id_idx" ON "payload_locked_documents_rels" USING btree ("verifications_id");
  CREATE INDEX "payload_locked_documents_rels_admin_invitations_id_idx" ON "payload_locked_documents_rels" USING btree ("admin_invitations_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_projects_id_idx" ON "payload_locked_documents_rels" USING btree ("projects_id");
  CREATE INDEX "payload_locked_documents_rels_documents_id_idx" ON "payload_locked_documents_rels" USING btree ("documents_id");
  CREATE INDEX "payload_locked_documents_rels_inquiries_id_idx" ON "payload_locked_documents_rels" USING btree ("inquiries_id");
  CREATE INDEX "payload_locked_documents_rels_vendors_id_idx" ON "payload_locked_documents_rels" USING btree ("vendors_id");
  CREATE INDEX "payload_locked_documents_rels_vendor_field_schema_id_idx" ON "payload_locked_documents_rels" USING btree ("vendor_field_schema_id");
  CREATE INDEX "payload_locked_documents_rels_rate_items_id_idx" ON "payload_locked_documents_rels" USING btree ("rate_items_id");
  CREATE INDEX "payload_locked_documents_rels_notices_id_idx" ON "payload_locked_documents_rels" USING btree ("notices_id");
  CREATE INDEX "payload_locked_documents_rels_portfolio_projects_id_idx" ON "payload_locked_documents_rels" USING btree ("portfolio_projects_id");
  CREATE INDEX "payload_locked_documents_rels_brands_id_idx" ON "payload_locked_documents_rels" USING btree ("brands_id");
  CREATE INDEX "payload_locked_documents_rels_architect_resources_id_idx" ON "payload_locked_documents_rels" USING btree ("architect_resources_id");
  CREATE INDEX "payload_locked_documents_rels_services_id_idx" ON "payload_locked_documents_rels" USING btree ("services_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "landing_page_blocks_hero_order_idx" ON "landing_page_blocks_hero" USING btree ("_order");
  CREATE INDEX "landing_page_blocks_hero_parent_id_idx" ON "landing_page_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "landing_page_blocks_hero_path_idx" ON "landing_page_blocks_hero" USING btree ("_path");
  CREATE INDEX "landing_page_blocks_hero_background_image_idx" ON "landing_page_blocks_hero" USING btree ("background_image_id");
  CREATE INDEX "landing_page_blocks_value_props_items_order_idx" ON "landing_page_blocks_value_props_items" USING btree ("_order");
  CREATE INDEX "landing_page_blocks_value_props_items_parent_id_idx" ON "landing_page_blocks_value_props_items" USING btree ("_parent_id");
  CREATE INDEX "landing_page_blocks_value_props_items_icon_idx" ON "landing_page_blocks_value_props_items" USING btree ("icon_id");
  CREATE INDEX "landing_page_blocks_value_props_order_idx" ON "landing_page_blocks_value_props" USING btree ("_order");
  CREATE INDEX "landing_page_blocks_value_props_parent_id_idx" ON "landing_page_blocks_value_props" USING btree ("_parent_id");
  CREATE INDEX "landing_page_blocks_value_props_path_idx" ON "landing_page_blocks_value_props" USING btree ("_path");
  CREATE INDEX "landing_page_blocks_rate_teaser_order_idx" ON "landing_page_blocks_rate_teaser" USING btree ("_order");
  CREATE INDEX "landing_page_blocks_rate_teaser_parent_id_idx" ON "landing_page_blocks_rate_teaser" USING btree ("_parent_id");
  CREATE INDEX "landing_page_blocks_rate_teaser_path_idx" ON "landing_page_blocks_rate_teaser" USING btree ("_path");
  CREATE INDEX "landing_page_blocks_cta_order_idx" ON "landing_page_blocks_cta" USING btree ("_order");
  CREATE INDEX "landing_page_blocks_cta_parent_id_idx" ON "landing_page_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "landing_page_blocks_cta_path_idx" ON "landing_page_blocks_cta" USING btree ("_path");
  CREATE INDEX "about_page_team_members_order_idx" ON "about_page_team_members" USING btree ("_order");
  CREATE INDEX "about_page_team_members_parent_id_idx" ON "about_page_team_members" USING btree ("_parent_id");
  CREATE INDEX "about_page_team_members_photo_idx" ON "about_page_team_members" USING btree ("photo_id");
  CREATE INDEX "pmc_page_services_order_idx" ON "pmc_page_services" USING btree ("_order");
  CREATE INDEX "pmc_page_services_parent_id_idx" ON "pmc_page_services" USING btree ("_parent_id");
  CREATE INDEX "pmc_page_past_collaborations_order_idx" ON "pmc_page_past_collaborations" USING btree ("_order");
  CREATE INDEX "pmc_page_past_collaborations_parent_id_idx" ON "pmc_page_past_collaborations" USING btree ("_parent_id");
  CREATE INDEX "site_settings_offices_order_idx" ON "site_settings_offices" USING btree ("_order");
  CREATE INDEX "site_settings_offices_parent_id_idx" ON "site_settings_offices" USING btree ("_parent_id");
  CREATE INDEX "navigation_items_sections_items_order_idx" ON "navigation_items_sections_items" USING btree ("_order");
  CREATE INDEX "navigation_items_sections_items_parent_id_idx" ON "navigation_items_sections_items" USING btree ("_parent_id");
  CREATE INDEX "navigation_items_sections_order_idx" ON "navigation_items_sections" USING btree ("_order");
  CREATE INDEX "navigation_items_sections_parent_id_idx" ON "navigation_items_sections" USING btree ("_parent_id");
  CREATE INDEX "navigation_items_order_idx" ON "navigation_items" USING btree ("_order");
  CREATE INDEX "navigation_items_parent_id_idx" ON "navigation_items" USING btree ("_parent_id");
  CREATE INDEX "footer_columns_items_order_idx" ON "footer_columns_items" USING btree ("_order");
  CREATE INDEX "footer_columns_items_parent_id_idx" ON "footer_columns_items" USING btree ("_parent_id");
  CREATE INDEX "footer_columns_order_idx" ON "footer_columns" USING btree ("_order");
  CREATE INDEX "footer_columns_parent_id_idx" ON "footer_columns" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_role" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "sessions" CASCADE;
  DROP TABLE "accounts" CASCADE;
  DROP TABLE "verifications" CASCADE;
  DROP TABLE "admin_invitations" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "projects" CASCADE;
  DROP TABLE "projects_rels" CASCADE;
  DROP TABLE "documents" CASCADE;
  DROP TABLE "inquiries" CASCADE;
  DROP TABLE "vendors" CASCADE;
  DROP TABLE "vendor_field_schema_options" CASCADE;
  DROP TABLE "vendor_field_schema" CASCADE;
  DROP TABLE "rate_items" CASCADE;
  DROP TABLE "notices" CASCADE;
  DROP TABLE "portfolio_projects" CASCADE;
  DROP TABLE "portfolio_projects_rels" CASCADE;
  DROP TABLE "brands" CASCADE;
  DROP TABLE "architect_resources" CASCADE;
  DROP TABLE "services" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "landing_page_blocks_hero" CASCADE;
  DROP TABLE "landing_page_blocks_value_props_items" CASCADE;
  DROP TABLE "landing_page_blocks_value_props" CASCADE;
  DROP TABLE "landing_page_blocks_rate_teaser" CASCADE;
  DROP TABLE "landing_page_blocks_cta" CASCADE;
  DROP TABLE "landing_page" CASCADE;
  DROP TABLE "about_page_team_members" CASCADE;
  DROP TABLE "about_page" CASCADE;
  DROP TABLE "pmc_page_services" CASCADE;
  DROP TABLE "pmc_page_past_collaborations" CASCADE;
  DROP TABLE "pmc_page" CASCADE;
  DROP TABLE "site_settings_offices" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TABLE "navigation_items_sections_items" CASCADE;
  DROP TABLE "navigation_items_sections" CASCADE;
  DROP TABLE "navigation_items" CASCADE;
  DROP TABLE "navigation" CASCADE;
  DROP TABLE "footer_columns_items" CASCADE;
  DROP TABLE "footer_columns" CASCADE;
  DROP TABLE "footer" CASCADE;
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_admin_invitations_role";
  DROP TYPE "public"."enum_projects_status";
  DROP TYPE "public"."enum_documents_label";
  DROP TYPE "public"."enum_documents_visible_to";
  DROP TYPE "public"."enum_inquiries_source";
  DROP TYPE "public"."enum_inquiries_status";
  DROP TYPE "public"."enum_vendors_trade_type";
  DROP TYPE "public"."enum_vendors_status";
  DROP TYPE "public"."enum_vendor_field_schema_field_type";
  DROP TYPE "public"."enum_rate_items_category";
  DROP TYPE "public"."enum_notices_target_role";
  DROP TYPE "public"."enum_portfolio_projects_category";
  DROP TYPE "public"."enum_architect_resources_type";
  DROP TYPE "public"."enum_site_settings_offices_city";`)
}
