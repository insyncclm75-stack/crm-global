import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { AuthProvider } from "@/contexts/AuthProvider";
import { OrgContextProvider } from "@/contexts/OrgContextProvider";

// Static imports - public/auth pages only
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ResetPassword from "./pages/ResetPassword";
import PublicForm from "./pages/PublicForm";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import LandingPage from "./pages/LandingPage";
import Install from "./pages/Install";

// Page loader component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

// Lazy loaded pages - CRM
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Contacts = lazy(() => import("./pages/Contacts"));
const ContactDetail = lazy(() => import("./pages/ContactDetail"));
const PipelineBoard = lazy(() => import("./pages/PipelineBoard"));
const PipelineAdvancedSearch = lazy(() => import("./pages/PipelineAdvancedSearch"));
const ClientHub = lazy(() => import("./pages/ClientHub"));
const ClientDetail = lazy(() => import("./pages/ClientDetail"));

// Lazy loaded pages - Reports & Analytics
const Reports = lazy(() => import("./pages/Reports"));
const ReportBuilder = lazy(() => import("./pages/ReportBuilder"));
const SavedReports = lazy(() => import("./pages/SavedReports"));
const CallingDashboard = lazy(() => import("./pages/CallingDashboard"));
const CallLogs = lazy(() => import("./pages/CallLogs"));

// Lazy loaded pages - Templates (campaigns are external: wa.in-sync.co.in / email.in-sync.co.in)
const Templates = lazy(() => import("./pages/Templates"));
const TemplateBuilder = lazy(() => import("./pages/TemplateBuilder"));

// Lazy loaded pages - Admin
const TechAdmin = lazy(() => import("./pages/TechAdmin"));
const Users = lazy(() => import("./pages/Users"));
const Teams = lazy(() => import("./pages/Teams"));
const PipelineStages = lazy(() => import("./pages/PipelineStages"));
const CallDispositions = lazy(() => import("./pages/CallDispositions"));
const ApprovalMatrix = lazy(() => import("./pages/ApprovalMatrix"));
const Designations = lazy(() => import("./pages/Designations"));
const CustomFields = lazy(() => import("./pages/CustomFields"));
const Forms = lazy(() => import("./pages/Forms"));
const Connectors = lazy(() => import("./pages/Connectors"));
const OutboundWebhooks = lazy(() => import("./pages/OutboundWebhooks"));
const CommunicationSettings = lazy(() => import("./pages/CommunicationSettings"));
const WhatsAppSettings = lazy(() => import("./pages/WhatsAppSettings"));
const ExotelSettings = lazy(() => import("./pages/ExotelSettings"));
const ApolloSettings = lazy(() => import("./pages/ApolloSettings"));
const EmailSettings = lazy(() => import("./pages/EmailSettings"));

// Lazy loaded pages - Walkthroughs & Onboarding
const Demo = lazy(() => import("./pages/Demo"));
const LandingDemo = lazy(() => import("./pages/LandingDemo"));
const OnboardingWizard = lazy(() => import("./pages/OnboardingWizard"));

// Lazy loaded pages - Other
const DataExport = lazy(() => import("./pages/admin/DataExport"));
const PlatformAdmin = lazy(() => import("./pages/PlatformAdmin"));
const Calendar = lazy(() => import("./pages/Calendar"));
const Chat = lazy(() => import("./pages/Chat"));

