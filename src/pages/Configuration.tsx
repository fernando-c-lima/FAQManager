
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useTheme } from "@/components/ThemeProvider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Moon, Sun, Save, Bell, MessageSquare, Users } from "lucide-react";

export default function Configuration() {
  const { theme, setTheme } = useTheme();
  
  const [generalConfig, setGeneralConfig] = useState({
    emailNotifications: true,
    smsNotifications: false,
    appNotifications: true,
    autoReplyEnabled: true,
    analyticsEnabled: true,
    shareAnalytics: false,
    defaultLanguage: "pt-BR",
    timezone: "America/Sao_Paulo"
  });

  const [chatbotConfig, setChatbotConfig] = useState({
    maxMessagesPerDay: 1000,
    maxUsersPerChatbot: 500,
    enableWebhooks: true,
    defaultResponseTime: 5,
    autoAssignUsers: true,
    enableLogging: true
  });

  const handleToggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
    toast.success(`Tema alterado para ${theme === "light" ? "escuro" : "claro"}`);
  };

  const handleSaveConfig = (type: string) => {
    toast.success(`Configurações de ${type} salvas com sucesso!`);
  };

  const handleGeneralConfigChange = (key: string, value: any) => {
    setGeneralConfig({ ...generalConfig, [key]: value });
  };
  
  const handleChatbotConfigChange = (key: string, value: any) => {
    setChatbotConfig({ ...chatbotConfig, [key]: value });
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl font-bold mb-2">Configurações</h1>
        <p className="text-muted-foreground">Preferências e personalização da plataforma</p>
      </motion.div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="general">Geral</TabsTrigger>
          <TabsTrigger value="chatbot">Chatbots</TabsTrigger>
          <TabsTrigger value="appearance">Aparência</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notificações
                </CardTitle>
                <CardDescription>Configurações das notificações da plataforma</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="email-notifications">Notificações por Email</Label>
                  <Switch 
                    id="email-notifications" 
                    checked={generalConfig.emailNotifications}
                    onCheckedChange={(value) => handleGeneralConfigChange("emailNotifications", value)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="sms-notifications">Notificações por SMS</Label>
                  <Switch 
                    id="sms-notifications" 
                    checked={generalConfig.smsNotifications}
                    onCheckedChange={(value) => handleGeneralConfigChange("smsNotifications", value)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="app-notifications">Notificações no Aplicativo</Label>
                  <Switch 
                    id="app-notifications" 
                    checked={generalConfig.appNotifications}
                    onCheckedChange={(value) => handleGeneralConfigChange("appNotifications", value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Preferências de Mensagens
                </CardTitle>
                <CardDescription>Configurações para mensagens e chatbots</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-reply">Resposta Automática</Label>
                  <Switch 
                    id="auto-reply" 
                    checked={generalConfig.autoReplyEnabled}
                    onCheckedChange={(value) => handleGeneralConfigChange("autoReplyEnabled", value)}
                  />
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="language">Idioma Padrão</Label>
                    <Select 
                      value={generalConfig.defaultLanguage}
                      onValueChange={(value) => handleGeneralConfigChange("defaultLanguage", value)}
                    >
                      <SelectTrigger id="language">
                        <SelectValue placeholder="Selecione o idioma" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                        <SelectItem value="en-US">Inglês (EUA)</SelectItem>
                        <SelectItem value="es">Espanhol</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Fuso Horário</Label>
                    <Select 
                      value={generalConfig.timezone}
                      onValueChange={(value) => handleGeneralConfigChange("timezone", value)}
                    >
                      <SelectTrigger id="timezone">
                        <SelectValue placeholder="Selecione o fuso horário" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="America/Sao_Paulo">Brasília (GMT-3)</SelectItem>
                        <SelectItem value="America/New_York">Nova York (GMT-5)</SelectItem>
                        <SelectItem value="Europe/London">Londres (GMT+0)</SelectItem>
                        <SelectItem value="Asia/Tokyo">Tóquio (GMT+9)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Análises e Coleta de Dados</CardTitle>
                <CardDescription>Configure como os dados são coletados e utilizados</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="analytics-enabled">Ativar Análises</Label>
                  <Switch 
                    id="analytics-enabled" 
                    checked={generalConfig.analyticsEnabled}
                    onCheckedChange={(value) => handleGeneralConfigChange("analyticsEnabled", value)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="share-analytics">Compartilhar Dados Anônimos</Label>
                  <Switch 
                    id="share-analytics" 
                    checked={generalConfig.shareAnalytics}
                    onCheckedChange={(value) => handleGeneralConfigChange("shareAnalytics", value)}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button onClick={() => handleSaveConfig("preferências gerais")}>
                <Save className="h-4 w-4 mr-2" />
                Salvar Configurações
              </Button>
            </div>
          </motion.div>
        </TabsContent>

        <TabsContent value="chatbot">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Limites de Uso
                </CardTitle>
                <CardDescription>Configure os limites de uso para seus chatbots</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="max-messages">Máximo de Mensagens por Dia</Label>
                  <Input
                    id="max-messages"
                    type="number"
                    value={chatbotConfig.maxMessagesPerDay}
                    onChange={(e) => handleChatbotConfigChange("maxMessagesPerDay", parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max-users">Máximo de Usuários por Chatbot</Label>
                  <Input
                    id="max-users"
                    type="number"
                    value={chatbotConfig.maxUsersPerChatbot}
                    onChange={(e) => handleChatbotConfigChange("maxUsersPerChatbot", parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="response-time">Tempo de Resposta Padrão (segundos)</Label>
                  <Input
                    id="response-time"
                    type="number"
                    value={chatbotConfig.defaultResponseTime}
                    onChange={(e) => handleChatbotConfigChange("defaultResponseTime", parseInt(e.target.value))}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Integrações e Funcionalidades</CardTitle>
                <CardDescription>Configure recursos avançados para seus chatbots</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="webhooks">Ativar Webhooks</Label>
                  <Switch 
                    id="webhooks" 
                    checked={chatbotConfig.enableWebhooks}
                    onCheckedChange={(value) => handleChatbotConfigChange("enableWebhooks", value)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-assign">Atribuição Automática de Usuários</Label>
                  <Switch 
                    id="auto-assign" 
                    checked={chatbotConfig.autoAssignUsers}
                    onCheckedChange={(value) => handleChatbotConfigChange("autoAssignUsers", value)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="enable-logging">Ativar Logs Detalhados</Label>
                  <Switch 
                    id="enable-logging" 
                    checked={chatbotConfig.enableLogging}
                    onCheckedChange={(value) => handleChatbotConfigChange("enableLogging", value)}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button onClick={() => handleSaveConfig("chatbots")}>
                <Save className="h-4 w-4 mr-2" />
                Salvar Configurações
              </Button>
            </div>
          </motion.div>
        </TabsContent>

        <TabsContent value="appearance">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <Card>
              <CardHeader>
                <CardTitle>Tema</CardTitle>
                <CardDescription>Configure o tema da interface</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {theme === "light" ? (
                      <Sun className="h-5 w-5" />
                    ) : (
                      <Moon className="h-5 w-5" />
                    )}
                    <Label htmlFor="theme-toggle">
                      {theme === "light" ? "Tema Claro" : "Tema Escuro"}
                    </Label>
                  </div>
                  <Switch
                    id="theme-toggle"
                    checked={theme === "dark"}
                    onCheckedChange={handleToggleTheme}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
