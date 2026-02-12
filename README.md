# 🛒 E-commerce Frontend - React + TypeScript

Frontend moderno para e-commerce desenvolvido com React, TypeScript, Tailwind CSS e Vite. Interface completa para gerenciamento de produtos, categorias, pedidos e usuários, integrada com a API FastAPI.

## ✨ Features

### 🔐 Autenticação & Autorização
- ✅ Login com JWT (endpoint `/api/v1/auth/login/json`)
- ✅ Registro de novos usuários
- ✅ Protected Routes com redirecionamento automático
- ✅ Token JWT armazenado em localStorage
- ✅ Interceptor automático para injeção do token
- ✅ Tratamento de sessão expirada (401)
- ✅ Role-Based Access Control (Admin/Customer)

### 📦 Gestão de Produtos
- ✅ Listagem com busca em tempo real
- ✅ CRUD completo (admin only)
- ✅ Filtros por categoria
- ✅ Indicadores visuais de estoque
- ✅ Modal de criação/edição
- ✅ Validação de formulários

### 🏷️ Gestão de Categorias
- ✅ Listagem com busca
- ✅ CRUD completo (admin only)
- ✅ Exibição de slug
- ✅ Modal de criação/edição
- ✅ Validação antes de exclusão

### 🛒 Gestão de Pedidos
- ✅ Listagem de pedidos
- ✅ Criação de pedidos com múltiplos items
- ✅ Filtro por status
- ✅ Atualização de status (admin only)
- ✅ Cancelamento de pedidos
- ✅ Badges coloridos por status
- ✅ Cálculo automático de total

### 👥 Gestão de Usuários (Admin Only)
- ✅ Listagem com busca
- ✅ Toggle de role (admin/customer)
- ✅ Toggle de status (ativo/inativo)
- ✅ Exclusão de usuários
- ✅ Proteção contra auto-exclusão

### 🎨 Interface
- ✅ Design responsivo (mobile, tablet, desktop)
- ✅ Menu de navegação com indicador de rota ativa
- ✅ Dashboard com estatísticas
- ✅ Loading states
- ✅ Tratamento de erros gracioso
- ✅ Feedback visual para ações do usuário
- ✅ Ícones com Lucide React

## 🛠️ Stack Tecnológica

- **Framework**: React 18
- **Linguagem**: TypeScript
- **Build Tool**: Vite
- **Estilização**: Tailwind CSS
- **Roteamento**: React Router DOM v7
- **HTTP Client**: Axios
- **Ícones**: Lucide React
- **Linting**: ESLint

## 📋 Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- API FastAPI rodando (backend)

## 🚀 Como Rodar

### 1. Clone o repositório

```bash
git clone <seu-repositorio>
cd react-ecommerce-api
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_API_BASE_URL=http://localhost:8000
```

### 4. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em: http://localhost:5173

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── Layout.tsx              # Layout principal com navegação
│   └── ProtectedRoute.tsx      # Guarda de rotas autenticadas
├── context/
│   └── AuthContext.tsx         # Contexto de autenticação
├── hooks/
│   └── useAuth.ts              # Hook para consumir auth context
├── pages/
│   ├── Login.tsx               # Página de login
│   ├── Register.tsx            # Página de registro
│   ├── Dashboard.tsx           # Dashboard com estatísticas
│   ├── Products.tsx            # Gestão de produtos
│   ├── Categories.tsx          # Gestão de categorias
│   ├── Orders.tsx              # Gestão de pedidos
│   └── Users.tsx               # Gestão de usuários (admin)
├── services/
│   ├── api.ts                  # Configuração do Axios
│   ├── auth.ts                 # Serviço de autenticação
│   ├── products.ts             # Serviço de produtos
│   ├── categories.ts           # Serviço de categorias
│   ├── orders.ts               # Serviço de pedidos
│   └── users.ts                # Serviço de usuários
├── App.tsx                     # Configuração de rotas
└── main.tsx                    # Entry point
```

## 🔌 Integração com a API

### Formato de Resposta da API

Todas as respostas da API seguem o formato:

```json
{
  "success": true,
  "data": { ... },
  "message": "Success message"
}
```

Os services extraem automaticamente o campo `data`.

### Endpoints Utilizados

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/v1/auth/login/json` | Login (retorna JWT) |
| POST | `/api/v1/auth/register` | Registro de usuário |
| GET | `/api/v1/auth/me` | Dados do usuário logado |
| GET | `/api/v1/products` | Listar produtos |
| POST | `/api/v1/products` | Criar produto |
| PUT | `/api/v1/products/:id` | Atualizar produto |
| DELETE | `/api/v1/products/:id` | Deletar produto |
| GET | `/api/v1/categories` | Listar categorias |
| POST | `/api/v1/categories` | Criar categoria |
| GET | `/api/v1/orders` | Listar pedidos |
| POST | `/api/v1/orders` | Criar pedido |
| PATCH | `/api/v1/orders/:id/status` | Atualizar status |
| GET | `/api/v1/users` | Listar usuários (admin) |
| PATCH | `/api/v1/users/:id/role` | Alterar role (admin) |

