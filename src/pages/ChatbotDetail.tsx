
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  Users, 
  MessageSquare, 
  ArrowLeft, 
  Calendar,
  Trash2,
  Plus,
  Save,
  Edit,
  RefreshCw,
  FileText
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import BigNumber from "@/components/BigNumber";

interface ChatLog {
  id: string;
  timestamp: string;
  user: string;
  message: string;
  response: string;
}

interface ChangeLog {
  id: string;
  timestamp: string;
  user: string;
  change: string;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export default function ChatbotDetail() {
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [chatbot, setChatbot] = useState<any>(null);
  const [chatLogs, setChatLogs] = useState<ChatLog[]>([]);
  const [changeLogs, setChangeLogs] = useState<ChangeLog[]>([]);
  const [generalInfo, setGeneralInfo] = useState("");
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [newFAQ, setNewFAQ] = useState({ question: "", answer: "" });
  const [editingFAQ, setEditingFAQ] = useState<string | null>(null);
  
  // Dados de interações por dia (simulado)
  const [interactionData, setInteractionData] = useState([]);

  useEffect(() => {
    // Simulando carregamento de dados
    const loadData = async () => {
      await new Promise(resolve => setTimeout(resolve, 800));

      // Dados do chatbot
      const mockChatbot = {
        id,
        name: id === "1" ? "Atendimento Telegram" : id === "2" ? "Vendas WhatsApp" : id === "3" ? "FAQ Telegram" : "Suporte WhatsApp",
        description: "Chatbot para atendimento ao cliente e suporte técnico.",
        platform: id === "1" || id === "3" ? "telegram" : "whatsapp",
        active: id !== "3",
        clients: id === "1" ? 245 : id === "2" ? 567 : id === "3" ? 89 : 320,
        interactions: id === "1" ? 1320 : id === "2" ? 4230 : id === "3" ? 430 : 2150,
        interactionsToday: id === "1" ? 58 : id === "2" ? 145 : id === "3" ? 0 : 87,
        trainingSessions: id === "1" ? 12 : id === "2" ? 20 : id === "3" ? 5 : 15,
      };

      // Dados de interações por dia (últimos 7 dias)
      const mockInteractionData = [
        { date: "03/06", interacoes: 45 },
        { date: "04/06", interacoes: 72 },
        { date: "05/06", interacoes: 63 },
        { date: "06/06", interacoes: 91 },
        { date: "07/06", interacoes: 104 },
        { date: "08/06", interacoes: 85 },
        { date: "09/06", interacoes: mockChatbot.interactionsToday },
      ];

      // Logs de chat
      const mockChatLogs = [
        {
          id: "log1",
          timestamp: "2023-06-09T14:30:00",
          user: "João Silva",
          message: "Como posso resetar minha senha?",
          response: "Para resetar sua senha, acesse a página de login e clique em 'Esqueci minha senha'."
        },
        {
          id: "log2",
          timestamp: "2023-06-09T14:15:00",
          user: "Maria Oliveira",
          message: "Qual o horário de atendimento?",
          response: "Nosso horário de atendimento é de segunda a sexta, das 8h às 18h."
        },
        {
          id: "log3",
          timestamp: "2023-06-09T13:45:00",
          user: "Carlos Mendes",
          message: "Como faço para acessar meu pedido?",
          response: "Para acessar seu pedido, entre na seção 'Meus Pedidos' no seu perfil."
        },
        {
          id: "log4",
          timestamp: "2023-06-09T13:20:00",
          user: "Ana Costa",
          message: "Vocês aceitam pagamento via Pix?",
          response: "Sim, aceitamos pagamento via Pix. Na hora de finalizar o pedido, selecione a opção Pix."
        },
        {
          id: "log5",
          timestamp: "2023-06-09T12:50:00",
          user: "Pedro Santos",
          message: "Qual o prazo de entrega para São Paulo?",
          response: "O prazo de entrega para São Paulo é de 2 a 3 dias úteis."
        }
      ];

      // Logs de alterações no arquivo de treinamento
      const mockChangeLogs = [
        {
          id: "change1",
          timestamp: "2023-06-08T16:45:00",
          user: "Admin",
          change: "Atualização da FAQ sobre métodos de pagamento."
        },
        {
          id: "change2",
          timestamp: "2023-06-07T11:20:00",
          user: "Admin",
          change: "Adição de informações sobre novos produtos no conhecimento geral."
        },
        {
          id: "change3",
          timestamp: "2023-06-06T14:30:00",
          user: "Admin",
          change: "Correção nas respostas sobre prazos de entrega."
        },
        {
          id: "change4",
          timestamp: "2023-06-05T10:15:00",
          user: "Admin",
          change: "Inclusão de FAQ sobre processo de troca e devolução."
        }
      ];

      // FAQs e informações gerais para treinamento
      const mockFAQs = [
        {
          id: "faq1",
          question: "Como faço para resetar minha senha?",
          answer: "Para resetar sua senha, acesse a página de login e clique em 'Esqueci minha senha'. Você receberá um e-mail com instruções para criar uma nova senha."
        },
        {
          id: "faq2",
          question: "Qual o prazo de entrega?",
          answer: "O prazo de entrega varia de acordo com a sua localização. Para capitais, o prazo é de 2 a 3 dias úteis. Para demais localidades, o prazo é de 3 a 7 dias úteis."
        },
        {
          id: "faq3",
          question: "Vocês aceitam pagamento via Pix?",
          answer: "Sim, aceitamos pagamento via Pix. Na hora de finalizar o pedido, selecione a opção Pix e siga as instruções para realizar o pagamento."
        }
      ];

      const mockGeneralInfo = `Nossa empresa oferece diversos produtos e serviços para atender às necessidades do cliente. Estamos no mercado há mais de 10 anos e temos como missão proporcionar a melhor experiência de atendimento.

Política de Privacidade: Respeitamos a privacidade dos nossos clientes e não compartilhamos dados pessoais com terceiros sem consentimento.

Horário de Atendimento: Segunda a sexta, das 8h às 18h. Sábados das 9h às 13h.

Endereço: Av. Principal, 1000 - Centro, São Paulo - SP, 01234-567

Formas de Pagamento: Cartão de crédito, débito, Pix, boleto bancário e transferência bancária.`;

      setChatbot(mockChatbot);
      setInteractionData(mockInteractionData);
      setChatLogs(mockChatLogs);
      setChangeLogs(mockChangeLogs);
      setFaqs(mockFAQs);
      setGeneralInfo(mockGeneralInfo);
      setIsLoading(false);
    };

    loadData();
  }, [id]);

  const handleSaveGeneralInfo = () => {
    // Simulando salvamento da informação geral
    const newChangeLog = {
      id: `change${changeLogs.length + 1}`,
      timestamp: new Date().toISOString(),
      user: "Admin",
      change: "Atualização das informações gerais do chatbot."
    };
    
    setChangeLogs([newChangeLog, ...changeLogs]);
    toast.success("Informações gerais atualizadas com sucesso!");
  };

  const handleAddFAQ = () => {
    if (!newFAQ.question || !newFAQ.answer) {
      toast.error("Preencha todos os campos da FAQ");
      return;
    }
    
    const newFAQItem = {
      id: `faq${faqs.length + 1}`,
      ...newFAQ
    };
    
    setFaqs([...faqs, newFAQItem]);
    setNewFAQ({ question: "", answer: "" });
    
    const newChangeLog = {
      id: `change${changeLogs.length + 1}`,
      timestamp: new Date().toISOString(),
      user: "Admin",
      change: `Adição de nova FAQ: "${newFAQ.question.substring(0, 30)}..."`
    };
    
    setChangeLogs([newChangeLog, ...changeLogs]);
    toast.success("FAQ adicionada com sucesso!");
  };

  const handleEditFAQ = (faqId: string) => {
    setEditingFAQ(faqId);
  };

  const handleUpdateFAQ = (faqId: string, updatedQuestion: string, updatedAnswer: string) => {
    const updatedFAQs = faqs.map(faq => {
      if (faq.id === faqId) {
        return { ...faq, question: updatedQuestion, answer: updatedAnswer };
      }
      return faq;
    });
    
    setFaqs(updatedFAQs);
    setEditingFAQ(null);
    
    const newChangeLog = {
      id: `change${changeLogs.length + 1}`,
      timestamp: new Date().toISOString(),
      user: "Admin",
      change: `Atualização da FAQ: "${updatedQuestion.substring(0, 30)}..."`
    };
    
    setChangeLogs([newChangeLog, ...changeLogs]);
    toast.success("FAQ atualizada com sucesso!");
  };

  const handleDeleteFAQ = (faqId: string) => {
    const faqToDelete = faqs.find(faq => faq.id === faqId);
    const updatedFAQs = faqs.filter(faq => faq.id !== faqId);
    
    setFaqs(updatedFAQs);
    
    const newChangeLog = {
      id: `change${changeLogs.length + 1}`,
      timestamp: new Date().toISOString(),
      user: "Admin",
      change: `Remoção da FAQ: "${faqToDelete?.question.substring(0, 30)}..."`
    };
    
    setChangeLogs([newChangeLog, ...changeLogs]);
    toast.success("FAQ removida com sucesso!");
  };

  const handleToggleChatbotStatus = () => {
    setChatbot({
      ...chatbot,
      active: !chatbot.active
    });
    
    toast.success(`Chatbot ${chatbot.active ? "desativado" : "ativado"} com sucesso!`);
  };

  const handleRetrainChatbot = () => {
    toast.success("Solicitação de retreino enviada com sucesso! O chatbot será atualizado em breve.");
    
    const newChangeLog = {
      id: `change${changeLogs.length + 1}`,
      timestamp: new Date().toISOString(),
      user: "Admin",
      change: "Solicitação de retreinamento do chatbot."
    };
    
    setChangeLogs([newChangeLog, ...changeLogs]);
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center py-24">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to="/dashboard">
              <Button variant="outline" size="icon" className="mr-2">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                {chatbot.name}
                <Badge variant={chatbot.active ? "success" : "destructive"}>
                  {chatbot.active ? "Ativo" : "Inativo"}
                </Badge>
              </h1>
              <p className="text-muted-foreground">{chatbot.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="chatbot-status">
                {chatbot.active ? "Ativo" : "Inativo"}
              </Label>
              <Switch
                id="chatbot-status"
                checked={chatbot.active}
                onCheckedChange={handleToggleChatbotStatus}
              />
            </div>
            <Button onClick={handleRetrainChatbot}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Retreinar
            </Button>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <Card className="lg:col-span-4">
          <CardContent className="p-6">
            <BigNumber 
              title="Total de Clientes" 
              value={chatbot.clients} 
              icon={<Users className="h-5 w-5" />}
            />
          </CardContent>
        </Card>
        <Card className="lg:col-span-4">
          <CardContent className="p-6">
            <BigNumber 
              title="Total de Interações" 
              value={chatbot.interactions.toLocaleString()} 
              icon={<MessageSquare className="h-5 w-5" />}
              delay={0.1}
            />
          </CardContent>
        </Card>
        <Card className="lg:col-span-4">
          <CardContent className="p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="h-full"
            >
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Interações (últimos 7 dias)</h3>
              <ResponsiveContainer width="100%" height={100}>
                <LineChart data={interactionData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false}
                    tickLine={false}
                    tickMargin={8}
                    fontSize={12}
                  />
                  <YAxis hide />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="interacoes" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2} 
                    dot={{ strokeWidth: 2 }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="logs">
        <TabsList className="mb-4">
          <TabsTrigger value="logs">Logs de Interação</TabsTrigger>
          <TabsTrigger value="training">Treinamento</TabsTrigger>
        </TabsList>

        <TabsContent value="logs">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Histórico de Interações
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {chatLogs.map((log) => (
                    <motion.div
                      key={log.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="border rounded-lg p-4 space-y-3"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-medium">{log.user}</span>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(log.timestamp), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                          </p>
                        </div>
                      </div>
                      <div className="pl-4 border-l-2 border-muted">
                        <p className="text-sm">{log.message}</p>
                      </div>
                      <div className="bg-muted/30 rounded-lg p-3">
                        <p className="text-sm">{log.response}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="training">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Treinamento do Chatbot
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="knowledge">
                  <TabsList className="mb-4">
                    <TabsTrigger value="knowledge">Conhecimento Geral</TabsTrigger>
                    <TabsTrigger value="faq">Perguntas Frequentes</TabsTrigger>
                    <TabsTrigger value="history">Histórico de Mudanças</TabsTrigger>
                  </TabsList>

                  <TabsContent value="knowledge">
                    <div className="space-y-4">
                      <label className="text-sm font-medium">
                        Informações Gerais para Treinamento
                      </label>
                      <Textarea
                        value={generalInfo}
                        onChange={(e) => setGeneralInfo(e.target.value)}
                        className="min-h-[300px]"
                        placeholder="Insira informações gerais para treinamento do chatbot..."
                      />
                      <div className="flex justify-end">
                        <Button onClick={handleSaveGeneralInfo}>
                          <Save className="h-4 w-4 mr-2" />
                          Salvar Alterações
                        </Button>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="faq">
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="font-medium">Adicionar Nova FAQ</h3>
                        <div className="space-y-3">
                          <div className="space-y-2">
                            <Label htmlFor="new-question">Pergunta</Label>
                            <Input
                              id="new-question"
                              value={newFAQ.question}
                              onChange={(e) => setNewFAQ({ ...newFAQ, question: e.target.value })}
                              placeholder="Digite a pergunta..."
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="new-answer">Resposta</Label>
                            <Textarea
                              id="new-answer"
                              value={newFAQ.answer}
                              onChange={(e) => setNewFAQ({ ...newFAQ, answer: e.target.value })}
                              placeholder="Digite a resposta..."
                              className="min-h-[100px]"
                            />
                          </div>
                          <div className="flex justify-end">
                            <Button onClick={handleAddFAQ}>
                              <Plus className="h-4 w-4 mr-2" />
                              Adicionar FAQ
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="font-medium">Perguntas Frequentes Existentes</h3>
                        {faqs.map((faq) => (
                          <motion.div
                            key={faq.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="border rounded-lg p-4 space-y-3"
                          >
                            {editingFAQ === faq.id ? (
                              <div className="space-y-3">
                                <div className="space-y-2">
                                  <Label htmlFor={`edit-question-${faq.id}`}>Pergunta</Label>
                                  <Input
                                    id={`edit-question-${faq.id}`}
                                    defaultValue={faq.question}
                                    ref={(input) => input && input.focus()}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor={`edit-answer-${faq.id}`}>Resposta</Label>
                                  <Textarea
                                    id={`edit-answer-${faq.id}`}
                                    defaultValue={faq.answer}
                                    className="min-h-[100px]"
                                  />
                                </div>
                                <div className="flex justify-end space-x-2">
                                  <Button
                                    variant="outline"
                                    onClick={() => setEditingFAQ(null)}
                                  >
                                    Cancelar
                                  </Button>
                                  <Button
                                    onClick={() => {
                                      const questionEl = document.getElementById(`edit-question-${faq.id}`) as HTMLInputElement;
                                      const answerEl = document.getElementById(`edit-answer-${faq.id}`) as HTMLTextAreaElement;
                                      handleUpdateFAQ(faq.id, questionEl.value, answerEl.value);
                                    }}
                                  >
                                    Salvar
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <div className="flex justify-between items-start">
                                  <h4 className="font-medium">{faq.question}</h4>
                                  <div className="flex space-x-1">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleEditFAQ(faq.id)}
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="text-destructive hover:text-destructive"
                                      onClick={() => handleDeleteFAQ(faq.id)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                                <p className="text-sm text-muted-foreground">{faq.answer}</p>
                              </>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="history">
                    <div className="space-y-4">
                      <h3 className="font-medium">Histórico de Alterações</h3>
                      {changeLogs.map((log) => (
                        <motion.div
                          key={log.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="border rounded-lg p-4"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">{log.change}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <p className="text-xs text-muted-foreground">
                                  {format(new Date(log.timestamp), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  por {log.user}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">
                                {format(new Date(log.timestamp), "dd MMM", { locale: ptBR })}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