const App = () => (
  <AuthProvider>
    <OrgContextProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/install" element={<Install />} />
          <Route path="/demo" element={<Demo />} />
          <Route path="/landing-demo" element={<LandingDemo />} />
          <Route path="/form/:formId" element={<PublicForm />} />

          {/* Onboarding */}
          <Route path="/onboarding" element={
            <ProtectedRoute>
              <OnboardingWizard />
            </ProtectedRoute>
          } />
          {/* CRM Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/contacts" element={
            <ProtectedRoute>
              <Contacts />
            </ProtectedRoute>
          } />
          
          <Route path="/contacts/:id" element={
            <ProtectedRoute>
              <ContactDetail />
            </ProtectedRoute>
          } />
          
          <Route path="/pipeline" element={
            <ProtectedRoute>
              <PipelineBoard />
            </ProtectedRoute>
          } />
          
          <Route path="/pipeline/advanced-search" element={
            <ProtectedRoute>
              <PipelineAdvancedSearch />
            </ProtectedRoute>
          } />
          
          <Route path="/clients" element={
            <ProtectedRoute>
              <ClientHub />
            </ProtectedRoute>
          } />
          
          <Route path="/clients/:id" element={
            <ProtectedRoute>
              <ClientDetail />
            </ProtectedRoute>
          } />
          
          {/* Reports & Analytics Routes */}
          <Route path="/reports" element={
            <ProtectedRoute>
              <Reports />
            </ProtectedRoute>
          } />
          
          <Route path="/reports/builder" element={
            <ProtectedRoute>
              <ReportBuilder />
            </ProtectedRoute>
          } />
          
          <Route path="/reports/saved" element={
            <ProtectedRoute>
              <SavedReports />
            </ProtectedRoute>
          } />
          
          <Route path="/calling-dashboard" element={
            <ProtectedRoute>
              <CallingDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/call-logs" element={
            <ProtectedRoute>
              <CallLogs />
            </ProtectedRoute>
          } />
          
          {/* Campaign Routes */}
          <Route path="/templates" element={
            <ProtectedRoute>
              <Templates />
            </ProtectedRoute>
          } />
          
          <Route path="/templates/create" element={
            <ProtectedRoute>
              <TemplateBuilder />
            </ProtectedRoute>
          } />
          
          {/* Campaigns are external: wa.in-sync.co.in / email.in-sync.co.in */}
          
          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute requiredRole="admin">
              <TechAdmin />
            </ProtectedRoute>
          } />
          
          <Route path="/users" element={
            <ProtectedRoute requiredRole="admin">
              <Users />
            </ProtectedRoute>
          } />
          
          <Route path="/teams" element={
            <ProtectedRoute requiredRole="admin">
              <Teams />
            </ProtectedRoute>
          } />
          
          <Route path="/admin/pipeline-stages" element={
            <ProtectedRoute requiredRole="admin">
              <PipelineStages />
            </ProtectedRoute>
          } />
          
          <Route path="/admin/call-dispositions" element={
            <ProtectedRoute requiredRole="admin">
              <CallDispositions />
            </ProtectedRoute>
          } />
          
          <Route path="/admin/approval-matrix" element={
            <ProtectedRoute requiredRole="admin">
              <ApprovalMatrix />
            </ProtectedRoute>
          } />
          
          <Route path="/admin/designations" element={
            <ProtectedRoute requiredRole="admin">
              <Designations />
            </ProtectedRoute>
          } />
          
          <Route path="/admin/custom-fields" element={
            <ProtectedRoute requiredRole="admin">
              <CustomFields />
            </ProtectedRoute>
          } />
          
          <Route path="/admin/forms" element={
            <ProtectedRoute requiredRole="admin">
              <Forms />
            </ProtectedRoute>
          } />
          
          <Route path="/admin/connectors" element={
            <ProtectedRoute requiredRole="admin">
              <Connectors />
            </ProtectedRoute>
          } />
          
          <Route path="/admin/outbound-webhooks" element={
            <ProtectedRoute requiredRole="admin">
              <OutboundWebhooks />
            </ProtectedRoute>
          } />
          
          <Route path="/admin/communication-settings" element={
            <ProtectedRoute requiredRole="admin">
              <CommunicationSettings />
            </ProtectedRoute>
          } />
          
          <Route path="/whatsapp-settings" element={
            <ProtectedRoute requiredRole="admin">
              <WhatsAppSettings />
            </ProtectedRoute>
          } />
          
          <Route path="/exotel-settings" element={
            <ProtectedRoute requiredRole="admin">
              <ExotelSettings />
            </ProtectedRoute>
          } />
          
          <Route path="/apollo-settings" element={
            <ProtectedRoute requiredRole="admin">
              <ApolloSettings />
            </ProtectedRoute>
          } />
          
          {/* Other Routes */}
          <Route path="/platform-admin" element={
            <ProtectedRoute>
              <PlatformAdmin />
            </ProtectedRoute>
          } />
          
          <Route path="/admin/data-export" element={
            <ProtectedRoute>
              <DataExport />
            </ProtectedRoute>
          } />
          
          <Route path="/calendar" element={
            <ProtectedRoute>
              <Calendar />
            </ProtectedRoute>
          } />
          
           <Route path="/chat" element={
             <ProtectedRoute>
               <Chat />
             </ProtectedRoute>
           } />
           
           <Route path="/chat/:conversationId" element={
             <ProtectedRoute>
               <Chat />
             </ProtectedRoute>
           } />
           
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </OrgContextProvider>
</AuthProvider>
);

export default App;
