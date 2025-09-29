# Guia de Integração de Nova Base – GovHub

# 1) Visão geral (como o projeto é organizado)

O GovHub é estruturado em módulos bem definidos dentro do repositório, cada um com uma responsabilidade clara. Isso facilita para qualquer pessoa nova entender **onde olhar** e **como começar** ao integrar uma nova base de dados.

#### **1.1. Orquestração – DAGs no Airflow**

* Local: `airflow_lappis/dags/**`
* Aqui ficam os **arquivos das DAGs**, que são os fluxos de execução no Airflow.
* Cada DAG define:

  * **Quando** rodar (agendamento com `schedule_interval`).
  * **Quais tarefas** executar (normalmente funções decoradas com `@task`).
  * **Dependência entre tarefas** (ordem de execução).
* Exemplo: uma DAG pode ter uma tarefa para buscar dados de uma API, outra para salvar no banco, e outra para disparar o processamento analítico.

---

#### **1.2. Clientes de APIs – Plugins**

* Local: `airflow_lappis/plugins/**`
* Cada sistema externo (PNCP, ComprasNet, SIAPE, etc.) tem seu próprio cliente, nomeado como `cliente_<sistema>.py`.
* A ideia é **encapsular toda a lógica de comunicação com o provedor** em uma classe separada, deixando a DAG mais limpa.
* Estrutura comum:

  * Herança de uma classe base (`cliente_base.py`) que já implementa comportamentos padrão: timeout, retries, logging básico.
  * Métodos específicos para endpoints da API (ex.: `get_contratacoes_publicacao` no cliente do PNCP).

---

#### **1.3. Helpers reutilizáveis**

* Local: `airflow_lappis/helpers/**`
* São **utilitários genéricos** que podem ser usados por qualquer cliente ou DAG.
* Exemplos:

  * `safe_request.py`: função para chamadas HTTP mais seguras (tratando erros, retornos vazios ou conteúdo não-JSON).
  * Funções de parsing, formatação de datas, manipulação de parâmetros.
* O objetivo é evitar duplicação de código: se você precisa de retry customizado ou de algo que já existe, basta importar o helper.

---

#### **1.4. Persistência – Banco de dados**

* Arquivos principais:

  * `cliente_postgres.py`: classe cliente para inserir dados no Postgres.
  * `postgres_helpers.py`: utilitários como a string de conexão (`get_postgres_conn`) e funções auxiliares para criar schema/tabelas.
* Normalmente, quando se integra uma nova base, você:

  * Usa o cliente da API para buscar os dados.
  * Usa o cliente do Postgres para criar um **novo schema** (um namespace no banco).
  * Insere os dados em uma **tabela correspondente** (com suporte a upsert, chaves primárias, etc.).

---

#### **1.5. Modelagem analítica (opcional)**

* Local: `airflow_lappis/dags/dbt/**`
* Após a ingestão bruta no Postgres, pode-se criar **modelos analíticos** usando dbt.
* Isso permite aplicar transformações em camadas (bronze, silver, gold) e preparar os dados para dashboards, relatórios e análises mais avançadas.
* É opcional: se a integração só precisa carregar dados brutos, não há necessidade de mexer no dbt.

---

#### **1.6. Logs – Monitoramento**

* O projeto usa `logging` em todas as classes e DAGs.
* Cada etapa da execução gera logs detalhados (tentativas de requisição, parâmetros usados, quantidade de registros coletados/inseridos).
* Isso garante rastreabilidade: você consegue saber exatamente onde falhou (na API, no banco, ou no parser) sem precisar adivinhar.

---

### Estrutura essencial (resumo do repositório)

```bash
airflow_lappis/
  ├── dags/
  │   ├── data_ingest/...       # Suas DAGs de ingestão
  │   └── dbt/                  # Modelagem analítica (dbt models)
  ├── helpers/
  │   ├── postgres_helpers.py   # Conexão e utilitários para Postgres
  │   └── safe_request.py       # Funções seguras para chamadas HTTP
  └── plugins/
      ├── cliente_base.py       # Classe base para APIs REST (httpx)
      ├── cliente_postgres.py   # Cliente para persistir dados no Postgres
      └── cliente_<nova_base>.py # Cliente que você cria ao integrar nova base
```

