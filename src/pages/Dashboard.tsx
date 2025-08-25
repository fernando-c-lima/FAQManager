
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MessageCircle, Smartphone, Smile, Frown, Bot, MessageSquare } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import BigNumber from "@/components/BigNumber";

interface ChatBot {
  id: string;
  name: string;
  description: string;
  platform: "telegram" | "whatsapp";
  active: boolean;
  clients: number;
  interactions: number;
  lastInteraction: string;
}

export default function Dashboard() {
  const navigate = useNavigate();
  
  const [chatbots] = useState<ChatBot[]>([
    {
      id: "1",
      name: "Atendimento Telegram",
      description: "Chatbot para atendimento ao cliente via Telegram.",
      platform: "telegram",
      active: true,
      clients: 245,
      interactions: 1320,
      lastInteraction: "2023-06-15T14:30:00"
    },
    {
      id: "2",
      name: "Vendas WhatsApp",
      description: "Chatbot para vendas e suporte pelo WhatsApp.",
      platform: "whatsapp",
      active: true,
      clients: 567,
      interactions: 4230,
      lastInteraction: "2023-06-15T15:45:00"
    },
    {
      id: "3",
      name: "FAQ Telegram",
      description: "Chatbot para responder perguntas frequentes no Telegram.",
      platform: "telegram",
      active: false,
      clients: 89,
      interactions: 430,
      lastInteraction: "2023-06-10T09:15:00"
    },
    {
      id: "4",
      name: "Suporte WhatsApp",
      description: "Chatbot para suporte técnico via WhatsApp.",
      platform: "whatsapp",
      active: true,
      clients: 320,
      interactions: 2150,
      lastInteraction: "2023-06-15T16:20:00"
    }
  ]);

  const activeChatbots = chatbots.filter(bot => bot.active);
  const inactiveChatbots = chatbots.filter(bot => !bot.active);

  const totalChatbots = chatbots.length;
  const activeChatbotsCount = activeChatbots.length;
  const totalClients = chatbots.reduce((acc, bot) => acc + bot.clients, 0);
  const totalInteractions = chatbots.reduce((acc, bot) => acc + bot.interactions, 0);

  const handleChatbotClick = (id: string) => {
    navigate(`/chatbot/${id}`);
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Gerencie seus chatbots de AI</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <BigNumber 
          title="Total de Chatbots" 
          value={totalChatbots} 
          icon={<Bot className="h-5 w-5" />}
          delay={0.1}
        />
        <BigNumber 
          title="Chatbots Ativos" 
          value={activeChatbotsCount} 
          icon={<Smile className="h-5 w-5" />}
          delay={0.2}
        />
        <BigNumber 
          title="Total de Clientes" 
          value={totalClients} 
          icon={<Smile className="h-5 w-5" />}
          delay={0.3}
        />
        <BigNumber 
          title="Total de Interações" 
          value={totalInteractions.toLocaleString()} 
          icon={<MessageSquare className="h-5 w-5" />}
          delay={0.4}
        />
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Smile className="h-5 w-5 text-green-500" />
            Chatbots Ativos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeChatbots.map((chatbot, index) => (
              <motion.div
                key={chatbot.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleChatbotClick(chatbot.id)}
              >
                <Card className="cursor-pointer hover:border-primary/50 transition-all duration-200">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <Badge variant={chatbot.platform === "telegram" ? "default" : "secondary"} className="mb-2">
                          {chatbot.platform === "telegram" ? (
                            <MessageCircle className="h-3 w-3 mr-1" />
                          ) : (
                            <Smartphone className="h-3 w-3 mr-1" />
                          )}
                          {chatbot.platform === "telegram" ? "Telegram" : "WhatsApp"}
                        </Badge>
                        <h3 className="font-semibold text-lg">{chatbot.name}</h3>
                        <p className="text-sm text-muted-foreground truncate-2">{chatbot.description}</p>
                      </div>
                      <Badge variant={chatbot.active ? "default" : "destructive"} className="ml-2">
                        {chatbot.active ? "Ativo" : "Inativo"}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Clientes</p>
                        <p className="text-sm font-medium">{chatbot.clients}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Interações</p>
                        <p className="text-sm font-medium">{chatbot.interactions}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {inactiveChatbots.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Frown className="h-5 w-5 text-red-500" />
              Chatbots Inativos
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {inactiveChatbots.map((chatbot, index) => (
                <motion.div
                  key={chatbot.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleChatbotClick(chatbot.id)}
                >
                  <Card className="cursor-pointer hover:border-primary/50 transition-all duration-200 opacity-70">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <Badge variant="outline" className="mb-2">
                            {chatbot.platform === "telegram" ? (
                              <MessageCircle className="h-3 w-3 mr-1" />
                            ) : (
                              <Smartphone className="h-3 w-3 mr-1" />
                            )}
                            {chatbot.platform === "telegram" ? "Telegram" : "WhatsApp"}
                          </Badge>
                          <h3 className="font-semibold text-lg">{chatbot.name}</h3>
                          <p className="text-sm text-muted-foreground truncate-2">{chatbot.description}</p>
                        </div>
                        <Badge variant="destructive" className="ml-2">
                          Inativo
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                          <p className="text-xs text-muted-foreground">Clientes</p>
                          <p className="text-sm font-medium">{chatbot.clients}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Interações</p>
                          <p className="text-sm font-medium">{chatbot.interactions}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
