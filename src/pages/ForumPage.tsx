import React, { useState, useEffect } from 'react';
import { User, Clock, MessageSquare, Heart, Filter, Plus, Tag, Search } from 'lucide-react';
import { useTranslation } from '../contexts/TranslationContext';
import { useUser } from '../contexts/UserContext';
import Card from '../components/common/Card';
import UserAvatar from '../components/common/UserAvatar';
import { ForumPost, ForumCategory } from '../types/user';
import { Timestamp } from 'firebase/firestore';

// Mock data for categories
const MOCK_CATEGORIES: ForumCategory[] = [
  {
    id: 'cat1',
    name: 'General Discussion',
    description: 'General discussions about the LKHN platform',
    icon: 'message-circle',
    color: 'blue',
    order: 1,
    moderators: ['mod1', 'mod2'],
    postCount: 42
  },
  {
    id: 'cat2',
    name: 'Crypto Talk',
    description: 'Discussions about cryptocurrencies and market trends',
    icon: 'trending-up',
    color: 'green',
    order: 2,
    moderators: ['mod3'],
    postCount: 23
  },
  {
    id: 'cat3',
    name: 'Financial Literacy',
    description: 'Resources and discussions about financial education',
    icon: 'book-open',
    color: 'purple',
    order: 3,
    moderators: ['mod1'],
    postCount: 15
  },
  {
    id: 'cat4',
    name: 'Community Events',
    description: 'Announcements and discussions about LKHN Hub events',
    icon: 'calendar',
    color: 'orange',
    order: 4,
    moderators: ['mod2', 'mod3'],
    postCount: 8
  },
];

// Mock data for posts
const MOCK_POSTS: ForumPost[] = [
  {
    id: 'post1',
    authorId: 'user1',
    title: 'Welcome to the LKHN Community Forum!',
    content: 'This is a space for all members to share ideas, ask questions, and connect with each other. Please be respectful and follow our community guidelines.',
    tags: ['welcome', 'community', 'guidelines'],
    createdAt: Timestamp.fromDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)),
    updatedAt: Timestamp.fromDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)),
    likes: ['user2', 'user3', 'user4'],
    commentCount: 5,
    viewCount: 120,
    category: 'cat1',
    featured: true,
    status: 'published'
  },
  {
    id: 'post2',
    authorId: 'user2',
    title: 'XRP Price Prediction for 2025',
    content: 'I\'ve been analyzing some trends and wanted to share my thoughts on where XRP might be heading in the next year...',
    tags: ['crypto', 'XRP', 'analysis'],
    createdAt: Timestamp.fromDate(new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)),
    updatedAt: Timestamp.fromDate(new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)),
    likes: ['user1', 'user3'],
    commentCount: 8,
    viewCount: 75,
    category: 'cat2',
    status: 'published'
  },
  {
    id: 'post3',
    authorId: 'user3',
    title: 'How to Start Building Credit from Zero',
    content: 'Many people in our community are looking to build credit for the first time. Here are some strategies that have worked for me and others...',
    tags: ['financial-literacy', 'credit', 'beginners'],
    createdAt: Timestamp.fromDate(new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)),
    updatedAt: Timestamp.fromDate(new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)),
    likes: ['user1', 'user2', 'user4', 'user5'],
    commentCount: 12,
    viewCount: 132,
    category: 'cat3',
    status: 'published'
  },
  {
    id: 'post4',
    authorId: 'user4',
    title: 'Upcoming Financial Literacy Workshop at Hub',
    content: 'We\'re excited to announce a new workshop on creating a personal budget that will be held at the LKHN Hub next week...',
    tags: ['event', 'workshop', 'budgeting'],
    createdAt: Timestamp.fromDate(new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)),
    updatedAt: Timestamp.fromDate(new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)),
    likes: ['user1', 'user3'],
    commentCount: 3,
    viewCount: 45,
    category: 'cat4',
    status: 'published'
  }
];

interface AuthorInfo {
  name: string;
  photoURL?: string;
}

