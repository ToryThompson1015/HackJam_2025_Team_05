import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { activitiesAPI } from '../../services/api';
import { Sparkles, Target, TrendingUp, Lightbulb, Zap, Award } from 'lucide-react';

const AISuggestions = () => {
  const { user } = useAuth(); 
  const [suggestions, setSuggestions] = useState([]);
  const [insights, setInsights] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      fetchUserActivities();
    }
  }, [user]);

  const fetchUserActivities = async () => {
    try {
      const response = await activitiesAPI.getActivities({ 
        page: 1, 
        limit: 10,
        userId: user._id 
      });
      
      if (response.data.success) {
        setRecentActivities(response.data.data.activities);
        generateAISuggestions(response.data.data.activities);
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
      generateFallbackSuggestions();
    }
  };

  const generateAISuggestions = async (activities) => {
    setLoading(true);
    setError(null);

    
    const userProfile = {
      name: `${user.firstName} ${user.lastName}`,
      level: user.currentLevel,
      totalPoints: user.totalPoints,
      experiencePoints: user.experiencePoints,
      cohort: user.cohort,
      recentActivities: activities.slice(0, 5).map(a => ({
        category: a.category,
        title: a.title,
        points: a.pointsAwarded,
        date: a.completedAt
      })),
      badges: user.badges?.length || 0,
      mentoringHours: user.mentoringStats?.totalHours || 0
    };

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{
            role: "system",
            content: `You are an AI career advisor for Per Scholas alumni. Generate personalized activity suggestions to help users gain points and advance their careers. Return valid JSON only with this structure:
            {
              "suggestions": [
                {
                  "title": "Activity Title",
                  "description": "Brief description",
                  "category": "mentoring|skill-development|community-contribution|networking|teaching|certification|career-advancement|learning|project-completion|volunteer-work",
                  "difficulty": "Easy|Medium|Hard|Expert",
                  "points": number,
                  "reason": "Why this is recommended",
                  "priority": "high|medium|low"
                }
              ],
              "insights": {
                "strength": "What user is doing well",
                "opportunity": "Area for improvement", 
                "nextGoal": "Suggested next milestone",
                "motivation": "Encouraging message"
              }
            }`
          }, {
            role: "user",
            content: `User Profile: ${userProfile.name}, Level ${userProfile.level}, ${userProfile.totalPoints} total points, ${userProfile.experiencePoints} XP, Cohort: ${userProfile.cohort}, Recent activities: ${userProfile.recentActivities.map(a => `${a.category} (${a.points} pts)`).join(', ')}, Badges: ${userProfile.badges}, Mentoring Hours: ${userProfile.mentoringHours}. Generate 3-4 personalized suggestions.`
          }],
          max_tokens: 1000,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`AI API error: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = JSON.parse(data.choices[0].message.content);
      
      setSuggestions(aiResponse.suggestions);
      setInsights(aiResponse.insights);
    } catch (err) {
      console.error('AI API Error:', err);
      setError('AI suggestions temporarily unavailable');
      generateFallbackSuggestions();
    } finally {
      setLoading(false);
    }
  };

  const generateFallbackSuggestions = () => {
    const fallbackSuggestions = [];
    
    if (user.currentLevel < 5) {
      fallbackSuggestions.push({
        title: "Complete a Skills Assessment",
        description: "Take an online assessment in your field to identify growth areas",
        category: "skill-development",
        difficulty: "Easy",
        points: 25,
        reason: "Perfect for building your foundation at your current level",
        priority: "high"
      });
    } else {
      fallbackSuggestions.push({
        title: "Mentor a Junior Alumni",
        description: "Guide someone from a recent cohort in their career journey",
        category: "mentoring",
        difficulty: "Medium",
        points: 50,
        reason: "Your experience level makes you a great mentor",
        priority: "high"
      });
    }

    const hasRecentMentoring = recentActivities.some(a => a.category === 'mentoring');
    if (!hasRecentMentoring) {
      fallbackSuggestions.push({
        title: "Join Per Scholas Career Fair",
        description: "Volunteer to help current students with interview prep",
        category: "community-contribution",
        difficulty: "Easy",
        points: 40,
        reason: "Great way to give back to the community",
        priority: "medium"
      });
    }

    if (user.cohort?.includes('Web Dev')) {
      fallbackSuggestions.push({
        title: "Build an Open Source Project",
        description: "Create a useful tool and share it with the community",
        category: "project-completion",
        difficulty: "Hard",
        points: 100,
        reason: "Showcases your web development skills",
        priority: "medium"
      });
    }

    const fallbackInsights = {
      strength: `You're making great progress at Level ${user.currentLevel} with ${user.totalPoints} points!`,
      opportunity: "Consider adding more mentoring activities to help others grow",
      nextGoal: `Reach Level ${user.currentLevel + 1} - you're ${getNextLevelPoints() - user.experiencePoints} XP away!`,
      motivation: "You're in the top tier of your cohort - keep up the momentum!"
    };

    setSuggestions(fallbackSuggestions);
    setInsights(fallbackInsights);
  };

  const getNextLevelPoints = () => {
    const nextLevel = user.currentLevel + 1;
    return Math.pow(nextLevel - 1, 2) * 100;
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'mentoring': '👨‍🏫',
      'skill-development': '📚',
      'community-contribution': '🤝',
      'networking': '🌐',
      'teaching': '👩‍🏫',
      'certification': '🏆',
      'career-advancement': '📈',
      'learning': '🧠',
      'project-completion': '💻',
      'volunteer-work': '❤️'
    };
    return icons[category] || '🎯';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'high': '#e74c3c',
      'medium': '#f39c12',
      'low': '#27ae60'
    };
    return colors[priority] || '#95a5a6';
  };

  if (!user) return null;

  return (
    <div className="ai-suggestions">
      {/* Header */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <Sparkles size={20} />
            AI-Powered Suggestions
          </h3>
          <button 
            onClick={() => fetchUserActivities()}
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? <Zap size={16} /> : <Target size={16} />}
            {loading ? 'Generating...' : 'Refresh Suggestions'}
          </button>
        </div>
        
        {error && (
          <div style={{ 
            background: '#fff3cd', 
            border: '1px solid #ffeaa7', 
            borderRadius: '4px', 
            padding: '12px', 
            marginBottom: '20px',
            color: '#856404'
          }}>
             {error}
          </div>
        )}

        <p style={{ color: '#666', marginBottom: '0' }}>
          Personalized recommendations based on your Level {user.currentLevel} progress and recent activities
        </p>
      </div>

      <div className="grid grid-2">
        {/* AI Insights */}
        {insights && (
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">
                <TrendingUp size={20} />
                Your Progress Insights
              </h3>
            </div>
            
            <div style={{ marginBottom: '20px', padding: '15px', background: '#e8f5e8', borderRadius: '8px', borderLeft: '4px solid #27ae60' }}>
              <h4 style={{ color: '#27ae60', marginBottom: '8px', fontSize: '1rem' }}> You're doing great!</h4>
              <p style={{ margin: '0', color: '#2c3e50', fontSize: '14px' }}>{insights.strength}</p>
            </div>
            
            <div style={{ marginBottom: '20px', padding: '15px', background: '#fff3cd', borderRadius: '8px', borderLeft: '4px solid #f39c12' }}>
              <h4 style={{ color: '#856404', marginBottom: '8px', fontSize: '1rem' }}> Growth Opportunity</h4>
              <p style={{ margin: '0', color: '#2c3e50', fontSize: '14px' }}>{insights.opportunity}</p>
            </div>
            
            <div style={{ padding: '15px', background: '#cce5ff', borderRadius: '8px', borderLeft: '4px solid #3498db' }}>
              <h4 style={{ color: '#004085', marginBottom: '8px', fontSize: '1rem' }}> Next Goal</h4>
              <p style={{ margin: '0', color: '#2c3e50', fontSize: '14px' }}>{insights.nextGoal}</p>
            </div>
          </div>
        )}

        {/* Level Progress */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <Award size={20} />
              Level Progress
            </h3>
          </div>
          
          <div className="progress-container">
            <div className="progress-info">
              <span>Level {user.currentLevel}</span>
              <span>Level {user.currentLevel + 1}</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${Math.min((user.experiencePoints / getNextLevelPoints()) * 100, 100)}%` }}
              ></div>
            </div>
            <div className="progress-text">
              {user.experiencePoints} / {getNextLevelPoints()} XP
            </div>
          </div>

          <div style={{ marginTop: '20px', textAlign: 'center', padding: '15px', background: '#f8f9fa', borderRadius: '8px' }}>
            <p style={{ margin: '0', color: '#2c3e50', fontWeight: '500' }}>
              {getNextLevelPoints() - user.experiencePoints} XP needed for Level {user.currentLevel + 1}
            </p>
          </div>
        </div>
      </div>

      {/* Suggestions Grid */}
      <div className="grid grid-3">
        {suggestions.map((suggestion, index) => (
          <div key={index} className="card activity-card" style={{ borderLeftColor: getPriorityColor(suggestion.priority) }}>
            <div className="activity-header">
              <h4 className="activity-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.2rem' }}>{getCategoryIcon(suggestion.category)}</span>
                {suggestion.title}
              </h4>
              <span className="activity-points">+{suggestion.points} pts</span>
            </div>
            
            <p style={{ color: '#666', fontSize: '14px', lineHeight: '1.4', margin: '10px 0' }}>
              {suggestion.description}
            </p>
            
            <div style={{ 
              background: 'rgba(52, 152, 219, 0.1)', 
              padding: '10px', 
              borderRadius: '6px', 
              marginBottom: '15px' 
            }}>
              <p style={{ margin: '0', fontSize: '13px', color: '#2c3e50' }}>
                💡 <strong>Why this works:</strong> {suggestion.reason}
              </p>
            </div>
            
            <div className="activity-meta">
              <span className="activity-category" style={{ 
                background: suggestion.difficulty === 'Easy' ? '#27ae60' : 
                          suggestion.difficulty === 'Medium' ? '#f39c12' : 
                          suggestion.difficulty === 'Hard' ? '#e74c3c' : '#9b59b6',
                color: 'white',
                padding: '2px 8px',
                borderRadius: '10px',
                fontSize: '12px'
              }}>
                {suggestion.difficulty}
              </span>
              <span style={{ 
                background: getPriorityColor(suggestion.priority),
                color: 'white',
                padding: '2px 8px',
                borderRadius: '10px',
                fontSize: '12px'
              }}>
                {suggestion.priority} priority
              </span>
            </div>
          </div>
        ))}
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          <Zap size={24} style={{ animation: 'spin 1s linear infinite' }} />
          <p style={{ marginTop: '10px' }}>AI is analyzing your progress...</p>
        </div>
      )}
    </div>
  );
};

export default AISuggestions;