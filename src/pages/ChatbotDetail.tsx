import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Users, MessageSquare, ArrowLeft, Calendar, Trash2, Plus, Save, Edit, RefreshCw, FileText } from "lucide-react";
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

interface FAQ {
  id: string;
  pergunta: string;
  resposta: string;
}

export default function ChatbotDetail() {
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [chatbot, setChatbot] = useState<any>({
    name: "",
    description: "",
    active: true,
    clients: 0,
    interactions: 0,
    interactionsToday: 0,
    trainingSessions: 0,
  });
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [newFAQ, setNewFAQ] = useState({ pergunta: "", resposta: "" });
  const [editingFAQ, setEditingFAQ] = useState<string | null>(null);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
  const loadData = async () => {
    try {
      setIsLoading(true);

      const response = await fetch(`${API_URL}/faq`);
      console.log("Resposta da API:", response);

      const data = await response.json();
      console.log("Dados convertidos em JSON:", data);

      setFaqs(data);

    } catch (error) {
      toast.error("Erro ao carregar dados do chatbot.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  loadData();
}, []);


  useEffect(() => {
  const loadVectorFiles = async () => {
    try {
      const response = await fetch(`${API_URL}/vector-files`);
      const files = await response.json();
      console.log("Arquivos da vector store:", files);
      // aqui você pode salvar em state se quiser
    } catch (err) {
      console.error("Erro ao carregar vector store", err);
    }
  };

  loadVectorFiles();
}, []);


  const handleAddFAQ = async () => {
    if (!newFAQ.pergunta || !newFAQ.resposta) {
      toast.error("Preencha todos os campos da FAQ");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/faq/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newFAQ),
      });
      const createdFAQ = await response.json();
      setFaqs([...faqs, createdFAQ]);
      setNewFAQ({ pergunta: "", resposta: "" });
      toast.success("FAQ adicionada com sucesso!");
    } catch (error) {
      toast.error("Erro ao adicionar FAQ.");
      console.error(error);
    }
  };

  const handleUpdateFAQ = async (faqId: string, updatedQuestion: string, updatedAnswer: string) => {
    try {
      const response = await fetch(`${API_URL}/faq/${faqId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pergunta: updatedQuestion, resposta: updatedAnswer }),
      });
      const updatedFAQ = await response.json();
      setFaqs(faqs.map(faq => faq.id === faqId ? updatedFAQ : faq));
      setEditingFAQ(null);
      toast.success("FAQ atualizada com sucesso!");
    } catch (error) {
      toast.error("Erro ao atualizar FAQ.");
      console.error(error);
    }
  };

  const handleDeleteFAQ = async (faqId: string) => {
    try {
      await fetch(`${API_URL}/faq/${faqId}`, { method: "DELETE" });
      setFaqs(faqs.filter(faq => faq.id !== faqId));
      toast.success("FAQ removida com sucesso!");
    } catch (error) {
      toast.error("Erro ao remover FAQ.");
      console.error(error);
    }
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
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
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
              <Label htmlFor="chatbot-status">{chatbot.active ? "Ativo" : "Inativo"}</Label>
              <Switch id="chatbot-status" checked={chatbot.active} onCheckedChange={() => setChatbot({ ...chatbot, active: !chatbot.active })} />
            </div>
            <Button onClick={() => toast.success("Solicitação de retreino enviada!")}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Retreinar
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Métricas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <Card className="lg:col-span-4">
          <CardContent className="p-6">
            <BigNumber title="Total de Clientes" value={chatbot.clients} icon={<Users className="h-5 w-5" />} />
          </CardContent>
        </Card>
        <Card className="lg:col-span-4">
          <CardContent className="p-6">
            <BigNumber title="Total de Interações" value={chatbot.interactions.toLocaleString()} icon={<MessageSquare className="h-5 w-5" />} delay={0.1} />
          </CardContent>
        </Card>
      </div>

      {/* Tabs FAQ / Histórico */}
      <Tabs defaultValue="faq">
        <TabsList className="mb-4">
          <TabsTrigger value="faq">Perguntas Frequentes</TabsTrigger>
        </TabsList>

        <TabsContent value="faq">
          <div className="space-y-6">
            {/* Adicionar FAQ */}
            <div className="space-y-4">
              <h3 className="font-medium">Adicionar Nova FAQ</h3>
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="new-question">Pergunta</Label>
                  <Input id="new-question" value={newFAQ.pergunta} onChange={(e) => setNewFAQ({ ...newFAQ, pergunta: e.target.value })} placeholder="Digite a pergunta..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-answer">Resposta</Label>
                  <Textarea id="new-answer" value={newFAQ.resposta} onChange={(e) => setNewFAQ({ ...newFAQ, resposta: e.target.value })} placeholder="Digite a resposta..." className="min-h-[100px]" />
                </div>
                <div className="flex justify-end">
                  <Button onClick={handleAddFAQ}>
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar FAQ
                  </Button>
                </div>
              </div>
            </div>

            {/* FAQs existentes */}
            <div className="space-y-4">
              <h3 className="font-medium">Perguntas Frequentes Existentes</h3>
              {faqs.map((faq) => (
                <motion.div key={faq.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border rounded-lg p-4 space-y-3">
                  {editingFAQ === faq.id ? (
                    <div className="space-y-3">
                      <Input defaultValue={faq.pergunta} id={`edit-question-${faq.id}`} autoFocus />
                      <Textarea defaultValue={faq.resposta} id={`edit-answer-${faq.id}`} className="min-h-[100px]" />
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setEditingFAQ(null)}>Cancelar</Button>
                        <Button onClick={() => {
                          const questionEl = document.getElementById(`edit-question-${faq.id}`) as HTMLInputElement;
                          const answerEl = document.getElementById(`edit-answer-${faq.id}`) as HTMLTextAreaElement;
                          handleUpdateFAQ(faq.id, questionEl.value, answerEl.value);
                        }}>Salvar</Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium">{faq.pergunta}</h4>
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="sm" onClick={() => setEditingFAQ(faq.id)}><Edit className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => handleDeleteFAQ(faq.id)}><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{faq.resposta}</p>
                    </>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
