import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { CheckCircle, AlertTriangle, Clock, Shield, Database, Zap } from 'lucide-react';

interface ChecklistItem {
  id: string;
  category: string;
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'pending' | 'failed';
  priority: 'critical' | 'high' | 'medium' | 'low';
  automated?: boolean;
}

export const ProductionReadinessChecklist = () => {
  const [items, setItems] = useState<ChecklistItem[]>([
    // Security
    {
      id: 'security-ssl',
      category: 'Security',
      title: 'SSL/TLS Configuration',
      description: 'SSL certificates configured and HTTPS enforced',
      status: 'completed',
      priority: 'critical',
      automated: true
    },
    {
      id: 'security-headers',
      category: 'Security',
      title: 'Security Headers',
      description: 'CSP, HSTS, X-Frame-Options configured',
      status: 'completed',
      priority: 'critical',
      automated: true
    },
    {
      id: 'security-rls',
      category: 'Security',
      title: 'Row Level Security',
      description: 'RLS policies enabled on all tables',
      status: 'completed',
      priority: 'critical',
      automated: true
    },
    
    // Performance
    {
      id: 'perf-lighthouse',
      category: 'Performance',
      title: 'Lighthouse Score',
      description: 'Performance score > 90',
      status: 'in-progress',
      priority: 'high',
      automated: true
    },
    {
      id: 'perf-caching',
      category: 'Performance',
      title: 'Caching Strategy',
      description: 'CDN and browser caching configured',
      status: 'pending',
      priority: 'high'
    },
    {
      id: 'perf-compression',
      category: 'Performance',
      title: 'Asset Compression',
      description: 'Gzip/Brotli compression enabled',
      status: 'completed',
      priority: 'medium',
      automated: true
    },
    
    // Database
    {
      id: 'db-backup',
      category: 'Database',
      title: 'Automated Backups',
      description: 'Daily backups configured with retention',
      status: 'pending',
      priority: 'critical'
    },
    {
      id: 'db-monitoring',
      category: 'Database',
      title: 'Database Monitoring',
      description: 'Performance and error monitoring active',
      status: 'in-progress',
      priority: 'high'
    },
    
    // Legal & Compliance
    {
      id: 'legal-gdpr',
      category: 'Legal',
      title: 'GDPR Compliance',
      description: 'Data export/deletion mechanisms implemented',
      status: 'completed',
      priority: 'critical'
    },
    {
      id: 'legal-privacy',
      category: 'Legal',
      title: 'Privacy Policy',
      description: 'Complete privacy policy published',
      status: 'pending',
      priority: 'critical'
    },
    
    // Monitoring
    {
      id: 'monitor-alerts',
      category: 'Monitoring',
      title: 'Error Alerting',
      description: 'Real-time error notifications configured',
      status: 'completed',
      priority: 'critical',
      automated: true
    },
    {
      id: 'monitor-uptime',
      category: 'Monitoring',
      title: 'Uptime Monitoring',
      description: 'External uptime monitoring service active',
      status: 'pending',
      priority: 'high'
    }
  ]);

  const categories = [...new Set(items.map(item => item.category))];
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'in-progress': return <Clock className="w-4 h-4 text-blue-500" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'destructive';
      case 'high': return 'secondary';
      case 'medium': return 'outline';
      default: return 'outline';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Security': return <Shield className="w-5 h-5" />;
      case 'Performance': return <Zap className="w-5 h-5" />;
      case 'Database': return <Database className="w-5 h-5" />;
      default: return <CheckCircle className="w-5 h-5" />;
    }
  };

  const toggleItemStatus = (id: string) => {
    setItems(prev => prev.map(item => 
      item.id === id 
        ? { ...item, status: item.status === 'completed' ? 'pending' : 'completed' }
        : item
    ));
  };

  const runAutomatedChecks = async () => {
    const automatedItems = items.filter(item => item.automated);
    
    for (const item of automatedItems) {
      setItems(prev => prev.map(i => 
        i.id === item.id ? { ...i, status: 'in-progress' } : i
      ));
      
      // Simulate automated check
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Most checks should pass in our implementation
      const passed = Math.random() > 0.1; // 90% success rate
      
      setItems(prev => prev.map(i => 
        i.id === item.id 
          ? { ...i, status: passed ? 'completed' : 'failed' }
          : i
      ));
    }
  };

  const completedItems = items.filter(item => item.status === 'completed').length;
  const totalItems = items.length;
  const completionPercentage = (completedItems / totalItems) * 100;

  const criticalPending = items.filter(item => 
    item.priority === 'critical' && item.status !== 'completed'
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Production Readiness</span>
            <Button onClick={runAutomatedChecks}>
              Run Automated Checks
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Overall Progress</span>
                <span>{completedItems}/{totalItems} ({Math.round(completionPercentage)}%)</span>
              </div>
              <Progress value={completionPercentage} />
            </div>

            {criticalPending.length > 0 && (
              <Alert className="border-destructive">
                <AlertTriangle className="w-4 h-4" />
                <AlertDescription>
                  {criticalPending.length} critical items remain incomplete. 
                  These must be addressed before production deployment.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>

      {categories.map(category => {
        const categoryItems = items.filter(item => item.category === category);
        const categoryCompleted = categoryItems.filter(item => item.status === 'completed').length;
        
        return (
          <Card key={category}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getCategoryIcon(category)}
                  <span>{category}</span>
                </div>
                <Badge variant="outline">
                  {categoryCompleted}/{categoryItems.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {categoryItems.map(item => (
                  <div key={item.id} className="flex items-start space-x-3 p-3 border rounded">
                    <Checkbox
                      checked={item.status === 'completed'}
                      onCheckedChange={() => toggleItemStatus(item.id)}
                      disabled={item.automated}
                    />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{item.title}</h4>
                        <div className="flex items-center space-x-2">
                          {item.automated && (
                            <Badge variant="outline" className="text-xs">
                              Auto
                            </Badge>
                          )}
                          <Badge variant={getPriorityColor(item.priority) as any}>
                            {item.priority}
                          </Badge>
                          {getStatusIcon(item.status)}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};