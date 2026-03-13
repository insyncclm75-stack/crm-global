-- Add webhook triggers for all tables that are available in the webhook creation UI
-- Previously only support_tickets and related tables had triggers

-- contacts
DROP TRIGGER IF EXISTS webhook_contacts_insert ON public.contacts;
CREATE TRIGGER webhook_contacts_insert
  AFTER INSERT ON public.contacts
  FOR EACH ROW EXECUTE FUNCTION trigger_outbound_webhook_generic();

DROP TRIGGER IF EXISTS webhook_contacts_update ON public.contacts;
CREATE TRIGGER webhook_contacts_update
  AFTER UPDATE ON public.contacts
  FOR EACH ROW EXECUTE FUNCTION trigger_outbound_webhook_generic();

DROP TRIGGER IF EXISTS webhook_contacts_delete ON public.contacts;
CREATE TRIGGER webhook_contacts_delete
  AFTER DELETE ON public.contacts
  FOR EACH ROW EXECUTE FUNCTION trigger_outbound_webhook_generic();

-- contact_activities
DROP TRIGGER IF EXISTS webhook_contact_activities_insert ON public.contact_activities;
CREATE TRIGGER webhook_contact_activities_insert
  AFTER INSERT ON public.contact_activities
  FOR EACH ROW EXECUTE FUNCTION trigger_outbound_webhook_generic();

DROP TRIGGER IF EXISTS webhook_contact_activities_update ON public.contact_activities;
CREATE TRIGGER webhook_contact_activities_update
  AFTER UPDATE ON public.contact_activities
  FOR EACH ROW EXECUTE FUNCTION trigger_outbound_webhook_generic();

DROP TRIGGER IF EXISTS webhook_contact_activities_delete ON public.contact_activities;
CREATE TRIGGER webhook_contact_activities_delete
  AFTER DELETE ON public.contact_activities
  FOR EACH ROW EXECUTE FUNCTION trigger_outbound_webhook_generic();

-- email_bulk_campaigns
DROP TRIGGER IF EXISTS webhook_email_bulk_campaigns_insert ON public.email_bulk_campaigns;
CREATE TRIGGER webhook_email_bulk_campaigns_insert
  AFTER INSERT ON public.email_bulk_campaigns
  FOR EACH ROW EXECUTE FUNCTION trigger_outbound_webhook_generic();

DROP TRIGGER IF EXISTS webhook_email_bulk_campaigns_update ON public.email_bulk_campaigns;
CREATE TRIGGER webhook_email_bulk_campaigns_update
  AFTER UPDATE ON public.email_bulk_campaigns
  FOR EACH ROW EXECUTE FUNCTION trigger_outbound_webhook_generic();

DROP TRIGGER IF EXISTS webhook_email_bulk_campaigns_delete ON public.email_bulk_campaigns;
CREATE TRIGGER webhook_email_bulk_campaigns_delete
  AFTER DELETE ON public.email_bulk_campaigns
  FOR EACH ROW EXECUTE FUNCTION trigger_outbound_webhook_generic();

-- blog_posts
DROP TRIGGER IF EXISTS webhook_blog_posts_insert ON public.blog_posts;
CREATE TRIGGER webhook_blog_posts_insert
  AFTER INSERT ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION trigger_outbound_webhook_generic();

DROP TRIGGER IF EXISTS webhook_blog_posts_update ON public.blog_posts;
CREATE TRIGGER webhook_blog_posts_update
  AFTER UPDATE ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION trigger_outbound_webhook_generic();

DROP TRIGGER IF EXISTS webhook_blog_posts_delete ON public.blog_posts;
CREATE TRIGGER webhook_blog_posts_delete
  AFTER DELETE ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION trigger_outbound_webhook_generic();

-- whatsapp_bulk_campaigns
DROP TRIGGER IF EXISTS webhook_whatsapp_bulk_campaigns_insert ON public.whatsapp_bulk_campaigns;
CREATE TRIGGER webhook_whatsapp_bulk_campaigns_insert
  AFTER INSERT ON public.whatsapp_bulk_campaigns
  FOR EACH ROW EXECUTE FUNCTION trigger_outbound_webhook_generic();

DROP TRIGGER IF EXISTS webhook_whatsapp_bulk_campaigns_update ON public.whatsapp_bulk_campaigns;
CREATE TRIGGER webhook_whatsapp_bulk_campaigns_update
  AFTER UPDATE ON public.whatsapp_bulk_campaigns
  FOR EACH ROW EXECUTE FUNCTION trigger_outbound_webhook_generic();

DROP TRIGGER IF EXISTS webhook_whatsapp_bulk_campaigns_delete ON public.whatsapp_bulk_campaigns;
CREATE TRIGGER webhook_whatsapp_bulk_campaigns_delete
  AFTER DELETE ON public.whatsapp_bulk_campaigns
  FOR EACH ROW EXECUTE FUNCTION trigger_outbound_webhook_generic();

