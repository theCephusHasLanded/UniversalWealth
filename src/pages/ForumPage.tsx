import React, { useState, useEffect, useRef } from 'react';
import { 
  User, Clock, MessageSquare, Heart, Filter, Plus, Tag, Search, 
  ChevronDown, Award, TrendingUp, BookOpen, Calendar, ThumbsUp, Eye, Flag
} from 'lucide-react';
import { useTranslation } from '../contexts/TranslationContext';
import { useUser } from '../contexts/UserContext';
import Card from '../components/common/Card';
import UserAvatar from '../components/common/UserAvatar';
import { ForumPost, ForumCategory } from '../types/user';
import { Timestamp } from 'firebase/firestore';
import EyeLogo from '../components/common/EyeLogo';

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
  },
  {
    id: 'post5',
    authorId: 'user5',
    title: 'The Future of Real Estate and Blockchain Integration',
    content: 'How tokenized real estate on blockchain can revolutionize property ownership and investment...',
    tags: ['blockchain', 'real-estate', 'investment'],
    createdAt: Timestamp.fromDate(new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)),
    updatedAt: Timestamp.fromDate(new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)),
    likes: ['user1', 'user2', 'user3', 'user4'],
    commentCount: 9,
    viewCount: 87,
    category: 'cat2',
    featured: true,
    status: 'published'
  },
];

interface AuthorInfo {
  name: string;
  photoURL?: string;
}

// Category icon component
const CategoryIcon: React.FC<{ icon: string, color: string, size?: number }> = ({ icon, color, size = 20 }) => {
  switch (icon) {
    case 'message-circle':
      return <MessageSquare size={size} className={`text-${color}-500`} />;
    case 'trending-up':
      return <TrendingUp size={size} className={`text-${color}-500`} />;
    case 'book-open':
      return <BookOpen size={size} className={`text-${color}-500`} />;
    case 'calendar':
      return <Calendar size={size} className={`text-${color}-500`} />;
    default:
      return <MessageSquare size={size} className={`text-${color}-500`} />;
  }
};