const ForumPage: React.FC = () => {
  const { t } = useTranslation();
  const { fetchUserProfile } = useUser();
  const [categories, setCategories] = useState<ForumCategory[]>(MOCK_CATEGORIES);
  const [posts, setPosts] = useState<ForumPost[]>(MOCK_POSTS);
  const [authors, setAuthors] = useState<Record<string, AuthorInfo>>({});
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Fetch author information
  useEffect(() => {
    const fetchAuthors = async () => {
      const authorIds = Array.from(new Set(posts.map(post => post.authorId)));
      const authorData: Record<string, AuthorInfo> = {};
      
      for (const authorId of authorIds) {
        try {
          const profile = await fetchUserProfile(authorId);
          if (profile) {
            authorData[authorId] = {
              name: profile.displayName,
              photoURL: profile.photoURL
            };
          }
        } catch (err) {
          console.error('Error fetching author info:', err);
        }
      }
      
      setAuthors(authorData);
    };
    
    fetchAuthors();
  }, [posts, fetchUserProfile]);
  
  // Filter posts based on active category and search query
  const filteredPosts = posts.filter(post => {
    // Category filter
    if (activeCategory && post.category !== activeCategory) {
      return false;
    }
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        post.title.toLowerCase().includes(query) ||
        post.content.toLowerCase().includes(query) ||
        post.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    return true;
  });
  
  // Format date display
  const formatDate = (timestamp: Timestamp) => {
    const date = timestamp.toDate();
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds ago`;
    } else if (diffInSeconds < 60 * 60) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
    } else if (diffInSeconds < 60 * 60 * 24) {
      const hours = Math.floor(diffInSeconds / (60 * 60));
      return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    } else if (diffInSeconds < 60 * 60 * 24 * 7) {
      const days = Math.floor(diffInSeconds / (60 * 60 * 24));
      return `${days} day${days === 1 ? '' : 's'} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">{t('forum.title')}</h1>
        <p className="text-gray-400 mb-6">{t('forum.description')}</p>
        
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
          <div className="relative w-full sm:w-3/5 lg:w-1/2">
            <input
              type="text"
              className="w-full bg-gray-800 border border-gray-700 rounded-sm py-2 pl-10 pr-3"
              placeholder={t('forum.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          </div>
          
          <div className="flex flex-wrap gap-2 justify-end">
            <button className="px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-sm text-sm flex items-center">
              <Filter size={14} className="mr-2" />
              {t('forum.filter')}
            </button>
            
            <button className="px-3 py-2 bg-green-600 hover:bg-green-700 rounded-sm text-sm flex items-center">
              <Plus size={14} className="mr-2" />
              {t('forum.newPost')}
            </button>
          </div>
        </div>
        
        {/* Categories */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card
            className={`p-5 cursor-pointer ${activeCategory === null ? 'bg-gray-800' : 'bg-gray-900'} hover:bg-gray-800 transition-colors`}
            onClick={() => setActiveCategory(null)}
          >
            <h3 className="text-lg font-medium mb-2">{t('forum.allCategories')}</h3>
            <p className="text-sm text-gray-400">{posts.length} {t('forum.posts')}</p>
          </Card>
          
          {categories.map((category) => (
            <Card
              key={category.id}
              className={`p-5 cursor-pointer ${activeCategory === category.id ? 'bg-gray-800' : 'bg-gray-900'} hover:bg-gray-800 transition-colors`}
              onClick={() => setActiveCategory(category.id === activeCategory ? null : category.id)}
            >
              <h3 className="text-lg font-medium mb-2">{category.name}</h3>
              <p className="text-sm text-gray-400">{category.postCount} {t('forum.posts')}</p>
            </Card>
          ))}
        </div>
      </div>
      
      {/* Featured Posts */}
      {!activeCategory && !searchQuery && (
        <div className="mb-10">
          <h2 className="text-xl font-bold mb-6">{t('forum.featuredPosts')}</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {posts.filter(post => post.featured).map((post) => (
              <Card key={post.id} className="p-6 h-full flex flex-col shadow-lg">
                <div className="flex items-start mb-4">
                  <UserAvatar 
                    userId={post.authorId}
                    displayName={authors[post.authorId]?.name || 'Unknown User'}
                    photoURL={authors[post.authorId]?.photoURL}
                    size="lg"
                    className="mr-4"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-medium mb-1">{post.title}</h3>
                    <div className="flex items-center text-sm text-gray-500">
                      <span>{authors[post.authorId]?.name || 'Unknown User'}</span>
                      <span className="mx-2">·</span>
                      <Clock size={14} className="mr-1" />
                      <span>{formatDate(post.createdAt)}</span>
                    </div>
                  </div>
                </div>
                
                <p className="text-base text-gray-300 mb-6 line-clamp-3">{post.content}</p>
                
                <div className="mt-auto flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center text-sm text-gray-400">
                      <Heart size={16} className="mr-2" />
                      <span>{post.likes.length}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-400">
                      <MessageSquare size={16} className="mr-2" />
                      <span>{post.commentCount}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {post.tags.slice(0, 2).map((tag, idx) => (
                      <span key={idx} className="text-sm bg-gray-700 px-3 py-1 rounded-sm">
                        {tag}
                      </span>
                    ))}
                    {post.tags.length > 2 && (
                      <span className="text-sm bg-gray-700 px-3 py-1 rounded-sm">
                        +{post.tags.length - 2}
                      </span>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
      
      {/* Post List */}
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
          <h2 className="text-lg font-medium">
            {activeCategory 
              ? categories.find(c => c.id === activeCategory)?.name || t('forum.posts')
              : searchQuery 
                ? t('forum.searchResults') 
                : t('forum.recentPosts')
            }
          </h2>
          
          {filteredPosts.length > 0 && (
            <span className="text-sm text-gray-400">
              {filteredPosts.length} {t('forum.posts')}
            </span>
          )}
        </div>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-gray-600 border-t-gray-300 rounded-full animate-spin"></div>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare size={40} className="mx-auto mb-4 text-gray-500" />
            <h4 className="text-lg font-medium mb-2">
              {searchQuery 
                ? t('forum.noSearchResults') 
                : activeCategory 
                  ? t('forum.noCategoryPosts') 
                  : t('forum.noPosts')
              }
            </h4>
            <p className="text-gray-400 mb-6">
              {searchQuery 
                ? t('forum.tryDifferentSearch') 
                : t('forum.beFirstToPost')
              }
            </p>
            
            <button className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-sm text-sm flex items-center mx-auto">
              <Plus size={16} className="mr-2" />
              {t('forum.createPost')}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <Card key={post.id} className="p-5">
                <div className="flex items-start">
                  <UserAvatar 
                    userId={post.authorId}
                    displayName={authors[post.authorId]?.name || 'Unknown User'}
                    photoURL={authors[post.authorId]?.photoURL}
                    size="md"
                    className="mr-4"
                  />
                  
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <h3 className="text-base font-medium">{post.title}</h3>
                      
                      <div className="flex items-center text-sm text-gray-500 mt-1 sm:mt-0">
                        <span>{authors[post.authorId]?.name || 'Unknown User'}</span>
                        <span className="mx-2">·</span>
                        <Clock size={12} className="mr-1" />
                        <span>{formatDate(post.createdAt)}</span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-300 my-3 line-clamp-2">{post.content}</p>
                    
                    <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center text-sm text-gray-500">
                          <Heart size={14} className="mr-1" />
                          <span>{post.likes.length}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <MessageSquare size={14} className="mr-1" />
                          <span>{post.commentCount}</span>
                        </div>
                        
                        <span className="text-sm px-3 py-1 bg-gray-800 rounded-sm">
                          {categories.find(c => c.id === post.category)?.name || 'General'}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-2 sm:mb-0">
                        {post.tags.slice(0, 3).map((tag, idx) => (
                          <span key={idx} className="text-sm bg-gray-800 px-3 py-1 rounded-sm flex items-center">
                            <Tag size={12} className="mr-1" />
                            {tag}
                          </span>
                        ))}
                        {post.tags.length > 3 && (
                          <span className="text-sm bg-gray-800 px-3 py-1 rounded-sm">
                            +{post.tags.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ForumPage;