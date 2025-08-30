import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { NavBar } from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Edit3, Trash2, Send, CheckCircle2, Clock } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

export default function Profile() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [myPosts, setMyPosts] = useState<any[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate("/login");
  }, [user, loading, navigate]);

  const fetchPosts = async () => {
    if (!user) return;
    setLoadingPosts(true);
    const { data, error } = await supabase
      .from("posts")
      .select("id,title,content,tags,status,created_at,updated_at,view_count")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false });
    if (error) {
      toast({ title: "Failed to load posts", description: error.message, variant: "destructive" });
    } else {
      setMyPosts(data || []);
    }
    setLoadingPosts(false);
  };

  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const resetForm = () => {
    setTitle("");
    setContent("");
    setTags("");
    setEditingId(null);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);
    const tagArray = tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const excerpt = content.slice(0, 160);

    if (editingId) {
      const { error } = await supabase
        .from("posts")
        .update({ title, content, tags: tagArray, excerpt })
        .eq("id", editingId)
        .eq("user_id", user.id);
      if (error) {
        toast({ title: "Update failed", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Post updated" });
        resetForm();
        fetchPosts();
      }
    } else {
      const { error } = await supabase.from("posts").insert({
        user_id: user.id,
        title,
        content,
        excerpt,
        tags: tagArray,
        status: "pending",
      });
      if (error) {
        toast({ title: "Create failed", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Submitted for review", description: "An admin will approve your post." });
        resetForm();
        fetchPosts();
      }
    }

    setSubmitting(false);
  };

  const onEdit = (post: any) => {
    setEditingId(post.id);
    setTitle(post.title);
    setContent(post.content);
    setTags((post.tags || []).join(", "));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onDelete = async (id: string) => {
    if (!user) return;
    const { error } = await supabase.from("posts").delete().eq("id", id).eq("user_id", user.id);
    if (error) {
      toast({ title: "Delete failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Post deleted" });
      fetchPosts();
    }
  };

  const pendingCount = useMemo(() => myPosts.filter(p => p.status === 'pending').length, [myPosts]);

  return (
    <div className="min-h-screen bg-content-bg">
      <NavBar />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
          <div className="text-sm text-muted-foreground">
            {pendingCount > 0 && (
              <span className="inline-flex items-center"><Clock className="h-4 w-4 mr-1" /> {pendingCount} pending</span>
            )}
          </div>
        </div>

        {/* Editor */}
        <Card className="blog-card mb-8">
          <CardHeader>
            <CardTitle>{editingId ? "Edit Post" : "Write a Post"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} rows={8} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input id="tags" value={tags} onChange={(e) => setTags(e.target.value)} />
              </div>
              <div className="flex gap-2">
                <Button type="submit" variant="hero" disabled={submitting}>
                  {editingId ? <Edit3 className="h-4 w-4 mr-2" /> : <Send className="h-4 w-4 mr-2" />}
                  {editingId ? "Save Changes" : "Submit for Review"}
                </Button>
                {editingId && (
                  <Button type="button" variant="ghost" onClick={resetForm}>Cancel</Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        <Separator className="my-8" />

        {/* My Posts */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">My Posts</h2>
          {loadingPosts ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : myPosts.length === 0 ? (
            <p className="text-muted-foreground">No posts yet. Write your first post above.</p>
          ) : (
            myPosts.map((post) => (
              <Card key={post.id} className="blog-card">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="pr-4">
                      <h3 className="text-xl font-semibold mb-1">{post.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">Updated {new Date(post.updated_at).toLocaleString()}</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {(post.tags || []).map((t: string) => (
                          <Badge key={t} variant="secondary">{t}</Badge>
                        ))}
                      </div>
                      <div className="flex items-center text-sm">
                        {post.status === 'approved' ? (
                          <span className="inline-flex items-center text-success"><CheckCircle2 className="h-4 w-4 mr-1"/> Approved</span>
                        ) : post.status === 'pending' ? (
                          <span className="inline-flex items-center text-warning"><Clock className="h-4 w-4 mr-1"/> Pending</span>
                        ) : (
                          <span className="text-muted-foreground capitalize">{post.status}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => onEdit(post)}>
                        <Edit3 className="h-4 w-4 mr-2" /> Edit
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => onDelete(post.id)}>
                        <Trash2 className="h-4 w-4 mr-2 text-destructive" /> Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
