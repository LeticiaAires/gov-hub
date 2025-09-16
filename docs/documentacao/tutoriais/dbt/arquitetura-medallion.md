# Arquitetura e Modelagem de Dados

A organização dos dados no repositório segue a **arquitetura em camadas (medalhão)**, alinhada às práticas modernas de engenharia de dados e ao uso do **dbt (Data Build Tool)** para transformação e modelagem.

Essa abordagem facilita a rastreabilidade, o controle de qualidade, a documentação e a evolução gradual dos dados ao longo do tempo, permitindo que cada etapa do pipeline seja **clara, modular e auditável**.

As camadas estão estruturadas da seguinte forma:

---

### **Raw**

* **Descrição:** camada bruta que armazena os dados exatamente como foram recebidos da fonte (APIs, arquivos, sistemas transacionais, etc.), sem qualquer transformação.
* **Objetivo:** atuar como **fonte de verdade** e manter um histórico imutável, preservando o dado original.
* **Uso no dbt:** os dados da camada *raw* são referenciados no dbt através de `source()`, garantindo rastreabilidade desde a origem.

Exemplo:

```sql
select * from {{ source('transfere_gov', 'contratos') }}
```

---

### **Bronze**

* **Descrição:** camada de padronização, onde os dados passam por correções mínimas (ajuste de tipos, normalização de colunas, limpeza básica).
* **Objetivo:** estruturar os dados de forma consistente, mantendo a granularidade original.
* **Uso no dbt:** modelos bronze geralmente são **incrementais**, garantindo ingestão eficiente de grandes volumes sem recriar toda a tabela a cada execução.

Exemplo:

```sql
select
    cast(id_contrato as integer) as id_contrato,
    upper(empresa_nome) as empresa_nome,
    valor
from {{ source('transfere_gov', 'contratos') }}
```

---

### **Silver**

* **Descrição:** camada de integração e enriquecimento.
  Aqui os dados passam por **junções entre diferentes fontes**, cálculos derivados, regras de negócio e validações mais complexas.
* **Objetivo:** consolidar informações, criando tabelas prontas para análise integrada.
* **Uso no dbt:** modelos silver frequentemente utilizam `ref()` para **referenciar diretamente os modelos bronze**, garantindo modularidade e lineage automático.

Exemplo:

```sql
select
    c.id_contrato,
    c.empresa_nome,
    e.valor_empenho
from {{ ref('contratos_bronze') }} c
left join {{ ref('empenhos_bronze') }} e 
    on c.id_contrato = e.contrato_id
```

---

### **Gold**

* **Descrição:** camada final, otimizada para **consumo analítico**.
  Aqui estão as tabelas agregadas, métricas, indicadores e visões específicas para **dashboards, relatórios e APIs**.
* **Objetivo:** fornecer dados confiáveis e prontos para negócio, com **granularidade reduzida e performance otimizada**.
* **Uso no dbt:** modelos gold costumam ser **tables materializadas**, garantindo consultas rápidas para ferramentas de BI (Superset, Power BI, Metabase).

Exemplo:

```sql
select
    empresa_nome,
    count(distinct id_contrato) as qtd_contratos,
    sum(valor_empenho) as total_empenhado
from {{ ref('contratos_integrados_silver') }}
group by empresa_nome
```

---

## Boas práticas na Arquitetura Medalhão com dbt

1. **Separação clara por pastas:** `models/bronze`, `models/silver`, `models/gold`.
2. **Nomenclatura padronizada:** use sufixos ou prefixos que indiquem a camada (ex: `contratos_bronze`, `contratos_silver`).
3. **Documentação e testes:** cada camada deve ser descrita em arquivos `.yml` com seus campos, e validada com testes (`not_null`, `unique`, `relationships`).
4. **Controle de materialização:**

    * *Raw* = apenas referência (source).
    * *Bronze* = incremental ou tabela.
    * *Silver* = tabela.
    * *Gold* = tabela persistente.


5. **Governança e rastreabilidade:** toda alteração em uma camada deve ser registrada, documentada e revisada, garantindo consistência do pipeline.

---

A arquitetura medalhão, implementada com o dbt, permite criar pipelines de dados **claros, auditáveis e escaláveis**.
Cada camada tem um papel específico e, ao usar `source()` e `ref()`, conseguimos **manter rastreabilidade ponta a ponta**: desde a entrada bruta até as métricas finais consumidas pelos usuários de negócio.

Essa estrutura é essencial para garantir **qualidade, confiabilidade e governança** sobre os dados tratados no repositório.