## 🔐 Autenticação

### Fluxo de Autenticação

1. **Login**: Usuário envia credenciais para `/api/v1/auth/login/json`
2. **Token**: API retorna JWT no formato `{ data: { access_token, user } }`
3. **Armazenamento**: Token salvo em `localStorage`
4. **Interceptor**: Axios adiciona automaticamente `Authorization: Bearer {token}`
5. **Expiração**: Em 401, limpa token e redireciona para login

### Proteção de Rotas

```typescript
<Route path="/dashboard" element={
  <ProtectedRoute>
    <Dashboard />
  </ProtectedRoute>
} />
```

## 🎨 Componentes Principais

### Layout

Componente wrapper que adiciona:
- Navegação responsiva
- Menu mobile
- Informações do usuário
- Botão de logout
- Indicador de rota ativa

### Protected Route

Componente que:
- Verifica presença de token
- Redireciona para login se não autenticado
- Permite acesso se autenticado

## 📝 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview

# Linting
npm run lint

# Type checking
npm run typecheck
```

## 🐛 Troubleshooting

### Erro de CORS

**Problema**: `CORS policy: No 'Access-Control-Allow-Origin' header`

**Solução**: Configure CORS na API FastAPI:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Token undefined

**Problema**: `Bearer undefined` nos headers

**Solução**: Verifique se a API retorna o token no formato correto:
```json
{
  "data": {
    "access_token": "...",
    "user": {...}
  }
}
```

### Tela em branco ao navegar

**Problema**: Páginas ficam em branco

**Solução**: 
- Verifique se a API está respondendo corretamente
- Os services extraem `response.data.data` para compatibilidade com a API
- Verificar console do navegador para erros

### Redirect após 401

**Problema**: Usuário não é redirecionado ao expirar sessão

**Solução**: O interceptor do Axios trata automaticamente:
```typescript
if (error.response?.status === 401) {
  localStorage.removeItem('access_token');
  window.location.href = '/login';
}
```

## 🚢 Deploy

### Build de Produção

```bash
npm run build
```

Gera pasta `dist/` com arquivos otimizados.

### Variáveis de Ambiente

Configure no seu serviço de hosting:

```env
VITE_API_BASE_URL=https://sua-api.com
```
# 🐳 Docker - Frontend

## Arquivos
- `Dockerfile` - Build otimizado (Node + Nginx)
- `docker-compose.yml` - Produção
- `nginx.conf` - Configuração Nginx
- `.dockerignore` - Arquivos ignorados

## Uso

### Produção
```bash
docker-compose up -d --build
```
http://localhost:3000

### Comandos
```bash
# Ver logs
docker-compose logs -f
```

```bash
# Parar
docker-compose down
```

## Variáveis de Ambiente

Configure em `.env`:
```env
VITE_API_BASE_URL=http://localhost:8000
```

### Plataformas Recomendadas

- **Vercel**: Deploy automático com GitHub
- **Netlify**: CI/CD integrado
- **GitHub Pages**: Hosting gratuito
- **Railway**: Full-stack deploy

## 🔒 Boas Práticas de Segurança

- ✅ Token JWT armazenado apenas em localStorage
- ✅ Limpeza automática de token em 401
- ✅ Protected routes para páginas autenticadas
- ✅ Role-based access control
- ✅ Validação de formulários no frontend
- ✅ Sanitização de inputs

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'feat: add nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

### Padrão de Commits

Seguimos o padrão [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` Nova funcionalidade
- `fix:` Correção de bug
- `docs:` Documentação
- `style:` Formatação
- `refactor:` Refatoração
- `test:` Testes
- `chore:` Configurações

## 📄 Licença

Este projeto está sob a licença MIT.

## 👨‍💻 Autor

Desenvolvido como parte do projeto FastAPI E-commerce API

---

⭐ Se este projeto te ajudou, considere dar uma estrela!

## 📚 Links Úteis

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Vite Guide](https://vitejs.dev/guide/)
- [React Router](https://reactrouter.com/)
- [Axios Documentation](https://axios-http.com/docs/intro)
