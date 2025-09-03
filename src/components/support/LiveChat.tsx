import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Send, Minimize2, X, User, Bot } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import { toast } from 'sonner';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'agent' | 'bot';
  timestamp: Date;
  senderName?: string;
}

interface ChatAgent {
  id: string;
  name: string;
  isOnline: boolean;
  avatar: string;
  speciality: string;
}

const mockAgents: ChatAgent[] = [
  {
    id: '1',
    name: 'Sarah Benali',
    isOnline: true,
    avatar: '/placeholder.svg',
    speciality: 'Casablanca & Rabat'
  },
  {
    id: '2',
    name: 'Youssef Alami',
    isOnline: true,
    avatar: '/placeholder.svg',
    speciality: 'Marrakech & Sud'
  }
];

const botResponses = {
  greeting: "Bonjour ! Je suis l'assistant virtuel d'AlertImmo. Comment puis-je vous aider aujourd'hui ?",
  properties: "Je peux vous aider à trouver des propriétés. Quel type de bien recherchez-vous et dans quelle ville ?",
  price: "Pour les informations détaillées sur les prix, je vais vous mettre en contact avec l'un de nos agents spécialisés.",
  contact: "Un agent va vous contacter dans les plus brefs délais. Puis-je avoir votre numéro de téléphone ?",
  default: "Je ne suis pas sûr de comprendre. Voulez-vous que je vous mette en contact avec un agent humain ?"
};

export const LiveChat = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentAgent, setCurrentAgent] = useState<ChatAgent | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [chatStatus, setChatStatus] = useState<'bot' | 'waiting' | 'connected'>('bot');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Initial bot greeting
      const greeting: Message = {
        id: '1',
        text: botResponses.greeting,
        sender: 'bot',
        timestamp: new Date(),
        senderName: 'Assistant AlertImmo'
      };
      setMessages([greeting]);
    }
  }, [isOpen]);

  const getBotResponse = (userMessage: string): string => {
    const msg = userMessage.toLowerCase();
    
    if (msg.includes('prix') || msg.includes('coût') || msg.includes('tarif')) {
      return botResponses.price;
    }
    if (msg.includes('propriété') || msg.includes('appartement') || msg.includes('maison') || msg.includes('villa')) {
      return botResponses.properties;
    }
    if (msg.includes('contact') || msg.includes('téléphone') || msg.includes('agent')) {
      return botResponses.contact;
    }
    if (msg.includes('bonjour') || msg.includes('salut') || msg.includes('hello')) {
      return botResponses.greeting;
    }
    
    return botResponses.default;
  };

  const connectToAgent = () => {
    const availableAgent = mockAgents.find(agent => agent.isOnline);
    if (availableAgent) {
      setCurrentAgent(availableAgent);
      setChatStatus('connected');
      
      const agentMessage: Message = {
        id: Date.now().toString(),
        text: `Bonjour ! Je suis ${availableAgent.name}, spécialisé dans ${availableAgent.speciality}. Comment puis-je vous aider ?`,
        sender: 'agent',
        timestamp: new Date(),
        senderName: availableAgent.name
      };
      
      setMessages(prev => [...prev, agentMessage]);
    } else {
      setChatStatus('waiting');
      const waitingMessage: Message = {
        id: Date.now().toString(),
        text: "Tous nos agents sont actuellement occupés. Laissez-nous votre message et nous vous recontacterons rapidement.",
        sender: 'bot',
        timestamp: new Date(),
        senderName: 'Assistant AlertImmo'
      };
      setMessages(prev => [...prev, waitingMessage]);
    }
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'user',
      timestamp: new Date(),
      senderName: user?.email || 'Vous'
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsTyping(true);

    // Simulate response delay
    setTimeout(() => {
      setIsTyping(false);
      
      let response: Message;
      
      if (chatStatus === 'bot') {
        const botText = getBotResponse(newMessage);
        response = {
          id: (Date.now() + 1).toString(),
          text: botText,
          sender: 'bot',
          timestamp: new Date(),
          senderName: 'Assistant AlertImmo'
        };

        // If bot suggests agent contact, offer the option
        if (botText === botResponses.price || botText === botResponses.contact || botText === botResponses.default) {
          setTimeout(() => {
            const followUp: Message = {
              id: (Date.now() + 2).toString(),
              text: "Souhaitez-vous que je vous mette en contact avec un de nos agents spécialisés ?",
              sender: 'bot',
              timestamp: new Date(),
              senderName: 'Assistant AlertImmo'
            };
            setMessages(prev => [...prev, followUp]);
          }, 1000);
        }
      } else {
        response = {
          id: (Date.now() + 1).toString(),
          text: "Merci pour votre message. Je vérifie les informations et vous réponds dans un instant...",
          sender: 'agent',
          timestamp: new Date(),
          senderName: currentAgent?.name || 'Agent'
        };
      }
      
      setMessages(prev => [...prev, response]);
    }, 1000 + Math.random() * 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 rounded-full h-14 w-14 shadow-lg hover:shadow-xl transition-all"
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <Card className={`fixed bottom-6 right-6 z-50 w-96 shadow-2xl transition-all ${
      isMinimized ? 'h-16' : 'h-[600px]'
    }`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <MessageCircle className="h-5 w-5 text-primary" />
            <div className="flex flex-col">
              <span>Support AlertImmo</span>
              {currentAgent ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground font-normal">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  {currentAgent.name}
                </div>
              ) : (
                <Badge variant="secondary" className="text-xs w-fit">
                  {chatStatus === 'bot' ? 'Assistant virtuel' : 'En attente...'}
                </Badge>
              )}
            </div>
          </CardTitle>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsMinimized(!isMinimized)}
            >
              <Minimize2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      {!isMinimized && (
        <CardContent className="flex flex-col h-full p-0">
          <ScrollArea className="flex-1 p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.sender !== 'user' && (
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    {message.sender === 'bot' ? (
                      <Bot className="h-4 w-4 text-primary" />
                    ) : (
                      <User className="h-4 w-4 text-primary" />
                    )}
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.sender === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString('fr-FR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
                <div className="bg-muted rounded-lg p-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </ScrollArea>

          {chatStatus === 'bot' && (
            <div className="px-4 py-2 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={connectToAgent}
                className="w-full"
              >
                Parler à un agent
              </Button>
            </div>
          )}

          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Tapez votre message..."
                className="flex-1"
                disabled={isTyping}
              />
              <Button 
                onClick={sendMessage} 
                size="icon"
                disabled={!newMessage.trim() || isTyping}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};