-- call_logs
DROP TRIGGER IF EXISTS webhook_call_logs_insert ON public.call_logs;
CREATE TRIGGER webhook_call_logs_insert
  AFTER INSERT ON public.call_logs
  FOR EACH ROW EXECUTE FUNCTION trigger_outbound_webhook_generic();

DROP TRIGGER IF EXISTS webhook_call_logs_update ON public.call_logs;
CREATE TRIGGER webhook_call_logs_update
  AFTER UPDATE ON public.call_logs
  FOR EACH ROW EXECUTE FUNCTION trigger_outbound_webhook_generic();

DROP TRIGGER IF EXISTS webhook_call_logs_delete ON public.call_logs;
CREATE TRIGGER webhook_call_logs_delete
  AFTER DELETE ON public.call_logs
  FOR EACH ROW EXECUTE FUNCTION trigger_outbound_webhook_generic();

-- email_conversations
DROP TRIGGER IF EXISTS webhook_email_conversations_insert ON public.email_conversations;
CREATE TRIGGER webhook_email_conversations_insert
  AFTER INSERT ON public.email_conversations
  FOR EACH ROW EXECUTE FUNCTION trigger_outbound_webhook_generic();

DROP TRIGGER IF EXISTS webhook_email_conversations_update ON public.email_conversations;
CREATE TRIGGER webhook_email_conversations_update
  AFTER UPDATE ON public.email_conversations
  FOR EACH ROW EXECUTE FUNCTION trigger_outbound_webhook_generic();

DROP TRIGGER IF EXISTS webhook_email_conversations_delete ON public.email_conversations;
CREATE TRIGGER webhook_email_conversations_delete
  AFTER DELETE ON public.email_conversations
  FOR EACH ROW EXECUTE FUNCTION trigger_outbound_webhook_generic();

-- whatsapp_messages
DROP TRIGGER IF EXISTS webhook_whatsapp_messages_insert ON public.whatsapp_messages;
CREATE TRIGGER webhook_whatsapp_messages_insert
  AFTER INSERT ON public.whatsapp_messages
  FOR EACH ROW EXECUTE FUNCTION trigger_outbound_webhook_generic();

DROP TRIGGER IF EXISTS webhook_whatsapp_messages_update ON public.whatsapp_messages;
CREATE TRIGGER webhook_whatsapp_messages_update
  AFTER UPDATE ON public.whatsapp_messages
  FOR EACH ROW EXECUTE FUNCTION trigger_outbound_webhook_generic();

DROP TRIGGER IF EXISTS webhook_whatsapp_messages_delete ON public.whatsapp_messages;
CREATE TRIGGER webhook_whatsapp_messages_delete
  AFTER DELETE ON public.whatsapp_messages
  FOR EACH ROW EXECUTE FUNCTION trigger_outbound_webhook_generic();

-- pipeline_stages
DROP TRIGGER IF EXISTS webhook_pipeline_stages_insert ON public.pipeline_stages;
CREATE TRIGGER webhook_pipeline_stages_insert
  AFTER INSERT ON public.pipeline_stages
  FOR EACH ROW EXECUTE FUNCTION trigger_outbound_webhook_generic();

DROP TRIGGER IF EXISTS webhook_pipeline_stages_update ON public.pipeline_stages;
CREATE TRIGGER webhook_pipeline_stages_update
  AFTER UPDATE ON public.pipeline_stages
  FOR EACH ROW EXECUTE FUNCTION trigger_outbound_webhook_generic();

DROP TRIGGER IF EXISTS webhook_pipeline_stages_delete ON public.pipeline_stages;
CREATE TRIGGER webhook_pipeline_stages_delete
  AFTER DELETE ON public.pipeline_stages
  FOR EACH ROW EXECUTE FUNCTION trigger_outbound_webhook_generic();

-- teams
DROP TRIGGER IF EXISTS webhook_teams_insert ON public.teams;
CREATE TRIGGER webhook_teams_insert
  AFTER INSERT ON public.teams
  FOR EACH ROW EXECUTE FUNCTION trigger_outbound_webhook_generic();

DROP TRIGGER IF EXISTS webhook_teams_update ON public.teams;
CREATE TRIGGER webhook_teams_update
  AFTER UPDATE ON public.teams
  FOR EACH ROW EXECUTE FUNCTION trigger_outbound_webhook_generic();

DROP TRIGGER IF EXISTS webhook_teams_delete ON public.teams;
CREATE TRIGGER webhook_teams_delete
  AFTER DELETE ON public.teams
  FOR EACH ROW EXECUTE FUNCTION trigger_outbound_webhook_generic();

-- profiles
DROP TRIGGER IF EXISTS webhook_profiles_insert ON public.profiles;
CREATE TRIGGER webhook_profiles_insert
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION trigger_outbound_webhook_generic();

DROP TRIGGER IF EXISTS webhook_profiles_update ON public.profiles;
CREATE TRIGGER webhook_profiles_update
  AFTER UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION trigger_outbound_webhook_generic();

DROP TRIGGER IF EXISTS webhook_profiles_delete ON public.profiles;
CREATE TRIGGER webhook_profiles_delete
  AFTER DELETE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION trigger_outbound_webhook_generic();
