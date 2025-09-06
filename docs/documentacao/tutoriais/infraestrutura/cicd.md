# CI/CD - Integração e Entrega Contínua

Este documento descreve a configuração de CI/CD (Continuous Integration/Continuous Deployment) para o projeto GovHub, incluindo a documentação MkDocs e os containers Docker.

## Visão Geral

O projeto utiliza GitHub Actions para automatizar os processos de:

- **Integração Contínua (CI)**: Validação, testes e build automático
- **Entrega Contínua (CD)**: Deploy automático para diferentes ambientes

## Workflows Configurados

### 1. Deploy da Documentação (`deploy.yml`)

Automatiza o deploy da documentação MkDocs para GitHub Pages.

**Triggers:**
- Push para branches `main` ou `master`
- Pull requests
- Execução manual

**Funcionalidades:**
- Build da documentação MkDocs
- Deploy automático para GitHub Pages
- Validação em Pull Requests
- Cache de dependências para melhor performance

**Configuração necessária:**
```yaml
# No repositório GitHub, configure:
# Settings > Pages > Source: GitHub Actions
```

**Variáveis de ambiente opcionais:**
- `GOOGLE_ANALYTICS_KEY`: Chave do Google Analytics

### 2. Deploy Docker (`docker-deploy.yml`)

Constrói e publica imagens Docker do projeto.

**Triggers:**
- Push para branches principais
- Tags de versão (`v*`)
- Pull requests (apenas build, sem push)

**Funcionalidades:**
- Build multi-arquitetura (AMD64, ARM64)
- Push para GitHub Container Registry
- Versionamento automático baseado em tags
- Deploy para ambientes de staging e produção

**Imagens geradas:**
```bash
ghcr.io/govhub-br/govhub:latest
ghcr.io/govhub-br/govhub:main
ghcr.io/govhub-br/govhub:v1.0.0
```

### 3. Validação da Documentação (`docs-validation.yml`)

Valida a qualidade e integridade da documentação.

**Triggers:**
- Push e Pull Requests
- Execução semanal automática
- Execução manual

**Validações realizadas:**
- Configuração do MkDocs
- Links internos e externos
- Arquivos órfãos
- Estrutura da documentação
- Estatísticas de conteúdo

## Configuração do Ambiente

### Pré-requisitos

1. **GitHub Pages habilitado:**
   ```
   Settings > Pages > Source: GitHub Actions
   ```

2. **Secrets configurados (opcional):**
   ```
   GOOGLE_ANALYTICS_KEY: Sua chave do Google Analytics
   ```

3. **Permissões do repositório:**
   ```
   Settings > Actions > General > Workflow permissions: Read and write
   ```

### Estrutura de Branches

- `main`/`master`: Branch principal, deploys automáticos
- `develop`: Branch de desenvolvimento
- Feature branches: Validação via PR

## Ambientes de Deploy

### Documentação (GitHub Pages)
- **URL**: `https://govhub-br.github.io/govhub/`
- **Deploy**: Automático em push para main
- **Tecnologia**: MkDocs Material

### Container Registry
- **Registry**: GitHub Container Registry (ghcr.io)
- **Imagens**: Multi-arquitetura (AMD64, ARM64)
- **Versionamento**: Baseado em Git tags e branches

## Monitoramento e Logs

### Visualização de Workflows
```bash
# Acesse: https://github.com/GovHub-br/govhub/actions
```

### Status Badges
Adicione ao README.md:
```markdown
![Deploy Status](https://github.com/GovHub-br/govhub/workflows/Deploy%20MkDocs%20to%20GitHub%20Pages/badge.svg)
![Docker Build](https://github.com/GovHub-br/govhub/workflows/Build%20and%20Deploy%20Docker%20Container/badge.svg)
```

## Desenvolvimento Local

### Testando a Documentação
```bash
# Instalar dependências
pip install -r requirements.txt
pip install mkdocs-material[recommended,imaging]

# Servir localmente
mkdocs serve

# Build para produção
mkdocs build --strict
```

### Testando o Container
```bash
# Build local
docker build -t govhub-docs .

# Executar localmente
docker run -p 8000:8000 govhub-docs

# Usando docker-compose
docker-compose up govhub-docs
```

## Troubleshooting

### Problemas Comuns

1. **Build falha no GitHub Actions:**
   - Verifique se todas as dependências estão no `requirements.txt`
   - Confirme que o `mkdocs.yml` está válido

2. **Deploy não funciona:**
   - Verifique se GitHub Pages está habilitado
   - Confirme as permissões do workflow

3. **Links quebrados:**
   - Execute `mkdocs build --strict` localmente
   - Use o workflow de validação para identificar problemas

### Logs e Debug

```bash
# Ver logs detalhados do MkDocs
mkdocs build --verbose

# Validar configuração
mkdocs config

# Testar plugins
mkdocs serve --verbose
```

## Migração do GitLab

Para a maioria das aplicações estamos usando imagens de containers públicos, porém para o caso do Airflow é necessário instalar algumas dependências para garantir que temos todas as bibliotecas necessárias para rodar das DAGs, para esse caso foi implementado um passo extra no CI do gitlab garantido que qualquer mudança no `Dockerfile` ou no `requirements.txt` gere uma versão nova da imagem do Airflow e publique a mesma no repositório público do gitlab.

O processo de atualização da imagem do Airflow ficou manual para garantir que o usuário que atualizou as dependências se responsabilize por subir a imagem nova e verificar que nada quebrou no processo de atualização.

**Nota**: Com a migração para GitHub Actions, este processo foi automatizado e melhorado com validações adicionais.
