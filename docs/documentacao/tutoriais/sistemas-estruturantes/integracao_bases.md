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


---


# 2) Checklist de integração (ordem recomendada)

### (a) Estudo inicial da API do provedor<br>

Antes de escrever qualquer código, é fundamental **entender bem a API** que será integrada. Isso envolve:

* **Base URL**: qual é a raiz dos endpoints (ex.: `https://contratos.comprasnet.gov.br/api`).
* **Autenticação**: é aberta ou precisa de token/certificado/usuário e senha?
* **Formato de resposta**: retorna sempre JSON? Pode devolver XML, CSV ou até HTML em caso de erro?
* **Paginação**: a API retorna todos os dados de uma vez ou exige navegar página por página (parâmetros como `pagina=1,2,...`)?
* **Headers obrigatórios**: geralmente `accept: application/json`, mas pode haver exigências de chave de API, user-agent, etc.
* **Limites de uso (rate limits)**: existe limite de chamadas por minuto/hora? Se sim, precisamos considerar `sleep` ou retentativas.

Essa etapa é essencial porque define a forma como vamos estruturar o cliente e o fluxo da DAG.
A dica prática é: **testar manualmente a API** com `curl`, Postman ou até `requests` em Python antes de começar a codar.

---

### (b) Criação do **cliente** da base (`plugins/cliente_<nova_base>.py`)<br>

O cliente é a camada que encapsula todas as chamadas à API. Ele **herda de `ClienteBase`** (classe comum que já configura `httpx`, timeout e retries) e define métodos específicos para cada endpoint.

##### Estrutura típica

1. **Definições principais**:

    * `BASE_URL`: raiz da API.
    * `BASE_HEADER`: headers padrão.

2. **Construtor (`__init__`)**:

    * Chama o `super().__init__` passando a `BASE_URL`.
    * Registra logs para indicar a inicialização do cliente.

3. **Métodos por endpoint**:

    * Nomeados com clareza, ex.: `get_contratos_by_ug`, `get_faturas_by_contrato_id`.
    * Fazem a chamada com `self.request` (já herdado do `ClienteBase`).
    * Validam o status da resposta.
    * Retornam a lista ou `None`.

---

##### Exemplo (trecho simplificado do `cliente_contratos`)

```python
class ClienteContratos(ClienteBase):
    BASE_URL = "https://contratos.comprasnet.gov.br/api"
    BASE_HEADER = {"accept": "application/json"}

    def __init__(self) -> None:
        super().__init__(base_url=ClienteContratos.BASE_URL)
        logging.info(f"[cliente_contratos.py] Initialized with base_url {self.BASE_URL}")

    def get_contratos_by_ug(self, ug_code: str) -> list | None:
        endpoint = f"/contrato/ug/{ug_code}"
        status, data = self.request(http.HTTPMethod.GET, endpoint, headers=self.BASE_HEADER)
        if status == http.HTTPStatus.OK and isinstance(data, list):
            return data
        return None
```

A ideia é que qualquer pessoa saiba olhar o cliente e entender:

* **como a API é chamada**,
* **como o retorno é tratado**,
* e **onde estão os pontos de log**.

---

### (c) Criação da **DAG** no Airflow (`dags/<nova_base>_dag.py`)<br>

A DAG orquestra a ingestão dos dados. Ela é responsável por:

1. **Agendamento**: definido no decorator `@dag` (ex.: `@daily`, `@weekly`).
2. **Variáveis de configuração**: lidas do Airflow (`Variable.get`) para parametrizar a execução.
3. **Tasks**: funções anotadas com `@task` que:

    * Instanciam o cliente da API.
    * Instanciam o cliente Postgres (`ClientPostgresDB`).
    * Buscam os dados via cliente da API.
    * Inserem os dados no banco, adicionando campos como `dt_ingest`.

##### Exemplo simplificado

```python
@dag(
    schedule_interval="@daily",
    start_date=datetime(2023, 1, 1),
    catchup=False,
    tags=["contratos_api"],
)
def api_contratos_dag():
    @task
    def fetch_and_store():
        api = ClienteContratos()
        db = ClientPostgresDB(get_postgres_conn())
        contratos = api.get_contratos_by_ug("113601")
        if contratos:
            for c in contratos:
                c["dt_ingest"] = datetime.now().isoformat()
            db.insert_data(contratos, "contratos", schema="compras_gov", conflict_fields=["id"], primary_key=["id"])
    fetch_and_store()
```

---

### (d) Modelagem analítica com **dbt**<br>

Depois de coletar e armazenar os dados no Postgres, usamos o **dbt** para organizar as camadas:

* **Bronze**: tabelas mais próximas da fonte, com padronização mínima (tipagem, normalização de campos nulos, etc.).
* **Silver**: tabelas transformadas e enriquecidas, com junções entre diferentes fontes (ex.: contratos + empenhos).
* **Gold**: dados prontos para consumo em dashboards e relatórios. Aqui já está no formato esperado pelo BI (Superset, Power BI, etc.).

A organização do dbt no projeto segue a lógica de pastas por **schema** (`models/<schema>`), e dentro delas as subpastas **bronze**, **silver** e **gold**.

---

### (e) Logging e variáveis do Airflow<br>

##### Logging

O **logging** é essencial para a rastreabilidade.
Quando rodamos uma DAG no Airflow, todos os logs das tasks ficam registrados na interface. Isso permite identificar:

* Parâmetros usados na execução.
* Quantidade de registros processados.
* Erros e exceções.

Por isso, é boa prática logar:

* Início e fim de cada chamada.
* Totais de registros.
* Avisos quando o retorno estiver vazio.

##### Variáveis do Airflow

É recomendável usar **variáveis do Airflow** para guardar:

* Códigos de órgãos.
* CNPJs.
* Tokens de acesso (quando não forem credenciais sensíveis).

Assim conseguimos alterar o comportamento da DAG **sem precisar mexer no código**, apenas ajustando variáveis no painel do Airflow.
