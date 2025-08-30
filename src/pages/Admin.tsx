import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { NavBar } from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, XCircle, Clock, Shield, UserCheck, AlertTriangle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

export default function Admin() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [isAdmin, setIsAdmin] = useState(false);
  const [pendingPosts, setPendingPosts] = useState<any[]>([]);
  const [allPosts, setAllPosts] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate("/login");
  }, [user, loading, navigate]);

  // Check admin status
  useEffect(() => {
    async function checkAdmin() {
      if (!user) return;
      const { data } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("user_id", user.id)
        .single();
      if (data?.is_admin) {
        setIsAdmin(true);
      } else {
        navigate("/profile");
      }
    }
    checkAdmin();
  }, [user, navigate]);

  const fetchPendingPosts = async () => {
    setLoadingPosts(true);
    const { data, error } = await supabase
      .from("posts")
      .select("id,title,content,status,created_at,user_id,profiles(display_name,username)")
      .eq("status", "pending")
      .order("created_at", { ascending: false });
    if (error) {
      toast({ title: "Failed to load pending posts", description: error.message, variant: "destructive" });
    } else {
      setPendingPosts(data || []);
    }
    setLoadingPosts(false);
  };

  const fetchAllPosts = async () => {
    setLoadingPosts(true);
    const { data, error } = await supabase
      .from("posts")
      .select("id,title,status,created_at,user_id,view_count,profiles(display_name,username,is_restricted)")
      .order("created_at", { ascending: false });
    if (error) {
      toast({ title: "Failed to load posts", description: error.message, variant: "destructive" });
    } else {
      setAllPosts(data || []);
    }
    setLoadingPosts(false);
  };

  const fetchUsers = async () => {
    setLoadingUsers(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("user_id,username,display_name,is_admin,is_restricted,created_at")
      .order("created_at", { ascending: false });
    if (error) {
      toast({ title: "Failed to load users", description: error.message, variant: "destructive" });
    } else {
      setUsers(data || []);
    }
    setLoadingUsers(false);
  };

  useEffect(() => {
    if (isAdmin) {
      fetchPendingPosts();
      fetchAllPosts();
      fetchUsers();
    }
  }, [isAdmin]);

  const approvePost = async (postId: string) => {
    const { error } = await supabase
      .from("posts")
      .update({
        status: "approved",
        approved_by: user?.id,
        approved_at: new Date().toISOString(),
      })
      .eq("id", postId);
    if (error) {
      toast({ title: "Failed to approve", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Post approved!" });
      fetchPendingPosts();
      fetchAllPosts();
    }
  };

  const rejectPost = async (postId: string) => {
    const { error } = await supabase.from("posts").update({ status: "rejected" }).eq("id", postId);
    if (error) {
      toast({ title: "Failed to reject", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Post rejected" });
      fetchPendingPosts();
      fetchAllPosts();
    }
  };

  const hidePost = async (postId: string) => {
    const { error } = await supabase.from("posts").update({ status: "hidden" }).eq("id", postId);
    if (error) {
      toast({ title: "Failed to hide", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Post hidden" });
      fetchAllPosts();
    }
  };

  const toggleUserRestriction = async (userId: string, currentRestricted: boolean) => {
    const { error } = await supabase
      .from("profiles")
      .update({ is_restricted: !currentRestricted })
      .eq("user_id", userId);
    if (error) {
      toast({ title: "Failed to update user", description: error.message, variant: "destructive" });
    } else {
      toast({ title: currentRestricted ? "User unrestricted" : "User restricted" });
      fetchUsers();
    }
  };

  const pendingCount = pendingPosts.length;
  const restrictedUsers = useMemo(() => users.filter(u => u.is_restricted).length, [users]);

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-content-bg">
        <NavBar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h1 className="text-2xl font-bold">Access Denied</h1>
            <p className="text-muted-foreground">You need admin privileges to access this page.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-content-bg">
      <NavBar />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h1 className="text-3xl font-bold text-foreground flex items-center">
            <Shield className="h-8 w-8 mr-2 text-primary" />
            Admin Dashboard
          </h1>
          <div className="text-sm text-muted-foreground">
            {pendingCount > 0 && (
              <span className="inline-flex items-center">
                <Clock className="h-4 w-4 mr-1" /> {pendingCount} pending review
              </span>
            )}
          </div>
        </div>

        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pending">Pending ({pendingCount})</TabsTrigger>
            <TabsTrigger value="posts">All Posts</TabsTrigger>
            <TabsTrigger value="users">Users ({restrictedUsers})</TabsTrigger>
          </TabsList>

          {/* Pending Posts */}
          <TabsContent value="pending" className="space-y-4">
            <h2 className="text-2xl font-semibold">Posts Pending Review</h2>
            {loadingPosts ? (
              <p className="text-muted-foreground">Loading...</p>
            ) : pendingPosts.length === 0 ? (
              <Card className="blog-card">
                <CardContent className="py-8 text-center">
                  <CheckCircle2 className="h-12 w-12 mx-auto text-success mb-4" />
                  <h3 className="text-lg font-medium">All caught up!</h3>
                  <p className="text-muted-foreground">No posts pending review at the moment.</p>
                </CardContent>
              </Card>
            ) : (
              pendingPosts.map((post) => (
                <Card key={post.id} className="blog-card">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="pr-4 flex-1">
                        <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          By {post.profiles?.display_name || post.profiles?.username || "Unknown"} •{" "}
                          {new Date(post.created_at).toLocaleDateString()}
                        </p>
                        <p className="text-muted-foreground mb-4 line-clamp-3">{post.content.slice(0, 200)}...</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => approvePost(post.id)}
                          className="text-success border-success hover:bg-success hover:text-white"
                        >
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Approve
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => rejectPost(post.id)}
                          className="text-destructive border-destructive hover:bg-destructive hover:text-white"
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* All Posts */}
          <TabsContent value="posts" className="space-y-4">
            <h2 className="text-2xl font-semibold">All Posts</h2>
            {loadingPosts ? (
              <p className="text-muted-foreground">Loading...</p>
            ) : (
              <div className="space-y-4">
                {allPosts.map((post) => (
                  <Card key={post.id} className="blog-card">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold mb-1">{post.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            By {post.profiles?.display_name || post.profiles?.username || "Unknown"} •{" "}
                            {new Date(post.created_at).toLocaleDateString()} • {post.view_count || 0} views
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              post.status === "approved"
                                ? "default"
                                : post.status === "pending"
                                ? "secondary"
                                : "outline"
                            }
                          >
                            {post.status}
                          </Badge>
                          {post.profiles?.is_restricted && (
                            <Badge variant="destructive">User Restricted</Badge>
                          )}
                          {post.status === "approved" && (
                            <Button variant="ghost" size="sm" onClick={() => hidePost(post.id)}>
                              Hide
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Users */}
          <TabsContent value="users" className="space-y-4">
            <h2 className="text-2xl font-semibold">User Management</h2>
            {loadingUsers ? (
              <p className="text-muted-foreground">Loading...</p>
            ) : (
              <div className="space-y-4">
                {users.map((profile) => (
                  <Card key={profile.user_id} className="blog-card">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold mb-1">
                            {profile.display_name || profile.username || "Unknown User"}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Joined {new Date(profile.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {profile.is_admin && (
                            <Badge variant="default">
                              <UserCheck className="h-3 w-3 mr-1" />
                              Admin
                            </Badge>
                          )}
                          {profile.is_restricted ? (
                            <Badge variant="destructive">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Restricted
                            </Badge>
                          ) : (
                            <Badge variant="outline">Active</Badge>
                          )}
                          {!profile.is_admin && (
                            <Button
                              variant={profile.is_restricted ? "outline" : "destructive"}
                              size="sm"
                              onClick={() => toggleUserRestriction(profile.user_id, profile.is_restricted)}
                            >
                              {profile.is_restricted ? "Unrestrict" : "Restrict"}
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}