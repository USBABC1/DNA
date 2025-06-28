# DNA - Deep Narrative Analysis

Uma plataforma profissional de análise narrativa profunda usando inteligência artificial avançada. Descubra padrões psicológicos através da sua narrativa pessoal.

## 🎯 Visão Geral

O DNA (Deep Narrative Analysis) é uma aplicação SaaS que permite aos usuários realizar sessões de análise psicológica através de respostas em áudio a perguntas cuidadosamente elaboradas. A plataforma utiliza tecnologias modernas para oferecer uma experiência segura, intuitiva e profissional.

### ✨ Funcionalidades Principais

- 🎤 **Gravação de Áudio**: Interface intuitiva para gravação de respostas
- 🔊 **Transcrição Automática**: Conversão de áudio para texto usando Deepgram
- 🔐 **Autenticação Segura**: Login via Google OAuth
- 💾 **Armazenamento Seguro**: Dados no Supabase e áudios no Google Drive
- 📊 **Dashboard Personalizado**: Acompanhamento de sessões e progresso
- 🎨 **Interface Moderna**: Design responsivo com Tailwind CSS
- 🔒 **Privacidade Total**: Políticas RLS e criptografia de dados

## 🏗️ Arquitetura Técnica

### Stack Tecnológico

- **Frontend & Backend**: Next.js 14 (App Router)
- **Autenticação**: NextAuth.js com Google Provider
- **Banco de Dados**: Supabase (PostgreSQL)
- **Armazenamento**: Google Drive API
- **Transcrição**: Deepgram API
- **UI/UX**: Tailwind CSS + shadcn/ui
- **Deploy**: Netlify
- **Linguagem**: TypeScript

### Fluxo de Dados

1. **Autenticação**: Google OAuth → NextAuth → Supabase
2. **Sessão**: Criação de sessão → Banco de dados
3. **Gravação**: Áudio → Transcrição (Deepgram) + Upload (Google Drive)
4. **Persistência**: Dados salvos no Supabase com RLS
5. **Análise**: Dashboard com progresso e estatísticas

## 🚀 Instalação e Configuração

### Pré-requisitos

- Node.js 18+ 
- Conta no Supabase
- Projeto no Google Cloud
- Conta na Deepgram
- Conta no Netlify (para deploy)

### 1. Clone e Instalação

```bash
git clone https://github.com/seu-usuario/dna-analysis.git
cd dna-analysis
npm install
```

### 2. Configuração do Banco de Dados (Supabase)

