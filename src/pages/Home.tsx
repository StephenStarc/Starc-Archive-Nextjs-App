/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
// @ts-expect-error
import { db } from '../firebase'; // Adjust the import path as needed
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';

interface Post {
  id: string;
  title: string;
  summary: string;
  imageUrl: string;
  createdAt: Date;
}

export default function BlogHome() {
  const [featuredPost, setFeaturedPost] = useState<Post | null>(null);
  const [latestPosts, setLatestPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const postsQuery = query(
        collection(db, 'publicPosts'),
        orderBy('createdAt', 'desc'),
        limit(7)
      );

      const querySnapshot = await getDocs(postsQuery);
      const posts = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate()
      })) as Post[];

      if (posts.length > 0) {
        setFeaturedPost(posts[0]);
        setLatestPosts(posts.slice(1));
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        {featuredPost && (
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Featured Post</h2>
            <Card className="bg-primary text-primary-foreground">
              <CardHeader>
                <CardTitle className="text-2xl">{featuredPost.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <img
                  src={featuredPost.imageUrl}
                  alt="Featured post"
                  className="w-full h-64 object-cover mb-4 rounded-md"
                />
                <p >
  {featuredPost.summary.split(' ').slice(0, 20).join(' ')}
  {featuredPost.summary.split(' ').length > 20 ? '...' : ''}
</p>
              </CardContent>
              <CardFooter>
                <Link to={`/post/${featuredPost.id}`}>
                  <Button variant="secondary">Read More</Button>
                </Link>
              </CardFooter>
            </Card>
          </section>
        )}

        <section>
          <h2 className="text-3xl font-bold mb-6">Latest Posts</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {latestPosts.map((post) => (
              <Card key={post.id}>
                <CardHeader>
                  <CardTitle>{post.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-40 object-cover mb-4 rounded-md"
                  />
                  <p className="text-muted-foreground">
                    {post.summary.split(' ').slice(0, 20).join(' ')}
                    {post.summary.split(' ').length > 20 ? '...' : ''}
                  </p>
                </CardContent>
                <CardFooter>
                  <Link to={`/post/${post.id}`}>
                    <Button variant="outline">Read More</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}