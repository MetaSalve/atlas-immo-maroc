import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, Clock, Play, TestTube } from 'lucide-react';

interface TestResult {
  name: string;
  status: 'passed' | 'failed' | 'running' | 'pending';
  duration?: number;
  error?: string;
}

interface TestSuite {
  name: string;
  tests: TestResult[];
  status: 'passed' | 'failed' | 'running' | 'pending';
}

export const TestRunner = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [testSuites, setTestSuites] = useState<TestSuite[]>([
    {
      name: 'Authentication Tests',
      status: 'pending',
      tests: [
        { name: 'User login with valid credentials', status: 'pending' },
        { name: 'User login with invalid credentials', status: 'pending' },
        { name: 'Password reset flow', status: 'pending' },
        { name: 'Two-factor authentication', status: 'pending' }
      ]
    },
    {
      name: 'Property Search Tests',
      status: 'pending',
      tests: [
        { name: 'Basic property search', status: 'pending' },
        { name: 'Advanced filters', status: 'pending' },
        { name: 'Geolocation search', status: 'pending' },
        { name: 'Price range filtering', status: 'pending' }
      ]
    },
    {
      name: 'Alert System Tests',
      status: 'pending',
      tests: [
        { name: 'Create new alert', status: 'pending' },
        { name: 'Alert notifications', status: 'pending' },
        { name: 'Alert management', status: 'pending' },
        { name: 'Alert subscription limits', status: 'pending' }
      ]
    }
  ]);

  const runTests = async () => {
    setIsRunning(true);
    setProgress(0);

    const totalTests = testSuites.reduce((acc, suite) => acc + suite.tests.length, 0);
    let completedTests = 0;

    for (const suite of testSuites) {
      // Update suite status to running
      setTestSuites(prev => prev.map(s => 
        s.name === suite.name ? { ...s, status: 'running' } : s
      ));

      let suiteHasFailed = false;

      for (const test of suite.tests) {
        // Update test status to running
        setTestSuites(prev => prev.map(s => 
          s.name === suite.name 
            ? {
                ...s,
                tests: s.tests.map(t => 
                  t.name === test.name ? { ...t, status: 'running' } : t
                )
              }
            : s
        ));

        // Simulate test execution
        await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 500));

        const passed = Math.random() > 0.2; // 80% success rate
        const duration = Math.random() * 1000 + 100;

        // Update test result
        setTestSuites(prev => prev.map(s => 
          s.name === suite.name 
            ? {
                ...s,
                tests: s.tests.map(t => 
                  t.name === test.name 
                    ? { 
                        ...t, 
                        status: passed ? 'passed' : 'failed',
                        duration,
                        error: passed ? undefined : 'Test assertion failed'
                      } 
                    : t
                )
              }
            : s
        ));

        if (!passed) suiteHasFailed = true;
        
        completedTests++;
        setProgress((completedTests / totalTests) * 100);
      }

      // Update suite final status
      setTestSuites(prev => prev.map(s => 
        s.name === suite.name 
          ? { ...s, status: suiteHasFailed ? 'failed' : 'passed' }
          : s
      ));
    }

    setIsRunning(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'running': return <Clock className="w-4 h-4 text-blue-500 animate-spin" />;
      default: return <TestTube className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed': return 'default';
      case 'failed': return 'destructive';
      case 'running': return 'secondary';
      default: return 'outline';
    }
  };

  const totalTests = testSuites.reduce((acc, suite) => acc + suite.tests.length, 0);
  const passedTests = testSuites.reduce((acc, suite) => 
    acc + suite.tests.filter(t => t.status === 'passed').length, 0
  );
  const failedTests = testSuites.reduce((acc, suite) => 
    acc + suite.tests.filter(t => t.status === 'failed').length, 0
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Test Suite Runner</span>
            <Button 
              onClick={runTests} 
              disabled={isRunning}
              className="flex items-center space-x-2"
            >
              <Play className="w-4 h-4" />
              <span>{isRunning ? 'Running...' : 'Run Tests'}</span>
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isRunning && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} />
            </div>
          )}

          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{passedTests}</div>
              <div className="text-sm text-muted-foreground">Passed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{failedTests}</div>
              <div className="text-sm text-muted-foreground">Failed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{totalTests}</div>
              <div className="text-sm text-muted-foreground">Total</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {testSuites.map((suite) => (
          <Card key={suite.name}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(suite.status)}
                  <span>{suite.name}</span>
                </div>
                <Badge variant={getStatusColor(suite.status) as any}>
                  {suite.status}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {suite.tests.map((test) => (
                  <div key={test.name} className="flex items-center justify-between p-2 border rounded">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(test.status)}
                      <span className="text-sm">{test.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {test.duration && (
                        <span className="text-xs text-muted-foreground">
                          {test.duration.toFixed(0)}ms
                        </span>
                      )}
                      {test.error && (
                        <Alert className="max-w-xs">
                          <AlertDescription className="text-xs">
                            {test.error}
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};