1. Crie um projeto em [Supabase](https://app.supabase.com)
2. Acesse SQL Editor
3. Execute o script `database_setup.sql`
4. Copie as credenciais da seção API

### 3. Configuração do Google Cloud

1. Acesse [Google Cloud Console](https://console.cloud.google.com)
2. Crie um novo projeto
3. Ative as APIs:
   - Google+ API
   - Google Drive API
4. Crie credenciais OAuth 2.0:
   - **JavaScript origins**: 
     - `http://localhost:3000`
     - `https://seu-app.netlify.app`
   - **Redirect URIs**:
     - `http://localhost:3000/api/auth/callback/google`
     - `https://seu-app.netlify.app/api/auth/callback/google`

### 4. Configuração da Deepgram

1. Crie uma conta em [Deepgram](https://console.deepgram.com)
2. Gere uma API Key no dashboard

### 5. Obter Refresh Token do Google Drive

1. Acesse [OAuth 2.0 Playground](https://developers.google.com/oauthplayground)
2. Configure com suas credenciais do Google Cloud
3. Autorize o escopo: `https://www.googleapis.com/auth/drive.file`
4. Troque o authorization code por tokens
5. Copie o `refresh_token`

### 6. Configuração das Variáveis de Ambiente

```bash
cp .env.example .env.local
```

Preencha todas as variáveis no arquivo `.env.local`:

```env
NEXTAUTH_SECRET=sua_chave_secreta_32_caracteres
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=seu_google_client_id
GOOGLE_CLIENT_SECRET=seu_google_client_secret
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima
SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role
DEEPGRAM_API_KEY=sua_chave_deepgram
GOOGLE_DRIVE_ADMIN_REFRESH_TOKEN=seu_refresh_token
GOOGLE_DRIVE_PARENT_FOLDER_ID=id_da_pasta_pai
```

### 7. Executar Localmente

```bash
npm run dev
```

Acesse: `http://localhost:3000`

## 🌐 Deploy na Netlify

### 1. Conectar Repositório

1. Faça push do código para GitHub
2. Conecte o repositório no Netlify
3. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`

### 2. Configurar Variáveis de Ambiente

No painel do Netlify, vá em Site configuration > Environment variables e adicione todas as variáveis do `.env.example`.

### 3. Atualizar URLs do Google Cloud

Após o deploy, atualize as URLs autorizadas no Google Cloud Console com a URL final do Netlify.

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/     # Configuração NextAuth
│   │   ├── sessions/               # API de sessões
│   │   └── transcribe/             # API de transcrição
│   ├── dashboard/                  # Dashboard do usuário
│   ├── globals.css                 # Estilos globais
│   ├── layout.tsx                  # Layout principal
│   └── page.tsx                    # Página inicial
├── components/
│   ├── ui/                         # Componentes base (shadcn/ui)
│   ├── AnalysisComponent.tsx       # Componente principal de análise
│   ├── AudioRecorder.tsx           # Gravador de áudio
│   └── AuthComponent.tsx           # Componente de autenticação
├── lib/
│   ├── supabase.ts                 # Cliente Supabase
│   └── utils.ts                    # Utilitários
└── services/
    └── googleDrive.ts              # Serviço Google Drive
```

## 🔒 Segurança

### Row Level Security (RLS)

- Todas as tabelas têm RLS habilitado
- Usuários só acessam seus próprios dados
- Políticas granulares por operação (SELECT, INSERT, UPDATE)

### Autenticação

- OAuth 2.0 com Google
- JWT tokens seguros
- Sessões com expiração automática

### Dados Sensíveis

- Áudios criptografados no Google Drive
- Chaves de API protegidas no servidor
- Comunicação HTTPS obrigatória

## 🎨 Interface do Usuário

### Design System

- **Cores**: Verde (#22c55e) como cor primária
- **Tipografia**: Inter (sans-serif) + JetBrains Mono
- **Componentes**: shadcn/ui + Radix UI
- **Ícones**: Lucide React
- **Responsividade**: Mobile-first design

### Experiência do Usuário

1. **Login Simples**: Um clique com Google
2. **Dashboard Intuitivo**: Visão geral das sessões
3. **Gravação Fluida**: Interface clara e feedback visual
4. **Progresso Visível**: Barra de progresso e navegação
5. **Transcrição Imediata**: Feedback em tempo real

## 📊 Funcionalidades Detalhadas

### Sistema de Sessões

- Criação automática de sessões
- 10 perguntas pré-definidas
- Navegação livre entre perguntas
- Salvamento automático de progresso

### Gravação de Áudio

- Gravação em tempo real
- Visualização de ondas sonoras
- Reprodução antes do envio
- Re-gravação ilimitada

### Transcrição Inteligente

- Processamento em português brasileiro
- Formatação automática
- Alta precisão com Deepgram
- Fallback para erros

### Armazenamento

- Áudios organizados por usuário no Google Drive
- Metadados no Supabase
- Backup automático
- Políticas de retenção

## 🔧 Desenvolvimento

### Scripts Disponíveis

```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build de produção
npm run start        # Servidor de produção
npm run lint         # Linting do código
npm run type-check   # Verificação de tipos
```

### Estrutura de Dados

#### analysis_sessions
- `id`: UUID da sessão
- `user_id`: Referência ao usuário
- `created_at`: Data de criação
- `final_synthesis`: Análise final (opcional)
- `status`: Status da sessão

#### user_responses
- `id`: UUID da resposta
- `session_id`: Referência à sessão
- `question_index`: Índice da pergunta (0-9)
- `question_text`: Texto da pergunta
- `transcript_text`: Transcrição da resposta
- `audio_file_drive_id`: ID do arquivo no Google Drive

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🆘 Suporte

Para suporte técnico ou dúvidas:

- 📧 Email: suporte@dna-analysis.com
- 📚 Documentação: [docs.dna-analysis.com](https://docs.dna-analysis.com)
- 🐛 Issues: [GitHub Issues](https://github.com/seu-usuario/dna-analysis/issues)

## 🙏 Agradecimentos

- [Next.js](https://nextjs.org/) - Framework React
- [Supabase](https://supabase.com/) - Backend as a Service
- [Deepgram](https://deepgram.com/) - API de transcrição
- [shadcn/ui](https://ui.shadcn.com/) - Componentes UI
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS

---

**DNA - Deep Narrative Analysis** - Descobrindo padrões profundos através da narrativa pessoal. 🧬✨

