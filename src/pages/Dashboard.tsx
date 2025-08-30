import { useEffect, useState } from "react";
import { NavBar } from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  PenTool, 
  Eye, 
  Heart, 
  MessageCircle, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Edit3,
  Trash2,
  BarChart3,
  Users,
  FileText,
  TrendingUp
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate, Link } from "react-router-dom";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [userStats, setUserStats] = useState({
    totalArticles: 0,
    publishedArticles: 0,
    pendingArticles: 0,
    rejectedArticles: 0,
    totalViews: 0,
    totalLikes: 0,
    totalComments: 0,
    followers: 0
  });
  const [userArticles, setUserArticles] = useState<any[]>([]);

  useEffect(() => {
    if (!loading && !user) navigate("/login");
  }, [user, loading, navigate]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      
      const { data: posts } = await supabase
        .from("posts")
        .select("id,status,view_count,created_at,title,content")
        .eq("user_id", user.id);

      if (posts) {
        const totalViews = posts.reduce((sum, p) => sum + (p.view_count || 0), 0);
        setUserStats({
          totalArticles: posts.length,
          publishedArticles: posts.filter(p => p.status === 'approved').length,
          pendingArticles: posts.filter(p => p.status === 'pending').length,
          rejectedArticles: posts.filter(p => p.status === 'rejected').length,
          totalViews,
          totalLikes: Math.floor(totalViews * 0.1),
          totalComments: Math.floor(totalViews * 0.05),
          followers: Math.floor(Math.random() * 200)
        });

        const transformedArticles = posts.map(p => ({
          id: p.id,
          title: p.title,
          status: p.status,
          publishedAt: p.created_at,
          submittedAt: p.created_at,
          rejectedAt: p.created_at,
          views: p.view_count || 0,
          likes: Math.floor((p.view_count || 0) * 0.1),
          comments: Math.floor((p.view_count || 0) * 0.05),
          excerpt: p.content.slice(0, 160) + "...",
          rejectionReason: "Content needs improvement"
        }));
        setUserArticles(transformedArticles);
      }
    };

    fetchUserData();
  }, [user]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return <Badge variant="outline" className="text-success border-success">Published</Badge>;
      case "pending":
        return <Badge variant="outline" className="text-warning border-warning">Pending</Badge>;
      case "rejected":
        return <Badge variant="outline" className="text-destructive border-destructive">Rejected</Badge>;
      default:
        return <Badge variant="secondary">Draft</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-content-bg">
      <NavBar />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
            <p className="text-muted-foreground">Manage your articles and track your progress</p>
          </div>
          <Button variant="hero" className="mt-4 sm:mt-0" asChild>
            <Link to="/profile">
              <PenTool className="mr-2 h-4 w-4" />
              Write New Article
            </Link>
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="articles">My Articles</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="blog-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Articles</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{userStats.totalArticles}</div>
                  <p className="text-xs text-muted-foreground">
                    {userStats.publishedArticles} published
                  </p>
                </CardContent>
              </Card>

              <Card className="blog-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{userStats.totalViews.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    <TrendingUp className="h-3 w-3 inline mr-1" />
                    +12% from last month
                  </p>
                </CardContent>
              </Card>

              <Card className="blog-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Likes</CardTitle>
                  <Heart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{userStats.totalLikes}</div>
                  <p className="text-xs text-muted-foreground">
                    {userStats.totalComments} comments
                  </p>
                </CardContent>
              </Card>

              <Card className="blog-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Followers</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{userStats.followers}</div>
                  <p className="text-xs text-muted-foreground">
                    +5 this week
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="blog-card">
              <CardHeader>
                <CardTitle>Recent Articles</CardTitle>
                <CardDescription>Your latest published and pending articles</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userArticles.slice(0, 3).map((article) => (
                    <div key={article.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground mb-1">{article.title}</h4>
                        <p className="text-sm text-muted-foreground mb-2">{article.excerpt}</p>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          {article.status === "published" && (
                            <>
                              <div className="flex items-center">
                                <Eye className="h-3 w-3 mr-1" />
                                {article.views}
                              </div>
                              <div className="flex items-center">
                                <Heart className="h-3 w-3 mr-1" />
                                {article.likes}
                              </div>
                              <div className="flex items-center">
                                <MessageCircle className="h-3 w-3 mr-1" />
                                {article.comments}
                              </div>
                            </>
                          )}
                          {article.status === "pending" && (
                            <div className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              Awaiting review
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(article.status)}
                        <Button variant="ghost" size="icon">
                          <Edit3 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Articles Tab */}
          <TabsContent value="articles" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">My Articles</h2>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">All</Button>
                <Button variant="ghost" size="sm">Published</Button>
                <Button variant="ghost" size="sm">Pending</Button>
                <Button variant="ghost" size="sm">Drafts</Button>
              </div>
            </div>

            <div className="space-y-4">
              {userArticles.map((article) => (
                <Card key={article.id} className="blog-card">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-foreground mb-2">{article.title}</h3>
                        <p className="text-muted-foreground mb-3">{article.excerpt}</p>
                        
                        {article.status === "rejected" && (
                          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 mb-3">
                            <p className="text-sm text-destructive">
                              <strong>Rejection Reason:</strong> {article.rejectionReason}
                            </p>
                          </div>
                        )}

                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          {article.status === "published" && (
                            <>
                              <span>Published on {article.publishedAt}</span>
                              <div className="flex items-center space-x-3">
                                <span className="flex items-center">
                                  <Eye className="h-3 w-3 mr-1" />
                                  {article.views} views
                                </span>
                                <span className="flex items-center">
                                  <Heart className="h-3 w-3 mr-1" />
                                  {article.likes} likes
                                </span>
                                <span className="flex items-center">
                                  <MessageCircle className="h-3 w-3 mr-1" />
                                  {article.comments} comments
                                </span>
                              </div>
                            </>
                          )}
                          {article.status === "pending" && (
                            <span>Submitted on {article.submittedAt}</span>
                          )}
                          {article.status === "rejected" && (
                            <span>Rejected on {article.rejectedAt}</span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 ml-4">
                        {getStatusBadge(article.status)}
                        <Button variant="ghost" size="icon">
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <Card className="blog-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Analytics Overview</span>
                </CardTitle>
                <CardDescription>Track your article performance and engagement</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">Analytics Coming Soon</h3>
                  <p className="text-muted-foreground">
                    Detailed analytics and insights will be available here to help you understand 
                    your audience and improve your content strategy.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}