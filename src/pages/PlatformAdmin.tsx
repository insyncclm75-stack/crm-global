import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LoadingState } from "@/components/common/LoadingState";
import { useNotification } from "@/hooks/useNotification";
import { Building2, Users, Activity, Eye, PhoneCall, Mail, UserCheck, AlertTriangle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Organization {
  id: string;
  name: string;
  slug: string;
  created_at: string;
  settings: any;
  usage_limits: any;
  primary_color: string;
  userCount?: number;
  contactCount?: number;
  is_active?: boolean;
  usersActive1Day?: number;
  usersActive7Days?: number;
  usersActive30Days?: number;
  callVolume?: number;
  emailVolume?: number;
}

interface ErrorLog {
  id: string;
  org_id: string;
  user_id: string | null;
  error_type: string;
  error_message: string;
  error_details: any;
  page_url: string | null;
  created_at: string;
  organization?: { name: string };
  profile?: { first_name: string; last_name: string };
}

interface OrgStats {
  totalOrgs: number;
  activeOrgs: number;
  totalUsers: number;
  totalContacts: number;
  usersLast1Day: number;
  usersLast7Days: number;
  usersLast30Days: number;
  callVolume: number;
  emailVolume: number;
}

export default function PlatformAdmin() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [stats, setStats] = useState<OrgStats>({
    totalOrgs: 0,
    activeOrgs: 0,
    totalUsers: 0,
    totalContacts: 0,
    usersLast1Day: 0,
    usersLast7Days: 0,
    usersLast30Days: 0,
    callVolume: 0,
    emailVolume: 0,
  });
  const [loading, setLoading] = useState(true);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [orgDetails, setOrgDetails] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [errorLogs, setErrorLogs] = useState<ErrorLog[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 20;
  const [showErrorLogs, setShowErrorLogs] = useState(false);
  const notify = useNotification();
  const navigate = useNavigate();

  useEffect(() => {
    checkPlatformAdmin();
    fetchErrorLogs();
  }, []);

  const checkPlatformAdmin = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/login");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("is_platform_admin")
        .eq("id", user.id)
        .single();

      if (!profile?.is_platform_admin) {
        notify.error("Access Denied", "You don't have platform admin privileges");
        navigate("/dashboard");
        return;
      }

      fetchOrganizations();
    } catch (error: any) {
      notify.error("Error", error);
    }
  };

  const fetchOrganizations = async () => {
    try {
      setLoading(true);

      const [
        { data: orgs, error: orgsError },
        { data: platformStats }
      ] = await Promise.all([
        supabase.from("organizations").select("*").order("created_at", { ascending: false }),
        supabase.rpc("get_platform_admin_stats")
      ]);

      if (orgsError) throw orgsError;

      const orgsWithStats = await Promise.all(
        (orgs || []).map(async (org) => {
          const { data: orgStats } = await supabase.rpc("get_org_statistics", {
            p_org_id: org.id
          });

          return {
            ...org,
            is_active: (org.settings as any)?.is_active !== false,
            userCount: (orgStats as any)?.user_count || 0,
            contactCount: (orgStats as any)?.contact_count || 0,
            usersActive1Day: (orgStats as any)?.active_users_1d || 0,
            usersActive7Days: (orgStats as any)?.active_users_7d || 0,
            usersActive30Days: (orgStats as any)?.active_users_30d || 0,
            callVolume: (orgStats as any)?.call_volume || 0,
            emailVolume: (orgStats as any)?.email_volume || 0,
          };
        })
      );

      setOrganizations(orgsWithStats);

      if (platformStats) {
        setStats({
          totalOrgs: (platformStats as any).total_organizations || 0,
          activeOrgs: orgs?.filter(o => (o.settings as any)?.is_active !== false).length || 0,
          totalUsers: (platformStats as any).total_users || 0,
          totalContacts: (platformStats as any).total_contacts || 0,
          usersLast1Day: (platformStats as any).active_users_1d || 0,
          usersLast7Days: (platformStats as any).active_users_7d || 0,
          usersLast30Days: (platformStats as any).active_users_30d || 0,
          callVolume: (platformStats as any).call_volume || 0,
          emailVolume: (platformStats as any).email_volume || 0,
        });
      }
    } catch (error: any) {
      notify.error("Error loading organizations", error);
    } finally{
      setLoading(false);
    }
  };

  const viewOrgDetails = async (org: Organization) => {
    try {
      setSelectedOrg(org);

      const { data: users } = await supabase
        .from("user_roles")
        .select(`
          id,
          role,
          created_at,
          profiles:user_id (
            first_name,
            last_name,
            phone
          )
        `)
        .eq("org_id", org.id);

      const { data: contacts } = await supabase
        .from("contacts")
        .select("id, created_at")
        .eq("org_id", org.id)
        .order("created_at", { ascending: false })
        .limit(5);

      setOrgDetails({ users, contacts });
      setIsDetailsOpen(true);
    } catch (error: any) {
      notify.error("Error", error);
    }
  };

  const fetchErrorLogs = async (page: number = 1) => {
    try {
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      const { count } = await supabase
        .from("error_logs")
        .select("*", { count: "exact", head: true });

      const { data, error } = await supabase
        .from("error_logs")
        .select(`
          *,
          organizations!error_logs_org_id_fkey(name),
          profiles!error_logs_user_id_fkey(first_name, last_name)
        `)
        .order("created_at", { ascending: false })
        .range(from, to);

      if (error) throw error;

      const formattedLogs = data?.map(log => ({
        ...log,
        organization: log.organizations,
        profile: log.profiles
      })) as ErrorLog[];

      setErrorLogs(formattedLogs || []);
      setTotalPages(Math.ceil((count || 0) / pageSize));
      setCurrentPage(page);
      setShowErrorLogs(true);
    } catch (error: any) {
      notify.error("Error loading logs", error);
    }
  };

  const getErrorTypeBadgeVariant = (type: string) => {
    switch (type.toLowerCase()) {
      case "critical":
      case "fatal":
        return "destructive";
      case "warning":
        return "default";
      default:
        return "secondary";
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <LoadingState message="Loading platform data..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Platform Monitoring</h1>
          <p className="text-muted-foreground">Monitor all organizations on the In-Sync platform</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="error-logs">Error Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Organizations</CardTitle>
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalOrgs}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.activeOrgs} active
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalUsers}</div>
                  <p className="text-xs text-muted-foreground">
                    Across all organizations
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Call Volume</CardTitle>
                  <PhoneCall className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.callVolume}</div>
                  <p className="text-xs text-muted-foreground">
                    Total calls logged
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Email Volume</CardTitle>
                  <Mail className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.emailVolume}</div>
                  <p className="text-xs text-muted-foreground">
                    Total emails sent
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* User Activity Stats */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Last 24 Hours</CardTitle>
                  <UserCheck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.usersLast1Day}</div>
                  <p className="text-xs text-muted-foreground">
                    Users active today
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Last 7 Days</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.usersLast7Days}</div>
                  <p className="text-xs text-muted-foreground">
                    Users this week
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Last 30 Days</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.usersLast30Days}</div>
                  <p className="text-xs text-muted-foreground">
                    Users this month
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Organizations Table - Read Only */}
            <Card>
              <CardHeader>
                <CardTitle>All Organizations</CardTitle>
                <CardDescription>Platform-wide organization monitoring</CardDescription>
              </CardHeader>
              <CardContent>
                <Table stickyHeader stickyFirstColumn>
                  <TableHeader sticky>
                    <TableRow>
                      <TableHead className="min-w-[180px]">Organization</TableHead>
                      <TableHead>Slug</TableHead>
                      <TableHead>Users</TableHead>
                      <TableHead>Contacts</TableHead>
                      <TableHead className="text-center">Active 1d</TableHead>
                      <TableHead className="text-center">Active 7d</TableHead>
                      <TableHead className="text-center">Active 30d</TableHead>
                      <TableHead className="text-center">Calls</TableHead>
                      <TableHead className="text-center">Emails</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {organizations.map((org) => (
                      <TableRow key={org.id}>
                        <TableCell className="font-medium min-w-[180px]">{org.name}</TableCell>
                        <TableCell className="font-mono text-sm">{org.slug}</TableCell>
                        <TableCell>{org.userCount}</TableCell>
                        <TableCell>{org.contactCount}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline">{org.usersActive1Day}</Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline">{org.usersActive7Days}</Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline">{org.usersActive30Days}</Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="secondary">{org.callVolume}</Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="secondary">{org.emailVolume}</Badge>
                        </TableCell>
                        <TableCell>
                          {org.is_active ? (
                            <Badge className="bg-green-500">Active</Badge>
                          ) : (
                            <Badge variant="destructive">Disabled</Badge>
                          )}
                        </TableCell>
                        <TableCell>{new Date(org.created_at).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => viewOrgDetails(org)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="error-logs" className="space-y-4">
            {/* Error Logs Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Error Logs</CardTitle>
                    <CardDescription>System-wide error tracking across all organizations</CardDescription>
                  </div>
                  <Button onClick={() => fetchErrorLogs(1)} variant="outline">
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    {showErrorLogs ? "Refresh Logs" : "Load Error Logs"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {showErrorLogs && (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Timestamp</TableHead>
                        <TableHead>Organization</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Error Message</TableHead>
                        <TableHead>Page</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {errorLogs.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center text-muted-foreground">
                            No error logs found
                          </TableCell>
                        </TableRow>
                      ) : (
                        errorLogs.map((log) => (
                          <TableRow key={log.id}>
                            <TableCell className="font-mono text-xs">
                              {new Date(log.created_at).toLocaleString()}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {log.organization?.name || "Unknown"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {log.profile
                                ? `${log.profile.first_name} ${log.profile.last_name}`
                                : "Anonymous"}
                            </TableCell>
                            <TableCell>
                              <Badge variant={getErrorTypeBadgeVariant(log.error_type)}>
                                {log.error_type}
                              </Badge>
                            </TableCell>
                            <TableCell className="max-w-md truncate">
                              {log.error_message}
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground max-w-xs">
                              {log.page_url ? (
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <span className="truncate block cursor-help">
                                        {new URL(log.page_url).pathname}
                                      </span>
                                    </TooltipTrigger>
                                    <TooltipContent className="max-w-md break-all">
                                      {log.page_url}
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              ) : "-"}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                )}

                {totalPages > 1 && (
                  <div className="mt-4 flex justify-center">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={(e) => {
                              e.preventDefault();
                              if (currentPage > 1) fetchErrorLogs(currentPage - 1);
                            }}
                            className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                          />
                        </PaginationItem>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <PaginationItem key={page}>
                            <PaginationLink
                              onClick={(e) => {
                                e.preventDefault();
                                fetchErrorLogs(page);
                              }}
                              isActive={currentPage === page}
                              className="cursor-pointer"
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        ))}

                        <PaginationItem>
                          <PaginationNext
                            onClick={(e) => {
                              e.preventDefault();
                              if (currentPage < totalPages) fetchErrorLogs(currentPage + 1);
                            }}
                            className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Organization Details Dialog */}
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>{selectedOrg?.name} - Details</DialogTitle>
            </DialogHeader>
            {orgDetails && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Organization Info</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Slug:</span>{" "}
                      <span className="font-mono">{selectedOrg?.slug}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Created:</span>{" "}
                      {new Date(selectedOrg?.created_at || "").toLocaleDateString()}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Total Users:</span>{" "}
                      {orgDetails.users?.length || 0}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Total Contacts:</span>{" "}
                      {selectedOrg?.contactCount || 0}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Users</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Joined</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orgDetails.users?.map((user: any) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            {user.profiles?.first_name} {user.profiles?.last_name}
                          </TableCell>
                          <TableCell>
                            <Badge>{user.role.replace("_", " ")}</Badge>
                          </TableCell>
                          <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