const ForumPage: React.FC = () => {
  const { t } = useTranslation();
  const { fetchUserProfile } = useUser();
  const [categories, setCategories] = useState<ForumCategory[]>(MOCK_CATEGORIES);
  const [posts, setPosts] = useState<ForumPost[]>(MOCK_POSTS);
  const [authors, setAuthors] = useState<Record<string, AuthorInfo>>({});
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'cards' | 'compact'>('cards');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'recent' | 'popular'>('recent');
  
  // Panel for creating new post
  const [showNewPostPanel, setShowNewPostPanel] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostCategory, setNewPostCategory] = useState('');
  const [newPostTags, setNewPostTags] = useState('');
  
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
  
  // Filter and sort posts
  const filteredPosts = posts
    .filter(post => {
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
    })
    .sort((a, b) => {
      if (sortBy === 'recent') {
        return b.createdAt.toMillis() - a.createdAt.toMillis();
      } else {
        // Sort by popularity (likes + comments + views/10)
        const popularityA = a.likes.length + a.commentCount + Math.floor(a.viewCount / 10);
        const popularityB = b.likes.length + b.commentCount + Math.floor(b.viewCount / 10);
        return popularityB - popularityA;
      }
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
  
  // Get category details
  const getCategoryDetails = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId) || {
      name: 'Unknown',
      icon: 'message-circle',
      color: 'gray'
    };
  };
  
  // Handle submit new post
  const handleSubmitNewPost = () => {
    if (!newPostTitle || !newPostContent || !newPostCategory) {
      // Handle validation
      return;
    }
    
    // Create new post
    const newPost: ForumPost = {
      id: `post${Date.now()}`,
      authorId: 'user1', // Current user ID
      title: newPostTitle,
      content: newPostContent,
      tags: newPostTags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      likes: [],
      commentCount: 0,
      viewCount: 0,
      category: newPostCategory,
      status: 'published'
    };
    
    // Add to posts
    setPosts([newPost, ...posts]);
    
    // Reset form
    setNewPostTitle('');
    setNewPostContent('');
    setNewPostCategory('');
    setNewPostTags('');
    setShowNewPostPanel(false);
  };
  
  return (
    <div className="px-4 py-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center mb-6">
          <div className="w-1 h-12 mr-4 bg-gold"></div>
          <div>
            <h1 className="text-sm uppercase tracking-widest text-gold mb-1">{t('forum.title')}</h1>
            <p className="text-white text-sm font-light">{t('forum.description')}</p>
          </div>
        </div>
        
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-8">
          <div className="relative w-full sm:w-3/5 lg:w-1/2">
            <div className="relative">
              <input
                type="text"
                className="w-full bg-navy-800 border border-navy-700 hover:border-navy-600 focus:border-gold/50 focus:outline-none rounded-sm py-2 pl-10 pr-3 transition-all duration-300"
                placeholder={t('forum.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500" />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 justify-end">
            <div className="relative">
              <button 
                className="px-3 py-2 bg-navy-800 border border-navy-700 hover:border-navy-600 transition-colors rounded-sm text-sm flex items-center"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter size={14} className="mr-2" />
                {t('forum.filter')}
                <ChevronDown size={14} className="ml-2" />
              </button>
              
              {showFilters && (
                <div className="absolute right-0 mt-1 w-48 bg-navy-800 border border-navy-700 shadow-lg rounded-sm z-10">
                  <div className="p-3 border-b border-navy-700">
                    <h4 className="text-xs uppercase tracking-wider text-gold">Sort By</h4>
                  </div>
                  <div className="p-2">
                    <button 
                      className={`w-full text-left px-3 py-2 text-sm rounded-sm ${sortBy === 'recent' ? 'bg-navy-700 text-white' : 'text-neutral-300 hover:bg-navy-700/50'}`}
                      onClick={() => setSortBy('recent')}
                    >
                      <Clock size={14} className="inline mr-2" />
                      Most Recent
                    </button>
                    <button 
                      className={`w-full text-left px-3 py-2 text-sm rounded-sm ${sortBy === 'popular' ? 'bg-navy-700 text-white' : 'text-neutral-300 hover:bg-navy-700/50'}`}
                      onClick={() => setSortBy('popular')}
                    >
                      <TrendingUp size={14} className="inline mr-2" />
                      Most Popular
                    </button>
                  </div>
                  <div className="p-3 border-t border-navy-700">
                    <h4 className="text-xs uppercase tracking-wider text-gold">View Mode</h4>
                  </div>
                  <div className="p-2">
                    <button 
                      className={`w-full text-left px-3 py-2 text-sm rounded-sm ${viewMode === 'cards' ? 'bg-navy-700 text-white' : 'text-neutral-300 hover:bg-navy-700/50'}`}
                      onClick={() => setViewMode('cards')}
                    >
                      <MessageSquare size={14} className="inline mr-2" />
                      Card View
                    </button>
                    <button 
                      className={`w-full text-left px-3 py-2 text-sm rounded-sm ${viewMode === 'compact' ? 'bg-navy-700 text-white' : 'text-neutral-300 hover:bg-navy-700/50'}`}
                      onClick={() => setViewMode('compact')}
                    >
                      <List size={14} className="inline mr-2" />
                      Compact View
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <button 
              className="px-3 py-2 bg-gold/10 border border-gold/30 hover:bg-gold/20 hover:border-gold/50 transition-colors rounded-sm text-sm flex items-center text-gold"
              onClick={() => setShowNewPostPanel(true)}
            >
              <Plus size={14} className="mr-2" />
              {t('forum.newPost')}
            </button>
          </div>
        </div>
        
        {/* Categories */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div 
            className={`p-5 cursor-pointer bg-navy-800 border border-navy-700 hover:border-gold/30 transition-all duration-300 ${activeCategory === null ? 'forum-category-active border-gold/50' : ''}`}
            onClick={() => setActiveCategory(null)}
          >
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-navy-700 flex items-center justify-center mr-3">
                <MessageSquare size={16} className="text-gold" />
              </div>
              <div>
                <h3 className="text-white text-sm">{t('forum.allCategories')}</h3>
                <p className="text-xs text-neutral-400 mt-1">{posts.length} {t('forum.posts')}</p>
              </div>
            </div>
          </div>
          
          {categories.map((category) => (
            <div
              key={category.id}
              className={`p-5 cursor-pointer bg-navy-800 border border-navy-700 hover:border-gold/30 transition-all duration-300 ${activeCategory === category.id ? 'forum-category-active border-gold/50' : ''}`}
              onClick={() => setActiveCategory(category.id === activeCategory ? null : category.id)}
            >
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full bg-navy-700 flex items-center justify-center mr-3`}>
                  <CategoryIcon icon={category.icon} color={category.color} size={16} />
                </div>
                <div>
                  <h3 className="text-white text-sm">{category.name}</h3>
                  <p className="text-xs text-neutral-400 mt-1">{category.postCount} {t('forum.posts')}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Featured Posts */}
      {!activeCategory && !searchQuery && (
        <div className="mb-10">
          <div className="flex items-center mb-4">
            <div className="h-px w-6 bg-gold mr-3"></div>
            <h2 className="text-sm uppercase tracking-widest text-gold">{t('forum.featuredPosts')}</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {posts.filter(post => post.featured).map((post) => (
              <div 
                key={post.id} 
                className="bg-navy-800 border border-navy-700 hover:border-gold/30 p-6 transition-all duration-300 forum-post-hover"
              >
                <div className="flex items-start mb-4">
                  <UserAvatar 
                    userId={post.authorId}
                    displayName={authors[post.authorId]?.name || 'Unknown User'}
                    photoURL={authors[post.authorId]?.photoURL}
                    size="lg"
                    className="mr-4"
                  />
                  
                  <div className="flex-1">
                    <h3 className="text-lg font-medium mb-1 text-white">{post.title}</h3>
                    <div className="flex items-center text-sm text-neutral-500">
                      <span>{authors[post.authorId]?.name || 'Unknown User'}</span>
                      <span className="mx-2">·</span>
                      <Clock size={14} className="mr-1" />
                      <span>{formatDate(post.createdAt)}</span>
                    </div>
                  </div>
                  
                  <div className="flex-shrink-0">
                    <div className="p-1 bg-gold/10 border border-gold/30 text-gold text-xs uppercase tracking-wider rounded-sm">
                      Featured
                    </div>
                  </div>
                </div>
                
                <p className="text-base text-neutral-300 mb-6 line-clamp-3">{post.content}</p>
                
                <div className="mt-auto flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center text-sm text-neutral-400">
                      <Heart size={16} className="mr-1 text-gold/70" />
                      <span>{post.likes.length}</span>
                    </div>
                    <div className="flex items-center text-sm text-neutral-400">
                      <MessageSquare size={16} className="mr-1 text-gold/70" />
                      <span>{post.commentCount}</span>
                    </div>
                    <div className="flex items-center text-sm text-neutral-400">
                      <Eye size={16} className="mr-1 text-gold/70" />
                      <span>{post.viewCount}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {post.tags.slice(0, 2).map((tag, idx) => (
                      <span 
                        key={idx} 
                        className="text-xs bg-navy-700 border border-navy-600 px-3 py-1 rounded-sm text-neutral-300"
                      >
                        {tag}
                      </span>
                    ))}
                    {post.tags.length > 2 && (
                      <span className="text-xs bg-navy-700 border border-navy-600 px-3 py-1 rounded-sm text-neutral-300">
                        +{post.tags.length - 2}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Post List */}
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2">
          <div className="flex items-center">
            <div className="h-px w-6 bg-gold mr-3"></div>
            <h2 className="text-sm uppercase tracking-widest text-gold">
              {activeCategory 
                ? categories.find(c => c.id === activeCategory)?.name || t('forum.posts')
                : searchQuery 
                  ? t('forum.searchResults') 
                  : t('forum.recentPosts')
              }
            </h2>
          </div>
          
          {filteredPosts.length > 0 && (
            <span className="text-xs text-neutral-400">
              {filteredPosts.length} {t('forum.posts')}
            </span>
          )}
        </div>
        
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="relative h-16 w-16">
              <div className="absolute inset-0 animate-pulse opacity-50 rounded-full bg-navy-700 border border-gold/20"></div>
              <EyeLogo size={64} variant="gold" expressiveness="high" />
            </div>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-16 bg-navy-800 border border-navy-700 rounded-sm">
            <div className="relative h-16 w-16 mx-auto mb-6">
              <EyeLogo size={64} variant="default" expressiveness="low" />
            </div>
            <h4 className="text-lg font-medium mb-2 text-white">
              {searchQuery 
                ? t('forum.noSearchResults') 
                : activeCategory 
                  ? t('forum.noCategoryPosts') 
                  : t('forum.noPosts')
              }
            </h4>
            <p className="text-neutral-400 mb-6 max-w-md mx-auto">
              {searchQuery 
                ? t('forum.tryDifferentSearch') 
                : t('forum.beFirstToPost')
              }
            </p>
            
            <button 
              className="px-4 py-2 bg-gold/10 border border-gold/30 hover:bg-gold/20 hover:border-gold/50 transition-colors rounded-sm text-sm flex items-center mx-auto text-gold"
              onClick={() => setShowNewPostPanel(true)}
            >
              <Plus size={16} className="mr-2" />
              {t('forum.createPost')}
            </button>
          </div>
        ) : (
          <div className={viewMode === 'cards' ? 'space-y-4' : 'bg-navy-800 border border-navy-700 rounded-sm overflow-hidden'}>
            {filteredPosts.map((post, index) => (
              viewMode === 'cards' ? (
                // Card view
                <div 
                  key={post.id} 
                  className="bg-navy-800 border border-navy-700 hover:border-gold/30 p-5 transition-all duration-300 forum-post-hover"
                >
                  <div className="flex items-start">
                    <UserAvatar 
                      userId={post.authorId}
                      displayName={authors[post.authorId]?.name || 'Unknown User'}
                      photoURL={authors[post.authorId]?.photoURL}
                      size="md"
                      className="mr-4"
                      interactive={true}
                    />
                    
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <h3 className="text-base font-medium text-white">{post.title}</h3>
                        
                        <div className="flex items-center text-sm text-neutral-500 mt-1 sm:mt-0">
                          <span>{authors[post.authorId]?.name || 'Unknown User'}</span>
                          <span className="mx-2">·</span>
                          <Clock size={12} className="mr-1" />
                          <span>{formatDate(post.createdAt)}</span>
                        </div>
                      </div>
                      
                      <p className="text-sm text-neutral-300 my-3 line-clamp-2">{post.content}</p>
                      
                      <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center text-sm text-neutral-400">
                            <Heart size={14} className="mr-1 text-gold/70" />
                            <span>{post.likes.length}</span>
                          </div>
                          <div className="flex items-center text-sm text-neutral-400">
                            <MessageSquare size={14} className="mr-1 text-gold/70" />
                            <span>{post.commentCount}</span>
                          </div>
                          <div className="flex items-center text-sm text-neutral-400">
                            <Eye size={14} className="mr-1 text-gold/70" />
                            <span>{post.viewCount}</span>
                          </div>
                          
                          <div className="flex items-center text-2xs text-neutral-400 bg-navy-700 px-2 py-1 rounded-sm">
                            <CategoryIcon 
                              icon={getCategoryDetails(post.category).icon} 
                              color={getCategoryDetails(post.category).color}
                              size={12}
                            />
                            <span className="ml-1">{getCategoryDetails(post.category).name}</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mb-2 sm:mb-0">
                          {post.tags.slice(0, 3).map((tag, idx) => (
                            <span 
                              key={idx} 
                              className="text-xs bg-navy-700 border border-navy-600 px-2 py-1 rounded-sm flex items-center text-neutral-300"
                            >
                              <Tag size={10} className="mr-1 text-gold/70" />
                              {tag}
                            </span>
                          ))}
                          {post.tags.length > 3 && (
                            <span className="text-xs bg-navy-700 border border-navy-600 px-2 py-1 rounded-sm text-neutral-300">
                              +{post.tags.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                // Compact view
                <div 
                  key={post.id} 
                  className={`px-4 py-3 hover:bg-navy-700/50 cursor-pointer ${
                    index < filteredPosts.length - 1 ? 'border-b border-navy-700' : ''
                  }`}
                >
                  <div className="flex items-center">
                    <UserAvatar 
                      userId={post.authorId}
                      displayName={authors[post.authorId]?.name || 'Unknown User'}
                      photoURL={authors[post.authorId]?.photoURL}
                      size="sm"
                      className="mr-3"
                      interactive={false}
                    />
                    
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-white line-clamp-1">{post.title}</h3>
                      <div className="flex flex-wrap gap-x-4 text-2xs text-neutral-500 mt-1">
                        <span>{authors[post.authorId]?.name || 'Unknown User'}</span>
                        <span className="flex items-center">
                          <Clock size={10} className="mr-1" />
                          {formatDate(post.createdAt)}
                        </span>
                        <span className="flex items-center">
                          <Heart size={10} className="mr-1 text-gold/70" />
                          {post.likes.length}
                        </span>
                        <span className="flex items-center">
                          <MessageSquare size={10} className="mr-1 text-gold/70" />
                          {post.commentCount}
                        </span>
                      </div>
                    </div>
                    
                    <div className="ml-3 flex items-center gap-2">
                      <div className="text-2xs text-neutral-400 bg-navy-700 px-2 py-1 rounded-sm flex items-center">
                        <CategoryIcon 
                          icon={getCategoryDetails(post.category).icon} 
                          color={getCategoryDetails(post.category).color}
                          size={10}
                        />
                      </div>
                      
                      {post.tags.length > 0 && (
                        <div className="text-2xs text-neutral-400 bg-navy-700 px-2 py-1 rounded-sm flex items-center">
                          <Tag size={10} className="mr-1 text-gold/70" />
                          <span>{post.tags[0]}</span>
                          {post.tags.length > 1 && <span>+{post.tags.length - 1}</span>}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            ))}
          </div>
        )}
      </div>
      
      {/* New Post Panel */}
      {showNewPostPanel && (
        <div className="fixed inset-0 bg-navy-900/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-navy-800 border border-navy-700 w-full max-w-2xl rounded-sm shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-navy-700">
              <div className="flex items-center">
                <div className="h-px w-6 bg-gold mr-3"></div>
                <h3 className="text-sm uppercase tracking-widest text-gold">{t('forum.createPost')}</h3>
              </div>
              <button 
                className="p-1 text-neutral-400 hover:text-white"
                onClick={() => setShowNewPostPanel(false)}
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm mb-1 text-neutral-300">Title</label>
                <input 
                  type="text" 
                  className="w-full bg-navy-900 border border-navy-700 focus:border-gold/50 focus:outline-none rounded-sm py-2 px-3"
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                  placeholder="Enter post title..."
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm mb-1 text-neutral-300">Content</label>
                <textarea 
                  className="w-full bg-navy-900 border border-navy-700 focus:border-gold/50 focus:outline-none rounded-sm py-2 px-3 min-h-[120px]"
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="Enter post content..."
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm mb-1 text-neutral-300">Category</label>
                  <select 
                    className="w-full bg-navy-900 border border-navy-700 focus:border-gold/50 focus:outline-none rounded-sm py-2 px-3"
                    value={newPostCategory}
                    onChange={(e) => setNewPostCategory(e.target.value)}
                  >
                    <option value="">Select category...</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm mb-1 text-neutral-300">Tags (comma separated)</label>
                  <input 
                    type="text" 
                    className="w-full bg-navy-900 border border-navy-700 focus:border-gold/50 focus:outline-none rounded-sm py-2 px-3"
                    value={newPostTags}
                    onChange={(e) => setNewPostTags(e.target.value)}
                    placeholder="e.g. finance, crypto, discussion"
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button 
                  className="px-4 py-2 border border-navy-600 hover:border-navy-500 transition-colors rounded-sm text-sm"
                  onClick={() => setShowNewPostPanel(false)}
                >
                  Cancel
                </button>
                <button 
                  className="px-4 py-2 bg-gold/10 border border-gold/30 hover:bg-gold/20 hover:border-gold/50 transition-colors rounded-sm text-sm text-gold"
                  onClick={handleSubmitNewPost}
                >
                  Create Post
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Missing Lucide icon polyfill
const List = ({ size = 24, className = "" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <line x1="8" y1="6" x2="21" y2="6"></line>
    <line x1="8" y1="12" x2="21" y2="12"></line>
    <line x1="8" y1="18" x2="21" y2="18"></line>
    <line x1="3" y1="6" x2="3.01" y2="6"></line>
    <line x1="3" y1="12" x2="3.01" y2="12"></line>
    <line x1="3" y1="18" x2="3.01" y2="18"></line>
  </svg>
);

export default ForumPage;